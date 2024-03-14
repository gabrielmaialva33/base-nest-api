import { from, map, Observable } from 'rxjs';
import { OrderByDirection, PartialModelObject } from 'objection';
import { HttpException, HttpStatus } from '@nestjs/common';

import {
  Builder,
  IKnexRepository,
  ListOptions,
  PaginateResult,
  SingleBuilder,
} from '@src/common/module/knex-repository.interface';
import { BaseEntity } from '@src/common/module/base.entity';
import { PaginationOptions } from '@src/common/module/pagination';

export class KnexRepository<T extends BaseEntity>
  implements IKnexRepository<T>
{
  protected readonly DEFAULT_SORT = 'id';
  protected readonly DEFAULT_ORDER: OrderByDirection = 'asc';
  protected readonly DEFAULT_PAGE = 1;
  protected readonly DEFAULT_PER_PAGE = 10;

  constructor(protected readonly model: typeof BaseEntity) {}

  list(options?: ListOptions<T>, builder?: Builder<T>): Observable<T[]> {
    const { sort = this.DEFAULT_SORT, order = this.DEFAULT_ORDER } =
      options || {};

    return from(
      this.model.query().modify((query) => {
        if (sort !== this.DEFAULT_SORT) this.validateSortProperty(String(sort));
        if (order !== this.DEFAULT_ORDER) this.validateOrderProperty(order);

        if (typeof builder === 'function') query.modify(builder);

        return query.orderBy(
          `${this.model.tableName}.${String(sort).toLowerCase()}`,
          order,
        );
      }),
    ).pipe(map((result) => result as T[]));
  }

  paginate(
    args?: PaginationOptions<T>,
    builder?: Builder<T>,
  ): Observable<PaginateResult<T>> {
    const {
      page = this.DEFAULT_PAGE,
      per_page = this.DEFAULT_PER_PAGE,
      sort = this.DEFAULT_SORT,
      order = this.DEFAULT_ORDER,
    } = args || {};

    return from(
      this.model.transaction(async (trx) => {
        if (sort !== this.DEFAULT_SORT) this.validateSortProperty(String(sort));
        if (order !== this.DEFAULT_ORDER) this.validateOrderProperty(order);

        const query = this.model.query(trx);
        if (typeof builder === 'function') query.modify(builder);

        query.page(Number(page) - 1, Number(per_page));

        return query.orderBy(
          `${this.model.tableName}.${String(sort).toLowerCase()}`,
          order,
        );
      }),
    ).pipe(
      map(
        (result) =>
          ({
            results: result['results'] as T[],
            total: result['total'] as number,
          }) as { results: T[]; total: number },
      ),
    );
  }

  findClause(
    clauseOrBuilder?: Partial<T> | Builder<T>,
    builder?: Builder<T>,
  ): Observable<T[]> {
    return from(
      this.model.query().modify((query) => {
        if (typeof clauseOrBuilder === 'function')
          query.modify(clauseOrBuilder);
        else if (clauseOrBuilder) query.where(clauseOrBuilder);
        if (typeof builder === 'function') query.modify(builder);
      }),
    ).pipe(map((result) => result as T[]));
  }

  findBy(key: keyof T, value: any, builder?: Builder<T>): Observable<T[]> {
    return from(
      this.model.query().modify((query) => {
        query.where(key as any, value);
        if (typeof builder === 'function') query.modify(builder);
      }),
    ).pipe(map((result) => result as T[]));
  }

  firstClause(
    clauseOrBuilder?: Partial<T> | Builder<T>,
    builder?: Builder<T>,
  ): Observable<T> {
    return from(
      this.model
        .query()
        .modify((query) => {
          if (typeof clauseOrBuilder === 'function')
            query.modify(clauseOrBuilder);
          else if (clauseOrBuilder) query.where(clauseOrBuilder);
          if (typeof builder === 'function') query.modify(builder);
        })
        .first(),
    ).pipe(map((result) => result as T));
  }

  firstBy(key: keyof T, value: any, builder?: Builder<T>): Observable<T> {
    return from(
      this.model
        .query()
        .modify((query) => {
          query.where(key as any, value);
          if (typeof builder === 'function') query.modify(builder);
        })
        .first(),
    ).pipe(map((result) => result as T));
  }

  find(id: number, builder?: Builder<T>): Observable<T> {
    return from(
      this.model
        .query()
        .modify((query) => {
          if (typeof builder === 'function') query.modify(builder);
        })
        .findById(id)
        .first(),
    ).pipe(map((result) => result as T));
  }

  create(payload: PartialModelObject<T>, builder?: Builder<T>): Observable<T> {
    return from(
      this.model
        .query()
        .modify((query) => {
          if (typeof builder === 'function') query.modify(builder);
        })
        .insert(payload),
    ).pipe(map((result) => result as T));
  }

  bulkCreate(
    payload: PartialModelObject<T>[],
    builder?: Builder<T>,
  ): Observable<T[]> {
    return from(
      this.model.transaction(async (trx) => {
        const query = this.model.query(trx);
        if (builder && typeof builder === 'function') query.modify(builder);
        return query.insert(payload) as unknown as T[];
      }),
    ).pipe(map((result) => result as T[]));
  }

  update(model: T, builder?: SingleBuilder<T>): Observable<T> {
    return from(
      model
        .$query()
        .modify((query) => {
          if (typeof builder === 'function') query.modify(builder);
        })
        .update()
        .returning('*'),
    ).pipe(map((result) => result as T));
  }

  destroy(model: T, builder?: SingleBuilder<T>): Observable<number> {
    return from(
      this.model.transaction(async (trx) => {
        const query = model.$query(trx);
        if (builder && typeof builder === 'function') query.modify(builder);
        return query.delete();
      }),
    ).pipe(map((result) => result as unknown as number));
  }

  /**
   * Helper method to paginate a query
   */
  private validateSortProperty(sort: string) {
    if (
      !Object.keys(this.model.jsonSchema.properties).includes(
        sort.toLowerCase(),
      )
    )
      throw new HttpException(
        `sort property must be one of: ${Object.keys(
          this.model.jsonSchema.properties,
        ).join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
  }

  private validateOrderProperty(order: string) {
    if (order.toLowerCase() !== 'asc' && order !== 'desc')
      throw new HttpException(
        `order property must be asc or desc`,
        HttpStatus.BAD_REQUEST,
      );
  }

  findOrCreate(
    searchPayload: PartialModelObject<T>,
    createPayload: PartialModelObject<T>,
    builder?: Builder<T>,
  ): Observable<T> {
    return from(
      this.model.transaction(async (trx) => {
        const query = this.model.query(trx);
        if (builder && typeof builder === 'function') query.modify(builder);

        const result = await query.where(searchPayload).first();
        if (result) return result;

        return query.insert(createPayload).returning('*').first();
      }),
    ).pipe(map((result) => result as T));
  }
}
