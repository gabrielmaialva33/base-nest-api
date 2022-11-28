import {
  Cascade,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

import { UserEntity } from '@user/entities/user.entity';
import { RoleEntity } from '@role/entities/role.entity';
import { DateTime } from 'luxon';

@Entity({
  tableName: 'users_roles',
  collection: 'users_roles',
  comment: 'UserEntity Role Pivot Table',
})
export class UserRoleEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id: string;

  @ManyToOne(() => UserEntity, {
    primary: true,
    cascade: [Cascade.ALL],
    onDelete: 'cascade',
    referencedColumnNames: ['id'],
  })
  user: UserEntity;

  @ManyToOne(() => RoleEntity, {
    primary: true,
    cascade: [Cascade.ALL],
    onDelete: 'cascade',
    referencedColumnNames: ['id'],
  })
  role: RoleEntity;

  @Property({
    name: 'assigned_at',
    type: 'datetime',
    defaultRaw: 'now()',
    onCreate: () => DateTime.local().toISO(),
  })
  assigned_at: DateTime;
}
