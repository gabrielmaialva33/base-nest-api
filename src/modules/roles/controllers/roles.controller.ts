import { Controller, Get, Param, Patch } from '@nestjs/common';

import { RolesService } from '@src/modules/roles/services/roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  list() {
    return this.rolesService.list();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.rolesService.get(+id);
  }

  // add role to user
  @Patch(':role_id/add-role/:user_id')
  addRole(@Param('role_id') roleId: string, @Param('user_id') userId: string) {
    return this.rolesService.addRole(+userId, +roleId);
  }
}
