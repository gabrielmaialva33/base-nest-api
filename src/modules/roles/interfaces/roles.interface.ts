import { IKnexRepository } from '@src/common/module/knex-repository.interface';
import { Role } from '@src/modules/roles/entities/role.entity';
import { User } from '@src/modules/users/entities/user.entity';
import { Observable } from 'rxjs';

export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');

export interface IRoleRepository extends IKnexRepository<Role> {
  getByName(name: string): Observable<Role>;

  attachRoleToUser(user: User, roleIds: number[]): Observable<void>;
}
