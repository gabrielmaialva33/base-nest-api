import { Pojo, QueryBuilder } from 'objection';
import { omit } from 'helper-fns';
import * as path from 'path';

import { BaseEntity } from '@src/common/module/base.entity';
import { User } from '@src/modules/users/entities/user.entity';
import { Env } from '@src/env';

export class Role extends BaseEntity {
  static tableName = 'roles';

  /**
   * ------------------------------------------------------
   * Columns
   * ------------------------------------------------------
   * Columns are used to define the fields of the model.
   */
  id: number;
  name: string;
  slug: string;
  description: string;
  created_at: string;

  /**
   * ------------------------------------------------------
   * Relations
   * ------------------------------------------------------
   * Relations are used to define relationships between models.
   */
  static relationMappings = {
    users: {
      relation: BaseEntity.ManyToManyRelation,
      modelClass: path.join(__dirname, '../../users/entities/user.entity'),
      join: {
        from: 'roles.id',
        through: {
          from: 'user_roles.role_id',
          to: 'user_roles.user_id',
        },
        to: 'users.id',
      },
    },
  };

  users: User[];

  /**
   * ------------------------------------------------------
   * Hooks
   * ------------------------------------------------------
   * Hooks are used to perform actions before or after certain events.
   */

  /**
   * ------------------------------------------------------
   * Scopes
   * ------------------------------------------------------
   * Scopes are used to define commonly used queries that can be re-used in multiple places.
   */
  static scopes = {
    search: (builder: QueryBuilder<Role>, search: string) =>
      builder.where((builder) => {
        const like = Env.DB_CLIENT === 'pg' ? 'ilike' : 'like';
        builder.andWhere((builder) => {
          for (const field of this.searchBy)
            builder.orWhere(field, `${like}`, `%${search}%`);
        });
      }),
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'slug'],
      properties: {
        name: { type: 'string', minLength: 1, maxLength: 50 },
        slug: { type: 'string', minLength: 1, maxLength: 50 },
        description: { type: ['string', 'null'] },
      },
    };
  }

  $formatJson(json: Pojo) {
    json = super.$formatJson(json);
    json = omit(json, ['created_at', 'updated_at']);
    return json;
  }

  static searchBy = ['name', 'slug'];
}
