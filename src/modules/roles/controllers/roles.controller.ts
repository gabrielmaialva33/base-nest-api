import { Controller, Get, Param, Patch, Query } from '@nestjs/common';

import { Auth } from '@src/common/decorators/auth.decorator';
import { Roles } from '@src/common/decorators/roles.decorator';

import { RolesService } from '@src/modules/roles/services/roles.service';
import { RoleType } from '@src/modules/roles/interfaces/roles.interface';
import { OrderByDirection } from 'objection';

@Auth()
@Roles(RoleType.ROOT, RoleType.ADMIN)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Roles(RoleType.ROOT, RoleType.ADMIN, RoleType.USER)
  @Get()
  list(
    @Query('sort') sort: string = 'id',
    @Query('order') order: OrderByDirection = 'asc',
    @Query('search') search: string = undefined,
  ) {
    return this.rolesService.list({ sort, order, search });
  }

  @Roles(RoleType.ROOT, RoleType.ADMIN, RoleType.USER)
  @Get(':id')
  get(@Param('id') id: string) {
    return this.rolesService.get(+id);
  }

  @Patch(':role_id/add-role/:user_id')
  addRole(@Param('role_id') roleId: string, @Param('user_id') userId: string) {
    return this.rolesService.addRole(+userId, +roleId);
  }
}
