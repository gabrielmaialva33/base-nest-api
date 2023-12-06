import { Inject, Injectable } from '@nestjs/common';

import { CreateUserDto } from '@src/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@src/modules/users/dto/update-user.dto';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '@src/modules/users/interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  create(data: CreateUserDto) {
    return data;
  }

  list() {
    return this.userRepository.all();
  }

  get(id: number) {
    return `This action returns a #${id} user`;
  }

  edit(id: number, data: UpdateUserDto) {
    return `This action updates a #${id} user with ${JSON.stringify(data)}`;
  }

  delete(id: number) {
    return `This action removes a #${id} user`;
  }
}
