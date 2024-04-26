import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';

import NativeInput from './NativeInput.js';

describe('NativeInput', () => {
  const defaultProps = {
    onChange: () => {
      // Intentionally empty
    },
    valueType: 'second',
  } satisfies React.ComponentProps<typeof NativeInput>;

  it('renders an input', () => {
    const { container } = render(<NativeInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toBeInTheDocument();
  });

  it('applies given aria-label properly', () => {
    const nativeInputAriaLabel = 'Date';

    const { container } = render(
      <NativeInput {...defaultProps} ariaLabel={nativeInputAriaLabel} />,
    );

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('aria-label', nativeInputAriaLabel);
  });

  it('has proper name defined', () => {
    const name = 'testName';

    const { container } = render(<NativeInput {...defaultProps} name={name} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('name', name);
  });

  // TODO: Investigate why ".000" is added here
  it.each`
    valueType   | parsedValue
    ${'second'} | ${'2017-09-30T22:17:41'}
    ${'minute'} | ${'2017-09-30T22:17'}
    ${'hour'}   | ${'2017-09-30T22:00'}
  `('displays given value properly if valueType is $valueType', ({ valueType, parsedValue }) => {
    const value = new Date(2017, 8, 30, 22, 17, 41);

    const { container } = render(
      <NativeInput {...defaultProps} value={value} valueType={valueType} />,
    );

    const input = container.querySelector('input');

    expect(input).toHaveValue(parsedValue);
  });

  it('does not disable input by default', () => {
    const { container } = render(<NativeInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).not.toBeDisabled();
  });

  it('disables input given disabled flag', () => {
    const { container } = render(<NativeInput {...defaultProps} disabled />);

    const input = container.querySelector('input');

    expect(input).toBeDisabled();
  });

  it('is not required input by default', () => {
    const { container } = render(<NativeInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).not.toBeRequired();
  });

  it('required input given required flag', () => {
    const { container } = render(<NativeInput {...defaultProps} required />);

    const input = container.querySelector('input');

    expect(input).toBeRequired();
  });

  it('has no min by default', () => {
    const { container } = render(<NativeInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).not.toHaveAttribute('min');
  });

  it.each`
    valueType   | parsedMin
    ${'second'} | ${'2017-09-30T22:00:00'}
    ${'minute'} | ${'2017-09-30T22:00'}
    ${'hour'}   | ${'2017-09-30T22:00'}
  `(
    'has proper min for minDate which is a full hour if valueType is $valueType',
    ({ valueType, parsedMin }) => {
      const { container } = render(
        <NativeInput
          {...defaultProps}
          minDate={new Date(2017, 8, 30, 22, 0, 0)}
          valueType={valueType}
        />,
      );

      const input = container.querySelector('input');

      expect(input).toHaveAttribute('min', parsedMin);
    },
  );

  it.each`
    valueType   | parsedMin
    ${'second'} | ${'2017-09-30T22:17:41'}
    ${'minute'} | ${'2017-09-30T22:17'}
    ${'hour'}   | ${'2017-09-30T22:00'}
  `(
    'has proper min for minDate which is not a full hour if valueType is $valueType',
    ({ valueType, parsedMin }) => {
      const { container } = render(
        <NativeInput
          {...defaultProps}
          minDate={new Date(2017, 8, 30, 22, 17, 41)}
          valueType={valueType}
        />,
      );

      const input = container.querySelector('input');

      expect(input).toHaveAttribute('min', parsedMin);
    },
  );

  it('has no max by default', () => {
    const { container } = render(<NativeInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).not.toHaveAttribute('max');
  });

  it.each`
    valueType   | parsedMax
    ${'second'} | ${'2017-09-30T22:00:00'}
    ${'minute'} | ${'2017-09-30T22:00'}
    ${'hour'}   | ${'2017-09-30T22:00'}
  `(
    'has proper max for maxDate which is a full hour if valueType is $valueType',
    ({ valueType, parsedMax }) => {
      const { container } = render(
        <NativeInput
          {...defaultProps}
          maxDate={new Date(2017, 8, 30, 22, 0, 0)}
          valueType={valueType}
        />,
      );

      const input = container.querySelector('input');

      expect(input).toHaveAttribute('max', parsedMax);
    },
  );

  it.each`
    valueType   | parsedMax
    ${'second'} | ${'2017-09-30T22:17:41'}
    ${'minute'} | ${'2017-09-30T22:17'}
    ${'hour'}   | ${'2017-09-30T22:00'}
  `(
    'has proper max for maxDate which is not a full hour if valueType is $valueType',
    ({ valueType, parsedMax }) => {
      const { container } = render(
        <NativeInput
          {...defaultProps}
          maxDate={new Date(2017, 8, 30, 22, 17, 41)}
          valueType={valueType}
        />,
      );

      const input = container.querySelector('input');

      expect(input).toHaveAttribute('max', parsedMax);
    },
  );
});
