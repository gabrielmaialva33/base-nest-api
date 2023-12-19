import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import * as crypto from 'crypto';
import { of } from 'rxjs';

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

  //   signIn({ uid, password }: SignInUserDto) {
  //     return this.userService.getByUid(uid).pipe(
  //       switchMap((user) => {
  //         if (!user || user.is_deleted)
  //           throw new NotFoundException({
  //             message: translate('exception.model_not_found', {
  //               args: { model: translate('model.user.label') },
  //             }),
  //           });
  //
  //         if (!user.is_active)
  //           throw new ForbiddenException({
  //             message: translate('exception.model_not_active', {
  //               args: { model: translate('model.user.label') },
  //             }),
  //           });
  //
  //         return Argon2Utils.verify$(user.password, password).pipe(
  //           switchMap(() => {
  //             const token = this.tokensService.generateRememberMeToken();
  //             user.$set({ remember_me_token: token });
  //             return this.userService.save(user).pipe(map(() => user));
  //           }),
  //           switchMap((match) => {
  //             if (!match)
  //               throw new UnauthorizedException({
  //                 message: translate('exception.invalid_credentials'),
  //               });
  //
  //             return this.tokensService
  //               .generateJwtToken({
  //                 id: user.id,
  //                 uid: uid,
  //               })
  //               .pipe(
  //                 map((token) => {
  //                   return {
  //                     user,
  //                     token,
  //                   };
  //                 }),
  //               );
  //           }),
  //         );
  //       }),
  //     );
  //   }
  //
  //   signUp(data: SignInUserDto) {
  //     return this.userService.create(data).pipe(
  //       switchMap((user) => {
  //         const token = this.tokensService.generateRememberMeToken();
  //         user.$set({ remember_me_token: token });
  //         return this.userService.save(user).pipe(map(() => user));
  //       }),
  //       switchMap((user) => {
  //         return this.tokensService
  //           .generateJwtToken({
  //             id: user.id,
  //             uid: data.uid,
  //           })
  //           .pipe(
  //             map((token) => {
  //               return {
  //                 user,
  //                 token,
  //               };
  //             }),
  //           );
  //       }),
  //     );
  //   }
  //
  //   signOut() {
  //     const user: User = RequestContext.get().currentUser;
  //     return this.tokensService.destroyJwtToken(user.id);
  //   }
  //
  //   refreshToken() {
  //     const user: User = RequestContext.get().currentUser;
  //     return this.userService.get(user.id).pipe(
  //       switchMap((user) => {
  //         return this.tokensService
  //           .generateRefreshToken(user.remember_me_token, {
  //             id: user.id,
  //           })
  //           .pipe(
  //             map((token) => {
  //               return {
  //                 user,
  //                 token,
  //               };
  //             }),
  //           );
  //       }),
  //     );
  //   }
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
});
