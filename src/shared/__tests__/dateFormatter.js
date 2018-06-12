import {
  formatDate,
  formatTime,
} from '../dateFormatter';

describe('formatDate', () => {
  it('returns proper full numeric date', () => {
    const date = new Date(2017, 1, 1);

    const formattedDate = formatDate(date, 'en-US');

    expect(formattedDate).toBe('2/1/2017');
  });
});

describe('formatTime', () => {
  it('returns proper full time', () => {
    const date = new Date(2017, 1, 1, 13, 27);

    const formattedTime = formatTime(date, 'en-US');

    expect(formattedTime).toBe('1:27:00 PM');
  });
});
