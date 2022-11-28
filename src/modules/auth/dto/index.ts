import { IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class SignInDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  uid: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  password: string;
}
