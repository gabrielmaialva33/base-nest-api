import type { Knex } from 'knex';
import { Role } from '@src/modules/roles/entities/role.entity';

export async function up(knex: Knex): Promise<void> {
  await knex.into<Role>(Role.tableName).insert([
    {
      name: 'root',
      slug: 'Root',
      description: 'Root system',
    },
    {
      name: 'admin',
      slug: 'Admin',
      description: 'Admin system',
    },
    {
      name: 'user',
      slug: 'User',
      description: 'User system',
    },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await knex.from(Role.tableName).delete();
}
