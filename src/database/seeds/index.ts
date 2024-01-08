import { Knex } from 'knex';

import { Argon2Utils } from '@src/common/helpers/argon2.utils';
import { userFactory } from '@src/database/factories';

import { User } from '@src/modules/users/entities/user.entity';
import { Role } from '@src/modules/roles/entities/role.entity';

export async function seed(knex: Knex): Promise<void> {
  const roles = await knex
    .from<Role>(Role.tableName)
    .select('id')
    .orderBy('created_at', 'asc');

  const password = await Argon2Utils.hash('Dev@551238');
  const usersData: any[] = userFactory.makeMany(100, { password });

  const users = await knex
    .into<User>(User.tableName)
    .insert(usersData)
    .returning('id');

  // randomize roles
  const userRoles = users.map((user, index) => ({
    user_id: user.id,
    role_id: roles[index % roles.length].id,
  }));

  await knex.into('user_roles').insert(userRoles);
}
