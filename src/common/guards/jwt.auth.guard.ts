import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { RequestContext } from '@src/lib/context/request';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    if (this.isPublicRoute(context)) return true;

    const token = this.extractJwtToken(context);
    if (!token) throw new UnauthorizedException('Token not found in request');

    return <boolean>super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any): any {
    if (err || !user || info) {
      throw new UnauthorizedException(this.getErrorMessage(info));
    }

    const async = RequestContext.get();
    async.currentUser = user;

    return user;
  }

  private isPublicRoute(context: ExecutionContext): boolean {
    return this.reflector.get<boolean>('isPublic', context.getHandler());
  }

  private extractJwtToken(context: ExecutionContext): string | null {
    const request = context.switchToHttp().getRequest();
    return request.headers.authorization;
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
