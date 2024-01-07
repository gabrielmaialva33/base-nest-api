import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { switchMap } from 'rxjs';

import { User } from '@src/modules/users/entities/user.entity';

import {
  IRoleRepository,
  ROLE_REPOSITORY,
} from '@src/modules/roles/interfaces/roles.interface';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '@src/modules/users/interfaces/user.interface';

@Injectable()
export class RolesService {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  list() {
    return this.roleRepository.list();
  }

  get(id: number) {
    return this.roleRepository.find(+id);
  }

  addRole(userId: number, roleId: number) {
    return this.userRepository
      .find(userId, (qb) => {
        qb.modify(User.scopes.notDeleted);
        qb.withGraphFetched('roles');
      })
      .pipe(
        switchMap((user) => {
          if (!user) throw new NotFoundException({ message: 'User not found' });

          return this.roleRepository.find(roleId).pipe(
            switchMap((role) => {
              if (!role)
                throw new NotFoundException({ message: 'Role not found' });

              const rolesId = user.roles.map((role) => role.id);
              if (rolesId.includes(role.id))
                throw new ConflictException({
                  message: 'Role already attached to user',
                });

              return this.roleRepository
                .attachRoleToUser(user, [role.id])
                .pipe(
                  switchMap(() =>
                    this.userRepository.find(userId, (qb) =>
                      qb.withGraphFetched('roles'),
                    ),
                  ),
                );
            }),
          );
        }),
      );
  }
}
