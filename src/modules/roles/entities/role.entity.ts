import { Pojo } from 'objection';

import { BaseEntity } from '@src/common/module/base.entity';
import { User } from '@src/modules/users/entities/user.entity';

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
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;

  /**
   * ------------------------------------------------------
   * Relations
   * ------------------------------------------------------
   * Relations are used to define relationships between models.
   */
  static relationMappings = {
    users: {
      relation: BaseEntity.ManyToManyRelation,
      modelClass: User,
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

  /**
   * ------------------------------------------------------
   * Misc
   * ------------------------------------------------------
   * - jsonSchema is used by objection to validate the data before inserting it into the database (optional)
   * - $formatJson is used by objection to format the data before sending it to the client (optional)
   */

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: 'string', minLength: 1, maxLength: 255 },
        is_active: { type: 'boolean' },
      },
    };
  }

  $formatJson(json: Pojo) {
    json = super.$formatJson(json);
    return json;
  }
}
