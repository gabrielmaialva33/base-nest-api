import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { createMock } from '@golevelup/ts-jest';
import { of } from 'rxjs';

import { JwtService } from '@nestjs/jwt';
import {
  JwtPayload,
  TokensService,
} from '@src/modules/tokens/services/tokens.service';
import { TokenGeneratorService } from '@src/modules/tokens/services/token-generator.service';
import {
  ITokenRepository,
  TOKEN_REPOSITORY,
} from '@src/modules/tokens/interfaces/token.interface';

import { userFactory } from '@src/database/factories';
import { tokenFactory } from '@src/database/factories/token.factory';

describe('TokensService', () => {
  let service: TokensService;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockTokenGeneratorService: jest.Mocked<TokenGeneratorService>;
  let mockTokenRepository: jest.Mocked<ITokenRepository>;
  let mockJwtService: jest.Mocked<JwtService>;

  const mockUser = userFactory.makeStub();
  const mockToken = tokenFactory.makeStub({ user_id: mockUser.id });

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokensService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) =>
              key === 'jwt.access_expiry' ? '15m' : '7d',
            ),
          },
        },
        {
          provide: TokenGeneratorService,
          useValue: createMock<TokenGeneratorService>(),
        },
        {
          provide: JwtService,
          useValue: createMock<JwtService>(),
        },
        {
          provide: TOKEN_REPOSITORY,
          useValue: createMock<ITokenRepository>(),
        },
      ],
    }).compile();

    service = module.get<TokensService>(TokensService);
    mockConfigService = module.get(ConfigService);
    mockTokenGeneratorService = module.get(TokenGeneratorService);
    mockTokenRepository = module.get(TOKEN_REPOSITORY);
    mockJwtService = module.get(JwtService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateJwtToken', () => {
    it('should generate a JWT token', (done) => {
      mockTokenGeneratorService.generateHashToken.mockReturnValue(
        of({ rawToken: mockToken.token, hashToken: 'hashToken' }),
      );

      mockTokenRepository.create.mockReturnValue(of(mockToken));
      mockTokenRepository.firstClause.mockReturnValue(of(mockToken));
      mockTokenRepository.destroy.mockReturnValue(of(1));

      mockJwtService.sign.mockReturnValue('token');

      const jwtPayload: JwtPayload = {
        id: mockUser.id,
        uid: mockUser.username,
      };

      service.generateJwtToken(jwtPayload).subscribe((token) => {
        expect(mockTokenGeneratorService.generateHashToken).toHaveBeenCalled();
        expect(
          mockTokenGeneratorService.generateHashToken,
        ).toHaveBeenCalledTimes(1);
        expect(
          mockTokenGeneratorService.generateHashToken,
        ).toHaveBeenCalledWith(60);

        expect(mockTokenRepository.create).toHaveBeenCalled();
        expect(mockTokenRepository.create).toHaveBeenCalledTimes(1);

        expect(mockTokenRepository.firstClause).toHaveBeenCalled();
        expect(mockTokenRepository.firstClause).toHaveBeenCalledTimes(1);

        expect(mockTokenRepository.destroy).toHaveBeenCalled();
        expect(mockTokenRepository.destroy).toHaveBeenCalledTimes(1);

        expect(mockJwtService.sign).toHaveBeenCalled();
        expect(mockJwtService.sign).toHaveBeenCalledTimes(1);

        expect(token).toEqual('token');
        done();
      });
    });
  });
});
