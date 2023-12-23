import { Module } from '@nestjs/common';
import { RolesController } from '@src/modules/roles/controllers/roles.controller';
import { RolesService } from '@src/modules/roles/services/roles.service';

import { ROLE_REPOSITORY } from '@src/modules/roles/interfaces/roles.interface';
import { RoleRepository } from '@src/modules/roles/repositories/role.repository';

@Module({
  controllers: [RolesController],
  providers: [
    RolesService,
    {
      provide: ROLE_REPOSITORY,
      useClass: RoleRepository,
    },
  ],
  exports: [RolesService, ROLE_REPOSITORY],
})
export class RolesModule {}
