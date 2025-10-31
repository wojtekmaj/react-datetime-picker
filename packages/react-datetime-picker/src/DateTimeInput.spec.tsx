import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';

import DateTimeInput from './DateTimeInput.js';

import { muteConsole, restoreConsole } from '../../../test-utils.js';

vi.useFakeTimers();

const hasFullICU = (() => {
  try {
    const date = new Date(2018, 0, 1, 21);
    const formatter = new Intl.DateTimeFormat('de-DE', { hour: 'numeric' });
    return formatter.format(date).includes('21');
  } catch {
    return false;
  }
})();

const itIfFullICU = it.skipIf(!hasFullICU);

describe('DateTimeInput', () => {
  const defaultProps = {
    className: 'react-datetime-picker__inputGroup',
  };

  it('renders a native input and custom inputs', async () => {
    const { container } = await render(<DateTimeInput {...defaultProps} />);

    const nativeInput = container.querySelector('input[type="datetime-local"]');
    const customInputs = container.querySelectorAll('input[data-input]');

    expect(nativeInput).toBeInTheDocument();
    expect(customInputs).toHaveLength(5);
  });

  it('does not render second input when maxDetail is "minute" or less', async () => {
    const { container } = await render(<DateTimeInput {...defaultProps} maxDetail="minute" />);

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

  it('does not render second and minute inputs when maxDetail is "hour" or less', async () => {
    const { container } = await render(<DateTimeInput {...defaultProps} maxDetail="hour" />);

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

  it('shows a given date in all inputs correctly given Date (12-hour format)', async () => {
    const date = new Date(2017, 8, 30, 22, 17, 3);

    const { container } = await render(
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

  it('shows a given date in all inputs correctly given ISO string (12-hour format)', async () => {
    const date = '2017-09-30T22:17:03';

    const { container } = await render(
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

  itIfFullICU(
    'shows a given date in all inputs correctly given Date (24-hour format)',
    async () => {
      const date = new Date(2017, 8, 30, 22, 17, 3);

      const { container } = await render(
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

  itIfFullICU(
    'shows a given date in all inputs correctly given ISO string (24-hour format)',
    async () => {
      const date = '2017-09-30T22:17:03';

      const { container } = await render(
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

  it('shows empty value in all inputs correctly given null', async () => {
    const { container } = await render(
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

  it('clears the value correctly', async () => {
    const date = new Date(2017, 8, 30, 22, 17, 3);

    const { container, rerender } = await render(
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

  it('renders custom inputs in a proper order (12-hour format)', async () => {
    const { container } = await render(<DateTimeInput {...defaultProps} maxDetail="second" />);

    const customInputs = container.querySelectorAll('input[data-input]');

    expect(customInputs[0]).toHaveAttribute('name', 'month');
    expect(customInputs[1]).toHaveAttribute('name', 'day');
    expect(customInputs[2]).toHaveAttribute('name', 'year');
    expect(customInputs[3]).toHaveAttribute('name', 'hour12');
    expect(customInputs[4]).toHaveAttribute('name', 'minute');
    expect(customInputs[5]).toHaveAttribute('name', 'second');
  });

  itIfFullICU('renders custom inputs in a proper order (24-hour format)', async () => {
    const { container } = await render(
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
    it('renders "y" properly', async () => {
      const { container } = await render(<DateTimeInput {...defaultProps} format="y" />);

      const componentInput = container.querySelector('input[name="year"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "yyyy" properly', async () => {
      const { container } = await render(<DateTimeInput {...defaultProps} format="yyyy" />);

      const componentInput = container.querySelector('input[name="year"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "M" properly', async () => {
      const { container } = await render(<DateTimeInput {...defaultProps} format="M" />);

      const componentInput = container.querySelector('input[name="month"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "MM" properly', async () => {
      const { container } = await render(<DateTimeInput {...defaultProps} format="MM" />);

      const componentInput = container.querySelector('input[name="month"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "MMM" properly', async () => {
      const { container } = await render(<DateTimeInput {...defaultProps} format="MMM" />);

      const componentSelect = container.querySelector('select[name="month"]');
      const customInputs = container.querySelectorAll('select');

      expect(componentSelect).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "MMMM" properly', async () => {
      const { container } = await render(<DateTimeInput {...defaultProps} format="MMMM" />);

      const componentSelect = container.querySelector('select[name="month"]');
      const customInputs = container.querySelectorAll('select');

      expect(componentSelect).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "d" properly', async () => {
      const { container } = await render(<DateTimeInput {...defaultProps} format="d" />);

      const componentInput = container.querySelector('input[name="day"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "dd" properly', async () => {
      const { container } = await render(<DateTimeInput {...defaultProps} format="dd" />);

      const componentInput = container.querySelector('input[name="day"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('throws error for "ddd"', async () => {
      muteConsole();

      const renderComponent = () => render(<DateTimeInput {...defaultProps} format="ddd" />);

      await expect(renderComponent).rejects.toThrowError('Unsupported token: ddd');

      restoreConsole();
    });

    it('renders "yyyy-MM-dd" properly', async () => {
      const { container } = await render(<DateTimeInput {...defaultProps} format="yyyy-MM-d" />);

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

    it('renders "h" properly', async () => {
      const { container } = await render(<DateTimeInput {...defaultProps} format="h" />);

      const componentInput = container.querySelector('input[name="hour12"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "hh" properly', async () => {
      const { container } = await render(<DateTimeInput {...defaultProps} format="hh" />);

      const componentInput = container.querySelector('input[name="hour12"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('throws error for "hhh"', async () => {
      muteConsole();

      const renderComponent = () => render(<DateTimeInput {...defaultProps} format="hhh" />);

      await expect(renderComponent).rejects.toThrowError('Unsupported token: hhh');

      restoreConsole();
    });

    it('renders "H" properly', async () => {
      const { container } = await render(<DateTimeInput {...defaultProps} format="H" />);

      const componentInput = container.querySelector('input[name="hour24"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "HH" properly', async () => {
      const { container } = await render(<DateTimeInput {...defaultProps} format="HH" />);

      const componentInput = container.querySelector('input[name="hour24"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('throws error for "HHH"', async () => {
      muteConsole();

      const renderComponent = () => render(<DateTimeInput {...defaultProps} format="HHH" />);

      await expect(renderComponent).rejects.toThrowError('Unsupported token: HHH');

      restoreConsole();
    });

    it('renders "m" properly', async () => {
      const { container } = await render(<DateTimeInput {...defaultProps} format="m" />);

      const componentInput = container.querySelector('input[name="minute"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "mm" properly', async () => {
      const { container } = await render(<DateTimeInput {...defaultProps} format="mm" />);

      const componentInput = container.querySelector('input[name="minute"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('throws error for "mmm"', async () => {
      muteConsole();

      const renderComponent = () => render(<DateTimeInput {...defaultProps} format="mmm" />);

      await expect(renderComponent).rejects.toThrowError('Unsupported token: mmm');

      restoreConsole();
    });

    it('renders "s" properly', async () => {
      const { container } = await render(<DateTimeInput {...defaultProps} format="s" />);

      const componentInput = container.querySelector('input[name="second"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "ss" properly', async () => {
      const { container } = await render(<DateTimeInput {...defaultProps} format="ss" />);

      const componentInput = container.querySelector('input[name="second"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('throws error for "sss"', async () => {
      muteConsole();

      const renderComponent = () => render(<DateTimeInput {...defaultProps} format="sss" />);

      await expect(renderComponent).rejects.toThrowError('Unsupported token: sss');

      restoreConsole();
    });

    it('renders "a" properly', async () => {
      const { container } = await render(<DateTimeInput {...defaultProps} format="a" />);

      const componentSelect = container.querySelector('select[name="amPm"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentSelect).toBeInTheDocument();
      expect(customInputs).toHaveLength(0);
    });
  });

  it('renders proper input separators', async () => {
    const { container } = await render(<DateTimeInput {...defaultProps} />);

    const separators = container.querySelectorAll('.react-datetime-picker__inputGroup__divider');

    expect(separators).toHaveLength(5);
    expect(separators[0]).toHaveTextContent('/');
    expect(separators[1]).toHaveTextContent('/');
    expect(separators[2]).toHaveTextContent(''); // Non-breaking space
    expect(separators[3]).toHaveTextContent(':');
    expect(separators[4]).toHaveTextContent(''); // Non-breaking space
  });

  it('renders proper amount of separators', async () => {
    const { container } = await render(<DateTimeInput {...defaultProps} maxDetail="hour" />);

    const separators = container.querySelectorAll('.react-datetime-picker__inputGroup__divider');
    const customInputs = container.querySelectorAll('input[data-input]');
    const ampm = container.querySelectorAll('select');

    expect(separators).toHaveLength(customInputs.length + ampm.length - 1);
  });

  it('jumps to the next field when right arrow is pressed', async () => {
    const { container } = await render(<DateTimeInput {...defaultProps} />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const monthInput = customInputs[0] as HTMLInputElement;
    const dayInput = customInputs[1];

    await userEvent.type(monthInput, '{arrowright}');

    expect(dayInput).toHaveFocus();
  });

  it('jumps to the next field when date separator key is pressed', async () => {
    const { container } = await render(<DateTimeInput {...defaultProps} />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const monthInput = customInputs[0] as HTMLInputElement;
    const dayInput = customInputs[1];

    const separators = container.querySelectorAll('.react-datetime-picker__inputGroup__divider');
    const separatorsTexts = Array.from(separators)
      .map((el) => el.textContent as string)
      .filter((el) => el.trim());
    const separatorKey = separatorsTexts[0] as string;

    await userEvent.type(monthInput, separatorKey);

    expect(dayInput).toHaveFocus();
  });

  it('jumps to the next field when time separator key is pressed', async () => {
    const { container } = await render(<DateTimeInput {...defaultProps} />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const monthInput = customInputs[0] as HTMLInputElement;
    const dayInput = customInputs[1];

    const separators = container.querySelectorAll('.react-datetime-picker__inputGroup__divider');
    const separatorsTexts = Array.from(separators)
      .map((el) => el.textContent as string)
      .filter((el) => el.trim());
    const separatorKey = separatorsTexts[separatorsTexts.length - 1] as string;

    await userEvent.type(monthInput, separatorKey);

    expect(dayInput).toHaveFocus();
  });

  it('does not jump to the next field when right arrow is pressed when the last input is focused', async () => {
    const { container } = await render(<DateTimeInput {...defaultProps} />);

    const select = container.querySelector('select') as HTMLSelectElement;

    await userEvent.type(select, '{arrowright}');

    expect(select).toHaveFocus();
  });

  it('jumps to the previous field when left arrow is pressed', async () => {
    const { container } = await render(<DateTimeInput {...defaultProps} />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const monthInput = customInputs[0];
    const dayInput = customInputs[1] as HTMLInputElement;

    await userEvent.type(dayInput, '{arrowleft}');

    expect(monthInput).toHaveFocus();
  });

  it('does not jump to the previous field when left arrow is pressed when the first input is focused', async () => {
    const { container } = await render(<DateTimeInput {...defaultProps} />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const monthInput = customInputs[0] as HTMLInputElement;

    await userEvent.type(monthInput, '{arrowleft}');

    expect(monthInput).toHaveFocus();
  });

  it("jumps to the next field when a value which can't be extended to another valid value is entered", async () => {
    const { container } = await render(<DateTimeInput {...defaultProps} />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const monthInput = customInputs[0] as HTMLInputElement;
    const dayInput = customInputs[1];

    await userEvent.type(monthInput, '4');

    expect(dayInput).toHaveFocus();
  });

  it('jumps to the next field when a value as long as the length of maximum value is entered', async () => {
    const { container } = await render(<DateTimeInput {...defaultProps} />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const monthInput = customInputs[0] as HTMLInputElement;
    const dayInput = customInputs[1];

    await userEvent.type(monthInput, '03');

    expect(dayInput).toHaveFocus();
  });

  function triggerKeyDown(element: HTMLElement, { key }: { key: string }) {
    element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
  }

  function triggerKeyPress(element: HTMLElement, { key }: { key: string }) {
    element.dispatchEvent(new KeyboardEvent('keypress', { key, bubbles: true, cancelable: true }));
  }

  function triggerKeyUp(element: HTMLElement, { key }: { key: string }) {
    element.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true, cancelable: true }));
  }

  it("jumps to the next field when a value which can't be extended to another valid value is entered by typing with multiple keys", async () => {
    function getActiveElement() {
      return document.activeElement as HTMLInputElement;
    }

    function keyDown(key: string, initial = false) {
      const element = getActiveElement();
      triggerKeyDown(element, { key });
      triggerKeyPress(element, { key });
      element.value = (initial ? '' : element.value) + key;
    }

    function keyUp(key: string) {
      triggerKeyUp(getActiveElement(), { key });
    }

    const date = new Date(2023, 3, 1);

    const { container } = await render(
      <DateTimeInput {...defaultProps} locale="de-DE" value={date} />,
    );

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
    const { container } = await render(<DateTimeInput {...defaultProps} />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const monthInput = customInputs[0] as HTMLInputElement;

    await userEvent.type(monthInput, '1');

    expect(monthInput).toHaveFocus();
  });

  it('triggers onChange correctly when changed custom input', async () => {
    const onChange = vi.fn();
    const date = new Date(2017, 8, 30, 22, 17, 0);

    const { container } = await render(
      <DateTimeInput {...defaultProps} onChange={onChange} value={date} />,
    );

    const customInputs = container.querySelectorAll('input[data-input]');
    const hourInput = customInputs[3] as HTMLInputElement;

    await userEvent.fill(hourInput, '8');

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(new Date(2017, 8, 30, 20, 17, 0), false);
  });

  it('triggers onChange correctly when changed custom input with year < 100', async () => {
    const onChange = vi.fn();
    const date = new Date();
    date.setFullYear(19, 8, 30);
    date.setHours(22, 17, 0, 0);

    const { container } = await render(
      <DateTimeInput {...defaultProps} onChange={onChange} value={date} />,
    );

    const customInputs = container.querySelectorAll('input[data-input]');
    const hourInput = customInputs[3] as HTMLInputElement;

    await userEvent.fill(hourInput, '8');

    const nextDate = new Date();
    nextDate.setFullYear(19, 8, 30);
    nextDate.setHours(20, 17, 0, 0);

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(nextDate, false);
  });

  it('triggers onChange correctly when changed custom input with no year', async () => {
    const onChange = vi.fn();
    const date = new Date(2017, 8, 30, 22, 17, 0);

    const { container } = await render(
      <DateTimeInput {...defaultProps} format="dd.MM HH:mm" onChange={onChange} value={date} />,
    );

    const customInputs = container.querySelectorAll('input[data-input]');
    const hourInput = customInputs[2] as HTMLInputElement;

    await userEvent.fill(hourInput, '20');

    const currentYear = new Date().getFullYear();

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(new Date(currentYear, 8, 30, 20, 17, 0), false);
  });

  it('triggers onChange correctly when cleared custom inputs', async () => {
    const onChange = vi.fn();
    const date = new Date(2017, 8, 30, 22, 17, 3);

    const { container } = await render(
      <DateTimeInput {...defaultProps} maxDetail="second" onChange={onChange} value={date} />,
    );

    const customInputs = Array.from(container.querySelectorAll('input[data-input]'));

    for (const customInput of customInputs) {
      await userEvent.clear(customInput);
    }

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(null, false);
  });

  function setNativeValue(element: HTMLInputElement, value: string) {
    const prototype = Object.getPrototypeOf(element);
    const propertyDescriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
    const prototypeValueSetter = propertyDescriptor?.set;

    if (prototypeValueSetter) {
      prototypeValueSetter.call(element, value);
    }
  }

  function triggerChange(element: HTMLInputElement, value: string) {
    setNativeValue(element, value);
    element.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
  }

  it('triggers onChange correctly when changed native input', async () => {
    const onChange = vi.fn();
    const date = new Date(2017, 8, 30, 22, 17, 3);

    const { container } = await render(
      <DateTimeInput {...defaultProps} onChange={onChange} value={date} />,
    );

    const nativeInput = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

    triggerChange(nativeInput, '2017-09-30T20:17:03');

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(new Date(2017, 8, 30, 20, 17, 3), false);
  });

  it('triggers onChange correctly when changed native input with year < 100', async () => {
    const onChange = vi.fn();
    const date = new Date();
    date.setFullYear(19, 8, 20);
    date.setHours(22, 17, 3, 0);

    const { container } = await render(
      <DateTimeInput {...defaultProps} onChange={onChange} value={date} />,
    );

    const nativeInput = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

    triggerChange(nativeInput, '0019-09-20T20:17:03');

    const nextDate = new Date();
    nextDate.setFullYear(19, 8, 20);
    nextDate.setHours(20, 17, 3, 0);

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(nextDate, false);
  });

  it('triggers onChange correctly when cleared native input', async () => {
    const onChange = vi.fn();
    const date = new Date(2017, 8, 30, 22, 17, 3);

    const { container } = await render(
      <DateTimeInput {...defaultProps} onChange={onChange} value={date} />,
    );

    const nativeInput = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;

    triggerChange(nativeInput, '');

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(null, false);
  });
});
