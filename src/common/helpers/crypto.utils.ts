import { randomBytes } from 'node:crypto';
import { Base64Utils } from '@src/common/helpers/base64.utils';

/**
 * -------------------------------------------------------
 * CryptoUtils
 * -------------------------------------------------------
 * Utilities for cryptography
 */
export const CryptoUtils = {
  /**
   * Generate a random string
   * @param size
   */
  random: (size: number = 32): string => {
    const bits = (size + 1) * 6;
    const buffer = randomBytes(Math.ceil(bits / 8));
    return Base64Utils.urlEncode(buffer).slice(0, size);
  },
};
