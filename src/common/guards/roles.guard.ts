import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { RoleType } from '@src/modules/roles/interfaces/roles.interface';
import { ROLES_KEY } from '@src/common/decorators/roles.decorator';
import { UsersService } from '@src/modules/users/services/users.service';
import { map, switchMap } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    if (!authorization)
      throw new UnauthorizedException('Token not found in request');

    const token = authorization.split(' ')[1];

    try {
      const { id } = this.jwtService.verify(token);

      return this.usersService.get(id).pipe(
        map((user) => {
          return requiredRoles.some((role) =>
            user.roles.map((r) => r.name).includes(role),
          );
        }),
      );
    } catch (e) {
      throw new UnauthorizedException(
        'The session has expired. Please relogin',
      );
    }
  }

  handleRequest(err: any, user: any, info: any): any {
    if (err || !user || info) {
      throw new UnauthorizedException(this.getErrorMessage(info));
    }

    return user;
  }

  private getErrorMessage(info: any): string {
    switch (info?.name) {
      case 'TokenExpiredError':
        return 'The session has expired. Please re-login';
      case 'JsonWebTokenError':
        return 'Token malformed';
      default:
        return info?.message || 'Unauthorized';
    }
  }
}
