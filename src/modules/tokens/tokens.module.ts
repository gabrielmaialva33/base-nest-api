import { Module } from '@nestjs/common';

import { TokensController } from '@src/modules/tokens/controllers/tokens.controller';
import { TokensService } from '@src/modules/tokens/services/tokens.service';
import { TokenGeneratorService } from '@src/modules/tokens/services/token-generator.service';
import { TOKEN_REPOSITORY } from '@src/modules/tokens/interfaces/token.interface';
import { TokenRepository } from '@src/modules/tokens/repositories/token.repository';

@Module({
  controllers: [TokensController],
  providers: [
    TokensService,
    TokenGeneratorService,
    {
      provide: TOKEN_REPOSITORY,
      useClass: TokenRepository,
    },
  ],
  exports: [TokensService, TokenGeneratorService],
})
export class TokensModule {}
