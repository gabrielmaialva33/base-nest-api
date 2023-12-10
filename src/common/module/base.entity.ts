import Objection, { Model } from 'objection';

export class BaseEntity extends Model {
  /**
   * ------------------------------------------------------
   * Config
   * ------------------------------------------------------
   */
  static useLimitInFirst = true;
  static idColumn = 'id';

  static get modelPaths() {
    return [__dirname];
  }

  /**
   * ------------------------------------------------------
   * Columns
   * ------------------------------------------------------
   */

  /**
   * ------------------------------------------------------
   * Hooks
   * ------------------------------------------------------
   */
  $beforeInsert(queryContext: Objection.QueryContext): Promise<any> | void {
    return super.$beforeInsert(queryContext);
  }

  $beforeUpdate(
    opt: Objection.ModelOptions,
    queryContext: Objection.QueryContext,
  ): Promise<any> | void {
    return super.$beforeUpdate(opt, queryContext);
  }

  $afterInsert(queryContext: Objection.QueryContext): Promise<any> | void {
    return super.$afterInsert(queryContext);
  }

  $afterUpdate(
    opt: Objection.ModelOptions,
    queryContext: Objection.QueryContext,
  ): Promise<any> | void {
    return super.$afterUpdate(opt, queryContext);
  }

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
