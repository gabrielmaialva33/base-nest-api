import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { FastifyReply } from 'fastify';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<FastifyReply>();
    const statusCode = exception.getStatus();

    let message = exception.getResponse() as {
      key: string;
      args: Record<string, any>;
    };

    message = await this.i18n.translate(message.key, {
      lang: host.switchToHttp().getRequest().i18nLang,
      args: message.args,
    });

    response
      .status(statusCode)
      .send({ status: statusCode, message, display: true });
  }
}
