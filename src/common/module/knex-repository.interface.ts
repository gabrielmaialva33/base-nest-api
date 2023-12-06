import { BaseEntity } from '@src/common/module/base.entity';
import { Observable } from 'rxjs';

export interface IKnexRepository<T extends BaseEntity> {
  /**
   * @description All the records
   * @memberof IKnexRepository
   * @returns {Observable<Model[]>}
   * @example
   * const model = () => this.repository.all()
   * model().subscribe((result) => console.log(result));
   */
  all(): Observable<T[]>;
}
