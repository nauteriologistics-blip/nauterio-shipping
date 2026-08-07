import { Controller, Get, Injectable, Module, NotFoundException, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { getPrismaClient } from "@nauterio/database";
import { AuthGuard } from "../../common/guards/auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";

/** Billing/payments module (spec section 24): charges, invoices, payment
 * allocation, bank transfer, refund, dispute. Read path only - the real
 * payment-creation flow needs a real Stripe/PayPal account (ADR 0001
 * section 9.2, first in the sequencing order once this scaffold exists).
 * PaymentAdapter interface + LocalMockPaymentAdapter already exist in
 * packages/integrations for when that work starts. */
@Injectable()
class BillingService {
  async getInvoiceById(id: string) {
    const prisma = getPrismaClient();
    const invoice = await prisma.invoice.findUnique({ where: { id }, include: { lines: true } });
    if (!invoice) throw new NotFoundException(`Invoice ${id} not found`);
    return invoice;
  }
}

@ApiTags("billing")
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionGuard)
@Controller("invoices")
class BillingController {
  constructor(private readonly service: BillingService) {}

  @Get(":id")
  async getInvoice(@Param("id") id: string) {
    return this.service.getInvoiceById(id);
  }
}

@Module({
  controllers: [BillingController],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}
