import { getFormatter } from './dateFormatter.js';

/**
 * Returns a value no smaller than min and no larger than max.
 *
 * @param {Date} value Value to return.
 * @param {Date} min Minimum return value.
 * @param {Date} max Maximum return value.
 * @returns {Date} Value between min and max.
 */
export function between<T extends Date>(value: T, min?: T | null, max?: T | null): T {
  if (min && min > value) {
    return min;
  }

  if (max && max < value) {
    return max;
  }

  return value;
}

const nines = ['9', '٩'];
const ninesRegExp = new RegExp(`[${nines.join('')}]`);
const amPmFormatter = getFormatter({ hour: 'numeric' });

export function getAmPmLabels(locale: string | undefined): [string, string] {
  const amString = amPmFormatter(locale, new Date(2017, 0, 1, 9));
  const pmString = amPmFormatter(locale, new Date(2017, 0, 1, 21));

  const [am1, am2] = amString.split(ninesRegExp) as [string, string];
  const [pm1, pm2] = pmString.split(ninesRegExp) as [string, string];

  if (pm2 !== undefined) {
    // If pm2 is undefined, nine was not found in pmString - this locale is not using 12-hour time
    if (am1 !== pm1) {
      return [am1, pm1].map((el) => el.trim()) as [string, string];
    }

    if (am2 !== pm2) {
      return [am2, pm2].map((el) => el.trim()) as [string, string];
    }
  }

  // Fallback
  return ['AM', 'PM'];
}
