import { Controller, Get, Param } from '@nestjs/common';

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
}
