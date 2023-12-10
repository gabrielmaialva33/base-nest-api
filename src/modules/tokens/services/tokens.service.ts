import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { catchError, map, switchMap } from 'rxjs';
import { DateTime } from 'luxon';
import * as ms from 'ms';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import {
  ITokenRepository,
  TOKEN_REPOSITORY,
} from '@src/modules/tokens/interfaces/token.interface';

import {
  GenerateToken,
  TokenGeneratorService,
} from '@src/modules/tokens/services/token-generator.service';

/**
 * -------------------------------------------------------
 * Token Service - Handles token generation
 * -------------------------------------------------------
 * @class TokenService
 * @property {number} tokenLength - Length of the raw token. The hash length will vary
 * @property {string} tokenType - Type of token to be generated
 * @property {string} expiresIn - Time until token expires
 * @method generateJwtToken - Generate a JWT token
 * @method buildTokenObject - Build a token object
 * @method saveToken - Save a token to the database
 * @method createJwt - Create a JWT token
 * @method getExpiresAtDate - Get the date the token expires
 * -------------------------------------------------------
 */
@Injectable()
export class TokensService {
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
    @Inject(TOKEN_REPOSITORY)
    private readonly tokenRepository: ITokenRepository,
    private readonly tokenGenerator: TokenGeneratorService,
  ) {}

  private tokenLength = 60;
  private tokenType = 'opaque_token';
  private expiresIn =
    this.configService.get<string>('jwt.access_expiry') || '15m';

  generateJwtToken(payload: JwtPayload) {
    return this.tokenGenerator.generateToken(this.tokenLength).pipe(
      map((token) => this.buildTokenObject(token, payload)),
      switchMap((tokenInfo) => this.saveToken(tokenInfo)),
      map((rawToken) => this.createJwt(rawToken, payload)),
      catchError((error) => {
        Logger.error(error.message, 'TokenService');
        throw new InternalServerErrorException({
          message: 'Not able to login',
        });
      }),
    );
  }

  private buildTokenObject(
    token: GenerateToken,
    payload: JwtPayload,
  ): TokenInfo {
    const expiresAt = this.getExpiresAtDate(this.expiresIn);
    return {
      name: 'Access Token | Authentication',
      type: this.tokenType,
      token: token.hashToken,
      rawToken: token.rawToken,
      userId: payload.id,
      expiresAt,
    };
  }

  private saveToken(tokenInfo: TokenInfo) {
    const tokenData = {
      name: tokenInfo.name || 'Opaque Access Token | Authentication',
      type: this.tokenType,
      token: tokenInfo.token,
      expires_at: tokenInfo.expiresAt.toISO(),
      user_id: tokenInfo.userId,
    };

    // delete existing tokens for user
    return this.destroyToken(tokenInfo.userId).pipe(
      switchMap(() =>
        // create new token
        this.tokenRepository
          .create(tokenData)
          .pipe(map(() => tokenInfo.rawToken)),
      ),
    );
  }

  private destroyToken(userId: number) {
    return this.tokenRepository.get({ user_id: userId }).pipe(
      map((token) => {
        if (!token) return;
        return this.tokenRepository.destroy(token);
      }),
    );
  }

  private createJwt(rawToken: string, payload: JwtPayload): string {
    return this.jwtService.sign(
      { token: rawToken, ...payload },
      { expiresIn: this.expiresIn },
    );
  }

  private getExpiresAtDate(expiresIn?: string | number): DateTime | undefined {
    if (!expiresIn) return;
    const milliseconds =
      typeof expiresIn === 'string' ? ms(expiresIn) : expiresIn;
    return DateTime.local().plus({ milliseconds });
  }
}

interface JwtPayload {
  id: number;
  uid?: string;
}

interface TokenInfo {
  name?: string;
  type?: string;
  token: string;
  rawToken: string;
  userId: number;
  expiresAt: DateTime;
}
