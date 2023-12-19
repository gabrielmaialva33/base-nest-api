import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { map, switchMap } from 'rxjs';

import { translate } from '@src/lib/i18n';

import { TokensService } from '@src/modules/tokens/services/tokens.service';
import { UsersService } from '@src/modules/users/services/users.service';
import { SignInUserDto } from '@src/modules/sessions/dto/sign-in-user.dto';

import { Argon2Utils } from '@src/common/helpers/argon2.utils';
import { SignUpUserDto } from '@src/modules/sessions/dto/sign-up-user.dto';

@Injectable()
export class SessionsService {
  constructor(
    @Inject(TokensService)
    private readonly tokensService: TokensService,
    @Inject(UsersService)
    private readonly userService: UsersService,
  ) {}

  signIn({ uid, password }: SignInUserDto) {
    return this.userService.getByUid(uid).pipe(
      switchMap((user) => {
        if (!user || user.is_deleted)
          throw new NotFoundException({
            message: translate('exception.model_not_found', {
              args: { model: translate('model.user.label') },
            }),
          });

        if (!user.is_active)
          throw new ForbiddenException({
            message: translate('exception.model_not_active', {
              args: { model: translate('model.user.label') },
            }),
          });

        return Argon2Utils.verify$(user.password, password).pipe(
          switchMap(() => {
            const token = this.tokensService.generateRememberMeToken();
            user.$set({ remember_me_token: token });
            return this.userService.save(user).pipe(map(() => user));
          }),
          switchMap((match) => {
            if (!match)
              throw new UnauthorizedException({
                message: translate('exception.invalid_credentials'),
              });

            return this.tokensService
              .generateJwtToken({
                id: user.id,
                uid: uid,
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
      }),
    );
  }

  signUp(data: SignUpUserDto) {
    return this.userService.create(data).pipe(
      switchMap((user) => {
        const token = this.tokensService.generateRememberMeToken();
        user.$set({ remember_me_token: token });
        return this.userService.save(user).pipe(map(() => user));
      }),
      switchMap((user) => {
        return this.tokensService
          .generateJwtToken({
            id: user.id,
            uid: data.email,
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

  signOut(userId: number) {
    return this.userService.get(userId).pipe(
      switchMap((user) => {
        if (!user) throw new NotFoundException();
        return this.tokensService.destroyJwtToken(user.id);
      }),
    );
  }

  refreshToken(userId: number) {
    return this.userService.get(userId).pipe(
      switchMap((user) => {
        return this.tokensService
          .generateRefreshToken(user.remember_me_token, {
            id: user.id,
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
}
