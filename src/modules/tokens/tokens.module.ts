import { Module } from '@nestjs/common';

import { TokensService } from '@src/modules/tokens/services/tokens.service';
import { TokensGeneratorService } from '@src/modules/tokens/services/tokens-generator.service';
import { TOKEN_REPOSITORY } from '@src/modules/tokens/interfaces/token.interface';
import { TokenRepository } from '@src/modules/tokens/repositories/token.repository';

@Module({
  providers: [
    TokensService,
    TokensGeneratorService,
    {
      provide: TOKEN_REPOSITORY,
      useClass: TokenRepository,
    },
  ],
  exports: [TokensService, TokensGeneratorService],
})
export class TokensModule {}
