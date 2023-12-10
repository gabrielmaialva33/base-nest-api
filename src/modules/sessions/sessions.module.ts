import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { NestJwtModule } from '@src/lib/jwt/jwt.module';
import { SessionsController } from '@src/modules/sessions/controllers/sessions.controller';
import { LocalStrategy } from '@src/modules/sessions/strategies/local.strategy';
import { JwtStrategy } from '@src/modules/sessions/strategies/jwt.strategy';
import { SessionsService } from '@src/modules/sessions/services/sessions.service';

@Module({
  imports: [PassportModule, NestJwtModule],
  controllers: [SessionsController],
  providers: [SessionsService, LocalStrategy, JwtStrategy],
})
export class SessionsModule {}
