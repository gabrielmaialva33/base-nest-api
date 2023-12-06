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
  created_at: Date;
  updated_at: Date;

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

  /**
   * ------------------------------------------------------
   * Scopes
   * ------------------------------------------------------
   */

  /**
   * ------------------------------------------------------
   * Misc
   * ------------------------------------------------------
   */
}
