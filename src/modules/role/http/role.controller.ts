import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from '@role/services/role.service';
import { EditRoleDto, StoreRoleDto } from '@role/dto';
import { JwtAuthGuard } from '@common/guards/jwt.auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  list(
    @Query('page') page?: number,
    @Query('per_page') per_page?: number,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('direction') direction?: string,
  ) {
    return this.roleService.list({
      page,
      per_page,
      search,
      sort,
      direction,
    });
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.roleService.get(id);
  }

  @Post()
  store(@Body() data: StoreRoleDto) {
    return this.roleService.store(data);
  }

  @Put(':id')
  edit(@Param('id') id: string, @Body() data: EditRoleDto) {
    return this.roleService.save(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.roleService.delete(id);
  }
}
