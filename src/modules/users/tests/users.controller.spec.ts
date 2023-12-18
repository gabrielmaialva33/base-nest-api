import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';

import { of } from 'rxjs';

import { UsersController } from '@src/modules/users/controllers/users.controller';
import { UsersService } from '@src/modules/users/services/users.service';

import {
  IUserRepository,
  USER_REPOSITORY,
} from '@src/modules/users/interfaces/user.interface';

import { userFactory } from '@src/database/factories';
import { NotFoundException } from '@nestjs/common';
import { pick } from 'helper-fns';

describe('UsersController', () => {
  let controller: UsersController;

  // repositories mock declaration
  const mockUserRepository = createMock<IUserRepository>();

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('list', () => {
    const mockUserList = userFactory.makeManyStub(10);

    it('should return a list of users', (done) => {
      jest.spyOn(mockUserRepository, 'list').mockReturnValue(of(mockUserList));

      controller.list().subscribe((users) => {
        expect(users).toEqual(mockUserList);
        done();
      });
    });
  });

  describe('paginate', () => {
    const mockUserList = userFactory.makeManyStub(10);

    it('should return a paginated list of users', (done) => {
      jest.spyOn(mockUserRepository, 'paginate').mockReturnValue(
        of({
          results: mockUserList,
          total: mockUserList.length,
        }),
      );

      controller.paginate().subscribe((paginatedUsers) => {
        expect(paginatedUsers).toEqual({
          data: mockUserList,
          pagination: {
            total: 10,
            current_page: 1,
            per_page: 10,
            total_pages: 1,
            first: null,
            previous: null,
            next: null,
            last: null,
            has_more: false,
            has_previous: false,
          },
        });

        expect(paginatedUsers.data).toEqual(mockUserList);
        expect(paginatedUsers.pagination.total).toEqual(mockUserList.length);
        done();
      });
    });
  });

  describe('get', () => {
    const mockUser = userFactory.makeStub();

    it('should return a user', (done) => {
      jest.spyOn(mockUserRepository, 'get').mockReturnValue(of(mockUser));

      controller.get(String(mockUser.id)).subscribe((user) => {
        expect(user).toEqual(mockUser);
        done();
      });
    });

    it('should throw an error if user not found', (done) => {
      const getSpy = jest
        .spyOn(mockUserRepository, 'get')
        .mockReturnValue(of(null));

      controller.get(String(mockUser.id)).subscribe({
        next: () => done.fail('Should not be called'),
        error: (err) => {
          expect(getSpy).toHaveBeenCalled();
          expect(err).toBeDefined();
          expect(err.status).toEqual(404);
          expect(err).toBeInstanceOf(NotFoundException);
          done();
        },
        complete: () => done(),
      });
    });
  });

  describe('create', () => {
    const mockUser = userFactory.makeStub();

    it('should create a user', (done) => {
      jest.spyOn(mockUserRepository, 'create').mockReturnValue(of(mockUser));

      controller.create(mockUser).subscribe((user) => {
        expect(user).toEqual(mockUser);
        done();
      });
    });
  });

  describe('edit', () => {
    const mockUser = userFactory.makeStub();
    const data = pick(userFactory.make(), [
      'first_name',
      'last_name',
      'email',
      'username',
      'avatar_url',
    ]);

    it('should update a user', (done) => {
      const getSpy = jest
        .spyOn(mockUserRepository, 'get')
        .mockReturnValue(of(mockUser));
      const editSpy = jest
        .spyOn(mockUserRepository, 'update')
        .mockReturnValue(of(mockUser.$set(data)));

      controller.edit(String(mockUser.id), mockUser).subscribe((user) => {
        expect(getSpy).toHaveBeenCalled();
        expect(editSpy).toHaveBeenCalled();
        expect(user).toEqual(mockUser);
        for (const key in mockUser) expect(user[key]).toEqual(mockUser[key]);
        done();
      });
    });
  });

  describe('delete', () => {
    const mockUser = userFactory.makeStub();

    it('should delete a user', (done) => {
      const getSpy = jest
        .spyOn(mockUserRepository, 'get')
        .mockReturnValue(of(mockUser));
      const deleteSpy = jest
        .spyOn(mockUserRepository, 'update')
        .mockReturnValue(of(mockUser.$set({ is_deleted: true })));

      controller.delete(String(mockUser.id)).subscribe((result) => {
        expect(getSpy).toHaveBeenCalled();
        expect(deleteSpy).toHaveBeenCalled();
        expect(result).toEqual(undefined);
        done();
      });
    });
  });
});
