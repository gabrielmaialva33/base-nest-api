import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const errors = exception.getResponse() as Record<string, any>;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const status = exception.getStatus();

    response.status(status).send({
      statusCode: status,
      message: 'Validation failed',
      errors,
    });
  }
}
