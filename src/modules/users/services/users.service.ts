import { Injectable } from '@nestjs/common';

import { CreateUserDto } from '@src/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@src/modules/users/dto/update-user.dto';

@Injectable()
export class UsersService {
  create(data: CreateUserDto) {
    return data;
  }

  list() {
    return `This action returns all users`;
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
