import {
  Collection,
  Entity,
  EntityRepositoryType,
  LoadStrategy,
  ManyToMany,
  Property,
} from '@mikro-orm/core';
import { RoleRepository } from '@role/repositories/role.repository';
import { UserEntity } from '@user/entities/user.entity';
import { BaseEntity } from '@common/entities/base.entity';

@Entity({
  tableName: 'roles',
  collection: 'roles',
  customRepository: () => RoleRepository,
  comment: 'Role Table',
})
export class RoleEntity extends BaseEntity {
  [EntityRepositoryType]?: RoleRepository;

  /**
   * ------------------------------------------------------
   * Columns
   * ------------------------------------------------------
   * - column typing struct
   */

  @Property({ length: 50, hidden: true })
  name: string;

  @Property({ length: 50 })
  slug: string;

  @Property({ length: 255 })
  description: string;

  /**
   * ------------------------------------------------------
   * Relationships
   * ------------------------------------------------------
   * - define model relationships
   */
  @ManyToMany({
    entity: () => UserEntity,
    pivotTable: 'users_roles',
    joinColumn: 'user_id',
    inverseJoinColumn: 'role_id',
    strategy: LoadStrategy.JOINED,
  })
  users: Collection<UserEntity> = new Collection<UserEntity>(this);

  /**
   * ------------------------------------------------------
   * Hooks
   * ------------------------------------------------------
   */

  /**
   * ------------------------------------------------------
   * Methods
   * ------------------------------------------------------
   */

  /**
   * ------------------------------------------------------
   * Query Scopes
   * ------------------------------------------------------
   */
}
