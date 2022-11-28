import { Injectable } from '@nestjs/common';
import { wrap } from '@mikro-orm/core';
import { DateTime } from 'luxon';

import { RoleRepository } from '@role/repositories/role.repository';
import { EditRoleDto, StoreRoleDto } from '@role/dto';
import { PaginationOptions } from '@common/interfaces/pagination.interface';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async list({ page, per_page, search, sort, direction }: PaginationOptions) {
    return this.roleRepository.paginate({
      page,
      per_page,
      search,
      sort,
      direction,
    });
  }

  async get(id: string) {
    return this.roleRepository.get(id);
  }

  async store(data: StoreRoleDto) {
    return this.roleRepository.store(data);
  }

  async save(id: string, data: EditRoleDto) {
    return this.roleRepository.save(id, data);
  }

  async delete(id: string) {
    const model = await this.roleRepository.get(id);
    wrap(model).assign({
      deleted_at: DateTime.local(),
    });
    await this.roleRepository.flush();
  }

  async getBy(fields: string[], values: string[]) {
    return this.roleRepository.getBy(fields, values);
  }
}
