import { AsyncLocalStorage } from 'async_hooks';

import { Logger } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export class RequestContext {
  static als = new AsyncLocalStorage<RequestContext>();
  static logger = new Logger(RequestContext.name);

  static start = <T extends RequestContext>(constructor: new () => T): void => {
    RequestContext.als.enterWith(new constructor());
  };

  static get<T extends RequestContext>(): T {
    return RequestContext.als.getStore() as T;
  }

  public request: FastifyRequest;
  params: any & { id: string };
  body: any;
  query: any;
  currentUser: any;
}
