import * as crypto from 'crypto';
import { PartialModelObject } from 'objection';
import { DateTime } from 'luxon';
import { faker } from '@faker-js/faker';

import { BaseFactory } from '@src/common/module/base.factory';
import { User } from '@src/modules/users/entities/user.entity';
import { Role } from '@src/modules/roles/entities/role.entity';
import { RoleType } from '@src/modules/roles/interfaces/roles.interface';
import { roleFactory } from '@src/database/factories/role.factory';

class UserFactory extends BaseFactory<User> {
  constructor() {
    super(User);
  }

  make(data?: PartialModelObject<User>): PartialModelObject<User> {
    return {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      username: faker.internet.userName(),
      avatar_url: `https://api.multiavatar.com/${faker.internet.userName()}.png`,
      remember_me_token: crypto.randomBytes(32).toString('hex'),
      last_login_at: DateTime.fromJSDate(faker.date.past()).toISO(),
      is_active: faker.datatype.boolean(),
      is_deleted: faker.datatype.boolean(),
      is_email_verified: faker.datatype.boolean(),
      created_at: DateTime.fromJSDate(faker.date.past()).toISO(),
      updated_at: DateTime.fromJSDate(faker.date.past()).toISO(),
      ...data,
    };
  }

  makeStub(data?: PartialModelObject<User>): User {
    const user = new User();
    const userData = this.make(data);

    user.$setDatabaseJson({
      id: faker.number.int(),
      ...userData,
    });

    user.$setRelated<Role>('roles', [
      roleFactory.makeStub({
        name: RoleType.USER,
        slug: 'User',
        description: 'User system',
      }),
    ]);

    return user;
  }
}

export const userFactory = new UserFactory();
