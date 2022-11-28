import {
  BeforeCreate,
  BeforeUpdate,
  Collection,
  Entity,
  EntityRepositoryType,
  Enum,
  EventArgs,
  LoadStrategy,
  ManyToMany,
  Property,
} from '@mikro-orm/core';

import { BaseEntity } from '@src/common/entities/base.entity';
import { UserRepository } from '@user/repositories/user.repository';
import { RoleEntity } from '@role/entities/role.entity';
import { Argon2Utils } from '@common/helpers';

@Entity({
  tableName: 'users',
  collection: 'users',
  customRepository: () => UserRepository,
  comment: 'UserEntity Table',
})
export class UserEntity extends BaseEntity {
  [EntityRepositoryType]?: UserRepository;

  /**
   * ------------------------------------------------------
   * Columns
   * ------------------------------------------------------
   * - column typing struct
   */

  @Property({ length: 80 })
  first_name: string;

  @Property({ length: 80 })
  last_name: string;

  @Property({
    columnType:
      "varchar(160) generated always as (first_name || ' ' || last_name) stored",
    ignoreSchemaChanges: ['type', 'extra'],
    nullable: true,
  })
  full_name: string;

  @Property({ unique: true })
  email: string;

  @Property({ length: 50, unique: true })
  user_name: string;

  @Property({ hidden: true, length: 118 })
  password: string;

  @Property({ type: 'boolean', default: false })
  is_online: boolean;

  /**
   * ------------------------------------------------------
   * Relationships
   * ------------------------------------------------------
   * - define model relationships
   */
  @ManyToMany({
    entity: () => RoleEntity,
    pivotTable: 'users_roles',
    joinColumn: 'user_id',
    inverseJoinColumn: 'role_id',
    strategy: LoadStrategy.JOINED,
  })
  roles: Collection<RoleEntity> = new Collection<RoleEntity>(this);

  /**
   * ------------------------------------------------------
   * Hooks
   * ------------------------------------------------------
   */
  @BeforeCreate()
  @BeforeUpdate()
  async hashPassword(arguments_: EventArgs<this>) {
    if (arguments_.changeSet.payload?.password)
      this.password = await Argon2Utils.hash(this.password);
  }

  /**
   * ------------------------------------------------------
   * Methods
   * ------------------------------------------------------
   */
  @Enum({
    items: () => ['first_name', 'last_name', 'email', 'user_name'],
    persist: false,
    hidden: true,
  })
  search_fields: string[] = ['first_name', 'last_name', 'email', 'user_name'];

  /**
   * ------------------------------------------------------
   * Query Scopes
   * ------------------------------------------------------
   */

  constructor(data: Partial<UserEntity>) {
    super();
    this.assign(data);
  }
}
