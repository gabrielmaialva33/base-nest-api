import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { UserEntity } from '@user/entities/user.entity';
import { RoleEntity } from '@role/entities/role.entity';

export class UsersSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const users = await em.find(UserEntity, {
      user_name: {
        $in: ['root', 'admin', 'user', 'guest'],
      },
    });
    if (users.length > 0) return;

    const roles = await em.find(RoleEntity, {
      name: {
        $in: ['root', 'admin', 'user', 'guest'],
      },
    });

    const root = em.create(UserEntity, {
      first_name: 'Pda',
      last_name: 'Root',
      email: 'root@base.com',
      user_name: 'root',
      password: '123456',
    });
    root.roles.add(roles[0]);

    const admin = em.create(UserEntity, {
      first_name: 'Pda',
      last_name: 'Admin',
      email: 'admin@base.com',
      user_name: 'admin',
      password: '123456',
    });
    admin.roles.add(roles[1]);

    const user = em.create(UserEntity, {
      first_name: 'Pda',
      last_name: 'User',
      email: 'user@base.com',
      user_name: 'user',
      password: '123456',
    });
    user.roles.add(roles[2]);

    const guest = em.create(UserEntity, {
      first_name: 'Pda',
      last_name: 'Guest',
      email: 'guest@base.com',
      user_name: 'guest',
      password: '123456',
    });
    guest.roles.add(roles[3]);

    return em.persistAndFlush([root, admin, user, guest]);
  }
}
