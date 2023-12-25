import { Module } from '@nestjs/common';

import { UsersModule } from '@src/modules/users/users.module';
import { SessionsModule } from '@src/modules/sessions/sessions.module';
import { TokensModule } from '@src/modules/tokens/tokens.module';
import { RolesModule } from '@src/modules/roles/roles.module';
import { FilesModule } from '@src/modules/files/files.module';

@Module({
  imports: [
    UsersModule,
    SessionsModule,
    TokensModule,
    RolesModule,
    FilesModule,
  ],
  exports: [
    UsersModule,
    SessionsModule,
    TokensModule,
    RolesModule,
    FilesModule,
  ],
})
export class SharedModule {}
