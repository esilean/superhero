/* eslint-disable @typescript-eslint/no-unused-vars */
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import en from 'date-fns/locale/en-IN';

interface ILocales {
  [k: string]: Locale;
}

const locales: ILocales = {
  pt: pt,
  en: en,
};

export const formatDateLocale = (date: Date, locale = 'en') => {
  let formatDate = '';
  switch (locale) {
    case 'pt':
    case 'pt-BR':
      formatDate = "eeee d 'de' MMMM";
      break;
    default:
      formatDate = 'eeee do MMMM';
      break;
  }

  return format(date, formatDate, { locale: locales[locale] });
};

export const getNavigatorLanguage = () => {
  return window.navigator.language || 'en';
};
