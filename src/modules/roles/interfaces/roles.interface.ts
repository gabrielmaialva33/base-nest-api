import { IKnexRepository } from '@src/common/module/knex-repository.interface';
import { Role } from '@src/modules/roles/entities/role.entity';

export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');

export interface IRoleRepository extends IKnexRepository<Role> {}
