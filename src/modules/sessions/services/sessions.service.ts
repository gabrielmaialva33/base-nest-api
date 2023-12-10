import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { switchMap } from 'rxjs';

import { TokensService } from '@src/modules/tokens/services/tokens.service';
import { UsersService } from '@src/modules/users/services/users.service';

@Injectable()
export class SessionsService {
  constructor(
    @Inject(TokensService)
    private readonly tokensService: TokensService,
    @Inject(UsersService)
    private readonly userService: UsersService,
  ) {}

  signIn(body: any) {
    return this.userService.getBy('email', body.uid).pipe(
      switchMap((user) => {
        if (!user) throw new NotFoundException('User not found');

        return this.tokensService.generateJwtToken({
          id: user.id,
          uid: body.uid,
        });
      }),
    );
  }
}
