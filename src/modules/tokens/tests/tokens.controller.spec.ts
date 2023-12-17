import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';

import { TokensController } from '@src/modules/tokens/controllers/tokens.controller';
import { TokensService } from '@src/modules/tokens/services/tokens.service';
import { ConfigService } from '@nestjs/config';

describe('TokensController', () => {
  let controller: TokensController;

  // services mock declaration
  const mockConfigService = createMock<ConfigService>();
  const mockJwtService = createMock<ConfigService>();

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokensController],
      providers: [
        TokensService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: TokensService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<TokensController>(TokensController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
