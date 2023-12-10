import { Module } from '@nestjs/common';

import { UsersModule } from '@src/modules/users/users.module';
import { SessionsModule } from '@src/modules/sessions/sessions.module';

@Module({ imports: [UsersModule, SessionsModule] })
export class SharedModule {}
