import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';

import { CryptoUtils } from '@src/common/helpers/crypto.utils';
import { Argon2Utils } from '@src/common/helpers/argon2.utils';

/**
 * -------------------------------------------------------
 * Token Generator Service - Handles token generation
 * -------------------------------------------------------
 * @class TokensGeneratorService
 * @property {number} tokenLength - Length of the raw token. The hash length will vary
 * @method generateHashToken - Generate a token and hash
 * @method generateHash - Converts value to an argon2 hash
 * -------------------------------------------------------
 */
@Injectable()
export class TokensGeneratorService {
  /**
   * Generate a token and its corresponding hash.
   * @param tokenLength Length of the token to be generated.
   * @returns An Observable containing the token and its hash.
   */
  generateHashToken(tokenLength: number): Observable<GenerateToken> {
    const rawToken = CryptoUtils.random(tokenLength);
    return this.generateHash(rawToken).pipe(
      map((hash) => ({ rawToken, hashToken: hash })),
    );
  }

  hashToken(rawToken: string): Observable<string> {
    return this.generateHash(rawToken);
  }

  generateToken(tokenLength: number) {
    return CryptoUtils.random(tokenLength);
  }

  /**
   * Convert a value to an argon2 hash.
   * @param value An Observable containing the hash.
   * @returns An Observable containing the hash.
   */
  private generateHash(value: string): Observable<string> {
    return Argon2Utils.hash$(value);
  }
}

export interface GenerateToken {
  rawToken: string;
  hashToken: string;
}
