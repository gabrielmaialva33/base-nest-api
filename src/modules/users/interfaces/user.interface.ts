import { IKnexRepository } from '@src/common/module/knex-repository.interface';
import { User } from '@src/modules/users/entities/user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface IUserRepository extends IKnexRepository<User> {}
