import { Test, TestingModule } from '@nestjs/testing';

import { TokensController } from '@src/modules/tokens/controllers/tokens.controller';
import { TokensService } from '@src/modules/tokens/services/tokens.service';

describe('TokensController', () => {
  let controller: TokensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokensController],
      providers: [TokensService],
    }).compile();

    controller = module.get<TokensController>(TokensController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
