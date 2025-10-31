import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { act } from 'react-dom/test-utils';

import DateTimePicker from './DateTimePicker.js';

import type { Locator } from 'vitest/browser';

async function waitForElementToBeRemovedOrHidden(callback: () => HTMLElement | null) {
  const element = callback();

  if (element) {
    await vi.waitFor(() =>
      expect(element).toHaveAttribute('class', expect.stringContaining('--closed')),
    );
  }
}

describe('DateTimePicker', () => {
  const defaultProps = {
    amPmAriaLabel: 'amPm',
    dayAriaLabel: 'day',
    hourAriaLabel: 'hour',
    minuteAriaLabel: 'minute',
    monthAriaLabel: 'month',
    secondAriaLabel: 'second',
    yearAriaLabel: 'year',
  };

  it('passes default name to DateTimeInput', async () => {
    const { container } = await render(<DateTimePicker {...defaultProps} />);

    const nativeInput = container.querySelector('input[type="datetime-local"]');

    expect(nativeInput).toHaveAttribute('name', 'datetime');
  });

  it('passes custom name to DateTimeInput', async () => {
    const name = 'testName';

    const { container } = await render(<DateTimePicker {...defaultProps} name={name} />);

    const nativeInput = container.querySelector('input[type="datetime-local"]');

    expect(nativeInput).toHaveAttribute('name', name);
  });

  it('passes autoFocus flag to DateTimeInput', async () => {
    await render(<DateTimePicker {...defaultProps} autoFocus />);

    const customInputs = page.getByRole('spinbutton');

    expect(customInputs.nth(0)).toHaveFocus();
  });

  it('passes disabled flag to DateTimeInput', async () => {
    const { container } = await render(<DateTimePicker {...defaultProps} disabled />);

    const nativeInput = container.querySelector('input[type="datetime-local"]');

    expect(nativeInput).toBeDisabled();
  });

  it('passes format to DateTimeInput', async () => {
    await render(<DateTimePicker {...defaultProps} format="ss" />);

    const customInputs = page.getByRole('spinbutton');

    expect(customInputs).toHaveLength(1);
    expect(customInputs.nth(0)).toHaveAttribute('name', 'second');
  });

  it('passes aria-label props to DateInput', async () => {
    const ariaLabelProps = {
      amPmAriaLabel: 'Select AM/PM',
      calendarAriaLabel: 'Toggle calendar',
      clearAriaLabel: 'Clear value',
      dayAriaLabel: 'Day',
      hourAriaLabel: 'Hour',
      minuteAriaLabel: 'Minute',
      monthAriaLabel: 'Month',
      nativeInputAriaLabel: 'Date and time',
      secondAriaLabel: 'Second',
      yearAriaLabel: 'Year',
    };

    const { container } = await render(<DateTimePicker {...ariaLabelProps} maxDetail="second" />);

    const calendarButton = page.getByTestId('calendar-button');
    const clearButton = page.getByTestId('clear-button');

    const nativeInput = container.querySelector('input[type="datetime-local"]');
    const dayInput = container.querySelector('input[name="day"]');
    const monthInput = container.querySelector('input[name="month"]');
    const yearInput = container.querySelector('input[name="year"]');
    const hourInput = container.querySelector('input[name="hour12"]');
    const minuteInput = container.querySelector('input[name="minute"]');
    const secondInput = container.querySelector('input[name="second"]');

    expect(calendarButton).toHaveAttribute('aria-label', ariaLabelProps.calendarAriaLabel);
    expect(clearButton).toHaveAttribute('aria-label', ariaLabelProps.clearAriaLabel);

    expect(nativeInput).toHaveAttribute('aria-label', ariaLabelProps.nativeInputAriaLabel);
    expect(dayInput).toHaveAttribute('aria-label', ariaLabelProps.dayAriaLabel);
    expect(monthInput).toHaveAttribute('aria-label', ariaLabelProps.monthAriaLabel);
    expect(yearInput).toHaveAttribute('aria-label', ariaLabelProps.yearAriaLabel);
    expect(hourInput).toHaveAttribute('aria-label', ariaLabelProps.hourAriaLabel);
    expect(minuteInput).toHaveAttribute('aria-label', ariaLabelProps.minuteAriaLabel);
    expect(secondInput).toHaveAttribute('aria-label', ariaLabelProps.secondAriaLabel);
  });

  it('passes placeholder props to DateInput', async () => {
    const placeholderProps = {
      dayPlaceholder: 'Day',
      hourPlaceholder: 'Hour',
      minutePlaceholder: 'Minute',
      monthPlaceholder: 'Month',
      secondPlaceholder: 'Second',
      yearPlaceholder: 'Year',
    };

    await render(<DateTimePicker {...defaultProps} {...placeholderProps} maxDetail="second" />);

    const dayInput = page.getByRole('spinbutton', { name: 'day' });
    const monthInput = page.getByRole('spinbutton', { name: 'month' });
    const yearInput = page.getByRole('spinbutton', { name: 'year' });
    const hourInput = page.getByRole('spinbutton', { name: 'hour' });
    const minuteInput = page.getByRole('spinbutton', { name: 'minute' });
    const secondInput = page.getByRole('spinbutton', { name: 'second' });

    expect(dayInput).toHaveAttribute('placeholder', placeholderProps.dayPlaceholder);
    expect(monthInput).toHaveAttribute('placeholder', placeholderProps.monthPlaceholder);
    expect(yearInput).toHaveAttribute('placeholder', placeholderProps.yearPlaceholder);
    expect(hourInput).toHaveAttribute('placeholder', placeholderProps.hourPlaceholder);
    expect(minuteInput).toHaveAttribute('placeholder', placeholderProps.minutePlaceholder);
    expect(secondInput).toHaveAttribute('placeholder', placeholderProps.secondPlaceholder);
  });

  describe('passes value to DateTimeInput', () => {
    it('passes single value to DateTimeInput', async () => {
      const value = new Date(2019, 0, 1);

      const { container } = await render(<DateTimePicker {...defaultProps} value={value} />);

      const nativeInput = container.querySelector('input[type="datetime-local"]');

      expect(nativeInput).toHaveValue('2019-01-01T00:00');
    });

    it('passes the first item of an array of values to DateTimeInput', async () => {
      const value1 = new Date(2019, 0, 1);
      const value2 = new Date(2019, 6, 1);

      const { container } = await render(
        <DateTimePicker {...defaultProps} value={[value1, value2]} />,
      );

      const nativeInput = container.querySelector('input[type="datetime-local"]');

      expect(nativeInput).toHaveValue('2019-01-01T00:00');
    });
  });

  it('applies className to its wrapper when given a string', async () => {
    const className = 'testClassName';

    const { container } = await render(<DateTimePicker {...defaultProps} className={className} />);

    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveClass(className);
  });

  it('applies "--open" className to its wrapper when given isCalendarOpen flag', async () => {
    const { container } = await render(<DateTimePicker {...defaultProps} isCalendarOpen />);

    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveClass('react-datetime-picker--open');
  });

  it('applies "--open" className to its wrapper when given isClockOpen flag', async () => {
    const { container } = await render(<DateTimePicker {...defaultProps} isClockOpen />);

    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveClass('react-datetime-picker--open');
  });

  it('applies calendar className to the calendar when given a string', async () => {
    const calendarClassName = 'testClassName';

    const { container } = await render(
      <DateTimePicker
        {...defaultProps}
        calendarProps={{ className: calendarClassName }}
        isCalendarOpen
      />,
    );

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toHaveClass(calendarClassName);
  });

  it('applies clock className to the clock when given a string', async () => {
    const clockClassName = 'testClassName';

    const { container } = await render(
      <DateTimePicker {...defaultProps} clockProps={{ className: clockClassName }} isClockOpen />,
    );

    const clock = container.querySelector('.react-clock');

    expect(clock).toHaveClass(clockClassName);
  });

  it('renders DateTimeInput component', async () => {
    const { container } = await render(<DateTimePicker {...defaultProps} />);

    const nativeInput = container.querySelector('input[type="datetime-local"]');

    expect(nativeInput).toBeInTheDocument();
  });

  describe('renders clear button properly', () => {
    it('renders clear button', async () => {
      await render(<DateTimePicker {...defaultProps} />);

      const clearButton = page.getByTestId('clear-button');

      expect(clearButton).toBeInTheDocument();
    });

    it('renders clear icon by default when clearIcon is not given', async () => {
      await render(<DateTimePicker {...defaultProps} />);

      const clearButton = page.getByTestId('clear-button');

      const clearIcon = clearButton.element().querySelector('svg');

      expect(clearIcon).toBeInTheDocument();
    });

    it('renders clear icon when given clearIcon as a string', async () => {
      await render(<DateTimePicker {...defaultProps} clearIcon="❌" />);

      const clearButton = page.getByTestId('clear-button');

      expect(clearButton).toHaveTextContent('❌');
    });

    it('renders clear icon when given clearIcon as a React element', async () => {
      function ClearIcon() {
        return <>❌</>;
      }

      await render(<DateTimePicker {...defaultProps} clearIcon={<ClearIcon />} />);

      const clearButton = page.getByTestId('clear-button');

      expect(clearButton).toHaveTextContent('❌');
    });

    it('renders clear icon when given clearIcon as a function', async () => {
      function ClearIcon() {
        return <>❌</>;
      }

      await render(<DateTimePicker {...defaultProps} clearIcon={ClearIcon} />);

      const clearButton = page.getByTestId('clear-button');

      expect(clearButton).toHaveTextContent('❌');
    });
  });

  describe('renders calendar button properly', () => {
    it('renders calendar button', async () => {
      await render(<DateTimePicker {...defaultProps} />);

      const calendarButton = page.getByTestId('calendar-button');

      expect(calendarButton).toBeInTheDocument();
    });

    it('renders calendar icon by default when calendarIcon is not given', async () => {
      await render(<DateTimePicker {...defaultProps} />);

      const calendarButton = page.getByTestId('calendar-button');

      const calendarIcon = calendarButton.element().querySelector('svg');

      expect(calendarIcon).toBeInTheDocument();
    });

    it('renders calendar icon when given calendarIcon as a string', async () => {
      await render(<DateTimePicker {...defaultProps} calendarIcon="📅" />);

      const calendarButton = page.getByTestId('calendar-button');

      expect(calendarButton).toHaveTextContent('📅');
    });

    it('renders calendar icon when given calendarIcon as a React element', async () => {
      function CalendarIcon() {
        return <>📅</>;
      }

      await render(<DateTimePicker {...defaultProps} calendarIcon={<CalendarIcon />} />);

      const calendarButton = page.getByTestId('calendar-button');

      expect(calendarButton).toHaveTextContent('📅');
    });

    it('renders calendar icon when given calendarIcon as a function', async () => {
      function CalendarIcon() {
        return <>📅</>;
      }

      await render(<DateTimePicker {...defaultProps} calendarIcon={CalendarIcon} />);

      const calendarButton = page.getByTestId('calendar-button');

      expect(calendarButton).toHaveTextContent('📅');
    });
  });

  it('renders Calendar component when given isCalendarOpen flag', async () => {
    const { container } = await render(<DateTimePicker {...defaultProps} isCalendarOpen />);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('renders Clock component when given isClockOpen flag', async () => {
    const { container } = await render(<DateTimePicker {...defaultProps} isClockOpen />);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('does not render Calendar component when given disableCalendar & isCalendarOpen flags', async () => {
    const { container } = await render(
      <DateTimePicker {...defaultProps} disableCalendar isCalendarOpen />,
    );

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).not.toBeInTheDocument();
  });

  it('does not render Clock component when given disableClock & isClockOpen flags', async () => {
    const { container } = await render(
      <DateTimePicker {...defaultProps} disableClock isClockOpen />,
    );

    const clock = container.querySelector('.react-clock');

    expect(clock).not.toBeInTheDocument();
  });

  it('opens Calendar component when given isCalendarOpen flag by changing props', async () => {
    const { container, rerender } = await render(<DateTimePicker {...defaultProps} />);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).not.toBeInTheDocument();

    rerender(<DateTimePicker {...defaultProps} isCalendarOpen />);

    const calendar2 = container.querySelector('.react-calendar');

    expect(calendar2).toBeInTheDocument();
  });

  it('opens Clock component when given isClockOpen flag by changing props', async () => {
    const { container, rerender } = await render(<DateTimePicker {...defaultProps} />);

    const clock = container.querySelector('.react-clock');

    expect(clock).not.toBeInTheDocument();

    rerender(<DateTimePicker {...defaultProps} isClockOpen />);

    const clock2 = container.querySelector('.react-clock');

    expect(clock2).toBeInTheDocument();
  });

  it('opens Calendar component when clicking on a button', async () => {
    const { container } = await render(<DateTimePicker {...defaultProps} />);

    const calendar = container.querySelector('.react-calendar');
    const button = page.getByTestId('calendar-button');

    expect(calendar).not.toBeInTheDocument();

    await userEvent.click(button);

    const calendar2 = container.querySelector('.react-calendar');

    expect(calendar2).toBeInTheDocument();
  });

  function triggerFocusInEvent(locator: Locator) {
    const element = locator.element();

    element.dispatchEvent(
      new FocusEvent('focusin', { bubbles: true, cancelable: false, composed: true }),
    );
  }

  function triggerFocusEvent(locator: Locator) {
    triggerFocusInEvent(locator);

    const element = locator.element();

    element.dispatchEvent(
      new FocusEvent('focus', { bubbles: false, cancelable: false, composed: true }),
    );
  }

  describe('handles opening Calendar component when focusing on an input inside properly', () => {
    it('opens Calendar component when focusing on an input inside by default', async () => {
      const { container } = await render(<DateTimePicker {...defaultProps} />);

      const calendar = container.querySelector('.react-calendar');
      const input = page.getByRole('spinbutton', { name: 'day' });

      expect(calendar).not.toBeInTheDocument();

      act(() => {
        triggerFocusEvent(input);
      });

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeInTheDocument();
    });

    it('opens Calendar component when focusing on an input inside given openWidgetsOnFocus = true', async () => {
      const { container } = await render(<DateTimePicker {...defaultProps} openWidgetsOnFocus />);

      const calendar = container.querySelector('.react-calendar');
      const input = page.getByRole('spinbutton', { name: 'day' });

      expect(calendar).not.toBeInTheDocument();

      act(() => {
        triggerFocusEvent(input);
      });

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeInTheDocument();
    });

    it('does not open Calendar component when focusing on an input inside given openWidgetsOnFocus = false', async () => {
      const { container } = await render(
        <DateTimePicker {...defaultProps} openWidgetsOnFocus={false} />,
      );

      const calendar = container.querySelector('.react-calendar');
      const input = page.getByRole('spinbutton', { name: 'day' });

      expect(calendar).not.toBeInTheDocument();

      act(() => {
        triggerFocusEvent(input);
      });

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeFalsy();
    });

    it('does not open Calendar component when focusing on an input inside given shouldOpenWidgets function returning false', async () => {
      const shouldOpenWidgets = () => false;

      const { container } = await render(
        <DateTimePicker {...defaultProps} shouldOpenWidgets={shouldOpenWidgets} />,
      );

      const calendar = container.querySelector('.react-calendar');
      const input = page.getByRole('spinbutton', { name: 'day' });

      expect(calendar).not.toBeInTheDocument();

      act(() => {
        triggerFocusEvent(input);
      });

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeFalsy();
    });

    it('does not open Calendar component when focusing on a select element', async () => {
      const { container } = await render(
        <DateTimePicker {...defaultProps} format="dd.MMMM.yyyy hh:mm:ss a" />,
      );

      const calendar = container.querySelector('.react-calendar');
      const select = page.getByRole('combobox', { name: 'month' });

      expect(calendar).not.toBeInTheDocument();

      act(() => {
        triggerFocusEvent(select);
      });

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeFalsy();
    });
  });

  describe('handles opening Clock component when focusing on an input inside properly', () => {
    it('opens Clock component when focusing on an input inside by default', async () => {
      const { container } = await render(<DateTimePicker {...defaultProps} />);

      const clock = container.querySelector('.react-clock');
      const input = page.getByRole('spinbutton', { name: /hour/ });

      expect(clock).not.toBeInTheDocument();

      act(() => {
        triggerFocusEvent(input);
      });

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeInTheDocument();
    });

    it('opens Clock component when focusing on an input inside given openWidgetsOnFocus = true', async () => {
      const { container } = await render(<DateTimePicker {...defaultProps} openWidgetsOnFocus />);

      const clock = container.querySelector('.react-clock');
      const input = page.getByRole('spinbutton', { name: /hour/ });

      expect(clock).not.toBeInTheDocument();

      act(() => {
        triggerFocusEvent(input);
      });

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeInTheDocument();
    });

    it('does not open Clock component when focusing on an input inside given openWidgetsOnFocus = false', async () => {
      const { container } = await render(
        <DateTimePicker {...defaultProps} openWidgetsOnFocus={false} />,
      );

      const clock = container.querySelector('.react-clock');
      const input = page.getByRole('spinbutton', { name: /hour/ });

      expect(clock).not.toBeInTheDocument();

      act(() => {
        triggerFocusEvent(input);
      });

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeFalsy();
    });

    it('does not open Clock component when focusing on an input inside given shouldOpenWidgets function returning false', async () => {
      const shouldOpenWidgets = () => false;

      const { container } = await render(
        <DateTimePicker {...defaultProps} shouldOpenWidgets={shouldOpenWidgets} />,
      );

      const clock = container.querySelector('.react-clock');
      const input = page.getByRole('spinbutton', { name: /hour/ });

      expect(clock).not.toBeInTheDocument();

      act(() => {
        triggerFocusEvent(input);
      });

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeFalsy();
    });

    it('does not open Clock component when focusing on a select element', async () => {
      const { container } = await render(
        <DateTimePicker {...defaultProps} format="dd.MMMM.yyyy hh:mm:ss a" />,
      );

      const clock = container.querySelector('.react-clock');
      const select = page.getByRole('combobox', { name: 'amPm' });

      expect(clock).not.toBeInTheDocument();

      act(() => {
        triggerFocusEvent(select);
      });

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeFalsy();
    });
  });

  it('closes Calendar component when clicked outside', async () => {
    const { container } = await render(<DateTimePicker {...defaultProps} isCalendarOpen />);

    await userEvent.click(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__calendar'),
    );
  });

  it('closes Calendar component when focused outside', async () => {
    const { container } = await render(<DateTimePicker {...defaultProps} isCalendarOpen />);

    triggerFocusInEvent(page.elementLocator(document.body));

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__calendar'),
    );
  });

  function triggerTouchStart(element: HTMLElement) {
    element.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, cancelable: true }));
  }

  it('closes Calendar component when tapped outside', async () => {
    const { container } = await render(<DateTimePicker {...defaultProps} isCalendarOpen />);

    triggerTouchStart(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__calendar'),
    );
  });

  it('closes Clock component when clicked outside', async () => {
    const { container } = await render(<DateTimePicker {...defaultProps} isClockOpen />);

    await userEvent.click(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__clock'),
    );
  });

  it('closes Clock component when focused outside', async () => {
    const { container } = await render(<DateTimePicker {...defaultProps} isClockOpen />);

    triggerFocusInEvent(page.elementLocator(document.body));

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__clock'),
    );
  });

  it('closes Clock component when tapped outside', async () => {
    const { container } = await render(<DateTimePicker {...defaultProps} isClockOpen />);

    triggerTouchStart(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__clock'),
    );
  });

  function triggerFocusOutEvent(locator: Locator) {
    const element = locator.element();

    element.dispatchEvent(
      new FocusEvent('focusout', { bubbles: true, cancelable: false, composed: true }),
    );
  }

  function triggerBlurEvent(locator: Locator) {
    triggerFocusOutEvent(locator);

    const element = locator.element();

    element.dispatchEvent(
      new FocusEvent('blur', { bubbles: false, cancelable: false, composed: true }),
    );
  }

  it('does not close Calendar component when focused within date inputs', async () => {
    const { container } = await render(<DateTimePicker {...defaultProps} isCalendarOpen />);

    const monthInput = page.getByRole('spinbutton', { name: 'month' });
    const dayInput = page.getByRole('spinbutton', { name: 'day' });

    triggerBlurEvent(monthInput);
    triggerFocusEvent(dayInput);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('does not close Clock component when focused within time inputs', async () => {
    const { container } = await render(<DateTimePicker {...defaultProps} isClockOpen />);

    const hourInput = page.getByRole('spinbutton', { name: 'hour' });
    const minuteInput = page.getByRole('spinbutton', { name: 'minute' });

    triggerBlurEvent(hourInput);
    triggerFocusEvent(minuteInput);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('closes Clock when Calendar is opened by a click on the calendar icon', async () => {
    const { container } = await render(<DateTimePicker {...defaultProps} isClockOpen />);

    const clock = container.querySelector('.react-clock');
    const button = page.getByTestId('calendar-button');

    expect(clock).toBeInTheDocument();

    await userEvent.click(button);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__clock'),
    );
  });

  it('opens Calendar component, followed by Clock component, when focusing on inputs inside', async () => {
    const { container } = await render(<DateTimePicker {...defaultProps} />);

    const dayInput = page.getByRole('spinbutton', { name: 'day' });

    act(() => {
      triggerFocusEvent(dayInput);
    });

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();

    const minuteInput = page.getByRole('spinbutton', { name: 'minute' });

    act(() => {
      triggerFocusEvent(minuteInput);
    });

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('closes Calendar when changing value by default', async () => {
    const { container } = await render(<DateTimePicker {...defaultProps} isCalendarOpen />);

    const firstTile = container.querySelector('.react-calendar__tile') as HTMLButtonElement;

    await act(async () => {
      await userEvent.click(firstTile);
    });

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__calendar'),
    );
  });

  it('closes Calendar when changing value with prop closeWidgets = true', async () => {
    const { container } = await render(
      <DateTimePicker {...defaultProps} closeWidgets isCalendarOpen />,
    );

    const firstTile = container.querySelector('.react-calendar__tile') as HTMLButtonElement;

    await act(async () => {
      await userEvent.click(firstTile);
    });

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__calendar'),
    );
  });

  it('does not close Calendar when changing value with prop closeWidgets = false', async () => {
    const { container } = await render(
      <DateTimePicker {...defaultProps} closeWidgets={false} isCalendarOpen />,
    );

    const firstTile = container.querySelector('.react-calendar__tile') as HTMLButtonElement;

    await act(async () => {
      await userEvent.click(firstTile);
    });

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('does not close Calendar when changing value with shouldCloseWidgets function returning false', async () => {
    const shouldCloseWidgets = () => false;

    const { container } = await render(
      <DateTimePicker {...defaultProps} isCalendarOpen shouldCloseWidgets={shouldCloseWidgets} />,
    );

    const firstTile = container.querySelector('.react-calendar__tile') as HTMLButtonElement;

    await act(async () => {
      await userEvent.click(firstTile);
    });

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('does not close Calendar when changing value using inputs', async () => {
    const { container } = await render(<DateTimePicker {...defaultProps} isCalendarOpen />);

    const dayInput = page.getByRole('spinbutton', { name: 'day' });

    await act(async () => {
      await userEvent.fill(dayInput, '1');
    });

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('does not close Clock when changing value using inputs', async () => {
    const { container } = await render(<DateTimePicker {...defaultProps} isClockOpen />);

    const hourInput = page.getByRole('spinbutton', { name: 'hour' });

    await act(async () => {
      await userEvent.fill(hourInput, '9');
    });

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('calls onChange callback when changing value', async () => {
    const value = new Date(2023, 0, 31, 21, 40, 11);
    const onChange = vi.fn();

    await render(
      <DateTimePicker {...defaultProps} maxDetail="second" onChange={onChange} value={value} />,
    );

    const dayInput = page.getByRole('spinbutton', { name: 'day' });

    await act(async () => {
      await userEvent.fill(dayInput, '1');
    });

    expect(onChange).toHaveBeenCalledWith(new Date(2023, 0, 1, 21, 40, 11));
  });

  it('calls onChange callback with merged new date & old time when calling internal onDateChange given Date', async () => {
    const hours = 21;
    const minutes = 40;
    const seconds = 11;
    const ms = 458;

    const onChange = vi.fn();
    const value = new Date(2018, 6, 17, hours, minutes, seconds, ms);
    const nextValue = new Date(2019, 0, 1, hours, minutes, seconds, ms);

    const { container } = await render(
      <DateTimePicker {...defaultProps} isCalendarOpen onChange={onChange} value={value} />,
    );

    // Navigate up the calendar
    const drillUpButton = container.querySelector(
      '.react-calendar__navigation__label',
    ) as HTMLButtonElement;
    await userEvent.click(drillUpButton); // To year 2018
    await userEvent.click(drillUpButton); // To 2011 – 2020 decade

    // Click year 2019
    const twentyNineteenButton = page.getByRole('button', { name: '2019' });
    await userEvent.click(twentyNineteenButton);

    // Click January
    const januaryButton = page.getByRole('button', { name: 'January 2019' });
    await userEvent.click(januaryButton);

    // Click 1st
    const firstButton = page.getByRole('button', { name: 'January 1, 2019' });
    await userEvent.click(firstButton);

    expect(onChange).toHaveBeenCalledWith(nextValue);
  });

  it('calls onChange callback with merged new date & old time when calling internal onDateChange given ISO string', async () => {
    const hours = 21;
    const minutes = 40;
    const seconds = 11;
    const ms = 458;

    const onChange = vi.fn();
    const value = new Date(2018, 6, 17, hours, minutes, seconds, ms).toISOString();
    const nextValue = new Date(2019, 0, 1, hours, minutes, seconds, ms);

    const { container } = await render(
      <DateTimePicker {...defaultProps} isCalendarOpen onChange={onChange} value={value} />,
    );

    // Navigate up the calendar
    const drillUpButton = container.querySelector(
      '.react-calendar__navigation__label',
    ) as HTMLButtonElement;
    await userEvent.click(drillUpButton); // To year 2018
    await userEvent.click(drillUpButton); // To 2011 – 2020 decade

    // Click year 2019
    const twentyNineteenButton = page.getByRole('button', { name: '2019' });
    await userEvent.click(twentyNineteenButton);

    // Click January
    const januaryButton = page.getByRole('button', { name: 'January 2019' });
    await userEvent.click(januaryButton);

    // Click 1st
    const firstButton = page.getByRole('button', { name: 'January 1, 2019' });
    await userEvent.click(firstButton);

    expect(onChange).toHaveBeenCalledWith(nextValue);
  });

  it('calls onInvalidChange callback when changing value to an invalid one', async () => {
    const value = new Date(2023, 0, 31, 21, 40, 11);
    const onInvalidChange = vi.fn();

    await render(
      <DateTimePicker
        {...defaultProps}
        maxDetail="second"
        onInvalidChange={onInvalidChange}
        value={value}
      />,
    );

    const dayInput = page.getByRole('spinbutton', { name: 'day' });

    await act(async () => {
      await userEvent.fill(dayInput, '32');
    });

    expect(onInvalidChange).toHaveBeenCalled();
  });

  it('clears the value when clicking on a button', async () => {
    const onChange = vi.fn();

    const { container } = await render(<DateTimePicker {...defaultProps} onChange={onChange} />);

    const calendar = container.querySelector('.react-calendar');
    const button = page.getByTestId('clear-button');

    expect(calendar).not.toBeInTheDocument();

    await userEvent.click(button);

    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('calls onClick callback when clicked a page (sample of mouse events family)', async () => {
    const onClick = vi.fn();

    const { container } = await render(<DateTimePicker {...defaultProps} onClick={onClick} />);

    const wrapper = container.firstElementChild as HTMLDivElement;
    await userEvent.click(wrapper);

    expect(onClick).toHaveBeenCalled();
  });

  it('calls onTouchStart callback when touched a page (sample of touch events family)', async () => {
    const onTouchStart = vi.fn();

    const { container } = await render(
      <DateTimePicker {...defaultProps} onTouchStart={onTouchStart} />,
    );

    const wrapper = container.firstElementChild as HTMLDivElement;

    triggerTouchStart(wrapper);

    expect(onTouchStart).toHaveBeenCalled();
  });
});
