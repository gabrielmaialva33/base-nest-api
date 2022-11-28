import { EntityData, Loaded } from '@mikro-orm/core';
import {
  Pagination,
  PaginationOptions,
} from '@common/interfaces/pagination.interface';
import { EntityDTO, RequiredEntityData } from '@mikro-orm/core/typings';
import { BaseEntity } from '@common/entities/base.entity';

export interface RepositoryInterface<Model extends BaseEntity> {
  paginate(options: PaginationOptions): Promise<Pagination<Model>>;

  get(id: string): Promise<Model>;

  store(data: RequiredEntityData<Model>): Promise<Model>;

  save(
    id: string,
    data: EntityData<Loaded<Model>> | Partial<EntityDTO<Loaded<Model>>>,
  ): Promise<Loaded<Model>>;
}
