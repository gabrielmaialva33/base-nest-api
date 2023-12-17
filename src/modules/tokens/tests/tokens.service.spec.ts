import { Test, TestingModule } from '@nestjs/testing';

import { TokensService } from '@src/modules/tokens/services/tokens.service';
import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';

describe('TokensService', () => {
  let service: TokensService;

  // services mock declaration
  const mockConfigService = createMock<ConfigService>();
  const mockJwtService = createMock<ConfigService>();

  // repositories mock declaration

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<TokensService>(TokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
