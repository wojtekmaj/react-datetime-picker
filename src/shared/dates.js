import { getISOLocalDate } from 'react-calendar/dist/shared/dates';
import { getHoursMinutesSeconds } from 'react-time-picker/dist/shared/dates';

export {
  getYear,
  getMonth,
  getDay,
} from 'react-calendar/dist/shared/dates';

export {
  getHours,
  getMinutes,
  getSeconds,
} from 'react-clock/dist/shared/dates';

export {
  getHoursMinutes,
  convert12to24,
  convert24to12,
} from 'react-time-picker/dist/shared/dates';

export {
  getISOLocalDate,
  getHoursMinutesSeconds,
};

// eslint-disable-next-line import/prefer-default-export
export const getISOLocalDateTime = (value) => {
  if (!value) {
    return value;
  }

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }

  return `${getISOLocalDate(date)}T${getHoursMinutesSeconds(date)}`;
};
