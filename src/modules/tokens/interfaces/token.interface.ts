import { IKnexRepository } from '@src/common/module/knex-repository.interface';
import { Token } from '@src/modules/tokens/entities/token.entity';

export const TOKEN_REPOSITORY = Symbol('TOKEN_REPOSITORY');

export interface ITokenRepository extends IKnexRepository<Token> {}
