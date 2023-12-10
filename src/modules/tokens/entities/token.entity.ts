import { QueryBuilder } from 'objection';
import { DateTime } from 'luxon';

import { BaseEntity } from '@src/common/module/base.entity';

export class Token extends BaseEntity {
  public static tableName = 'api_tokens';

  /**
   * ------------------------------------------------------
   * Columns
   * ------------------------------------------------------
   * Columns are used to define the fields of the model.
   */
  name: string;
  type: string;
  token: string;
  user_id: number;
  expires_at: string;
  created_at: string;

  /**
   * ------------------------------------------------------
   * Relations
   * ------------------------------------------------------
   * Relations are used to define relationships between models.
   */

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
    notExpired: (builder: QueryBuilder<Token>) =>
      builder.where('expires_at', '>', DateTime.local().toISO()),
  };

  /**
   * ------------------------------------------------------
   * Misc
   * ------------------------------------------------------
   * - jsonSchema is used by objection to validate the data before inserting it into the database (optional)
   * - $formatJson is used by objection to format the data before sending it to the client (optional)
   */
  static jsonSchema = {
    type: 'object',
    required: ['name', 'type', 'token', 'user_id'],
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      type: { type: 'string' },
      token: { type: 'string' },
      user_id: { type: 'integer' },
      expires_at: { type: ['string', 'null'] },
      created_at: { type: 'string' },
    },
  };
}
