import { describe, expect, it } from 'vitest';
import { between } from './utils.js';

describe('between', () => {
  it('returns value when value is within set boundaries', () => {
    const value = new Date(2017, 6, 1);
    const min = new Date(2017, 0, 1);
    const max = new Date(2017, 11, 1);
    const result = between(value, min, max);

    expect(result).toBe(value);
  });

  it('returns min when value is smaller than min', () => {
    const value = new Date(2017, 0, 1);
    const min = new Date(2017, 6, 1);
    const max = new Date(2017, 11, 1);
    const result = between(value, min, max);

    expect(result).toBe(min);
  });

  it('returns max when value is larger than max', () => {
    const value = new Date(2017, 11, 1);
    const min = new Date(2017, 0, 1);
    const max = new Date(2017, 6, 1);
    const result = between(value, min, max);

    expect(result).toBe(max);
  });

  it('returns value when min and max are not provided', () => {
    const value = new Date(2017, 6, 1);
    const result = between(value, null, undefined);

    expect(result).toBe(value);
  });
});
