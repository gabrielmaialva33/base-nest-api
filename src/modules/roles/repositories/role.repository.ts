import { IRoleRepository } from '@src/modules/roles/interfaces/roles.interface';
import { KnexRepository } from '@src/common/module/knex.repository';
import { Role } from '@src/modules/roles/entities/role.entity';

export class RoleRepository
  extends KnexRepository<Role>
  implements IRoleRepository
{
  constructor() {
    super(Role);
  }
}
