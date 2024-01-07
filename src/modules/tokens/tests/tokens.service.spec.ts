import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { of } from 'rxjs';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  JwtPayload,
  TokensService,
  TokenType,
} from '@src/modules/tokens/services/tokens.service';
import { TokensGeneratorService } from '@src/modules/tokens/services/tokens-generator.service';
import {
  ITokenRepository,
  TOKEN_REPOSITORY,
} from '@src/modules/tokens/interfaces/token.interface';

import { userFactory } from '@src/database/factories';
import { tokenFactory } from '@src/database/factories/token.factory';
import { Argon2Utils } from '@src/common/helpers/argon2.utils';

describe('TokensService', () => {
  let service: TokensService;

  let mockTokenGeneratorService: jest.Mocked<TokensGeneratorService>;
  let mockTokenRepository: jest.Mocked<ITokenRepository>;
  let mockJwtService: jest.Mocked<JwtService>;

  const mockUser = userFactory.makeStub();

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
          provide: TokensGeneratorService,
          useValue: createMock<TokensGeneratorService>(),
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
    mockTokenGeneratorService = module.get(TokensGeneratorService);
    mockJwtService = module.get(JwtService);
    mockTokenRepository = module.get(TOKEN_REPOSITORY);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateJwtToken', () => {
    const mockToken = tokenFactory.makeStub({
      user_id: mockUser.id,
      type: TokenType.ACCESS,
    });

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

  describe('generateRefreshToken', () => {
    const mockToken = tokenFactory.makeStub({
      user_id: mockUser.id,
      type: TokenType.REFRESH,
    });

    it('should generate a refresh token', (done) => {
      mockTokenGeneratorService.hashToken.mockReturnValue(of('refreshToken'));
      mockTokenRepository.create.mockReturnValue(of(mockToken));
      mockTokenRepository.firstClause.mockReturnValue(of(mockToken));
      mockTokenRepository.destroy.mockReturnValue(of(1));
      mockJwtService.sign.mockReturnValue('refreshToken');

      const jwtPayload: JwtPayload = {
        id: mockUser.id,
        uid: mockUser.username,
      };

      service
        .generateRefreshToken('refreshToken', jwtPayload)
        .subscribe((token) => {
          expect(mockTokenGeneratorService.hashToken).toHaveBeenCalled();
          expect(mockTokenGeneratorService.hashToken).toHaveBeenCalledTimes(1);

          expect(mockTokenRepository.create).toHaveBeenCalled();
          expect(mockTokenRepository.create).toHaveBeenCalledTimes(1);

          expect(mockTokenRepository.firstClause).toHaveBeenCalled();
          expect(mockTokenRepository.firstClause).toHaveBeenCalledTimes(1);

          expect(mockTokenRepository.destroy).toHaveBeenCalled();
          expect(mockTokenRepository.destroy).toHaveBeenCalledTimes(1);

          expect(token).toEqual('refreshToken');

          done();
        });
    });
  });

  describe('generateRememberMeToken', () => {
    it('should generate a remember me token', (done) => {
      mockTokenGeneratorService.generateToken.mockReturnValue('token');

      const result = service.generateRememberMeToken();

      expect(mockTokenGeneratorService.generateToken).toHaveBeenCalled();
      expect(mockTokenGeneratorService.generateToken).toHaveBeenCalledTimes(1);

      expect(result).toEqual('token');

      done();
    });
  });

  describe('destroyJwtToken', () => {
    const mockToken = tokenFactory.makeStub({ user_id: mockUser.id });

    it('should destroy a JWT token', (done) => {
      mockTokenRepository.firstClause.mockReturnValue(of(mockToken));
      mockTokenRepository.destroy.mockReturnValue(of(1));

      service.destroyJwtToken(mockUser.id).subscribe((result) => {
        expect(mockTokenRepository.firstClause).toHaveBeenCalled();
        expect(mockTokenRepository.firstClause).toHaveBeenCalledTimes(1);

        expect(mockTokenRepository.destroy).toHaveBeenCalled();
        expect(mockTokenRepository.destroy).toHaveBeenCalledTimes(1);

        expect(result).toEqual(1);

        done();
      });
    });
  });

  describe('validateOpaqueToken', () => {
    it('should validate an opaque token', (done) => {
      Argon2Utils.hash$('rawToken').subscribe((hashToken) => {
        const mockToken = tokenFactory.makeStub({
          token: hashToken,
          user_id: mockUser.id,
        });
        mockTokenRepository.firstClause.mockReturnValue(of(mockToken));

        service
          .validateOpaqueToken(mockUser.id, 'rawToken')
          .subscribe((result) => {
            expect(mockTokenRepository.firstClause).toHaveBeenCalled();
            expect(mockTokenRepository.firstClause).toHaveBeenCalledTimes(1);

            expect(result).toEqual(true);

            done();
          });
      });
    });
  });
});
