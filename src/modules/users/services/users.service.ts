import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { map, switchMap } from 'rxjs';

import { CreateUserDto } from '@src/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@src/modules/users/dto/update-user.dto';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '@src/modules/users/interfaces/user.interface';
import { DateTime } from 'luxon';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  list() {
    return this.userRepository.all((qb) => {
      qb.whereNot('is_deleted', true);
    });
  }

  get(id: number) {
    return this.userRepository
      .get({ id }, (qb) => qb.whereNot('is_deleted', true))
      .pipe(
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
        return this.userRepository.update(user);
      }),
    );
  }

  delete(id: number) {
    return this.get(id).pipe(
      switchMap((user) => {
        user.$set({
          is_deleted: true,
          deleted_at: DateTime.local().toISO(),
        });
        return this.userRepository
          .update(user)
          .pipe(map(() => ({ message: 'User deleted' })));
      }),
    );
  }
}
