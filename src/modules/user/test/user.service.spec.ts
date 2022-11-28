import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '@user/services/user.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserEntity } from '@user/entities/user.entity';
import { EntityManager } from '@mikro-orm/core';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forFeature({
          entities: [UserEntity],
        }),
      ],
      providers: [
        {
          provide: EntityManager,
          useFactory: jest.fn(() => ({
            flush: jest.fn(),
          })),
        },
        {
          provide: 'UserRepository',
          useFactory: jest.fn(() => ({
            findAll: jest.fn(),
            findOne: jest.fn(),
            persist: jest.fn(),
          })),
        },
        UserService,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
