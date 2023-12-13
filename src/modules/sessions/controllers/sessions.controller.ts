import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SessionsService } from '@src/modules/sessions/services/sessions.service';
import { LocalAuthGuard } from '@src/common/guards/local.auth.guard';
import { SignInUserDto } from '@src/modules/sessions/dto/sign-in-user.dto';
import { SignUpUserDto } from '@src/modules/sessions/dto/sign-up-user.dto';

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

  @Post('/sign_out')
  signOut() {
    return this.sessionsService.signOut();
  }
}
