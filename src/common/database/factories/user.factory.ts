import { Factory, Faker } from '@mikro-orm/seeder';
import { UserEntity } from '@user/entities/user.entity';

export class UserFactory extends Factory<UserEntity> {
  model = UserEntity;

  definition(faker: Faker): Partial<UserEntity> {
    return {
      first_name: faker.name.firstName(),
      last_name: faker.name.firstName(),
      user_name: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  }
}
