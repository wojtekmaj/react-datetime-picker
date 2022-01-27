import getUserLocale from 'get-user-locale';

const formatterCache = new Map();

export function getFormatter(options) {
  return (locale, date) => {
    const localeWithDefault = locale || getUserLocale();

    if (!formatterCache.has(localeWithDefault)) {
      formatterCache.set(localeWithDefault, new Map());
    }

    const formatterCacheLocale = formatterCache.get(localeWithDefault);

    if (!formatterCacheLocale.has(options)) {
      formatterCacheLocale.set(options, new Intl.DateTimeFormat(localeWithDefault, options).format);
    }

    return formatterCacheLocale.get(options)(date);
  };
}

const numberFormatterCache = new Map();

export function getNumberFormatter(options) {
  return (locale, date) => {
    const localeWithDefault = locale || getUserLocale();

    if (!numberFormatterCache.has(localeWithDefault)) {
      numberFormatterCache.set(localeWithDefault, new Map());
    }

    const numberFormatterCacheLocale = numberFormatterCache.get(localeWithDefault);

    if (!numberFormatterCacheLocale.has(options)) {
      numberFormatterCacheLocale.set(
        options,
        new Intl.NumberFormat(localeWithDefault, options).format,
      );
    }

    return numberFormatterCacheLocale.get(options)(date);
  };
}

const formatDateOptions = { day: 'numeric', month: 'numeric', year: 'numeric' };

export const formatDate = getFormatter(formatDateOptions);
