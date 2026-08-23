import { Controller, Get, HttpCode, Header, Injectable, Module, ServiceUnavailableException } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SkipThrottle } from "@nestjs/throttler";
import { getPrismaClient } from "@nauterio/database";

/**
 * REL-001: the ALB health check previously pointed at
 * /v1/content/pages/health, a database-querying content route that always
 * 404s (no such ContentPage row is ever seeded) - the API could never
 * reach a healthy steady state behind a load balancer. These are real
 * liveness/readiness routes instead.
 */
@Injectable()
class HealthService {
  /** No I/O - only answers "is the process up and able to handle a request
   * at all", so a transient DB blip never triggers an ALB task replacement
   * storm (that coupling was the other half of REL-001). */
  liveness() {
    return { status: "ok" as const };
  }

  /** Used for deployment gating and manual checks only - never as the ALB
   * liveness target. A short, explicit timeout so a stalled DB fails fast
   * rather than hanging the health check itself. The API runs on Render and
   * Postgres is hosted on Neon, so the readiness probe needs to tolerate
   * normal cross-provider/cold-start latency without marking a healthy service
   * unavailable. */
  async readiness(): Promise<{ status: "ok"; database: "ok" }> {
    const prisma = getPrismaClient();
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("readiness DB check timed out")), 10000)
    );
    try {
      await Promise.race([prisma.$queryRaw`SELECT 1`, timeout]);
    } catch (err) {
      throw new ServiceUnavailableException(`Database not ready: ${String(err)}`);
    }
    return { status: "ok", database: "ok" };
  }
}

@ApiTags("health")
@SkipThrottle()
@Controller("health")
class HealthController {
  constructor(private readonly service: HealthService) {}

  @Get()
  liveness() {
    return this.service.liveness();
  }

  @Get("ready")
  async ready() {
    return this.service.readiness();
  }
}

@ApiTags("healthz")
@SkipThrottle()
@Controller("healthz")
class HealthzController {
  @Get()
  @HttpCode(204)
  @Header("Cache-Control", "no-store")
  @Header("X-Robots-Tag", "noindex, nofollow")
  healthz() {
    return;
  }
}

@Module({
  controllers: [HealthController, HealthzController],
  providers: [HealthService],
})
export class HealthModule {}
