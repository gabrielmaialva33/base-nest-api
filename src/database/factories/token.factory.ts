import { BaseFactory } from '@src/common/module/base.factory';
import { Token } from '@src/modules/tokens/entities/token.entity';
import { faker } from '@faker-js/faker';
import { RoleType } from '@src/modules/roles/interfaces/roles.interface';
import { CryptoUtils } from '@src/common/helpers/crypto.utils';
import { TokenType } from '@src/modules/tokens/services/tokens.service';

export class TokenFactory extends BaseFactory<Token> {
  constructor() {
    super(Token);
  }

  make(data?: Partial<Token>): Partial<Token> {
    return {
      token: CryptoUtils.random(60),
      type: TokenType.ACCESS,
      ...data,
    };
  }

  makeStub(data?: Partial<Token>): Token {
    const token = new Token();
    const tokenData = this.make(data);

    token.$setDatabaseJson({
      id: faker.number.int(),
      ...tokenData,
    });

    return token;
  }
}

export const tokenFactory = new TokenFactory();
