import {
  formatDate,
  formatTime,
} from '../dateFormatter';

const hasFullICU = (() => {
  try {
    const date = new Date(2018, 0, 1, 21);
    const formatter = new Intl.DateTimeFormat('de-DE', { hour: 'numeric' });
    return formatter.format(date) === '21';
  } catch (err) {
    return false;
  }
})();

const itIfFullICU = hasFullICU ? it : it.skip;

describe('formatDate', () => {
  it('returns proper full numeric date', () => {
    const date = new Date(2017, 1, 1);

    const formattedDate = formatDate(date, 'en-US');

    expect(formattedDate).toBe('2/1/2017');
  });
});

describe('formatTime', () => {
  it('returns proper full time (12-hour format)', () => {
    const date = new Date(2017, 1, 1, 13, 27);

    const formattedTime = formatTime(date, 'en-US');

    expect(formattedTime).toBe('1:27:00 PM');
  });

  itIfFullICU('returns proper full time (24-hour format)', () => {
    const date = new Date(2017, 1, 1, 13, 27);

    const formattedTime = formatTime(date, 'de-DE');

    expect(formattedTime).toBe('13:27:00');
  });
});
