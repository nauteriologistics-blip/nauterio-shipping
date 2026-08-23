import { Controller, Get, Post, Body, Param, ParseUUIDPipe, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../../common/guards/auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../../common/guards/auth.guard";
import { BillingService } from "./billing.service";
import { CreateInvoiceDto, PayInvoiceDto } from "./dto/create-invoice.dto";
import { RequireIdempotencyKey } from "../../common/decorators/require-idempotency-key.decorator";

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
