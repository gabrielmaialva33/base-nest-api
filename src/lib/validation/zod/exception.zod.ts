import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ZodError } from './z';

@Injectable()
export class ZodValidationException extends UnprocessableEntityException {
  constructor(private error: ZodError) {
    super({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      message: 'Validation failed',
      errors: error.errors,
    });
  }

  public getZodError() {
    return this.error;
  }
}

export type ZodExceptionCreator = (error: ZodError) => Error;

export const createZodValidationException: ZodExceptionCreator = (error) => {
  return new ZodValidationException(error);
};
