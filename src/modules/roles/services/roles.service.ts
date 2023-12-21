import { Injectable, Inject } from '@nestjs/common';

import { CreateRoleDto } from '@src/modules/roles/dto/create-role.dto';
import { UpdateRoleDto } from '@src/modules/roles/dto/update-role.dto';
import {
  IRoleRepository,
  ROLE_REPOSITORY,
} from '@src/modules/roles/interfaces/roles.interface';

@Injectable()
export class RolesService {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  list() {
    return this.roleRepository.list();
  }

  get(id: number) {
    return this.roleRepository.getById(id);
  }
  create(data: CreateRoleDto) {
    return this.roleRepository.create(data);
  }

  edit(id: number, data: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
