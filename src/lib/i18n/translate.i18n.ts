import type { Path, TranslateOptions } from 'nestjs-i18n';
import { I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from '@src/generated/i18n/i18n.types';
export function translate(
  key: Path<I18nTranslations>,
  options: TranslateOptions = {},
) {
  const i18nContext = I18nContext.current<I18nTranslations>();

  if (i18nContext) return i18nContext.t(key, options);

  // Handle the case when i18nContext is undefined
  return ''; // or throw an error, return a default value, etc.
}
