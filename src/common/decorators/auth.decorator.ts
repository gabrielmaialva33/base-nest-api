import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@src/common/guards/jwt.auth.guard';

export function Auth() {
  return applyDecorators(UseGuards(JwtAuthGuard));
}
