import {
  callIfDefined,
} from './utils';

describe('callIfDefined', () => {
  it('calls given function if defined', () => {
    const fn = jest.fn();
    const arg1 = 'hi';
    const arg2 = 'hello';

    callIfDefined(fn, arg1, arg2);

    expect(fn).toHaveBeenCalledWith(arg1, arg2);
  });
});
