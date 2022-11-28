import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '@user/user.module';
import { AuthController } from '@auth/http/auth.controller';
import { AuthService } from '@auth/services/auth.service';
import { JwtStrategy, LocalStrategy } from '@auth/strategies';
import { NestJwtModule } from '@src/lib/jwt/jwt.module';

@Module({
  imports: [UserModule, PassportModule, NestJwtModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [NestJwtModule, AuthService],
})
export class AuthModule {}
