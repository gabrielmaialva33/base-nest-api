import { Module } from '@nestjs/common';

import { UsersController } from '@src/modules/users/controllers/users.controller';
import { UsersService } from '@src/modules/users/services/users.service';
import { UserRepository } from '@src/modules/users/repositories/user.repository';
import { USER_REPOSITORY } from '@src/modules/users/interfaces/user.interface';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
