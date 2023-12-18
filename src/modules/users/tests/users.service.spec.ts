import { Test, TestingModule } from '@nestjs/testing';

import { NotFoundException } from '@nestjs/common';

import { createMock } from '@golevelup/ts-jest';
import { of } from 'rxjs';
import { pick } from 'helper-fns';

import { UsersService } from '@src/modules/users/services/users.service';

import {
  IUserRepository,
  USER_REPOSITORY,
} from '@src/modules/users/interfaces/user.interface';
import { userFactory } from '@src/database/factories';

describe('UsersService', () => {
  let service: UsersService;
  let mockUserRepository: jest.Mocked<IUserRepository>;
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
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    mockUserRepository = module.get(USER_REPOSITORY);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
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
        });
        done();
      });
    });
  });

  describe('get', () => {
    const mockUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];

    it('should return a user', (done) => {
      mockUserRepository.get.mockReturnValue(of(mockUser));

      service.get(mockUser.id).subscribe((user) => {
        expect(mockUserRepository.get).toHaveBeenCalled();
        expect(mockUserRepository.get).toHaveBeenCalledTimes(1);
        expect(user).toEqual(mockUser);
        for (const key in mockUser) expect(user[key]).toEqual(mockUser[key]);
        done();
      });
    });

    it('should not return a user', (done) => {
      mockUserRepository.get.mockReturnValue(of(undefined));

      service.get(mockUser.id).subscribe({
        next: () => done.fail('Should not return a user'),
        error: (err) => {
          expect(mockUserRepository.get).toHaveBeenCalled();
          expect(mockUserRepository.get).toHaveBeenCalledTimes(1);
          expect(err).toBeDefined();
          expect(err.status).toEqual(404);
          expect(err).toBeInstanceOf(NotFoundException);
          done();
        },
        complete: () => done(),
      });
    });
  });

  describe('getByUid', () => {
    const mockUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];

    it('should return a user', (done) => {
      mockUserRepository.getByUid.mockReturnValue(of(mockUser));

      service.getByUid(mockUser.email).subscribe((user) => {
        expect(mockUserRepository.getByUid).toHaveBeenCalled();
        expect(mockUserRepository.getByUid).toHaveBeenCalledTimes(1);
        expect(user).toEqual(mockUser);
        for (const key in mockUser) expect(user[key]).toEqual(mockUser[key]);
        done();
      });
    });

    it('should not return a user', (done) => {
      const getByUidSpy = jest
        .spyOn(mockUserRepository, 'getByUid')
        .mockReturnValue(of(undefined));

      service.getByUid(mockUser.username).subscribe({
        next: () => done.fail('Should not return a user'),
        error: (err) => {
          expect(getByUidSpy).toHaveBeenCalled();
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
      mockUserRepository.create.mockReturnValue(of(mockUser));

      service.create(mockUser).subscribe((user) => {
        expect(mockUserRepository.create).toHaveBeenCalled();
        expect(user).toEqual(mockUser);
        for (const key in mockUser) expect(user[key]).toEqual(mockUser[key]);
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

    it('should edit a user', (done) => {
      mockUserRepository.get.mockReturnValue(of(mockUser));
      mockUserRepository.update.mockReturnValue(of(mockUser.$set(data)));

      service.edit(mockUser.id, {}).subscribe((user) => {
        expect(mockUserRepository.get).toHaveBeenCalled();
        expect(mockUserRepository.get).toHaveBeenCalledTimes(1);
        expect(mockUserRepository.update).toHaveBeenCalled();
        expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
        for (const key in mockUser) expect(user[key]).toEqual(mockUser[key]);
        done();
      });
    });
  });

  describe('save', () => {
    const mockUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];

    it('should save a user', (done) => {
      mockUserRepository.update.mockReturnValue(of(mockUser));

      service.save(mockUser).subscribe((user) => {
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
      mockUserRepository.get.mockReturnValue(of(mockUser));
      mockUserRepository.update.mockReturnValue(
        of(mockUser.$set({ is_deleted: true })),
      );

      service.delete(mockUser.id).subscribe((result) => {
        expect(mockUserRepository.get).toHaveBeenCalled();
        expect(mockUserRepository.get).toHaveBeenCalledTimes(1);
        expect(mockUserRepository.update).toHaveBeenCalled();
        expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
        expect(result).toEqual(true);
        done();
      });
    });
  });
});
