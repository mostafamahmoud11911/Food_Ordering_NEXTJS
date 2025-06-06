import { Languages } from '@/constants/enums';

export type LanguageType = Languages.ARABIC | Languages.ENGLISH

type i18nType = {
  defaultLocale: LanguageType;
  locales: LanguageType[];
};

export const i18n: i18nType = {
  defaultLocale: Languages.ENGLISH,
  locales: [Languages.ENGLISH, Languages.ARABIC],
};

export type Locale = (typeof i18n)['locales'][number];