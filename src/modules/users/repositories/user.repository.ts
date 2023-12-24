import { from, map, Observable } from 'rxjs';

import { KnexRepository } from '@src/common/module/knex.repository';
import { IUserRepository } from '@src/modules/users/interfaces/user.interface';
import { User } from '@src/modules/users/entities/user.entity';

export class UserRepository
  extends KnexRepository<User>
  implements IUserRepository
{
  constructor() {
    super(User);
  }

  getByUid(uid: string): Observable<User | undefined> {
    return from(
      this.model
        .query()
        .where((qb) => {
          for (const field of User.uid) qb.orWhere(field, uid);
        })
        .whereNot('is_deleted', true)
        .withGraphFetched('roles')
        .first(),
    ).pipe(map((result) => result as User));
  }
}
