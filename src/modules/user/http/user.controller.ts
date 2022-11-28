import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';

import { EditUserDto, StoreUserDto } from '@user/dto';
import { UserService } from '@user/services/user.service';

import { I18nValidationExceptionFilter } from '@common/filters';
import { JwtAuthGuard } from '@common/guards/jwt.auth.guard';

@UseFilters(new I18nValidationExceptionFilter())
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  list(
    @Query('page') page?: number,
    @Query('per_page') per_page?: number,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('direction') direction?: string,
  ) {
    return this.userService.list({
      page,
      per_page,
      search,
      sort,
      direction,
    });
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.userService.get(id);
  }

  @Post()
  create(@Body() data: StoreUserDto) {
    return this.userService.store(data);
  }

  @Put(':id')
  edit(@Param('id') id: string, @Body() data: EditUserDto) {
    return this.userService.save(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
