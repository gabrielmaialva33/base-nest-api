import {
  EntityData,
  FilterQuery,
  Loaded,
  ObjectQuery,
  wrap,
} from '@mikro-orm/core';
import {
  Pagination,
  PaginationOptions,
} from '@common/interfaces/pagination.interface';
import { BaseEntity } from '@common/entities/base.entity';
import { EntityDTO, RequiredEntityData } from '@mikro-orm/core/typings';
import { RepositoryInterface } from '@common/interfaces/repository.interface';
import { EntityRepository } from '@mikro-orm/postgresql';

export class BaseRepository<Model extends BaseEntity>
  extends EntityRepository<Model>
  implements RepositoryInterface<Model>
{
  async paginate({
    page,
    per_page,
    search,
    sort,
    direction,
  }: PaginationOptions): Promise<Pagination<Model>> {
    const filter: any = [];
    if (search) {
      const fields = this._em.getMetadata().get<Model>(String(this.entityName))
        .properties['search_fields'].items;
      fields.forEach((field) => {
        filter.push({ [field]: { $like: `%${search}%` } });
      });
    }

    if (!page) page = 1;
    if (!per_page) per_page = 10;
    if (!sort) sort = 'created_at';
    if (!direction) direction = 'desc';

    const [data, total] = await this.findAndCount(
      {
        $or: [...filter],
      } as ObjectQuery<Model>,
      {
        limit: Number(per_page),
        offset: Math.abs(Number(per_page) * (Number(page) - 1)),
        orderBy: {
          [sort]: direction,
        } as ObjectQuery<Model>,
        populate: true,
      },
    );

    return {
      meta: {
        total,
        per_page: Number(per_page),
        current_page: Number(page),
        last_page: Math.ceil(total / Number(per_page)),
        first_page: 1,
        first_page_url: '/?page=1',
        last_page_url: `/?page=${Math.ceil(total / Number(per_page))}`,
        next_page_url: `/?page=${Number(page) + 1}`,
        previous_page_url:
          Number(page) > 1 ? `/?page=${Number(page) - 1}` : null,
        sorted_by: sort,
        direction,
      },
      data,
    };
  }

  async get(id: string): Promise<Loaded<Model>> {
    return this.findOne(id as FilterQuery<Model>);
  }

  async store(data: RequiredEntityData<Model>): Promise<Model> {
    const model = this.create(data);
    await this.persistAndFlush(model);
    return model;
  }

  async save(
    id: string,
    data: EntityData<Loaded<Model>> | Partial<EntityDTO<Loaded<Model>>>,
  ): Promise<Loaded<Model>> {
    const model = await this.findOneOrFail(id as FilterQuery<Model>);
    wrap(model).assign(data);
    await this.flush();
    return model;
  }

  async getBy(keys: string[], values: string[]) {
    const filters: any = [];
    for (let i = 0; i < keys.length; i++) filters.push({ [keys[i]]: values });
    return this.findOne({
      $or: [...filters],
    } as unknown as ObjectQuery<Model>);
  }
}
