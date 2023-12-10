import { Module } from '@nestjs/common';

import { UsersModule } from '@src/modules/users/users.module';
import { SessionsModule } from '@src/modules/sessions/sessions.module';
import { TokensModule } from '@src/modules/tokens/tokens.module';

@Module({ imports: [UsersModule, SessionsModule, TokensModule] })
export class SharedModule {}
