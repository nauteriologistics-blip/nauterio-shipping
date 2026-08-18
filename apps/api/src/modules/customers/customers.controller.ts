import { Controller, Get, Post, Patch, Delete, Body, Param, ParseUUIDPipe, UseGuards, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Request } from "express";
import { AuthGuard } from "../../common/guards/auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";
import { NoPermissionRequired } from "../../common/decorators/no-permission-required.decorator";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";
import { RequireIdempotencyKey } from "../../common/decorators/require-idempotency-key.decorator";
import { CustomersService } from "./customers.service";
import { CreateAddressDto, UpdateAddressDto, UpdateProfileDto } from "./dto/customer.dto";

@ApiTags("customers")
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionGuard)
@Controller("me")
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get("profile")
  @NoPermissionRequired()
  @ApiOperation({ summary: "Get current user profile and addresses" })
  async getProfile(@Req() req: Request) {
    const userId = req.user.userId;
    return this.customersService.getProfile(userId);
  }

  @Patch("profile")
  @NoPermissionRequired()
  @ApiOperation({ summary: "Update current user profile" })
  async updateProfile(@Body() dto: UpdateProfileDto, @Req() req: Request) {
    const userId = req.user.userId;
    return this.customersService.updateProfile(userId, dto);
  }

  @Get("addresses")
  @NoPermissionRequired()
  @ApiOperation({ summary: "List user address book" })
  async listAddresses(@Req() req: Request) {
    const userId = req.user.userId;
    return this.customersService.listAddresses(userId);
  }

  @Post("addresses")
  @NoPermissionRequired()
  @RequireIdempotencyKey()
  @ApiOperation({ summary: "Add address to address book" })
  async addAddress(@Body() dto: CreateAddressDto, @Req() req: Request) {
    const userId = req.user.userId;
    return this.customersService.addAddress(userId, dto);
  }

  @Patch("addresses/:id")
  @NoPermissionRequired()
  @ApiOperation({ summary: "Update an address" })
  async updateAddress(@Param("id", ParseUUIDPipe) id: string, @Body() dto: UpdateAddressDto, @Req() req: Request) {
    const userId = req.user.userId;
    return this.customersService.updateAddress(id, userId, dto);
  }

  @Delete("addresses/:id")
  @NoPermissionRequired()
  @ApiOperation({ summary: "Delete an address" })
  async deleteAddress(@Param("id", ParseUUIDPipe) id: string, @Req() req: Request) {
    const userId = req.user.userId;
    return this.customersService.deleteAddress(id, userId);
  }
}

@ApiTags("customers")
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionGuard)
@Controller("admin/customers")
export class AdminCustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @RequirePermission("customer_pii:view")
  @ApiOperation({ summary: "List customer accounts (staff console)" })
  async list() {
    return this.customersService.listForAdmin();
  }
}
