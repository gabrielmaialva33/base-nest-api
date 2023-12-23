import { IRoleRepository } from '@src/modules/roles/interfaces/roles.interface';
import { KnexRepository } from '@src/common/module/knex.repository';
import { Role } from '@src/modules/roles/entities/role.entity';
import { from, Observable } from 'rxjs';
import { User } from '@src/modules/users/entities/user.entity';

export class RoleRepository
  extends KnexRepository<Role>
  implements IRoleRepository
{
  constructor() {
    super(Role);
  }

  attachRoleToUser(user: User, roleIds: number[]): Observable<number> {
    return from(user.$relatedQuery('roles').relate(roleIds));
  }
}
