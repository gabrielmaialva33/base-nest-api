import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SessionsService } from '@src/modules/sessions/services/sessions.service';
import { LocalAuthGuard } from '@src/common/guards/local.auth.guard';
import { SignInUserDto } from '@src/modules/sessions/dto/sign-in-user.dto';
import { SignUpUserDto } from '@src/modules/sessions/dto/sign-up-user.dto';
import { Auth } from '@src/common/decorators/auth.decorator';
import { User } from '@src/modules/users/entities/user.entity';
import { RequestContext } from '@src/lib/context/request';

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
  signOut() {
    const user: User = RequestContext.get().currentUser;
    if (!user) return;

    return this.sessionsService.signOut(user.id);
  }

  @Auth()
  @Patch('/refresh_token')
  refreshToken() {
    const user: User = RequestContext.get().currentUser;
    if (!user) return;

    return this.sessionsService.refreshToken(user.id);
  }
}
