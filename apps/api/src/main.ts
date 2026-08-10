import "dotenv/config";
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { loadApiConfig } from "@nauterio/configuration";
import { NestPinoLoggerAdapter } from "@nauterio/observability";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";
import { CorrelationIdInterceptor } from "./common/interceptors/correlation-id.interceptor";
import { apiLogger } from "./logger";

// Money columns are Prisma BigInt (spec: never a float - see schema.prisma).
// JSON.stringify has no native BigInt support and throws; serialize as a
// string so precision is never silently lost (a plain Number cast would
// risk that for very large minor-unit amounts). This is the standard
// workaround for BigInt + Express's res.json() - see Prisma's own docs.
(BigInt.prototype as unknown as { toJSON: () => string }).toJSON = function (this: bigint) {
  return this.toString();
};

async function bootstrap() {
  const config = loadApiConfig();

  // SEC-007: fail at process startup, not per-request, when the local-dev
  // auth passthrough would be active outside a developer's own machine.
  // The passthrough's own allow-list check (cognito-jwt-verifier.ts) would
  // eventually refuse it too, but only on the first authenticated request -
  // this way a misconfigured environment never accepts a single connection.
  const isDevOrTest = config.NODE_ENV === "development" || config.NODE_ENV === "test";
  if (config.LOCAL_AUTH_MODE && !isDevOrTest) {
    throw new Error(
      `CRITICAL SECURITY RISK: refusing to start with LOCAL_AUTH_MODE=true in NODE_ENV=${config.NODE_ENV}. ` +
        "The local-dev bearer-token-as-identity passthrough must never run outside development/test."
    );
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  // REL-011: routes Nest's own internal framework logs (route mapping,
  // lifecycle events) through the same structured pino/JSON output as every
  // application-level log call, instead of Nest's plain-text built-in
  // Logger - `bufferLogs: true` above holds Nest's startup logs until this
  // is set, so none of them leak through the old logger first.
  app.useLogger(new NestPinoLoggerAdapter(apiLogger));

  // SEC-008: without this, Express's `req.ip`/`req.ips` never trust
  // `X-Forwarded-For` at all, so behind the ALB every request appears to
  // come from the load balancer's own address - one shared rate-limit
  // bucket for every client on earth (reproduced live in the audit: 13
  // requests with 13 distinct X-Forwarded-For values all counted against
  // one bucket, 429 from request 11 onward). The trust hop count MUST match
  // the real proxy depth exactly - `true` would trust an attacker-supplied
  // header verbatim, letting an enumerator rotate X-Forwarded-For per
  // request to bypass the limit entirely (the converse trap the audit
  // explicitly warned about). Today's real topology is client -> ALB ->
  // this process (edge-stack.ts's own comment: CloudFront "does not exist
  // yet"), i.e. exactly one trusted hop - this MUST become 2 the day
  // CloudFront is added in front of the ALB, not before.
  app.set("trust proxy", 1);

  // Spec section 26.1: runtime validation at every external boundary.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new CorrelationIdInterceptor(config.CORRELATION_ID_HEADER));

  app.setGlobalPrefix("v1");

  // REL-002: drain in-flight requests and close the Prisma pool on
  // SIGTERM/SIGINT instead of the process being hard-killed mid-request,
  // matching the pattern apps/worker/src/main.ts already uses correctly.
  app.enableShutdownHooks();

  // REL-021: @nestjs/swagger (and its lodash/js-yaml transitive deps) must
  // never even be loaded in a production process - `NODE_ENV === "production"`
  // hard-blocks it regardless of the flag below, as defense in depth against
  // a misconfigured flag.
  // SEC-007 residual: previously gated only on `NODE_ENV !== "production"`,
  // so a `staging` deployment served the full route/DTO inventory at /docs
  // by default. ENABLE_API_DOCS defaults to false, so any non-production
  // environment must opt in explicitly rather than getting docs for free.
  if (config.NODE_ENV !== "production" && config.ENABLE_API_DOCS) {
    const { DocumentBuilder, SwaggerModule } = await import("@nestjs/swagger");
    const swaggerConfig = new DocumentBuilder()
      .setTitle("Nauterio Logistics API")
      .setDescription("Italy-USA shipping platform - REST API")
      .setVersion("1.0")
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("docs", app, document);
  }

  await app.listen(config.PORT);
  apiLogger.info({ port: config.PORT }, "Nauterio API listening");
}

bootstrap().catch((err) => {
  apiLogger.fatal({ err }, "[api] fatal startup error");
  process.exit(1);
});
