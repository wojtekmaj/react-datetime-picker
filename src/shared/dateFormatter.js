import getUserLocale from 'get-user-locale';

export function getFormatter(options) {
  return (locale, date) => date.toLocaleString(locale || getUserLocale(), options);
}

const formatDateOptions = { day: 'numeric', month: 'numeric', year: 'numeric' };

export const formatDate = getFormatter(formatDateOptions);
