import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { map, switchMap } from 'rxjs';

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

  list() {
    return this.userRepository.all((query) => {
      query.orderBy('id', 'desc');
    });
  }

  get(id: number) {
    return this.userRepository.get({ id }).pipe(
      map((user) => {
        if (!user) throw new NotFoundException({ message: 'User not found' });
        return user;
      }),
    );
  }

  create(data: CreateUserDto) {
    return this.userRepository.create(data);
  }

  edit(id: number, data: UpdateUserDto) {
    return this.get(id).pipe(
      switchMap((user) => {
        user.$set(data);
        return this.userRepository.update(user, (query) => {
          query.where('is_deleted', false);
        });
      }),
    );
  }

  delete(id: number) {
    return `This action removes a #${id} user`;
  }
}
