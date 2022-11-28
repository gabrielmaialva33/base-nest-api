import {
  Body,
  Controller,
  Post,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from '@auth/services/auth.service';
import { UserService } from '@user/services/user.service';

import { StoreUserDto } from '@user/dto';
import { I18nValidationExceptionFilter } from '@common/filters';
import { LocalAuthGuard } from '@common/guards/local.auth.guard';

@UseFilters(new I18nValidationExceptionFilter())
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/sign_in')
  async signIn(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('/sign_up')
  async signUp(@Body() data: StoreUserDto) {
    return this.usersService.store(data);
  }
}
