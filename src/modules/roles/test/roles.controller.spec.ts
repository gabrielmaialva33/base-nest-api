import { Test, TestingModule } from '@nestjs/testing';

import { RolesController } from '@src/modules/roles/controllers/roles.controller';
import { RolesService } from '@src/modules/roles/services/roles.service';
import {
  IRoleRepository,
  ROLE_REPOSITORY,
} from '@src/modules/roles/interfaces/roles.interface';
import { createMock } from '@golevelup/ts-jest';

describe('RolesController', () => {
  let controller: RolesController;
  let mockRoleRepository: jest.Mocked<IRoleRepository>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        RolesService,
        {
          provide: ROLE_REPOSITORY,
          useValue: createMock<IRoleRepository>(),
        },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    mockRoleRepository = module.get(ROLE_REPOSITORY);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(mockRoleRepository).toBeDefined();
  });
});
