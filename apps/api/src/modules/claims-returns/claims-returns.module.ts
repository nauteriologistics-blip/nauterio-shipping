import { Module } from "@nestjs/common";
import { ClaimsReturnsController } from "./claims-returns.controller";
import { ClaimsReturnsService } from "./claims-returns.service";
import { AuditModule } from "../audit/audit.module";

@Module({
  imports: [AuditModule],
  controllers: [ClaimsReturnsController],
  providers: [ClaimsReturnsService],
  exports: [ClaimsReturnsService],
})
export class ClaimsReturnsModule {}
