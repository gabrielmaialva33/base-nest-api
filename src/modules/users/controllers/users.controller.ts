import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { OrderByDirection } from 'objection';
import { CreateUserDto } from '@src/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@src/modules/users/dto/update-user.dto';
import { UsersService } from '@src/modules/users/services/users.service';

import { Auth } from '@src/common/decorators/auth.decorator';

@Auth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/all')
  list(
    @Query('sort') sort: string = 'id',
    @Query('order') order: OrderByDirection = 'asc',
    @Query('search') search: string = undefined,
  ) {
    return this.usersService.list({ sort, order, search });
  }

  @Get()
  paginate(
    @Query('page') page: number = 1,
    @Query('per_page') per_page: number = 10,
    @Query('sort') sort: string = 'id',
    @Query('order') order: OrderByDirection = 'asc',
    @Query('search') search: string = undefined,
  ) {
    return this.usersService.paginate({ page, per_page, sort, order, search });
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.usersService.get(+id);
  }

  @Post()
  create(@Body() data: CreateUserDto) {
    return this.usersService.create(data);
  }

  @Put(':id')
  edit(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.usersService.edit(+id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(+id);
  }
}
