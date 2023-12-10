import { Observable } from 'rxjs';
import {
  ModelObject,
  Modifier,
  ModifierFunction,
  QueryBuilder,
  QueryBuilderType,
  SingleQueryBuilder,
} from 'objection';

import { BaseEntity } from '@src/common/module/base.entity';

export type Builder<T extends BaseEntity> = ModifierFunction<QueryBuilder<T>>;
export type SingleBuilder<T extends BaseEntity> = Modifier<
  SingleQueryBuilder<QueryBuilderType<T>>
>;

export interface IKnexRepository<T extends BaseEntity> {
  /**
   * Get all the records that match the clause or query.
   *
   * @param {Partial<T> | Builder<T>} clauseOrBuilder - The clause or query to filter the records
   * @param {Builder<T>} builder - The query to filter the records
   * @returns {Observable<T[]>}
   *
   * @example
   * // Using a clause
   * const models = this.repository.all({ name: 'example' });
   * models.subscribe(results => console.log(results));
   *
   * @example
   * // Using a clause and a query
   * const models = this.repository.all({ name: 'example' }, query => query.orderBy('id', 'desc'));
   * models.subscribe(results => console.log(results));
   *
   * @example
   * // Using a query
   * const models = this.repository.all(query => query.orderBy('id', 'desc'));
   *
   * @memberof IKnexRepository
   */
  all(
    clauseOrBuilder?: Partial<T> | Builder<T>,
    builder?: Builder<T>,
  ): Observable<T[]>;

  /**
   * Get the first record that matches the clause or query.
   *
   * @param {Partial<T> | Builder<T>} clauseOrBuilder - The clause or query to filter the records
   * @param {Builder<T>} builder - The query to filter the records
   * @returns {Observable<T>}
   *
   * @example
   * // Using a clause
   * const model = this.repository.get({ id: 1 });
   * model.subscribe(result => console.log(result));
   *
   * @example
   * // Using a query
   * const model = this.repository.get(query => query.orderBy('id', 'desc'));
   * model.subscribe(result => console.log(result));
   *
   * @example
   * // Using a clause and a query
   * const model = this.repository.get({ id: 1 }, query => query.orderBy('id', 'desc'));
   * model.subscribe(result => console.log(result));
   *
   * @memberof IKnexRepository
   */
  get(
    clauseOrBuilder?: Partial<T> | Builder<T>,
    builder?: Builder<T>,
  ): Observable<T>;

  /**
   * Create a new record.
   *
   * @param {Partial<ModelObject<T>>} payload - The data to create the record
   * @param {Builder<T>} builder - The query to filter the records
   * @returns {Observable<T>}
   *
   * @example
   * const model = this.repository.create({ name: 'example' });
   * model.subscribe(result => console.log(result));
   *
   * @example
   * const model = this.repository.create({ name: 'example' }, query => query.orderBy('id', 'desc'));
   *
   * @memberof IKnexRepository
   */
  create(payload: Partial<ModelObject<T>>, builder?: Builder<T>): Observable<T>;

  /**
   * Create multiple records.
   *
   * @param {Partial<ModelObject<T>>[]} payload - The data to create the records
   * @param {Builder<T>} builder - The query to filter the records
   * @returns {Observable<T[]>}
   *
   * @example
   * const models = this.repository.bulkCreate([{ name: 'example' }, { name: 'example' }]);
   * models.subscribe(result => console.log(result));
   *
   * @example
   * const models = this.repository.bulkCreate([{ name: 'example' }, { name: 'example' }], query => query.orderBy('id', 'desc'));
   *
   * @memberof IKnexRepository
   */
  bulkCreate(
    payload: Partial<ModelObject<T>>[],
    builder?: Builder<T>,
  ): Observable<T[]>;

  /**
   * Update a record.
   *
   * @param {T} model - The model to update
   * @param {SingleBuilder<T>} builder - The query to filter the records
   * @returns {Observable<T>}
   *
   * @example
   * const user = await this.repository.get({ id: 1 });
   * const model = this.repository.update(user);
   * model.subscribe(result => console.log(result));
   *
   * @example
   * const user = await this.repository.get({ id: 1 });
   * const model = this.repository.update(user, query => query.where('id', '!=', 1));
   * model.subscribe(result => console.log(result));
   *
   * @memberof IKnexRepository
   */
  update(model: T, builder?: SingleBuilder<T>): Observable<T>;

  /**
   * Destroy a record.
   * @param {T} model - The model to delete
   * @param {SingleBuilder<T>} builder - The query to filter the records
   * @returns {Observable<number>}
   * @memberof IKnexRepository
   * @example
   * const user = await this.repository.get({ id: 1 });
   * const model = this.repository.destroy(user);
   * model.subscribe(result => console.log(result));
   * @example
   * const user = await this.repository.get({ id: 1 });
   * const model = this.repository.destroy(user, query => query.where('id', '!=', 1));
   * model.subscribe(result => console.log(result));
   */
  destroy(model: T, builder?: SingleBuilder<T>): Observable<number>;
}
