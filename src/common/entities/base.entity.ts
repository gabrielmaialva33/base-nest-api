import {
  BaseEntity as MikroBaseEntity,
  Entity,
  Filter,
  OptionalProps,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { DateTime } from 'luxon';

@Entity({ abstract: true, comment: 'An abstract base entity' })
@Filter({ name: 'deleted', cond: { deleted_at: { $ne: null } } })
export class BaseEntity extends MikroBaseEntity<BaseEntity, 'id'> {
  [OptionalProps]?: 'created_at' | 'updated_at' | 'deleted_at';

  /**
   * ------------------------------------------------------
   * Columns
   * ------------------------------------------------------
   * - column typing struct
   */
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id: string;

  @Property({
    name: 'created_at',
    type: 'datetime',
    defaultRaw: 'now()',
    hidden: true,
    onCreate: () => DateTime.local().toISO(),
  })
  created_at!: DateTime;

  @Property({
    name: 'updated_at',
    type: 'datetime',
    defaultRaw: 'now()',
    hidden: true,
    onCreate: () => DateTime.local().toISO(),
  })
  updated_at!: DateTime;

  @Property({
    name: 'deleted_at',
    type: 'datetime',
    nullable: true,
    hidden: true,
  })
  deleted_at?: DateTime;

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
