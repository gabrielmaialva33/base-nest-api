import { PartialModelObject } from 'objection';
import { faker } from '@faker-js/faker';

import { BaseFactory } from '@src/common/module/base.factory';
import { Role } from '@src/modules/roles/entities/role.entity';

export class RoleFactory extends BaseFactory<Role> {
  constructor() {
    super(Role);
  }

  make(data?: PartialModelObject<Role>): PartialModelObject<Role> {
    return {
      name: faker.hacker.noun(),
      slug: faker.hacker.verb(),
      description: faker.hacker.phrase(),
      ...data,
    };
  }

  makeStub(data?: PartialModelObject<Role>): Role {
    const role = new Role();
    const roleData = this.make(data);

    role.$setDatabaseJson({
      id: faker.number.int(),
      ...roleData,
    });

    return role;
  }
}

export const roleFactory = new RoleFactory();
