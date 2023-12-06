import { IKnexRepository } from '@src/common/module/knex-repository.interface';
import { BaseEntity } from '@src/common/module/base.entity';
import { from, Observable } from 'rxjs';

export class KnexRepository<T extends BaseEntity>
  implements IKnexRepository<T>
{
  constructor(protected readonly model: typeof BaseEntity) {}

  all(): Observable<T[]> {
    return from(this.model.query().then((result) => result as T[]));
  }
}
