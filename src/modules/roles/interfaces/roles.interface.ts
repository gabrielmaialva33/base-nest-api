import { IKnexRepository } from '@src/common/module/knex-repository.interface';
import { Role } from '@src/modules/roles/entities/role.entity';
import { User } from '@src/modules/users/entities/user.entity';
import { Observable } from 'rxjs';

export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');

export interface IRoleRepository extends IKnexRepository<Role> {
  /**
   * Attach a role to a user.
   * @param {User} user - The user to attach the role to.
   * @param {number[]} roleIds - The role ids to attach to the user.
   */
  attachRoleToUser(user: User, roleIds: number[]): Observable<number>;
}

export enum RoleType {
  ROOT = 'root',
  ADMIN = 'admin',
  USER = 'user',
}
