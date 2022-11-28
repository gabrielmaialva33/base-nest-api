import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { RoleEntity } from '@role/entities/role.entity';

export class RolesSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const roles = await em.find(RoleEntity, {
      name: {
        $in: ['root', 'admin', 'user', 'guest'],
      },
    });
    if (roles.length > 0) return;

    const root = em.create(RoleEntity, {
      slug: 'ROOT',
      name: 'root',
      description: 'Root user',
    });

    const admin = em.create(RoleEntity, {
      slug: 'ADMIN',
      name: 'admin',
      description: 'Admin user',
    });

    const user = em.create(RoleEntity, {
      slug: 'USER',
      name: 'user',
      description: 'An common user',
    });

    const guest = em.create(RoleEntity, {
      slug: 'GUEST',
      name: 'guest',
      description: 'An guest user',
    });

    return em.persistAndFlush([root, admin, user, guest]);
  }
}
