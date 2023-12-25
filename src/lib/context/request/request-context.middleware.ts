import {
  Inject,
  Injectable,
  Logger,
  NestMiddleware,
  OnModuleInit,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { RequestContext } from './request-context.model';
import { REQUEST_CONTEXT_MODULE_OPTIONS } from './request-context.constants';
import { RequestContextModuleOptions } from './request-context.module';

@Injectable()
export class RequestContextMiddleware<T extends RequestContext>
  implements NestMiddleware<FastifyRequest, FastifyReply>, OnModuleInit
{
  constructor(
    @Inject(REQUEST_CONTEXT_MODULE_OPTIONS)
    private readonly options: RequestContextModuleOptions<T>,
  ) {}

  use(req: FastifyRequest, res: FastifyReply, next: () => void): void {
    middleware(this.options.contextClass, req, res, next);
  }

  onModuleInit(): void {
    Logger.log(
      `Context Initialized with contextClass: ${this.options.contextClass.name}`,
      'ContextMiddleware',
    );
  }
}

export function requestContextMiddleware<T extends RequestContext>(
  contextClass: new () => T,
): (req: FastifyRequest, res: FastifyReply, next: () => void) => void {
  return (req: FastifyRequest, res: FastifyReply, next: () => void): void => {
    middleware(contextClass, req, res, next);
  };
}

function middleware<T extends RequestContext>(
  contextClass: new () => T,
  req: FastifyRequest,
  res: FastifyReply,
  next: () => void,
): void {
  RequestContext.start(contextClass);
  next();
}
