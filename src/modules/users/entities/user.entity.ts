import { Pojo, QueryBuilder } from 'objection';
import { omit } from 'helper-fns';

import { BaseEntity } from '@src/common/module/base.entity';

export class User extends BaseEntity {
  static tableName = 'users';

  /**
   * ------------------------------------------------------
   * Columns
   * ------------------------------------------------------
   */
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  avatar_url: string;
  username: string;
  last_login_at: Date;
  is_email_verified: boolean;
  is_deleted: boolean;
  deleted_at: Date;
  created_at: string;
  updated_at: string;

  /**
   * ------------------------------------------------------
   * Relations
   * ------------------------------------------------------
   */

  /**
   * ------------------------------------------------------
   * Hooks
   * ------------------------------------------------------
   */
  $afterInsert() {}
  $beforeUpdate() {}

  /**
   * ------------------------------------------------------
   * Scopes
   * ------------------------------------------------------
   */
  static scopes = {
    notDeleted(builder: QueryBuilder<User>) {
      builder.whereNot('is_deleted', true);
    },
  };

  /**
   * ------------------------------------------------------
   * Misc
   * ------------------------------------------------------
   */
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['first_name', 'last_name', 'email', 'password'],
      properties: {
        id: { type: 'integer' },
        first_name: { type: 'string', minLength: 1, maxLength: 255 },
        last_name: { type: 'string', minLength: 1, maxLength: 255 },
        email: { type: 'string', minLength: 1, maxLength: 255 },
        password: { type: 'string', minLength: 1, maxLength: 255 },
        avatar_url: { type: ['string', 'null'], minLength: 1, maxLength: 255 },
        username: { type: ['string', 'null'], minLength: 1, maxLength: 255 },
        last_login_at: { type: 'string', minLength: 1, maxLength: 255 },
        is_email_verified: { type: 'boolean' },
        is_deleted: { type: 'boolean' },
        deleted_at: { type: ['string', 'null'], minLength: 1, maxLength: 255 },
        created_at: { type: 'string', minLength: 1, maxLength: 255 },
        updated_at: { type: 'string', minLength: 1, maxLength: 255 },
      },
    };
  }

  $formatJson(json: Pojo) {
    json = super.$formatJson(json);
    return omit(json, ['password', 'is_deleted', 'deleted_at']);
  }
}
