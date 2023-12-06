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
}
