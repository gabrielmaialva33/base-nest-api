import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import * as crypto from 'crypto';
import { of } from 'rxjs';
import { pick } from 'helper-fns';

import { SessionsService } from '@src/modules/sessions/services/sessions.service';
import { TokensService } from '@src/modules/tokens/services/tokens.service';
import { UsersService } from '@src/modules/users/services/users.service';

import { userFactory } from '@src/database/factories';
import { Argon2Utils } from '@src/common/helpers/argon2.utils';

describe('SessionsService', () => {
  let service: SessionsService;
  let mockTokensService: jest.Mocked<TokensService>;
  let mockUsersService: jest.Mocked<UsersService>;

  const mockUser = userFactory.makeStub({ is_deleted: false, is_active: true });

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: TokensService,
          useValue: createMock<TokensService>(),
        },
        {
          provide: UsersService,
          useValue: createMock<UsersService>(),
        },
      ],
    }).compile();

    const hash = await Argon2Utils.hash('password');
    mockUser.$set({ password: hash });

    service = module.get<SessionsService>(SessionsService);
    mockTokensService = module.get(TokensService);
    mockUsersService = module.get(UsersService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should sign in a user', (done) => {
      mockUsersService.getByUid.mockReturnValue(of(mockUser));
      mockUsersService.save.mockReturnValue(of(mockUser));
      mockTokensService.generateJwtToken.mockReturnValue(
        of(crypto.randomBytes(32).toString('hex')),
      );

      service
        .signIn({
          uid: mockUser.email,
          password: 'password',
        })
        .subscribe((result) => {
          expect(mockUsersService.getByUid).toHaveBeenCalled();
          expect(mockUsersService.getByUid).toHaveBeenCalledTimes(1);
          expect(mockUsersService.save).toHaveBeenCalled();
          expect(mockUsersService.save).toHaveBeenCalledTimes(1);
          expect(mockTokensService.generateJwtToken).toHaveBeenCalled();
          expect(mockTokensService.generateJwtToken).toHaveBeenCalledTimes(1);
          expect(result.user).toEqual(mockUser);

          for (const key in result.user)
            expect(result.user[key]).toEqual(mockUser[key]);

          done();
        });
    });
  });

  describe('signUp', () => {
    const data = pick(mockUser, [
      'first_name',
      'last_name',
      'email',
      'username',
      'avatar_url',
      'password',
    ]);

    it('should sign up a user', (done) => {
      mockUsersService.create.mockReturnValue(of(mockUser));
      mockUsersService.save.mockReturnValue(of(mockUser));
      mockTokensService.generateJwtToken.mockReturnValue(
        of(crypto.randomBytes(32).toString('hex')),
      );

      service.signUp(data).subscribe((result) => {
        expect(mockUsersService.create).toHaveBeenCalled();
        expect(mockUsersService.create).toHaveBeenCalledTimes(1);
        expect(mockUsersService.save).toHaveBeenCalled();
        expect(mockUsersService.save).toHaveBeenCalledTimes(1);
        expect(mockTokensService.generateJwtToken).toHaveBeenCalled();
        expect(mockTokensService.generateJwtToken).toHaveBeenCalledTimes(1);
        expect(result.user).toEqual(mockUser);

        for (const key in result.user)
          expect(result.user[key]).toEqual(mockUser[key]);

        done();
      });
    });
  });

  describe('signOut', () => {
    it('should sign out a user', (done) => {
      mockTokensService.destroyJwtToken.mockReturnValue(of(1));
      mockUsersService.get.mockReturnValue(of(mockUser));

      service.signOut(mockUser.id).subscribe((result) => {
        expect(mockTokensService.destroyJwtToken).toHaveBeenCalled();
        expect(mockTokensService.destroyJwtToken).toHaveBeenCalledTimes(1);
        expect(result).toEqual(1);

        done();
      });
    });
  });
});
