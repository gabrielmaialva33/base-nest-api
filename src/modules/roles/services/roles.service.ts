import { Injectable, Inject } from '@nestjs/common';

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
}
