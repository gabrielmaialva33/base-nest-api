import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { of } from 'rxjs';
import { pick } from 'helper-fns';
import * as crypto from 'crypto';

import { SessionsService } from '@src/modules/sessions/services/sessions.service';
import { TokensService } from '@src/modules/tokens/services/tokens.service';

import { Argon2Utils } from '@src/common/helpers/argon2.utils';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '@src/modules/users/interfaces/user.interface';

import {
  IRoleRepository,
  ROLE_REPOSITORY,
  RoleType,
} from '@src/modules/roles/interfaces/roles.interface';
import { userFactory } from '@src/database/factories';

describe('SessionsService', () => {
  let service: SessionsService;
  let mockTokensService: jest.Mocked<TokensService>;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockRoleRepository: jest.Mocked<IRoleRepository>;

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
          provide: USER_REPOSITORY,
          useValue: createMock<IUserRepository>(),
        },
        {
          provide: ROLE_REPOSITORY,
          useValue: createMock<IRoleRepository>(),
        },
      ],
    }).compile();

    const hash = await Argon2Utils.hash('password');
    mockUser.$setDatabaseJson({ password: hash });

    service = module.get<SessionsService>(SessionsService);
    mockTokensService = module.get(TokensService);
    mockUserRepository = module.get(USER_REPOSITORY);
    mockRoleRepository = module.get(ROLE_REPOSITORY);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should sign in a user', (done) => {
      mockUserRepository.getByUid.mockReturnValue(of(mockUser));
      mockUserRepository.update.mockReturnValue(of(mockUser));
      mockTokensService.generateJwtToken.mockReturnValue(
        of(crypto.randomBytes(32).toString('hex')),
      );

      service
        .signIn({
          uid: mockUser.email,
          password: 'password',
        })
        .subscribe((result) => {
          expect(mockUserRepository.getByUid).toHaveBeenCalled();
          expect(mockUserRepository.getByUid).toHaveBeenCalledTimes(1);
          expect(mockUserRepository.getByUid).toHaveBeenCalledWith(
            mockUser.email,
          );

          expect(mockUserRepository.update).toHaveBeenCalled();
          expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
          expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser);

          expect(mockTokensService.generateJwtToken).toHaveBeenCalled();
          expect(mockTokensService.generateJwtToken).toHaveBeenCalledTimes(1);
          expect(mockTokensService.generateJwtToken).toHaveBeenCalledWith({
            id: mockUser.id,
            uid: mockUser.email,
            roles:
              mockUser.roles.length > 0
                ? mockUser.roles.map((role) => role.name)
                : [],
          });

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
    const mockRole = mockUser.roles[0];

    it('should sign up a user', (done) => {
      mockUserRepository.create.mockReturnValue(of(mockUser));
      mockUserRepository.update.mockReturnValue(of(mockUser));
      mockUserRepository.find.mockReturnValue(of(mockUser));

      mockRoleRepository.firstBy.mockReturnValue(of(mockRole));
      mockRoleRepository.attachRoleToUser.mockReturnValue(of(1));

      mockTokensService.generateJwtToken.mockReturnValue(
        of(crypto.randomBytes(32).toString('hex')),
      );

      service.signUp(data).subscribe((result) => {
        expect(mockUserRepository.create).toHaveBeenCalled();
        expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
        expect(mockUserRepository.create).toHaveBeenCalledWith(data);

        expect(mockUserRepository.update).toHaveBeenCalled();
        expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
        expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser);

        expect(mockRoleRepository.firstBy).toHaveBeenCalled();
        expect(mockRoleRepository.firstBy).toHaveBeenCalledTimes(1);
        expect(mockRoleRepository.firstBy).toHaveBeenCalledWith(
          'name',
          RoleType.USER,
        );

        expect(mockRoleRepository.attachRoleToUser).toHaveBeenCalled();
        expect(mockRoleRepository.attachRoleToUser).toHaveBeenCalledTimes(1);
        expect(mockRoleRepository.attachRoleToUser).toHaveBeenCalledWith(
          mockUser,
          [mockRole.id],
        );

        expect(mockTokensService.generateJwtToken).toHaveBeenCalled();
        expect(mockTokensService.generateJwtToken).toHaveBeenCalledTimes(1);
        expect(mockTokensService.generateJwtToken).toHaveBeenCalledWith({
          id: mockUser.id,
          uid: mockUser.email,
          roles:
            mockUser.roles.length > 0
              ? mockUser.roles.map((role) => role.name)
              : [],
        });

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
      mockUserRepository.find.mockReturnValue(of(mockUser));

      service.signOut(mockUser.id).subscribe((result) => {
        expect(mockTokensService.destroyJwtToken).toHaveBeenCalled();
        expect(mockTokensService.destroyJwtToken).toHaveBeenCalledTimes(1);
        expect(mockTokensService.destroyJwtToken).toHaveBeenCalledWith(
          mockUser.id,
        );

        expect(result).toEqual(1);

        done();
      });
    });
  });
});
