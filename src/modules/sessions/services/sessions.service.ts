import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { map, switchMap } from 'rxjs';

import { TokensService } from '@src/modules/tokens/services/tokens.service';
import { UsersService } from '@src/modules/users/services/users.service';
import { SignInUserDto } from '@src/modules/sessions/dto/sign-in-user.dto';

@Injectable()
export class SessionsService {
  constructor(
    @Inject(TokensService)
    private readonly tokensService: TokensService,
    @Inject(UsersService)
    private readonly userService: UsersService,
  ) {}

  signIn(body: SignInUserDto) {
    return this.userService.getByUid(body.uid).pipe(
      switchMap((user) => {
        if (!user) throw new NotFoundException('User not found');

        return this.tokensService
          .generateJwtToken({
            id: user.id,
            uid: body.uid,
          })
          .pipe(
            map((token) => {
              return {
                user,
                token,
              };
            }),
          );
      }),
    );
  }

  signOut() {
    //todo: implement sign out
    return {
      message: 'Sign out successful',
    };
  }
}
