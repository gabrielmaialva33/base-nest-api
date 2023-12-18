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
    const mockList = userFactory.makeManyStub(10);

    it('should return a list of users', () => {
      jest.spyOn(mockUserRepository, 'list').mockReturnValue(of(mockList));

      controller.list().subscribe((users) => {
        expect(users).toEqual(mockList);
      });
    });
  });
});
