import { Controller } from '@nestjs/common';
import { TokensService } from '@src/modules/tokens/services/tokens.service';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}
}
