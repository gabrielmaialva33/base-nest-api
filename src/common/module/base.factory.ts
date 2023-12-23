import { forkJoin, from, Observable } from 'rxjs';
import { PartialModelObject } from 'objection';

import { BaseEntity } from '@src/common/module/base.entity';

export abstract class BaseFactory<T extends BaseEntity> {
  protected constructor(protected model: typeof BaseEntity) {}

  protected abstract make(data?: Partial<T>): PartialModelObject<T>;

  protected abstract makeStub(data?: Partial<T>): T;

  makeMany(quantity: number, data?: Partial<T>): PartialModelObject<T>[] {
    const entities: PartialModelObject<T>[] = [];
    for (let i = 0; i < quantity; i++) {
      entities.push(this.make(data));
    }

    return entities;
  }

  makeManyStub(amount = 10, data?: Partial<T>): T[] {
    const entities: T[] = [];
    for (let i = 0; i < amount; i++) {
      entities.push(this.makeStub(data));
    }
    return entities;
  }

  create$(data?: Partial<T>): Observable<T> {
    const entity = this.make(data);
    return from(this.model.query().insertAndFetch(entity)) as Observable<T>;
  }

  createMany$(amount: number, data?: Partial<T>): Observable<T[]> {
    const observables = Array.from({ length: amount }, () =>
      this.create$(data),
    );
    return forkJoin(observables);
  }

  async create(data?: Partial<T>): Promise<T> {
    const entity = this.make(data);
    return (await this.model.query().insertAndFetch(entity)) as T;
  }

  async createMany(amount: number, data?: Partial<T>): Promise<T[]> {
    const createPromises = Array.from({ length: amount }, () =>
      this.create(data),
    );
    return Promise.all(createPromises);
  }
}
