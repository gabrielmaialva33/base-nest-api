/**
 * -------------------------------------------------------
 * Base64 Utils
 * -------------------------------------------------------
 * Utilities for encoding and decoding base64 strings.
 */
export const Base64Utils = {
  /**
   * Decode a base64 string to a string
   * @param data
   * @param encoding
   */
  encode(
    data: ArrayBuffer | SharedArrayBuffer | string,
    encoding?: BufferEncoding,
  ): string {
    if (typeof data === 'string') {
      return Buffer.from(data, encoding).toString('base64');
    }
    return Buffer.from(data).toString('base64');
  },

  /**
   * Decode a base64 string to a string
   * @param encoded
   * @param encoding
   * @param strict
   */
  decode(
    encoded: string | Buffer,
    encoding: BufferEncoding = 'utf-8',
    strict: boolean = false,
  ): string | null {
    if (Buffer.isBuffer(encoded)) {
      return encoded.toString(encoding);
    }

    const decoded = Buffer.from(encoded, 'base64').toString(encoding);
    const isInvalid = this.encode(decoded, encoding) !== encoded;

    if (strict && isInvalid) {
      throw new Error('Cannot decode malformed value');
    }

    return isInvalid ? null : decoded;
  },

  /**
   * Encode a string to a base64 string
   * @param data
   * @param encoding
   */
  urlEncode(
    data: ArrayBuffer | SharedArrayBuffer | string,
    encoding?: BufferEncoding,
  ): string {
    const encoded =
      typeof data === 'string'
        ? this.encode(data, encoding)
        : this.encode(data);
    return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
  },

  /**
   * Decode a base64 string to a string
   * @param encoded
   * @param encoding
   * @param strict
   */
  urlDecode(
    encoded: string | Buffer,
    encoding: BufferEncoding = 'utf-8',
    strict: boolean = false,
  ): string | null {
    if (Buffer.isBuffer(encoded)) {
      return encoded.toString(encoding);
    }

    const decoded = Buffer.from(encoded, 'base64').toString(encoding);
    const isInvalid = this.urlEncode(decoded, encoding) !== encoded;

    if (strict && isInvalid) {
      throw new Error('Cannot urlDecode malformed value');
    }

    return isInvalid ? null : decoded;
  },
};
