import { Injectable, Inject } from '@nestjs/common';

import {
  IRoleRepository,
  ROLE_REPOSITORY,
} from '@src/modules/roles/interfaces/roles.interface';
import { User } from '@src/modules/users/entities/user.entity';

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

  attachRoleToUser(user: User, roleIds: number[]) {
    return this.roleRepository.attachRoleToUser(user, roleIds);
  }
}
