import { getISOLocalDateTime } from '../dates';

describe('getISOLocalDateTime', () => {
  it('returns proper ISO date', () => {
    const date = new Date(2017, 0, 1, 21, 41, 37);

    const ISODate = getISOLocalDateTime(date);

    expect(ISODate).toBe('2017-01-01T21:41:37');
  });

  it('returns nothing when given nothing', () => {
    expect(getISOLocalDateTime()).toBeUndefined();
  });

  it('throws an error when given nonsense data', () => {
    const text = 'wololo';
    const fn = () => {};

    expect(() => getISOLocalDateTime(text)).toThrow();
    expect(() => getISOLocalDateTime(fn)).toThrow();
  });
});
