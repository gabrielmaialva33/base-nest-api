import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DateTime } from 'luxon';

import { createMock } from '@golevelup/ts-jest';
import { of } from 'rxjs';
import { pick } from 'helper-fns';

import {
  IUserRepository,
  USER_REPOSITORY,
} from '@src/modules/users/interfaces/user.interface';
import {
  IRoleRepository,
  ROLE_REPOSITORY,
  RoleType,
} from '@src/modules/roles/interfaces/roles.interface';
import { UsersService } from '@src/modules/users/services/users.service';
import { userFactory } from '@src/database/factories';

describe('UsersService', () => {
  let service: UsersService;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockRoleRepository: jest.Mocked<IRoleRepository>;

  const mockUsers = userFactory.makeManyStub(10);

  beforeAll(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
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
    service = module.get<UsersService>(UsersService);
    mockUserRepository = module.get(USER_REPOSITORY);
    mockRoleRepository = module.get(ROLE_REPOSITORY);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(mockUserRepository).toBeDefined();
    expect(mockRoleRepository).toBeDefined();
  });

  describe('list', () => {
    it('should return a list of users', (done) => {
      mockUserRepository.list.mockReturnValue(of(mockUsers));
      service.list().subscribe((users) => {
        expect(mockUserRepository.list).toHaveBeenCalled();
        expect(mockUserRepository.list).toHaveBeenCalledTimes(1);
        expect(users).toEqual(mockUsers);
        expect(users.length).toEqual(10);
        done();
      });
    });
  });

  describe('paginate', () => {
    it('should return a paginated list of users', (done) => {
      mockUserRepository.paginate.mockReturnValue(
        of({ results: mockUsers, total: mockUsers.length }),
      );
      service.paginate().subscribe((paginatedUsers) => {
        const { data, pagination } = paginatedUsers;
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
            is_empty: false,
            first_page_url: '?page=1&per_page=10',
            last_page_url: '?page=1&per_page=10',
            next_page_url: null,
            previous_page_url: null,
          },
        });
        expect(data).toEqual(mockUsers);
        expect(pagination).toEqual({
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
          is_empty: false,
          first_page_url: '?page=1&per_page=10',
          last_page_url: '?page=1&per_page=10',
          next_page_url: null,
          previous_page_url: null,
        });
        done();
      });
    });
  });

  describe('get', () => {
    const mockUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];

    it('should return a user', (done) => {
      mockUserRepository.firstBy.mockReturnValue(of(mockUser));
      service.get(mockUser.id).subscribe((user) => {
        expect(mockUserRepository.firstBy).toHaveBeenCalled();
        expect(mockUserRepository.firstBy).toHaveBeenCalledTimes(1);
        expect(mockUserRepository.firstBy).toBeCalledWith(
          'id',
          mockUser.id,
          expect.anything(),
        );
        expect(user).toEqual(mockUser);
        for (const key in mockUser) expect(user[key]).toEqual(mockUser[key]);
        done();
      });
    });

    it('should not return a user', (done) => {
      mockUserRepository.firstBy.mockReturnValue(of(undefined));
      service.get(mockUser.id).subscribe({
        next: () => done.fail('Should not return a user'),
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
    const mockUser = userFactory.makeStub();
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

      service.create(data).subscribe((user) => {
        expect(mockUserRepository.create).toHaveBeenCalled();
        expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
        expect(mockUserRepository.create).toHaveBeenCalledWith(data);

        expect(mockUserRepository.firstBy).toHaveBeenCalled();
        expect(mockUserRepository.firstBy).toHaveBeenCalledTimes(1);
        expect(mockUserRepository.firstBy).toHaveBeenCalledWith(
          'id',
          mockUser.id,
          expect.anything(),
        );

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

        expect(user).toEqual(mockUser);
        for (const key in mockUser) expect(user[key]).toEqual(mockUser[key]);
        done();
      });
    });
  });

  describe('edit', () => {
    const mockUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    const data = pick(mockUser.$toJson(), [
      'first_name',
      'last_name',
      'email',
      'username',
      'avatar_url',
    ]);

    it('should edit a user', (done) => {
      mockUserRepository.firstBy.mockReturnValue(of(mockUser));
      mockUserRepository.update.mockReturnValue(of(mockUser));

      service.edit(mockUser.id, data).subscribe((user) => {
        expect(mockUserRepository.firstBy).toHaveBeenCalled();
        expect(mockUserRepository.firstBy).toHaveBeenCalledTimes(1);
        expect(mockUserRepository.firstBy).toHaveBeenCalledWith(
          'id',
          mockUser.id,
          expect.anything(),
        );

        expect(mockUserRepository.update).toHaveBeenCalled();
        expect(mockUserRepository.update).toHaveBeenCalledTimes(1);

        for (const key in data) expect(user[key]).toEqual(data[key]);
        done();
      });
    });
  });

  describe('delete', () => {
    const mockUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];

    it('should delete a user', (done) => {
      mockUserRepository.firstBy.mockReturnValue(of(mockUser));
      mockUserRepository.update.mockReturnValue(
        of(
          mockUser.$set({
            is_deleted: true,
            deleted_at: DateTime.local().toISO(),
          }),
        ),
      );

      service.delete(mockUser.id).subscribe((result) => {
        expect(mockUserRepository.firstBy).toHaveBeenCalled();
        expect(mockUserRepository.firstBy).toHaveBeenCalledTimes(1);
        expect(mockUserRepository.firstBy).toHaveBeenCalledWith(
          'id',
          mockUser.id,
          expect.anything(),
        );

        expect(mockUserRepository.update).toHaveBeenCalled();
        expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
        expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser);

        expect(result).toEqual(true);
        done();
      });
    });
  });
});
