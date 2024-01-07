import { from, map, Observable } from 'rxjs';

import { IRoleRepository } from '@src/modules/roles/interfaces/roles.interface';
import { KnexRepository } from '@src/common/module/knex.repository';
import { Role } from '@src/modules/roles/entities/role.entity';
import { User } from '@src/modules/users/entities/user.entity';

export class RoleRepository
  extends KnexRepository<Role>
  implements IRoleRepository
{
  constructor() {
    super(Role);
  }

  attachRoleToUser(user: User, roleIds: number[]): Observable<number> {
    return from(
      this.model.transaction(async (trx) => {
        return user.$relatedQuery('roles', trx).relate(roleIds);
      }),
    );
  }

  detachRoleFromUser(user: User, roleIds: number[]): Observable<number> {
    return from(
      this.model.transaction(async (trx) => {
        return user
          .$relatedQuery('roles', trx)
          .unrelate()
          .whereIn('id', roleIds);
      }),
    );
  }

  syncRoleToUser(user: User, roleIds: number[]): Observable<void> {
    return from(
      this.model.transaction(async (trx) => {
        await user
          .$relatedQuery('roles', trx)
          .unrelate()
          .whereIn('id', roleIds);
        await user.$relatedQuery('roles', trx).relate(roleIds);
      }),
    ).pipe(map(() => undefined));
  }
}
