import { formatDate } from './dateFormatter';

describe('formatDate', () => {
  it('returns proper full numeric date', () => {
    const date = new Date(2017, 1, 1);

    const formattedDate = formatDate('en-US', date);

    expect(formattedDate).toBe('2/1/2017');
  });
});
