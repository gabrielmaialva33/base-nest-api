import { IKnexRepository } from '@src/common/module/knex-repository.interface';
import { User } from '@src/modules/users/entities/user.entity';
import { Observable } from 'rxjs';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface IUserRepository extends IKnexRepository<User> {
  getByUid(uid: string): Observable<User | undefined>;
}
