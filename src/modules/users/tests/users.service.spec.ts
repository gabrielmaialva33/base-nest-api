import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '@src/modules/users/services/users.service';
import { NotFoundException } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { of } from 'rxjs';
import { pick } from 'helper-fns';

import { userFactory } from '@src/database/factories';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '@src/modules/users/interfaces/user.interface';

describe('UsersService', () => {
  let service: UsersService;

  // repositories mock declaration
  const mockUserRepository = createMock<IUserRepository>();

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('list', () => {
    const mockUsers = userFactory.makeManyStub(10);

    it('should return a list of users', (done) => {
      const listSpy = jest
        .spyOn(mockUserRepository, 'list')
        .mockReturnValue(of(mockUsers));

      service.list().subscribe((users) => {
        expect(listSpy).toHaveBeenCalled();
        expect(users).toEqual(mockUsers);
        expect(users.length).toEqual(10);
        done();
      });
    });
  });

  describe('paginate', () => {
    const mockUsers = userFactory.makeManyStub(10);

    it('should return a paginated list of users', (done) => {
      const paginateSpy = jest
        .spyOn(mockUserRepository, 'paginate')
        .mockReturnValue(of({ results: mockUsers, total: 10 }));

      service.paginate().subscribe((paginatedUsers) => {
        const { data, pagination } = paginatedUsers;

        expect(paginateSpy).toHaveBeenCalled();
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
    const mockUser = userFactory.makeStub();

    it('should return a user', (done) => {
      const getSpy = jest
        .spyOn(mockUserRepository, 'get')
        .mockReturnValue(of(mockUser));

      service.get(mockUser.id).subscribe((user) => {
        expect(getSpy).toHaveBeenCalled();
        expect(user).toEqual(mockUser);
        for (const key in mockUser) expect(user[key]).toEqual(mockUser[key]);
        done();
      });
    });

    it('should not return a user', (done) => {
      const getSpy = jest
        .spyOn(mockUserRepository, 'get')
        .mockReturnValue(of(undefined));

      service.get(mockUser.id).subscribe({
        next: () => done.fail('Should not return a user'),
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

  describe('getByUid', () => {
    const mockUser = userFactory.makeStub();

    it('should return a user', (done) => {
      const getByUidSpy = jest
        .spyOn(mockUserRepository, 'getByUid')
        .mockReturnValue(of(mockUser));

      service.getByUid(mockUser.email).subscribe((user) => {
        expect(getByUidSpy).toHaveBeenCalled();
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
      const createSpy = jest
        .spyOn(mockUserRepository, 'create')
        .mockReturnValue(of(mockUser));

      service.create(mockUser).subscribe((user) => {
        expect(createSpy).toHaveBeenCalled();
        expect(user).toEqual(mockUser);
        for (const key in mockUser) expect(user[key]).toEqual(mockUser[key]);
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

    it('should edit a user', (done) => {
      const getSpy = jest
        .spyOn(mockUserRepository, 'get')
        .mockReturnValue(of(mockUser));
      const editSpy = jest
        .spyOn(mockUserRepository, 'update')
        .mockReturnValue(of(mockUser.$set(data)));

      service.edit(mockUser.id, {}).subscribe((user) => {
        expect(getSpy).toHaveBeenCalled();
        expect(editSpy).toHaveBeenCalled();
        for (const key in mockUser) expect(user[key]).toEqual(mockUser[key]);
        done();
      });
    });
  });

  describe('save', () => {
    const mockUser = userFactory.makeStub();

    it('should save a user', (done) => {
      const saveSpy = jest
        .spyOn(mockUserRepository, 'update')
        .mockReturnValue(of(mockUser));

      service.save(mockUser).subscribe((user) => {
        expect(saveSpy).toHaveBeenCalled();
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

      service.delete(mockUser.id).subscribe((result) => {
        expect(getSpy).toHaveBeenCalled();
        expect(deleteSpy).toHaveBeenCalled();
        expect(result).toEqual(true);
        done();
      });
    });
  });
});
