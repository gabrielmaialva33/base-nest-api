import {
  BaseEntity,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

import { DateTime } from 'luxon';
import { UserEntity } from '@user/entities/user.entity';

@Entity({
  tableName: 'logs',
  comment: 'request logs for the application',
})
export class LoggerEntity extends BaseEntity<LoggerEntity, 'id'> {
  /**
   * ------------------------------------------------------
   * Columns
   * ------------------------------------------------------
   * - column typing struct
   */
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id: string;

  @Property({ nullable: true, comment: 'ip address of the request' })
  ip: string;

  @Property({ nullable: true })
  remote_ip: string;

  @Property({ nullable: true })
  remote_port: number;

  @Property({ nullable: true })
  remote_family: string;

  @Property({ nullable: true, comment: 'request method' })
  method: string;

  @Property({ nullable: true, comment: 'request url' })
  url: string;

  @Property({ nullable: true })
  protocol: string;

  @Property({ type: 'json', comment: 'request parameters', nullable: true })
  parameters: object;

  @Property({ type: 'json', comment: 'request query', nullable: true })
  query: object;

  @Property({ type: 'json', comment: 'request headers', nullable: true })
  headers: object;

  @Property({
    name: 'created_at',
    type: 'datetime',
    defaultRaw: 'now()',
    hidden: true,
    onCreate: () => DateTime.local().toISO(),
  })
  created_at!: DateTime;

  /**
   * ------------------------------------------------------
   * Relationships
   * ------------------------------------------------------
   * - define model relationships
   */
  @ManyToOne(() => UserEntity, {
    nullable: true,
    comment: 'user who made the request',
    type: 'uuid',
    fieldName: 'user_id',
  })
  user: UserEntity;

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

  constructor(data: Partial<LoggerEntity>) {
    super();
    this.assign(data);
  }
}
