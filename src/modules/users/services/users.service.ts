import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { map, switchMap } from 'rxjs';
import { DateTime } from 'luxon';

import { translate } from '@src/lib/i18n';
import { CreateUserDto } from '@src/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@src/modules/users/dto/update-user.dto';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '@src/modules/users/interfaces/user.interface';
import { User } from '@src/modules/users/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  list() {
    return this.userRepository.all((qb) => {
      qb.modify(User.scopes.notDeleted);
    });
  }

  get(id: number) {
    return this.userRepository
      .get({ id }, (qb) => qb.modify(User.scopes.notDeleted))
      .pipe(
        map((user) => {
          if (!user)
            throw new NotFoundException({
              message: translate('exception.model_not_found', {
                args: { model: translate('model.user.label') },
              }),
            });

          return user;
        }),
      );
  }

  getBy(field: string, value: any) {
    return this.userRepository
      .get({ [field]: value }, (qb) => qb.modify(User.scopes.notDeleted))
      .pipe(
        map((user) => {
          if (!user) throw new NotFoundException({ message: 'User not found' });
          return user;
        }),
      );
  }

  getByUid(uid: string) {
    return this.userRepository.getByUid(uid).pipe(
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
