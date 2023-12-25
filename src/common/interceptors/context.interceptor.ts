import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { FastifyRequest } from 'fastify';

import { JwtService } from '@nestjs/jwt';
import { RequestContext } from '@src/lib/context/request';

@Injectable()
export class ContextInterceptor implements NestInterceptor {
  constructor(private readonly _jwtService: JwtService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();

    const async = RequestContext.get();
    async.request = ctx.getRequest<FastifyRequest>();
    async.params = ctx.getRequest<FastifyRequest>().params;
    async.body = ctx.getRequest<FastifyRequest>().body;
    async.query = ctx.getRequest<FastifyRequest>().query;

    return next.handle();
  }
}
