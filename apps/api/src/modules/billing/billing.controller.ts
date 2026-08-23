import { Controller, Get, Post, Patch, Body, Param, ParseUUIDPipe, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../../common/guards/auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../../common/guards/auth.guard";
import { BillingService } from "./billing.service";
import { CreateInvoiceDto, PayInvoiceDto, UpdateInvoiceStatusDto } from "./dto/create-invoice.dto";
import { RequireIdempotencyKey } from "../../common/decorators/require-idempotency-key.decorator";
import { CorrelationId } from "../../common/decorators/correlation-id.decorator";

@ApiTags("billing")
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionGuard)
@Controller("invoices")
export class BillingController {
  constructor(private readonly service: BillingService) {}

  @Get()
  @RequirePermission("invoice:read")
  @ApiOperation({ summary: "List invoices with cursor pagination" })
  async listInvoices(
    @CurrentUser() user: AuthenticatedUser,
    @Query("after") after?: string,
    @Query("limit") limit?: string
  ) {
    return this.service.listInvoices(
      { role: user.role, userId: user.userId, organisationId: user.organisationId },
      { after, limit: limit ? parseInt(limit, 10) : undefined }
    );
  }

  @Get(":id")
  @RequirePermission("invoice:read")
  @ApiOperation({ summary: "Get invoice by ID with line items and payment history" })
  async getInvoice(@Param("id", ParseUUIDPipe) id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.service.getInvoiceById(id, { role: user.role, userId: user.userId, organisationId: user.organisationId });
  }

  @Post()
  @RequirePermission("invoice:manage")
  @RequireIdempotencyKey()
  @ApiOperation({ summary: "Create invoice for a shipment (staff only)" })
  async createInvoice(@Body() dto: CreateInvoiceDto, @CurrentUser() user: AuthenticatedUser) {
    return this.service.createInvoice(dto, user.userId);
  }

  @Patch(":id/status")
  @RequirePermission("invoice:manage")
  @RequireIdempotencyKey()
  @ApiOperation({ summary: "Update invoice status after offline operations review or settlement" })
  async updateInvoiceStatus(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateInvoiceStatusDto,
    @CurrentUser() user: AuthenticatedUser,
    @CorrelationId() correlationId: string
  ) {
    return this.service.updateInvoiceStatus(id, dto, user.userId, correlationId);
  }

  @Post(":id/pay")
  @RequirePermission("invoice:read")
  @RequireIdempotencyKey()
  @ApiOperation({ summary: "Disabled: online payment is not collected through Nauterio" })
  async payInvoice(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: PayInvoiceDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.service.payInvoice(id, dto, user.userId, {
      role: user.role,
      userId: user.userId,
      organisationId: user.organisationId,
    });
  }
}
