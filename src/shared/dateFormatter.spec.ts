import { describe, expect, it } from 'vitest';
import { formatDate } from './dateFormatter.js';

describe('formatDate', () => {
  it('returns proper full numeric date', () => {
    const date = new Date(2017, 1, 1);

    const formattedDate = formatDate('en-US', date);

    expect(formattedDate).toBe('2/1/2017');
  });
});
