import { Module } from '@nestjs/common';

import { UserController } from '@user/http/user.controller';
import { UserService } from '@user/services/user.service';

import { OrmModule } from '@src/lib/orm/orm.module';

@Module({
  imports: [OrmModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, UserModule],
})
export class UserModule {}
