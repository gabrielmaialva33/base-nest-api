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
   * @returns {Observable<number>}
   */
  attachRoleToUser(user: User, roleIds: number[]): Observable<number>;

  /**
   * Detach a role from a user.
   * @param {User} user - The user to detach the role from.
   * @param {number[]} roleIds - The role ids to detach from the user.
   * @returns {Observable<number>}
   */
  detachRoleFromUser(user: User, roleIds: number[]): Observable<number>;

  /**
   * Sync a role to a user.
   * @param {User} user - The user to sync the role to.
   * @param {number[]} roleIds - The role ids to sync to the user.
   * @returns {Observable<void>}
   */
  syncRoleToUser(user: User, roleIds: number[]): Observable<void>;
}

export enum RoleType {
  ROOT = 'root',
  ADMIN = 'admin',
  USER = 'user',
}
