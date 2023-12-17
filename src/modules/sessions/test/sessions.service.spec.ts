import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';

import { SessionsService } from '@src/modules/sessions/services/sessions.service';
import { TokensService } from '@src/modules/tokens/services/tokens.service';
import { UsersService } from '@src/modules/users/services/users.service';

describe('SessionsService', () => {
  let service: SessionsService;

  // services mock declaration
  const mockTokensService = createMock<TokensService>();
  const mockUsersService = createMock<UsersService>();

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: TokensService,
          useValue: mockTokensService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
