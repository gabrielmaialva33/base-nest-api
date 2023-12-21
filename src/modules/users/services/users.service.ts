import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { map, switchMap } from 'rxjs';
import { DateTime } from 'luxon';

import { translate } from '@src/lib/i18n';
import { createPagination } from '@src/common/module/pagination';

import { CreateUserDto } from '@src/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@src/modules/users/dto/update-user.dto';
import { User } from '@src/modules/users/entities/user.entity';
import {
  IUserRepository,
  USER_REPOSITORY,
  UserList,
  UserPaginate,
} from '@src/modules/users/interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  list(params?: UserList) {
    const { search, ...options } = params || {};
    return this.userRepository.list(options, (qb) => {
      qb.modify(User.scopes.notDeleted);
      if (search) qb.modify(User.scopes.search, search);
    });
  }

  paginate(params?: UserPaginate) {
    const { search, ...options } = params || {};
    return this.userRepository
      .paginate(options, (qb) => {
        qb.modify(User.scopes.notDeleted);
        if (search) qb.modify(User.scopes.search, search);
      })
      .pipe(
        map((data) =>
          createPagination<User>({
            data: data.results,
            total: data.total,
            page: options.page,
            per_page: options.per_page,
          }),
        ),
      );
  }

  get(id: number) {
    return this.userRepository
      .getBy({ id }, (qb) => qb.modify(User.scopes.notDeleted))
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
      .getBy({ [field]: value }, (qb) => qb.modify(User.scopes.notDeleted))
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

  save(user: User) {
    return this.userRepository.update(user);
  }

  delete(id: number) {
    return this.get(id).pipe(
      switchMap((user) => {
        user.$set({
          is_deleted: true,
          deleted_at: DateTime.local().toISO(),
        });
        return this.userRepository.update(user).pipe(map(() => true));
      }),
    );
  }
}
