import crypto from 'crypto';
import { ModelObject } from 'objection';
import { faker } from '@faker-js/faker';
import { DateTime } from 'luxon';

import { BaseFactory } from '@src/common/module/base.factory';
import { User } from '@src/modules/users/entities/user.entity';

export class UserFactory extends BaseFactory<User> {
  constructor() {
    super(User);
  }
  make(data?: Partial<ModelObject<User>>): Partial<ModelObject<User>> {
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

  makeStub(data?: Partial<ModelObject<User>>): User {
    const user = new User();
    const userData = this.make(data);

    user.$setDatabaseJson({
      id: faker.number.int(),
      ...userData,
    });

    return user;
  }
}
