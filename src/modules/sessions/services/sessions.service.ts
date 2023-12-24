import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { from, map, switchMap, tap } from 'rxjs';

import { translate } from '@src/lib/i18n';
import { TokensService } from '@src/modules/tokens/services/tokens.service';
import { SignInUserDto } from '@src/modules/sessions/dto/sign-in-user.dto';
import { Argon2Utils } from '@src/common/helpers/argon2.utils';
import { SignUpUserDto } from '@src/modules/sessions/dto/sign-up-user.dto';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '@src/modules/users/interfaces/user.interface';
import {
  IRoleRepository,
  ROLE_REPOSITORY,
  RoleType,
} from '@src/modules/roles/interfaces/roles.interface';
import { User } from '@src/modules/users/entities/user.entity';

@Injectable()
export class SessionsService {
  constructor(
    @Inject(TokensService) private readonly tokensService: TokensService,
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: IRoleRepository,
  ) {}

  signIn({ uid, password }: SignInUserDto) {
    return this.userRepository.getByUid(uid).pipe(
      switchMap((user) => this.validateUser(user)),
      switchMap((user) => this.verifyPassword(user, password)),
      switchMap((user) => this.generateTokenAndUpdateUser(user, uid)),
    );
  }

  signUp(data: SignUpUserDto) {
    return this.userRepository.create(data).pipe(
      switchMap((user) => this.attachUserRole(user)),
      switchMap((user) =>
        this.userRepository.find(user.id, (qb) => qb.withGraphFetched('roles')),
      ),
      switchMap((user) => this.generateTokenAndUpdateUser(user, data.email)),
    );
  }

  signOut(userId: number) {
    return this.userRepository.find(userId).pipe(
      switchMap((user) => {
        if (!user) {
          throw new NotFoundException();
        }
        return this.tokensService.destroyJwtToken(user.id);
      }),
    );
  }

  refreshToken(userId: number) {
    return this.userRepository.find(userId).pipe(
      switchMap((user) => {
        return this.tokensService
          .generateRefreshToken(user.remember_me_token, { id: user.id })
          .pipe(map((token) => ({ user, token })));
      }),
    );
  }

  /**
   * ------------------------------------------------------
   * Private Methods
   * ------------------------------------------------------
   */
  private validateUser(user: User | undefined) {
    if (!user || user.is_deleted) {
      throw new NotFoundException({
        message: translate('exception.model_not_found', {
          args: { model: translate('model.user.label') },
        }),
      });
    }

    if (!user.is_active) {
      throw new ForbiddenException({
        message: translate('exception.model_not_active', {
          args: { model: translate('model.user.label') },
        }),
      });
    }

    return from(Promise.resolve(user));
  }

  private verifyPassword(user: User, password: string) {
    return Argon2Utils.verify$(user.password, password).pipe(
      switchMap((match) => {
        if (!match) {
          throw new UnauthorizedException({
            message: translate('exception.invalid_credentials'),
          });
        }
        return from(Promise.resolve(user));
      }),
    );
  }

  private generateTokenAndUpdateUser(user: User, uid: string) {
    const token = this.tokensService.generateRememberMeToken();
    user.$set({ remember_me_token: token });
    return this.userRepository.update(user).pipe(
      switchMap(() => {
        return this.tokensService
          .generateJwtToken({
            id: user.id,
            uid: uid,
            roles:
              user.roles.length > 0 ? user.roles.map((role) => role.name) : [],
          })
          .pipe(map((jwtToken) => ({ user, token: jwtToken })));
      }),
    );
  }

  private attachUserRole(user: User) {
    return this.roleRepository.firstBy('name', RoleType.USER).pipe(
      switchMap((role) =>
        this.roleRepository.attachRoleToUser(user, [role.id]),
      ),
      map(() => user),
    );
  }
}
