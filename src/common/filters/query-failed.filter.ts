import {
  DriverException,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

import { STATUS_CODES } from 'http';
import { FastifyReply } from 'fastify';

@Catch(UniqueConstraintViolationException)
export class QueryFailedFilter implements ExceptionFilter {
  catch(exception: DriverException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<FastifyReply>();

    const status =
      exception.name && exception.name.startsWith('UQ')
        ? HttpStatus.CONFLICT
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).send({
      status: status,
      error: STATUS_CODES[status],
    });
  }
}
