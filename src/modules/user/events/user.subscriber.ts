import { EntityName, EventArgs, EventSubscriber } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { UserEntity } from '@user/entities/user.entity';
import { Argon2Utils } from '@common/helpers';

@Injectable()
export class UserSubscriber implements EventSubscriber<UserEntity> {
  getSubscribedEntities(): EntityName<UserEntity>[] {
    return [UserEntity];
  }

  async beforeCreate(arguments_: EventArgs<UserEntity>): Promise<void> {
    if (arguments_.changeSet.payload?.password) {
      arguments_.entity.password = await Argon2Utils.hash(
        arguments_.entity.password,
      );
    }
  }

  async beforeUpdate(arguments_: EventArgs<UserEntity>): Promise<void> {
    if (arguments_.changeSet.payload?.password) {
      arguments_.entity.password = await Argon2Utils.hash(
        arguments_.entity.password,
      );
    }
  }
}
