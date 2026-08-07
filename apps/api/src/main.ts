import "dotenv/config";
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { loadApiConfig } from "@nauterio/configuration";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";
import { CorrelationIdInterceptor } from "./common/interceptors/correlation-id.interceptor";

// Money columns are Prisma BigInt (spec: never a float - see schema.prisma).
// JSON.stringify has no native BigInt support and throws; serialize as a
// string so precision is never silently lost (a plain Number cast would
// risk that for very large minor-unit amounts). This is the standard
// workaround for BigInt + Express's res.json() - see Prisma's own docs.
(BigInt.prototype as unknown as { toJSON: () => string }).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const config = loadApiConfig();
  const app = await NestFactory.create(AppModule);

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

  // OpenAPI generated directly from the DTOs used for runtime validation -
  // one source of truth (ADR 0001 section 5.1), not a hand-maintained spec.
  if (config.NODE_ENV !== "production") {
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
  // eslint-disable-next-line no-console
  console.log(`Nauterio API listening on port ${config.PORT} (${config.NODE_ENV})`);
}

bootstrap();
