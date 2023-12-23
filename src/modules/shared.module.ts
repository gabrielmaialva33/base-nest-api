import { Module } from '@nestjs/common';

import { UsersModule } from '@src/modules/users/users.module';
import { SessionsModule } from '@src/modules/sessions/sessions.module';
import { TokensModule } from '@src/modules/tokens/tokens.module';
import { RolesModule } from '@src/modules/roles/roles.module';

@Module({
  imports: [UsersModule, SessionsModule, TokensModule, RolesModule],
  exports: [UsersModule, SessionsModule, TokensModule, RolesModule],
})
export class SharedModule {}
