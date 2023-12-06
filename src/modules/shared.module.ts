import { Module } from '@nestjs/common';
import { UsersModule } from '@src/modules/users/users.module';

@Module({ imports: [UsersModule] })
export class SharedModule {}
