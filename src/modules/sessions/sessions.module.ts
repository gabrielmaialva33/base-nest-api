import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { NestJwtModule } from '@src/lib/jwt/jwt.module';
import { SessionsController } from '@src/modules/sessions/controllers/sessions.controller';
import { LocalStrategy } from '@src/modules/sessions/strategies/local.strategy';
import { JwtStrategy } from '@src/modules/sessions/strategies/jwt.strategy';
import { SessionsService } from '@src/modules/sessions/services/sessions.service';
import { TokensModule } from '@src/modules/tokens/tokens.module';
import { UsersModule } from '@src/modules/users/users.module';
import { RolesModule } from '@src/modules/roles/roles.module';

@Module({
  imports: [
    PassportModule,
    NestJwtModule,
    TokensModule,
    UsersModule,
    RolesModule,
  ],
  controllers: [SessionsController],
  providers: [SessionsService, LocalStrategy, JwtStrategy],
})
export class SessionsModule {}
