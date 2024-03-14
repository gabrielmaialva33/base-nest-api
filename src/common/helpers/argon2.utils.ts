import * as argon2 from 'argon2';
import { from, map, Observable } from 'rxjs';
import { Logger } from '@nestjs/common';

const logger = new Logger();

/**
 * -------------------------------------------------------
 * Argon2 Utils
 * -------------------------------------------------------
 * Utilities for hashing and verifying passwords using Argon2.
 */
export const Argon2Utils = {
  /**
   * Hash a password
   *
   * @param {string} password - The password to be hashed.
   * @returns {Promise<string>} A promise that resolves to the hash of the password.
   *
   * @example
   * // How to use hashPassword
   * const password = 'myPassword123';
   * const hash = await Argon2Utils.hashPassword(password);
   * console.log(hash); // Outputs the generated hash
   */
  hashPassword: async (password: string): Promise<string> => {
    try {
      const hash = await argon2.hash(password, { hashLength: 32 });
      return hash;
    } catch (error) {
      logger.error(
        `Error hashing password: ${error.message}`,
        error.stack,
        'Argon2:Utils',
      );
      throw error;
    }
  },

  /**
   * Verify a password
   *
   * @param {string} password - The password to be verified.
   * @param {string} hash - The hash against which the password will be verified.
   * @returns {Promise<boolean>} A promise that resolves to true if the password and hash match, otherwise false.
   *
   * @example
   * // How to use verifyPassword
   * const password = 'myPassword123';
   * const hash = 'previously_generated_hash';
   * const isMatch = await Argon2Utils.verifyPassword(password, hash);
   * console.log(isMatch); // true if the password matches the hash, false otherwise
   */
  verifyPassword: async (password: string, hash: string): Promise<boolean> => {
    try {
      const match = await argon2.verify(hash, password);
      return match;
    } catch (error) {
      logger.error(
        `Error verifying password: ${error.message}`,
        error.stack,
        'Argon2:Utils',
      );
      throw error;
    }
  },

  /**
   * Hash a string
   * @param str
   */
  hash: async (str: string): Promise<string> => {
    try {
      const hash = await argon2.hash(str);
      return hash;
    } catch (error) {
      logger.error(
        `Error hashing password: ${error.message}`,
        error.stack,
        'Argon2:Utils',
      );
      throw error;
    }
  },

  /**
   * Verify a string
   * @param hash
   * @param str
   */
  verify: async (hash: string, str: string): Promise<boolean> => {
    try {
      const match = await argon2.verify(hash, str);
      return match;
    } catch (error) {
      logger.error(
        `Error verifying password: ${error.message}`,
        error.stack,
        'Argon2:Utils',
      );
      throw error;
    }
  },

  /**
   * Hash a string (Observable)
   * @param str
   */
  hash$: (str: string): Observable<string> => {
    return from(Argon2Utils.hash(str)).pipe(map((hash) => hash));
  },
  /**
   * Verify a string (Observable)
   * @param hash
   * @param str
   */
  verify$: (hash: string, str: string): Observable<boolean> =>
    from(Argon2Utils.verify(hash, str)).pipe(map((match) => match)),
};
