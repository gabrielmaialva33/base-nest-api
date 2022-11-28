import * as argon2 from 'argon2';

export const Argon2Utils = {
  hash: async (password: string): Promise<string> => {
    return await argon2.hash(password, { saltLength: 32 });
  },

  verify: async (hash: string, password: string): Promise<boolean> => {
    return await argon2.verify(hash, password);
  },
};
