import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SessionsService } from '@src/modules/sessions/services/sessions.service';
import { LocalAuthGuard } from '@src/common/guards/local.auth.guard';
import { SignInUserDto } from '@src/modules/sessions/dto/sign-in-user.dto';
import { SignUpUserDto } from '@src/modules/sessions/dto/sign-up-user.dto';
import { Auth } from '@src/common/decorators/auth.decorator';

@Controller()
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/sign_in')
  signIn(@Body() body: SignInUserDto) {
    return this.sessionsService.signIn(body);
  }

  @Post('/sign_up')
  signUp(@Body() body: SignUpUserDto) {
    return this.sessionsService.signUp(body);
  }

  @Auth()
  @Delete('/sign_out')
  signOut(@Req() req: NestifyRequest) {
    if (!req.user)
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );

    return this.sessionsService.signOut(req.user.id);
  }

  @Auth()
  @Patch('/refresh_token')
  refreshToken(@Req() req: NestifyRequest) {
    if (!req.user)
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );

    return this.sessionsService.refreshToken(req.user.id);
  }
}
