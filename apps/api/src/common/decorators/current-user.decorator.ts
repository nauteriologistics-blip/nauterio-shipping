import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { Request } from "express";
import type { AuthenticatedUser } from "../guards/auth.guard";

export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext): AuthenticatedUser => {
  const req = ctx.switchToHttp().getRequest<Request>();
  if (!req.user) {
    throw new Error("CurrentUser decorator used on a route without AuthGuard");
  }
  return req.user;
});
