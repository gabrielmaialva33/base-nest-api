import { Test, TestingModule } from '@nestjs/testing';

import { createMock } from '@golevelup/ts-jest';
import { of } from 'rxjs';

import { RolesService } from '@src/modules/roles/services/roles.service';
import {
  IRoleRepository,
  ROLE_REPOSITORY,
} from '@src/modules/roles/interfaces/roles.interface';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '@src/modules/users/interfaces/user.interface';

import { roleFactory, userFactory } from '@src/database/factories';

describe('RolesService', () => {
  let service: RolesService;
  let mockRoleRepository: jest.Mocked<IRoleRepository>;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  const mockRoles = roleFactory.makeManyStub(5);

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: ROLE_REPOSITORY,
          useValue: createMock<IRoleRepository>(),
        },
        {
          provide: USER_REPOSITORY,
          useValue: createMock<IUserRepository>(),
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    mockRoleRepository = module.get(ROLE_REPOSITORY);
    mockUserRepository = module.get(USER_REPOSITORY);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(mockRoleRepository).toBeDefined();
    expect(mockUserRepository).toBeDefined();
  });

  describe('list', () => {
    it('should return a list of roles', (done) => {
      mockRoleRepository.list.mockReturnValueOnce(of(mockRoles));

      service.list().subscribe((roles) => {
        expect(mockRoleRepository.list).toHaveBeenCalled();
        expect(mockRoleRepository.list).toHaveBeenCalledTimes(1);
        expect(roles).toEqual(mockRoles);
        done();
      });
    });
  });

  describe('get', () => {
    it('should return a role', (done) => {
      const mockRole = mockRoles[Math.floor(Math.random() * mockRoles.length)];
      mockRoleRepository.find.mockReturnValueOnce(of(mockRole));

      service.get(mockRole.id).subscribe((role) => {
        expect(mockRoleRepository.find).toHaveBeenCalled();
        expect(mockRoleRepository.find).toHaveBeenCalledTimes(1);
        expect(role).toEqual(mockRole);
        done();
      });
    });
  });

  describe('addRole', () => {
    it('should add a role to a user', (done) => {
      const mockRole = mockRoles[Math.floor(Math.random() * mockRoles.length)];
      const mockUser = userFactory.makeStub({
        roles: mockRoles.filter((role) => role.id !== mockRole.id),
      });

      mockUserRepository.find.mockReturnValue(of(mockUser));
      mockRoleRepository.find.mockReturnValue(of(mockRole));

      mockRoleRepository.attachRoleToUser.mockReturnValue(of(1));

      service.addRole(mockUser.id, mockRole.id).subscribe((user) => {
        expect(mockUserRepository.find).toHaveBeenCalled();
        expect(mockUserRepository.find).toHaveBeenCalledTimes(2);
        expect(mockUserRepository.find).toHaveBeenCalledWith(
          mockUser.id,
          expect.anything(),
        );

        expect(mockRoleRepository.find).toHaveBeenCalled();
        expect(mockRoleRepository.find).toHaveBeenCalledTimes(1);
        expect(mockRoleRepository.find).toHaveBeenCalledWith(mockRole.id);

        expect(mockRoleRepository.attachRoleToUser).toHaveBeenCalled();
        expect(mockRoleRepository.attachRoleToUser).toHaveBeenCalledTimes(1);
        expect(mockRoleRepository.attachRoleToUser).toHaveBeenCalledWith(
          mockUser,
          [mockRole.id],
        );

        expect(user).toEqual(mockUser);

        done();
      });
    });
  });
});
