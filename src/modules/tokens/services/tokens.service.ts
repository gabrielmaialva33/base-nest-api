import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
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
import { Argon2Utils } from '@src/common/helpers/argon2.utils';

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
    @Inject(TokenGeneratorService)
    private readonly tokenGenerator: TokenGeneratorService,
    @Inject(TOKEN_REPOSITORY)
    private readonly tokenRepository: ITokenRepository,
  ) {}

  private tokenLength = 60;
  private tokenType: TokenType = TokenType.ACCESS;
  private expiresIn =
    this.configService.get<string>('jwt.access_expiry') || '15m';
  private refreshExpiresIn =
    this.configService.get<string>('jwt.refresh_expiry') || '7d';

  generateJwtToken(payload: JwtPayload) {
    return this.tokenGenerator.generateHashToken(this.tokenLength).pipe(
      map((token) => this.buildTokenObject(token, payload)),
      switchMap((tokenData) => this.saveToken(tokenData)),
      map((rawToken) => this.createJwt(rawToken, payload)),
      // catchError((error) => {
      //   Logger.error(error.message, 'TokenService');
      //   throw new InternalServerErrorException({
      //     message: 'Not able to login',
      //   });
      // }),
    );
  }

  generateRefreshToken(rawToken: string, payload: JwtPayload) {
    return this.tokenGenerator
      .hashToken(rawToken)
      .pipe()
      .pipe(
        map((token) =>
          this.buildTokenObject(
            { rawToken, hashToken: token },
            payload,
            TokenType.REFRESH,
          ),
        ),
        switchMap((tokenData) => this.saveToken(tokenData)),
        map((rawToken) => this.createJwt(rawToken, payload, TokenType.REFRESH)),
        catchError((error) => {
          Logger.error(error.message, 'TokenService');
          throw new InternalServerErrorException({
            message: 'Not able to login',
          });
        }),
      );
  }

  generateRememberMeToken() {
    return this.tokenGenerator.generateToken(this.tokenLength);
  }

  destroyJwtToken(userId: number) {
    return this.destroyToken(userId);
  }

  validateOpaqueToken(userId: number, rawToken: string) {
    return this.tokenRepository.firstClause({ user_id: userId }).pipe(
      mergeMap((token) => {
        if (!token) return of(false);
        return Argon2Utils.verify$(token.token, rawToken);
      }),
    );
  }

  private buildTokenObject(
    token: GenerateToken,
    payload: JwtPayload,
    type: TokenType = TokenType.ACCESS,
  ): TokenData {
    console.log({ token, payload, type }, 'buildTokenObject');
    console.log(this.expiresIn, 'this.expiresIn');
    const expiresAt =
      type === TokenType.ACCESS
        ? this.getExpiresAtDate(this.expiresIn)
        : this.getExpiresAtDate(this.refreshExpiresIn);

    console.log(expiresAt, 'expiresAt');

    console.log(
      {
        name: 'Opaque Access Token | Authentication',
        type,
        token: token.hashToken,
        rawToken: token.rawToken,
        userId: payload.id,
        expiresAt,
      },
      'buildTokenObject',
    );
    return {
      name: 'Opaque Access Token | Authentication',
      type,
      token: token.hashToken,
      rawToken: token.rawToken,
      userId: payload.id,
      expiresAt,
    };
  }

  private saveToken(tokenData: TokenData) {
    console.log(tokenData, 'tokenData');
    const payload = {
      name: tokenData.name || 'Opaque Access Token | Authentication',
      type: tokenData.type || this.tokenType,
      token: tokenData.token,
      expires_at: tokenData.expiresAt.toISO(),
      user_id: tokenData.userId,
    };

    // delete existing tokens for user
    return this.destroyToken(tokenData.userId).pipe(
      switchMap(() =>
        // create new token
        this.tokenRepository
          .create(payload)
          .pipe(map(() => tokenData.rawToken)),
      ),
    );
  }

  private destroyToken(userId: number) {
    return this.tokenRepository.firstClause({ user_id: userId }).pipe(
      mergeMap((token) => {
        if (!token) return of(0);
        return this.tokenRepository.destroy(token);
      }),
    );
  }

  private createJwt(
    rawToken: string,
    payload: JwtPayload,
    type: TokenType = TokenType.ACCESS,
  ) {
    const expiresIn =
      type === TokenType.ACCESS ? this.expiresIn : this.refreshExpiresIn;
    return this.jwtService.sign({ token: rawToken, ...payload }, { expiresIn });
  }

  private getExpiresAtDate(expiresIn?: string | number): DateTime | undefined {
    if (!expiresIn) return;
    const milliseconds =
      typeof expiresIn === 'string' ? ms(expiresIn) : expiresIn;
    console.log(milliseconds, 'milliseconds');
    return DateTime.local().plus({ milliseconds });
  }
}

export interface JwtPayload {
  id: number;
  uid?: string;
  roles?: string[];
  rawToken?: string;
}

export interface TokenData {
  name?: string;
  type?: string;
  token: string;
  rawToken: string;
  userId: number;
  expiresAt: DateTime;
}

export enum TokenType {
  ACCESS = 'access_token',
  REFRESH = 'refresh_token',
}
