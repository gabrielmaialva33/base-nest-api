import { from, map, Observable } from 'rxjs';

import {
  IKnexRepository,
  Builder,
  SingleBuilder,
} from '@src/common/module/knex-repository.interface';
import { BaseEntity } from '@src/common/module/base.entity';

export class KnexRepository<T extends BaseEntity>
  implements IKnexRepository<T>
{
  constructor(protected readonly model: typeof BaseEntity) {}

  all(
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

  get(
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

  create(payload: Partial<T>, builder?: Builder<T>): Observable<T> {
    return from(
      this.model.transaction(async (trx) => {
        const query = this.model.query(trx);
        if (typeof builder === 'function') query.modify(builder);
        return query.insert(payload);
      }),
    ).pipe(map((result) => result as T));
  }

  bulkCreate(payload: Partial<T>[], builder?: Builder<T>): Observable<T[]> {
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
}
