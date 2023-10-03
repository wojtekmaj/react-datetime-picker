import { beforeEach, describe, expect, it, vi } from 'vitest';
import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DateTimeInput from './DateTimeInput.js';

import { muteConsole, restoreConsole } from '../../../test-utils.js';

vi.useFakeTimers();

const hasFullICU = (() => {
  try {
    const date = new Date(2018, 0, 1, 21);
    const formatter = new Intl.DateTimeFormat('de-DE', { hour: 'numeric' });
    return formatter.format(date).includes('21');
  } catch (err) {
    return false;
  }
})();

const itIfFullICU = hasFullICU ? it : it.skip;

describe('DateTimeInput', () => {
  const defaultProps = {
    className: 'react-datetime-picker__inputGroup',
  };

  let user: ReturnType<typeof userEvent.setup>;
  beforeEach(() => {
    user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime.bind(vi),
    });
  });

  it('renders a native input and custom inputs', () => {
    const { container } = render(<DateTimeInput {...defaultProps} />);

    const nativeInput = container.querySelector('input[type="datetime-local"]');
    const customInputs = container.querySelectorAll('input[data-input]');

    expect(nativeInput).toBeInTheDocument();
    expect(customInputs).toHaveLength(5);
  });

  it('does not render second input when maxDetail is "minute" or less', () => {
    const { container } = render(<DateTimeInput {...defaultProps} maxDetail="minute" />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const dayInput = container.querySelector('input[name="day"]');
    const monthInput = container.querySelector('input[name="month"]');
    const yearInput = container.querySelector('input[name="year"]');
    const secondInput = container.querySelector('input[name="second"]');
    const minuteInput = container.querySelector('input[name="minute"]');
    const hourInput = container.querySelector('input[name^="hour"]');

    expect(customInputs).toHaveLength(5);

    expect(yearInput).toBeInTheDocument();
    expect(monthInput).toBeInTheDocument();
    expect(dayInput).toBeInTheDocument();
    expect(hourInput).toBeInTheDocument();
    expect(minuteInput).toBeInTheDocument();
    expect(secondInput).toBeFalsy();
  });

  it('does not render second and minute inputs when maxDetail is "hour" or less', () => {
    const { container } = render(<DateTimeInput {...defaultProps} maxDetail="hour" />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const dayInput = container.querySelector('input[name="day"]');
    const monthInput = container.querySelector('input[name="month"]');
    const yearInput = container.querySelector('input[name="year"]');
    const secondInput = container.querySelector('input[name="second"]');
    const minuteInput = container.querySelector('input[name="minute"]');
    const hourInput = container.querySelector('input[name^="hour"]');

    expect(customInputs).toHaveLength(4);

    expect(yearInput).toBeInTheDocument();
    expect(monthInput).toBeInTheDocument();
    expect(dayInput).toBeInTheDocument();
    expect(hourInput).toBeInTheDocument();
    expect(minuteInput).toBeFalsy();
    expect(secondInput).toBeFalsy();
  });

  it('shows a given date in all inputs correctly given Date (12-hour format)', () => {
    const date = new Date(2017, 8, 30, 22, 17, 3);

    const { container } = render(
      <DateTimeInput {...defaultProps} maxDetail="second" value={date} />,
    );

    const nativeInput = container.querySelector('input[type="datetime-local"]');
    const customInputs = container.querySelectorAll('input[data-input]');

    expect(nativeInput).toHaveValue('2017-09-30T22:17:03');
    expect(customInputs[0]).toHaveValue(9);
    expect(customInputs[1]).toHaveValue(30);
    expect(customInputs[2]).toHaveValue(2017);
    expect(customInputs[3]).toHaveValue(10);
    expect(customInputs[4]).toHaveValue(17);
    expect(customInputs[5]).toHaveValue(3);
  });

  it('shows a given date in all inputs correctly given ISO string (12-hour format)', () => {
    const date = '2017-09-30T22:17:03';

    const { container } = render(
      <DateTimeInput {...defaultProps} maxDetail="second" value={date} />,
    );

    const nativeInput = container.querySelector('input[type="datetime-local"]');
    const customInputs = container.querySelectorAll('input[data-input]');

    expect(nativeInput).toHaveValue('2017-09-30T22:17:03');
    expect(customInputs[0]).toHaveValue(9);
    expect(customInputs[1]).toHaveValue(30);
    expect(customInputs[2]).toHaveValue(2017);
    expect(customInputs[3]).toHaveValue(10);
    expect(customInputs[4]).toHaveValue(17);
    expect(customInputs[5]).toHaveValue(3);
  });

  itIfFullICU('shows a given date in all inputs correctly given Date (24-hour format)', () => {
    const date = new Date(2017, 8, 30, 22, 17, 3);

    const { container } = render(
      <DateTimeInput {...defaultProps} locale="de-DE" maxDetail="second" value={date} />,
    );

    const nativeInput = container.querySelector('input[type="datetime-local"]');
    const customInputs = container.querySelectorAll('input[data-input]');

    expect(nativeInput).toHaveValue('2017-09-30T22:17:03');
    expect(customInputs[0]).toHaveValue(30);
    expect(customInputs[1]).toHaveValue(9);
    expect(customInputs[2]).toHaveValue(2017);
    expect(customInputs[3]).toHaveValue(22);
    expect(customInputs[4]).toHaveValue(17);
    expect(customInputs[5]).toHaveValue(3);
  });

  itIfFullICU(
    'shows a given date in all inputs correctly given ISO string (24-hour format)',
    () => {
      const date = '2017-09-30T22:17:03';

      const { container } = render(
        <DateTimeInput {...defaultProps} locale="de-DE" maxDetail="second" value={date} />,
      );

      const nativeInput = container.querySelector('input[type="datetime-local"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(nativeInput).toHaveValue('2017-09-30T22:17:03');
      expect(customInputs[0]).toHaveValue(30);
      expect(customInputs[1]).toHaveValue(9);
      expect(customInputs[2]).toHaveValue(2017);
      expect(customInputs[3]).toHaveValue(22);
      expect(customInputs[4]).toHaveValue(17);
      expect(customInputs[5]).toHaveValue(3);
    },
  );

  it('shows empty value in all inputs correctly given null', () => {
    const { container } = render(
      <DateTimeInput {...defaultProps} maxDetail="second" value={null} />,
    );

    const nativeInput = container.querySelector('input[type="datetime-local"]');
    const customInputs = container.querySelectorAll('input[data-input]');

    expect(nativeInput).toHaveAttribute('value', '');
    expect(customInputs[0]).toHaveAttribute('value', '');
    expect(customInputs[1]).toHaveAttribute('value', '');
    expect(customInputs[2]).toHaveAttribute('value', '');
    expect(customInputs[3]).toHaveAttribute('value', '');
    expect(customInputs[4]).toHaveAttribute('value', '');
    expect(customInputs[5]).toHaveAttribute('value', '');
  });

  it('clears the value correctly', () => {
    const date = new Date(2017, 8, 30, 22, 17, 3);

    const { container, rerender } = render(
      <DateTimeInput {...defaultProps} maxDetail="second" value={date} />,
    );

    rerender(<DateTimeInput {...defaultProps} maxDetail="second" value={null} />);

    const nativeInput = container.querySelector('input[type="datetime-local"]');
    const customInputs = container.querySelectorAll('input[data-input]');

    expect(nativeInput).toHaveAttribute('value', '');
    expect(customInputs[0]).toHaveAttribute('value', '');
    expect(customInputs[1]).toHaveAttribute('value', '');
    expect(customInputs[2]).toHaveAttribute('value', '');
    expect(customInputs[3]).toHaveAttribute('value', '');
    expect(customInputs[4]).toHaveAttribute('value', '');
    expect(customInputs[5]).toHaveAttribute('value', '');
  });

  it('renders custom inputs in a proper order (12-hour format)', () => {
    const { container } = render(<DateTimeInput {...defaultProps} maxDetail="second" />);

    const customInputs = container.querySelectorAll('input[data-input]');

    expect(customInputs[0]).toHaveAttribute('name', 'month');
    expect(customInputs[1]).toHaveAttribute('name', 'day');
    expect(customInputs[2]).toHaveAttribute('name', 'year');
    expect(customInputs[3]).toHaveAttribute('name', 'hour12');
    expect(customInputs[4]).toHaveAttribute('name', 'minute');
    expect(customInputs[5]).toHaveAttribute('name', 'second');
  });

  itIfFullICU('renders custom inputs in a proper order (24-hour format)', () => {
    const { container } = render(
      <DateTimeInput {...defaultProps} locale="de-DE" maxDetail="second" />,
    );

    const customInputs = container.querySelectorAll('input[data-input]');

    expect(customInputs[0]).toHaveAttribute('name', 'day');
    expect(customInputs[1]).toHaveAttribute('name', 'month');
    expect(customInputs[2]).toHaveAttribute('name', 'year');
    expect(customInputs[3]).toHaveAttribute('name', 'hour24');
    expect(customInputs[4]).toHaveAttribute('name', 'minute');
    expect(customInputs[5]).toHaveAttribute('name', 'second');
  });

  describe('renders custom inputs in a proper order given format', () => {
    it('renders "y" properly', () => {
      const { container } = render(<DateTimeInput {...defaultProps} format="y" />);

      const componentInput = container.querySelector('input[name="year"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "yyyy" properly', () => {
      const { container } = render(<DateTimeInput {...defaultProps} format="yyyy" />);

      const componentInput = container.querySelector('input[name="year"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "M" properly', () => {
      const { container } = render(<DateTimeInput {...defaultProps} format="M" />);

      const componentInput = container.querySelector('input[name="month"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "MM" properly', () => {
      const { container } = render(<DateTimeInput {...defaultProps} format="MM" />);

      const componentInput = container.querySelector('input[name="month"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "MMM" properly', () => {
      const { container } = render(<DateTimeInput {...defaultProps} format="MMM" />);

      const componentSelect = container.querySelector('select[name="month"]');
      const customInputs = container.querySelectorAll('select');

      expect(componentSelect).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "MMMM" properly', () => {
      const { container } = render(<DateTimeInput {...defaultProps} format="MMMM" />);

      const componentSelect = container.querySelector('select[name="month"]');
      const customInputs = container.querySelectorAll('select');

      expect(componentSelect).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "d" properly', () => {
      const { container } = render(<DateTimeInput {...defaultProps} format="d" />);

      const componentInput = container.querySelector('input[name="day"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "dd" properly', () => {
      const { container } = render(<DateTimeInput {...defaultProps} format="dd" />);

      const componentInput = container.querySelector('input[name="day"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('throws error for "ddd"', () => {
      muteConsole();

      const renderComponent = () => render(<DateTimeInput {...defaultProps} format="ddd" />);

      expect(renderComponent).toThrow('Unsupported token: ddd');

      restoreConsole();
    });

    it('renders "yyyy-MM-dd" properly', () => {
      const { container } = render(<DateTimeInput {...defaultProps} format="yyyy-MM-d" />);

      const monthInput = container.querySelector('input[name="month"]');
      const dayInput = container.querySelector('input[name="day"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(monthInput).toBeInTheDocument();
      expect(dayInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(3);
      expect(customInputs[0]).toHaveAttribute('name', 'year');
      expect(customInputs[1]).toHaveAttribute('name', 'month');
      expect(customInputs[2]).toHaveAttribute('name', 'day');
    });

    it('renders "h" properly', () => {
      const { container } = render(<DateTimeInput {...defaultProps} format="h" />);

      const componentInput = container.querySelector('input[name="hour12"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "hh" properly', () => {
      const { container } = render(<DateTimeInput {...defaultProps} format="hh" />);

      const componentInput = container.querySelector('input[name="hour12"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('throws error for "hhh"', () => {
      muteConsole();

      const renderComponent = () => render(<DateTimeInput {...defaultProps} format="hhh" />);

      expect(renderComponent).toThrow('Unsupported token: hhh');

      restoreConsole();
    });

    it('renders "H" properly', () => {
      const { container } = render(<DateTimeInput {...defaultProps} format="H" />);

      const componentInput = container.querySelector('input[name="hour24"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "HH" properly', () => {
      const { container } = render(<DateTimeInput {...defaultProps} format="HH" />);

      const componentInput = container.querySelector('input[name="hour24"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('throws error for "HHH"', () => {
      muteConsole();

      const renderComponent = () => render(<DateTimeInput {...defaultProps} format="HHH" />);

      expect(renderComponent).toThrow('Unsupported token: HHH');

      restoreConsole();
    });

    it('renders "m" properly', () => {
      const { container } = render(<DateTimeInput {...defaultProps} format="m" />);

      const componentInput = container.querySelector('input[name="minute"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "mm" properly', () => {
      const { container } = render(<DateTimeInput {...defaultProps} format="mm" />);

      const componentInput = container.querySelector('input[name="minute"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('throws error for "mmm"', () => {
      muteConsole();

      const renderComponent = () => render(<DateTimeInput {...defaultProps} format="mmm" />);

      expect(renderComponent).toThrow('Unsupported token: mmm');

      restoreConsole();
    });

    it('renders "s" properly', () => {
      const { container } = render(<DateTimeInput {...defaultProps} format="s" />);

      const componentInput = container.querySelector('input[name="second"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "ss" properly', () => {
      const { container } = render(<DateTimeInput {...defaultProps} format="ss" />);

      const componentInput = container.querySelector('input[name="second"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('throws error for "sss"', () => {
      muteConsole();

      const renderComponent = () => render(<DateTimeInput {...defaultProps} format="sss" />);

      expect(renderComponent).toThrow('Unsupported token: sss');

      restoreConsole();
    });

    it('renders "a" properly', () => {
      const { container } = render(<DateTimeInput {...defaultProps} format="a" />);

      const componentSelect = container.querySelector('select[name="amPm"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentSelect).toBeInTheDocument();
      expect(customInputs).toHaveLength(0);
    });
  });

  it('renders proper input separators', () => {
    const { container } = render(<DateTimeInput {...defaultProps} />);

    const separators = container.querySelectorAll('.react-datetime-picker__inputGroup__divider');

    expect(separators).toHaveLength(5);
    expect(separators[0]).toHaveTextContent('/');
    expect(separators[1]).toHaveTextContent('/');
    expect(separators[2]).toHaveTextContent(''); // Non-breaking space
    expect(separators[3]).toHaveTextContent(':');
    expect(separators[4]).toHaveTextContent(''); // Non-breaking space
  });

  it('renders proper amount of separators', () => {
    const { container } = render(<DateTimeInput {...defaultProps} maxDetail="hour" />);

    const separators = container.querySelectorAll('.react-datetime-picker__inputGroup__divider');
    const customInputs = container.querySelectorAll('input[data-input]');
    const ampm = container.querySelectorAll('select');

    expect(separators).toHaveLength(customInputs.length + ampm.length - 1);
  });

  it('jumps to the next field when right arrow is pressed', async () => {
    const { container } = render(<DateTimeInput {...defaultProps} />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const monthInput = customInputs[0] as HTMLInputElement;
    const dayInput = customInputs[1];

    await user.type(monthInput, '{arrowright}');

    expect(dayInput).toHaveFocus();
  });

  it('jumps to the next field when date separator key is pressed', async () => {
    const { container } = render(<DateTimeInput {...defaultProps} />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const monthInput = customInputs[0] as HTMLInputElement;
    const dayInput = customInputs[1];

    const separators = container.querySelectorAll('.react-datetime-picker__inputGroup__divider');
    const separatorsTexts = Array.from(separators)
      .map((el) => el.textContent as string)
      .filter((el) => el.trim());
    const separatorKey = separatorsTexts[0] as string;

    await user.type(monthInput, separatorKey);

    expect(dayInput).toHaveFocus();
  });

  it('jumps to the next field when time separator key is pressed', async () => {
    const { container } = render(<DateTimeInput {...defaultProps} />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const monthInput = customInputs[0] as HTMLInputElement;
    const dayInput = customInputs[1];

    const separators = container.querySelectorAll('.react-datetime-picker__inputGroup__divider');
    const separatorsTexts = Array.from(separators)
      .map((el) => el.textContent as string)
      .filter((el) => el.trim());
    const separatorKey = separatorsTexts[separatorsTexts.length - 1] as string;

    await user.type(monthInput, separatorKey);

    expect(dayInput).toHaveFocus();
  });

  it('does not jump to the next field when right arrow is pressed when the last input is focused', async () => {
    const { container } = render(<DateTimeInput {...defaultProps} />);

    const select = container.querySelector('select') as HTMLSelectElement;

    await user.type(select, '{arrowright}');

    expect(select).toHaveFocus();
  });

  it('jumps to the previous field when left arrow is pressed', async () => {
    const { container } = render(<DateTimeInput {...defaultProps} />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const monthInput = customInputs[0];
    const dayInput = customInputs[1] as HTMLInputElement;

    await user.type(dayInput, '{arrowleft}');

    expect(monthInput).toHaveFocus();
  });

  it('does not jump to the previous field when left arrow is pressed when the first input is focused', async () => {
    const { container } = render(<DateTimeInput {...defaultProps} />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const monthInput = customInputs[0] as HTMLInputElement;

    await user.type(monthInput, '{arrowleft}');

    expect(monthInput).toHaveFocus();
  });

  it("jumps to the next field when a value which can't be extended to another valid value is entered", async () => {
    const { container } = render(<DateTimeInput {...defaultProps} />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const monthInput = customInputs[0] as HTMLInputElement;
    const dayInput = customInputs[1];

    await user.type(monthInput, '4');

    expect(dayInput).toHaveFocus();
  });

  it('jumps to the next field when a value as long as the length of maximum value is entered', async () => {
    const { container } = render(<DateTimeInput {...defaultProps} />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const monthInput = customInputs[0] as HTMLInputElement;
    const dayInput = customInputs[1];

    await user.type(monthInput, '03');

    expect(dayInput).toHaveFocus();
  });

  it("jumps to the next field when a value which can't be extended to another valid value is entered by typing with multiple keys", async () => {
    function getActiveElement() {
      return document.activeElement as HTMLInputElement;
    }

    function keyDown(key: string, initial = false) {
      const element = getActiveElement();
      fireEvent.keyDown(element, { key });
      fireEvent.keyPress(element, { key });
      element.value = (initial ? '' : element.value) + key;
    }

    function keyUp(key: string) {
      fireEvent.keyUp(getActiveElement(), { key });
    }

    const date = new Date(2023, 3, 1);

    const { container } = render(<DateTimeInput {...defaultProps} locale="de-DE" value={date} />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const dayInput = customInputs[0] as HTMLInputElement;
    const monthInput = customInputs[1];

    dayInput.focus();
    expect(dayInput).toHaveFocus();

    keyDown('1', true);
    keyDown('2');

    keyUp('1');
    expect(dayInput).toHaveFocus();

    keyUp('2');
    expect(monthInput).toHaveFocus();
  });

  it('does not jump the next field when a value which can be extended to another valid value is entered', async () => {
    const { container } = render(<DateTimeInput {...defaultProps} />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const monthInput = customInputs[0] as HTMLInputElement;

    await user.type(monthInput, '1');

    expect(monthInput).toHaveFocus();
  });

  it('triggers onChange correctly when changed custom input', () => {
    const onChange = vi.fn();
    const date = new Date(2017, 8, 30, 22, 17, 0);

    const { container } = render(
      <DateTimeInput {...defaultProps} onChange={onChange} value={date} />,
    );

    const customInputs = container.querySelectorAll('input[data-input]');
    const hourInput = customInputs[3] as HTMLInputElement;

    fireEvent.change(hourInput, { target: { value: '8' } });

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(new Date(2017, 8, 30, 20, 17, 0), false);
  });

  it('triggers onChange correctly when changed custom input with year < 100', () => {
    const onChange = vi.fn();
    const date = new Date();
    date.setFullYear(19, 8, 30);
    date.setHours(22, 17, 0, 0);

    const { container } = render(
      <DateTimeInput {...defaultProps} onChange={onChange} value={date} />,
    );

    const customInputs = container.querySelectorAll('input[data-input]');
    const hourInput = customInputs[3] as HTMLInputElement;

    fireEvent.change(hourInput, { target: { value: '8' } });

    const nextDate = new Date();
    nextDate.setFullYear(19, 8, 30);
    nextDate.setHours(20, 17, 0, 0);

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(nextDate, false);
  });

  it('triggers onChange correctly when changed custom input with no year', () => {
    const onChange = vi.fn();
    const date = new Date(2017, 8, 30, 22, 17, 0);

    const { container } = render(
      <DateTimeInput {...defaultProps} format="dd.MM HH:mm" onChange={onChange} value={date} />,
    );

    const customInputs = container.querySelectorAll('input[data-input]');
    const hourInput = customInputs[2] as HTMLInputElement;

    fireEvent.change(hourInput, { target: { value: '20' } });

    const currentYear = new Date().getFullYear();

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(new Date(currentYear, 8, 30, 20, 17, 0), false);
  });

  it('triggers onChange correctly when cleared custom inputs', () => {
    const onChange = vi.fn();
    const date = new Date(2017, 8, 30, 22, 17, 3);

    const { container } = render(
      <DateTimeInput {...defaultProps} maxDetail="second" onChange={onChange} value={date} />,
    );

    const customInputs = container.querySelectorAll('input[data-input]');

    customInputs.forEach((customInput) => {
      fireEvent.change(customInput, { target: { value: '' } });
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(null, false);
  });

  it('triggers onChange correctly when changed native input', () => {
    const onChange = vi.fn();
    const date = new Date(2017, 8, 30, 22, 17, 3);

    const { container } = render(
      <DateTimeInput {...defaultProps} onChange={onChange} value={date} />,
    );

    const nativeInput = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

    fireEvent.change(nativeInput, { target: { value: '2017-09-30T20:17:03' } });

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(new Date(2017, 8, 30, 20, 17, 3), false);
  });

  it('triggers onChange correctly when changed native input with year < 100', () => {
    const onChange = vi.fn();
    const date = new Date();
    date.setFullYear(19, 8, 20);
    date.setHours(22, 17, 3, 0);

    const { container } = render(
      <DateTimeInput {...defaultProps} onChange={onChange} value={date} />,
    );

    const nativeInput = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

    fireEvent.change(nativeInput, { target: { value: '0019-09-20T20:17:03' } });

    const nextDate = new Date();
    nextDate.setFullYear(19, 8, 20);
    nextDate.setHours(20, 17, 3, 0);

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(nextDate, false);
  });

  it('triggers onChange correctly when cleared native input', () => {
    const onChange = vi.fn();
    const date = new Date(2017, 8, 30, 22, 17, 3);

    const { container } = render(
      <DateTimeInput {...defaultProps} onChange={onChange} value={date} />,
    );

    const nativeInput = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

    fireEvent.change(nativeInput, { target: { value: '' } });

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(null, false);
  });
});
