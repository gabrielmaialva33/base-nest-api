import type { Knex } from 'knex';

import { Argon2Utils } from '@src/common/helpers/argon2.utils';
import { Role } from '@src/modules/roles/entities/role.entity';
import { User } from '@src/modules/users/entities/user.entity';

export async function up(knex: Knex): Promise<void> {
  const roles = await knex
    .from<Role>(Role.tableName)
    .select('id')
    .orderBy('created_at', 'asc');

  const password = await Argon2Utils.hash('Dev@551238');

  const userData = [
    {
      first_name: 'Root',
      last_name: 'User',
      email: 'root@base.com.br',
      username: 'root',
      password,
    },
    {
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@base.com.br',
      username: 'admin',
      password,
    },
    {
      first_name: 'User',
      last_name: 'User',
      email: 'user@base.com.br',
      username: 'user',
      password,
    },
  ];

  const users = await knex
    .into<User>(User.tableName)
    .insert(userData)
    .returning('id');

  const userRoles = users.map((user, index) => ({
    user_id: user.id,
    role_id: roles[index % roles.length].id, // Garantir que o índice esteja dentro do array de roles
  }));

  await knex.into('user_roles').insert(userRoles);
}

export async function down(knex: Knex): Promise<void> {
  await knex.from<User>(User.tableName).del();
}
