import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { lastValueFrom } from 'rxjs';
import { DateTime } from 'luxon';

import { translate } from '@src/lib/i18n';
import { UsersService } from '@src/modules/users/services/users.service';
import { TokensService } from '@src/modules/tokens/services/tokens.service';

interface JwtPayload {
  token: string;
  id: number;
  uid: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(ConfigService)
    private readonly config: ConfigService,
    @Inject(UsersService)
    private readonly userService: UsersService,
    @Inject(TokensService)
    private readonly tokensService: TokensService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('jwt.secret', 'secret'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await lastValueFrom(this.userService.getByUid(payload.uid));
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

    // check token
    const isValid = await lastValueFrom(
      this.tokensService.validateOpaqueToken(user.id, payload.token),
    );
    if (!isValid)
      throw new UnauthorizedException({
        message: translate('exception.invalid_token'),
      });

    // check expiration
    if (payload.exp < DateTime.now().toSeconds())
      throw new UnauthorizedException({
        message: translate('exception.expired_token'),
      });

    return user;
  }
}
