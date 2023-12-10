import { Token } from '@src/modules/tokens/entities/token.entity';
import { KnexRepository } from '@src/common/module/knex.repository';
import { ITokenRepository } from '@src/modules/tokens/interfaces/token.interface';

export class TokenRepository
  extends KnexRepository<Token>
  implements ITokenRepository
{
  constructor() {
    super(Token);
  }
}
