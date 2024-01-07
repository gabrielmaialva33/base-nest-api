import { Controller, Get, Param, Patch } from '@nestjs/common';

import { Auth } from '@src/common/decorators/auth.decorator';
import { Roles } from '@src/common/decorators/roles.decorator';

import { RolesService } from '@src/modules/roles/services/roles.service';
import { RoleType } from '@src/modules/roles/interfaces/roles.interface';

@Auth()
@Roles(RoleType.ADMIN, RoleType.ROOT)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Roles(RoleType.USER, RoleType.ADMIN, RoleType.ROOT)
  @Get()
  list() {
    return this.rolesService.list();
  }

  @Roles(RoleType.USER, RoleType.ADMIN, RoleType.ROOT)
  @Get(':id')
  get(@Param('id') id: string) {
    return this.rolesService.get(+id);
  }

  @Patch(':role_id/add-role/:user_id')
  addRole(@Param('role_id') roleId: string, @Param('user_id') userId: string) {
    return this.rolesService.addRole(+userId, +roleId);
  }
}
