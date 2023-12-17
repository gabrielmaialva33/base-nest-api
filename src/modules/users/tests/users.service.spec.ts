import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '@src/modules/users/services/users.service';
import { createMock } from '@golevelup/ts-jest';
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
