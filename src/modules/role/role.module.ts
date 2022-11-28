import { Module } from '@nestjs/common';
import { RoleController } from '@role/http/role.controller';
import { RoleService } from '@role/services/role.service';
import { OrmModule } from '@src/lib/orm/orm.module';

@Module({
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
  imports: [OrmModule],
})
export class RoleModule {}
