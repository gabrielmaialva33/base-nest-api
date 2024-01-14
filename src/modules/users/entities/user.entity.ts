import { Pojo, QueryBuilder } from 'objection';
import { omit } from 'helper-fns';
import { DateTime } from 'luxon';
import * as path from 'path';

import { Env } from '@src/env';
import { Argon2Utils } from '@src/common/helpers/argon2.utils';

import { BaseEntity } from '@src/common/module/base.entity';
import { Role } from '@src/modules/roles/entities/role.entity';

export class User extends BaseEntity {
  static tableName = 'users';

  /**
   * ------------------------------------------------------
   * Columns
   * ------------------------------------------------------
   * Columns are used to define the fields of the model.
   */
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  avatar_url: string;
  username: string;
  last_login_at: string;
  remember_me_token: string;
  is_active: boolean;
  is_email_verified: boolean;
  is_deleted: boolean;
  deleted_at: string;
  created_at: string;
  updated_at: string;

  /**
   * ------------------------------------------------------
   * Relations
   * ------------------------------------------------------
   * Relations are used to define relationships between models.
   */
  static relationMappings = {
    tokens: {
      relation: BaseEntity.HasManyRelation,
      modelClass: path.join(__dirname, '../../tokens/entities/token.entity'),
      join: {
        from: 'users.id',
        to: 'api_tokens.user_id',
      },
    },
    roles: {
      relation: BaseEntity.ManyToManyRelation,
      modelClass: path.join(__dirname, '../../roles/entities/role.entity'),
      join: {
        from: 'users.id',
        through: {
          from: 'user_roles.user_id',
          to: 'user_roles.role_id',
        },
        to: 'roles.id',
      },
    },
  };

  roles: Role[];

  /**
   * ------------------------------------------------------
   * Hooks
   * ------------------------------------------------------
   * Hooks are used to perform actions before or after certain events.
   */
  async $beforeInsert() {
    // Hash the password before inserting the user
    if (this.password)
      this.password = await Argon2Utils.hashPassword(this.password);
  }

  $beforeUpdate() {
    this.updated_at = DateTime.local().toISO();
  }

  /**
   * ------------------------------------------------------
   * Scopes
   * ------------------------------------------------------
   * Scopes are used to define commonly used queries that can be re-used in multiple places.
   */
  static scopes = {
    notDeleted: (builder: QueryBuilder<User>) =>
      builder.whereNot(`$${this.tableName}.is_deleted`, true),
    search: (builder: QueryBuilder<User>, search: string) =>
      builder.where((builder) => {
        const like = Env.DB_CLIENT === 'pg' ? 'ilike' : 'like';
        builder.andWhere((builder) => {
          for (const field of this.searchBy)
            builder.orWhere(`${this.tableName}.${field}`, like, `%${search}%`);
        });
      }),
    relations: (builder: QueryBuilder<User>) =>
      builder.withGraphFetched('[roles]'),
  };

  /**
   * ------------------------------------------------------
   * Misc
   * ------------------------------------------------------
   * - jsonSchema is used by objection to validate the data before inserting it into the database (optional)
   * - $formatJson is used by objection to format the data before sending it to the client (optional)
   * - uid is used to identify the user by unique identifier (email or username)
   */
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['first_name', 'last_name', 'email', 'password'],
      properties: {
        id: { type: 'integer' },
        first_name: { type: 'string', minLength: 1, maxLength: 80 },
        last_name: { type: 'string', minLength: 1, maxLength: 80 },
        email: { type: 'string', minLength: 1, maxLength: 255 },
        password: { type: 'string', minLength: 1, maxLength: 118 },
        avatar_url: { type: ['string', 'null'], minLength: 1, maxLength: 255 },
        username: { type: ['string', 'null'], minLength: 1, maxLength: 40 },
        remember_me_token: {
          type: ['string', 'null'],
          minLength: 1,
          maxLength: 255,
        },
        last_login_at: { type: 'string', minLength: 1, maxLength: 255 },
        is_active: { type: 'boolean' },
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
    return omit(json, [
      'password',
      'remember_me_token',
      'is_deleted',
      'deleted_at',
    ]);
  }

  static uid = ['email', 'username'];
  static searchBy = ['first_name', 'last_name', 'email', 'username'];
}
