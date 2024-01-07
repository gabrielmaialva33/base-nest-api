import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { of } from 'rxjs';
import { pick } from 'helper-fns';
import { createMock } from '@golevelup/ts-jest';

import { UsersController } from '@src/modules/users/controllers/users.controller';
import { UsersService } from '@src/modules/users/services/users.service';

import {
  IUserRepository,
  USER_REPOSITORY,
} from '@src/modules/users/interfaces/user.interface';

import {
  IRoleRepository,
  ROLE_REPOSITORY,
} from '@src/modules/roles/interfaces/roles.interface';
import { userFactory } from '@src/database/factories';

describe('UsersController', () => {
  let controller: UsersController;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockRoleRepository: jest.Mocked<IRoleRepository>;
  const mockUsers = userFactory.makeManyStub(10);

  beforeAll(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
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

    controller = module.get<UsersController>(UsersController);
    mockUserRepository = module.get(USER_REPOSITORY);
    mockRoleRepository = module.get(ROLE_REPOSITORY);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(mockUserRepository).toBeDefined();
    expect(mockRoleRepository).toBeDefined();
  });

  describe('list', () => {
    it('should return a list of users', (done) => {
      mockUserRepository.list.mockReturnValue(of(mockUsers));

      controller.list().subscribe((users) => {
        expect(mockUserRepository.list).toHaveBeenCalled();
        expect(mockUserRepository.list).toHaveBeenCalledTimes(1);
        expect(users).toEqual(mockUsers);
        done();
      });
    });
  });

  describe('paginate', () => {
    it('should return a paginated list of users', (done) => {
      mockUserRepository.paginate.mockReturnValue(
        of({ results: mockUsers, total: mockUsers.length }),
      );

      controller.paginate().subscribe((paginatedUsers) => {
        expect(mockUserRepository.paginate).toHaveBeenCalled();
        expect(mockUserRepository.paginate).toHaveBeenCalledTimes(1);
        expect(paginatedUsers).toEqual({
          data: mockUsers,
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
        expect(paginatedUsers.data).toEqual(mockUsers);
        expect(paginatedUsers.pagination.total).toEqual(mockUsers.length);
        done();
      });
    });
  });

  describe('get', () => {
    const mockUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];

    it('should return a user', (done) => {
      mockUserRepository.firstBy.mockReturnValue(of(mockUser));

      controller.get(String(mockUser.id)).subscribe((user) => {
        expect(mockUserRepository.firstBy).toHaveBeenCalled();
        expect(mockUserRepository.firstBy).toHaveBeenCalledTimes(1);
        expect(user).toEqual(mockUser);
        done();
      });
    });

    it('should throw an error if user not found', (done) => {
      mockUserRepository.firstBy.mockReturnValue(of(null));

      controller.get(String(mockUser.id)).subscribe({
        next: () => done.fail('Should not be called'),
        error: (err) => {
          expect(mockUserRepository.firstBy).toHaveBeenCalled();
          expect(mockUserRepository.firstBy).toHaveBeenCalledTimes(1);
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
    const mockUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    const mockRole = mockUser.roles[0];
    const data = pick(mockUser.$toJson(), [
      'first_name',
      'last_name',
      'email',
      'password',
      'username',
      'avatar_url',
    ]);

    it('should create a user', (done) => {
      mockUserRepository.create.mockReturnValue(of(mockUser));
      mockUserRepository.firstBy.mockReturnValue(of(mockUser));
      mockRoleRepository.firstBy.mockReturnValue(of(mockRole));
      mockRoleRepository.attachRoleToUser.mockReturnValue(of(1));

      controller.create(data).subscribe((user) => {
        expect(mockUserRepository.create).toHaveBeenCalled();
        expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
        expect(mockUserRepository.firstBy).toHaveBeenCalled();
        expect(mockUserRepository.firstBy).toHaveBeenCalledTimes(1);
        expect(mockRoleRepository.firstBy).toHaveBeenCalled();
        expect(mockRoleRepository.firstBy).toHaveBeenCalledTimes(1);
        expect(mockRoleRepository.attachRoleToUser).toHaveBeenCalled();
        expect(mockRoleRepository.attachRoleToUser).toHaveBeenCalledTimes(1);
        expect(user).toEqual(mockUser);
        done();
      });
    });
  });

  describe('edit', () => {
    const mockUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    const data = pick(userFactory.make(), [
      'first_name',
      'last_name',
      'email',
      'username',
      'avatar_url',
    ]);

    it('should update a user', (done) => {
      mockUserRepository.firstBy.mockReturnValue(of(mockUser));
      mockUserRepository.update.mockReturnValue(of(mockUser.$set(data)));

      controller.edit(String(mockUser.id), mockUser).subscribe((user) => {
        expect(mockUserRepository.firstBy).toHaveBeenCalled();
        expect(mockUserRepository.firstBy).toHaveBeenCalledTimes(1);
        expect(mockUserRepository.update).toHaveBeenCalled();
        expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
        expect(user).toEqual(mockUser);
        for (const key in mockUser) expect(user[key]).toEqual(mockUser[key]);
        done();
      });
    });
  });

  describe('delete', () => {
    const mockUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];

    it('should delete a user', (done) => {
      mockUserRepository.firstBy.mockReturnValue(of(mockUser));
      mockUserRepository.update.mockReturnValue(
        of(mockUser.$set({ is_deleted: true })),
      );

      controller.delete(String(mockUser.id)).subscribe((result) => {
        expect(mockUserRepository.firstBy).toHaveBeenCalled();
        expect(mockUserRepository.firstBy).toHaveBeenCalledTimes(1);
        expect(mockUserRepository.update).toHaveBeenCalled();
        expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
        expect(result).toEqual(undefined);
        done();
      });
    });
  });
});
