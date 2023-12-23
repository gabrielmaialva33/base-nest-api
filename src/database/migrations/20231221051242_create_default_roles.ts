import { Knex } from 'knex';

import { Role } from '@src/modules/roles/entities/role.entity';
import { RoleType } from '@src/modules/roles/interfaces/roles.interface';

export const up = async (knex: Knex): Promise<void> => {
  const roles = [
    {
      name: RoleType.ROOT,
      slug: 'Root',
      description: 'Root system',
    },
    {
      name: RoleType.ADMIN,
      slug: 'Admin',
      description: 'Admin system',
    },
    {
      name: RoleType.USER,
      slug: 'User',
      description: 'User system',
    },
  ];

  await knex<Role>(Role.tableName).insert(roles);
};

export const down = async (knex: Knex): Promise<void> => {
  await knex(Role.tableName).delete();
};
