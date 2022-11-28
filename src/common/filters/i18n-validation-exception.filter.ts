import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import {
  getI18nContextFromArgumentsHost,
  I18nValidationException,
} from 'nestjs-i18n';
import {
  I18nValidationExceptionFilterDetailedErrorsOption,
  I18nValidationExceptionFilterErrorFormatterOption,
} from 'nestjs-i18n/dist/interfaces/i18n-validation-exception-filter.interface';
import { Either } from 'nestjs-i18n/dist/types/either.type';
import { formatI18nErrors } from 'nestjs-i18n/dist/utils/util';

import { StringUtils } from '@common/helpers';

type I18nValidationExceptionFilterOptions = Either<
  I18nValidationExceptionFilterDetailedErrorsOption,
  I18nValidationExceptionFilterErrorFormatterOption
>;

@Catch(I18nValidationException)
export class I18nValidationExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly options: I18nValidationExceptionFilterOptions = {
      detailedErrors: true,
    },
  ) {}

  catch(exception: I18nValidationException, host: ArgumentsHost) {
    const i18n = getI18nContextFromArgumentsHost(host);

    const i18nErrors = formatI18nErrors(exception.errors ?? [], i18n.service, {
      lang: i18n.lang,
    });

    const response = host.switchToHttp().getResponse();

    const errors: Array<{
      message: string;
      field: string;
      validation: string;
    }> = [];

    for (let i = 0; i < i18nErrors.length; i++)
      for (const key in i18nErrors[i].constraints)
        errors.push({
          message: i18nErrors[i].constraints[key],
          field: i18nErrors[i].property,
          validation: StringUtils.CamelCaseToUnderscore(key),
        });

    response
      .status(this.options.errorHttpStatusCode || exception.getStatus())
      .send({
        status: this.options.errorHttpStatusCode || exception.getStatus(),
        message: i18n.t(`exception.${exception.getResponse()}`),
        errors,
      });
  }
}
