import { Test, TestingModule } from '@nestjs/testing';

import { RolesService } from '@src/modules/roles/services/roles.service';
import {
  IRoleRepository,
  ROLE_REPOSITORY,
} from '@src/modules/roles/interfaces/roles.interface';
import { createMock } from '@golevelup/ts-jest';

describe('RolesService', () => {
  let service: RolesService;
  let mockRoleRepository: jest.Mocked<IRoleRepository>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: ROLE_REPOSITORY,
          useValue: createMock<IRoleRepository>(),
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    mockRoleRepository = module.get(ROLE_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(mockRoleRepository).toBeDefined();
  });
});
