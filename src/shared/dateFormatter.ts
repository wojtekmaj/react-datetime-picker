import getUserLocale from 'get-user-locale';

const formatterCache = new Map();

export function getFormatter(
  options: Intl.DateTimeFormatOptions,
): (locale: string | undefined, date: Date) => string {
  return function formatter(locale: string | undefined, date: Date): string {
    const localeWithDefault = locale || getUserLocale();

    if (!formatterCache.has(localeWithDefault)) {
      formatterCache.set(localeWithDefault, new Map());
    }

    const formatterCacheLocale = formatterCache.get(localeWithDefault);

    if (!formatterCacheLocale.has(options)) {
      formatterCacheLocale.set(
        options,
        new Intl.DateTimeFormat(localeWithDefault || undefined, options).format,
      );
    }

    return formatterCacheLocale.get(options)(date);
  };
}

const numberFormatterCache = new Map();

export function getNumberFormatter(options: Intl.NumberFormatOptions) {
  return (locale: string | undefined, number: number) => {
    const localeWithDefault = locale || getUserLocale();

    if (!numberFormatterCache.has(localeWithDefault)) {
      numberFormatterCache.set(localeWithDefault, new Map());
    }

    const numberFormatterCacheLocale = numberFormatterCache.get(localeWithDefault);

    if (!numberFormatterCacheLocale.has(options)) {
      numberFormatterCacheLocale.set(
        options,
        new Intl.NumberFormat(localeWithDefault || undefined, options).format,
      );
    }

    return numberFormatterCacheLocale.get(options)(number);
  };
}

const formatDateOptions = {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
} satisfies Intl.DateTimeFormatOptions;

export const formatDate = getFormatter(formatDateOptions);
