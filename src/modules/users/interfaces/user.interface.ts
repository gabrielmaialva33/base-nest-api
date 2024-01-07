import { Observable } from 'rxjs';

import {
  IKnexRepository,
  ListOptions,
} from '@src/common/module/knex-repository.interface';
import { User } from '@src/modules/users/entities/user.entity';
import { PaginationOptions } from '@src/common/module/pagination';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface IUserRepository extends IKnexRepository<User> {
  getByUid(uid: string): Observable<User | undefined>;
}

interface ScopesParams {
  search?: string;
}

export interface UserList extends ListOptions<User>, ScopesParams {}

export interface UserPaginate extends PaginationOptions<User>, ScopesParams {}
