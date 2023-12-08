import * as argon2 from 'argon2';

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
      const hash = await argon2.hash(password, { saltLength: 32 });
      return hash;
    } catch (err) {
      console.error('Error hashing password:', err);
      throw err;
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
    } catch (err) {
      console.error('Error verifying password:', err);
      throw err;
    }
  },
};
