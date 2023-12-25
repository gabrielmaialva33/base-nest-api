import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { of } from 'rxjs';
import { pick } from 'helper-fns';

import { RequestContext } from '@src/lib/context';
import { SessionsController } from '@src/modules/sessions/controllers/sessions.controller';
import { SessionsService } from '@src/modules/sessions/services/sessions.service';

import { userFactory } from '@src/database/factories';

describe('SessionsController', () => {
  let controller: SessionsController;
  let mockSessionsService: jest.Mocked<SessionsService>;

  const mockUser = userFactory.makeStub({ is_deleted: false, is_active: true });

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionsController],
      providers: [
        SessionsService,
        {
          provide: SessionsService,
          useValue: createMock<SessionsService>(),
        },
      ],
    }).compile();

    controller = module.get<SessionsController>(SessionsController);
    mockSessionsService = module.get(SessionsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should sign in a user', (done) => {
      mockSessionsService.signIn.mockReturnValue(
        of({
          token: 'token',
          user: mockUser,
        }),
      );

      controller
        .signIn({
          uid: mockUser.email,
          password: 'password',
        })
        .subscribe((response) => {
          expect(mockSessionsService.signIn).toHaveBeenCalled();
          expect(mockSessionsService.signIn).toHaveBeenCalledTimes(1);
          expect(mockSessionsService.signIn).toHaveBeenCalledWith(
            expect.objectContaining({
              uid: mockUser.email,
              password: 'password',
            }),
          );
          expect(response).toEqual({
            user: mockUser,
            token: 'token',
          });
          done();
        });
    });
  });

  describe('signUp', () => {
    it('should sign up a user', (done) => {
      const data = pick(mockUser, [
        'first_name',
        'last_name',
        'email',
        'username',
        'avatar_url',
        'password',
      ]);

      mockSessionsService.signUp.mockReturnValue(
        of({ user: mockUser, token: 'token' }),
      );

      controller.signUp(data).subscribe((response) => {
        expect(mockSessionsService.signUp).toHaveBeenCalled();
        expect(mockSessionsService.signUp).toHaveBeenCalledTimes(1);
        expect(mockSessionsService.signUp).toHaveBeenCalledWith(
          expect.objectContaining({
            first_name: mockUser.first_name,
            last_name: mockUser.last_name,
            email: mockUser.email,
            username: mockUser.username,
            avatar_url: mockUser.avatar_url,
            password: mockUser.password,
          }),
        );
        expect(response).toEqual({
          user: mockUser,
          token: 'token',
        });
        done();
      });
    });
  });

  describe('signOut', () => {
    it('should sign out a user', (done) => {
      jest
        .spyOn(RequestContext, 'get')
        .mockImplementation(() => ({ currentUser: mockUser }) as any);

      mockSessionsService.signOut.mockReturnValue(of(1));

      controller.signOut().subscribe((response) => {
        expect(mockSessionsService.signOut).toHaveBeenCalled();
        expect(mockSessionsService.signOut).toHaveBeenCalledTimes(1);
        expect(mockSessionsService.signOut).toHaveBeenCalledWith(mockUser.id);
        expect(response).toEqual(1);
        done();
      });
    });
  });

  describe('refreshToken', () => {
    it('should refresh token a user', (done) => {
      jest
        .spyOn(RequestContext, 'get')
        .mockImplementation(() => ({ currentUser: mockUser }) as any);

      mockSessionsService.refreshToken.mockReturnValue(
        of({
          user: mockUser,
          token: 'token',
        }),
      );

      controller.refreshToken().subscribe((response) => {
        expect(mockSessionsService.refreshToken).toHaveBeenCalled();
        expect(mockSessionsService.refreshToken).toHaveBeenCalledTimes(1);
        expect(mockSessionsService.refreshToken).toHaveBeenCalledWith(
          mockUser.id,
        );
        expect(response).toEqual({ user: mockUser, token: 'token' });
        done();
      });
    });
  });
});
