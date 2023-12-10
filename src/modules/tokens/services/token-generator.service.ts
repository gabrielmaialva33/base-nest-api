import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';

import { CryptoUtils } from '@src/common/helpers/crypto.utils';
import { Argon2Utils } from '@src/common/helpers/argon2.utils';

/**
 * -------------------------------------------------------
 * Token Generator Service - Handles token generation
 * -------------------------------------------------------
 * @class TokenGeneratorService
 * @property {number} tokenLength - Length of the raw token. The hash length will vary
 * @method generateToken - Generate a token and hash
 * @method generateHash - Converts value to an argon2 hash
 * -------------------------------------------------------
 */
@Injectable()
export class TokenGeneratorService {
  /**
   * Generate a token and its corresponding hash.
   * @param tokenLength Length of the token to be generated.
   * @returns An Observable containing the token and its hash.
   */
  generateToken(tokenLength: number): Observable<GenerateToken> {
    const rawToken = CryptoUtils.random(tokenLength);
    return this.generateHash(rawToken).pipe(
      map((hash) => ({ rawToken, hashToken: hash })),
    );
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
