import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { act, fireEvent } from '@testing-library/react';

import DateTimePicker from './DateTimePicker.js';

async function waitForElementToBeRemovedOrHidden(callback: () => HTMLElement | null) {
  const element = callback();

  if (element) {
    await vi.waitFor(() =>
      expect(element).toHaveAttribute('class', expect.stringContaining('--closed')),
    );
  }
}

describe('DateTimePicker', () => {
  it('passes default name to DateTimeInput', async () => {
    const { container } = await render(<DateTimePicker />);

    const nativeInput = container.querySelector('input[type="datetime-local"]');

    expect(nativeInput).toHaveAttribute('name', 'datetime');
  });

  it('passes custom name to DateTimeInput', async () => {
    const name = 'testName';

    const { container } = await render(<DateTimePicker name={name} />);

    const nativeInput = container.querySelector('input[type="datetime-local"]');

    expect(nativeInput).toHaveAttribute('name', name);
  });

  it('passes autoFocus flag to DateTimeInput', async () => {
    const { container } = await render(<DateTimePicker autoFocus />);

    const customInputs = container.querySelectorAll('input[data-input]');

    expect(customInputs[0]).toHaveFocus();
  });

  it('passes disabled flag to DateTimeInput', async () => {
    const { container } = await render(<DateTimePicker disabled />);

    const nativeInput = container.querySelector('input[type="datetime-local"]');

    expect(nativeInput).toBeDisabled();
  });

  it('passes format to DateTimeInput', async () => {
    const { container } = await render(<DateTimePicker format="ss" />);

    const customInputs = container.querySelectorAll('input[data-input]');

    expect(customInputs).toHaveLength(1);
    expect(customInputs[0]).toHaveAttribute('name', 'second');
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

    const calendarButton = container.querySelector('button.react-datetime-picker__calendar-button');
    const clearButton = container.querySelector('button.react-datetime-picker__clear-button');

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

    const { container } = await render(<DateTimePicker {...placeholderProps} maxDetail="second" />);

    const dayInput = container.querySelector('input[name="day"]');
    const monthInput = container.querySelector('input[name="month"]');
    const yearInput = container.querySelector('input[name="year"]');
    const hourInput = container.querySelector('input[name="hour12"]');
    const minuteInput = container.querySelector('input[name="minute"]');
    const secondInput = container.querySelector('input[name="second"]');

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

      const { container } = await render(<DateTimePicker value={value} />);

      const nativeInput = container.querySelector('input[type="datetime-local"]');

      expect(nativeInput).toHaveValue('2019-01-01T00:00');
    });

    it('passes the first item of an array of values to DateTimeInput', async () => {
      const value1 = new Date(2019, 0, 1);
      const value2 = new Date(2019, 6, 1);

      const { container } = await render(<DateTimePicker value={[value1, value2]} />);

      const nativeInput = container.querySelector('input[type="datetime-local"]');

      expect(nativeInput).toHaveValue('2019-01-01T00:00');
    });
  });

  it('applies className to its wrapper when given a string', async () => {
    const className = 'testClassName';

    const { container } = await render(<DateTimePicker className={className} />);

    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveClass(className);
  });

  it('applies "--open" className to its wrapper when given isCalendarOpen flag', async () => {
    const { container } = await render(<DateTimePicker isCalendarOpen />);

    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveClass('react-datetime-picker--open');
  });

  it('applies "--open" className to its wrapper when given isClockOpen flag', async () => {
    const { container } = await render(<DateTimePicker isClockOpen />);

    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveClass('react-datetime-picker--open');
  });

  it('applies calendar className to the calendar when given a string', async () => {
    const calendarClassName = 'testClassName';

    const { container } = await render(
      <DateTimePicker calendarProps={{ className: calendarClassName }} isCalendarOpen />,
    );

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toHaveClass(calendarClassName);
  });

  it('applies clock className to the clock when given a string', async () => {
    const clockClassName = 'testClassName';

    const { container } = await render(
      <DateTimePicker clockProps={{ className: clockClassName }} isClockOpen />,
    );

    const clock = container.querySelector('.react-clock');

    expect(clock).toHaveClass(clockClassName);
  });

  it('renders DateTimeInput component', async () => {
    const { container } = await render(<DateTimePicker />);

    const nativeInput = container.querySelector('input[type="datetime-local"]');

    expect(nativeInput).toBeInTheDocument();
  });

  describe('renders clear button properly', () => {
    it('renders clear button', async () => {
      const { container } = await render(<DateTimePicker />);

      const clearButton = container.querySelector('button.react-datetime-picker__clear-button');

      expect(clearButton).toBeInTheDocument();
    });

    it('renders clear icon by default when clearIcon is not given', async () => {
      const { container } = await render(<DateTimePicker />);

      const clearButton = container.querySelector(
        'button.react-datetime-picker__clear-button',
      ) as HTMLButtonElement;

      const clearIcon = clearButton.querySelector('svg');

      expect(clearIcon).toBeInTheDocument();
    });

    it('renders clear icon when given clearIcon as a string', async () => {
      const { container } = await render(<DateTimePicker clearIcon="❌" />);

      const clearButton = container.querySelector('button.react-datetime-picker__clear-button');

      expect(clearButton).toHaveTextContent('❌');
    });

    it('renders clear icon when given clearIcon as a React element', async () => {
      function ClearIcon() {
        return <>❌</>;
      }

      const { container } = await render(<DateTimePicker clearIcon={<ClearIcon />} />);

      const clearButton = container.querySelector('button.react-datetime-picker__clear-button');

      expect(clearButton).toHaveTextContent('❌');
    });

    it('renders clear icon when given clearIcon as a function', async () => {
      function ClearIcon() {
        return <>❌</>;
      }

      const { container } = await render(<DateTimePicker clearIcon={ClearIcon} />);

      const clearButton = container.querySelector('button.react-datetime-picker__clear-button');

      expect(clearButton).toHaveTextContent('❌');
    });
  });

  describe('renders calendar button properly', () => {
    it('renders calendar button', async () => {
      const { container } = await render(<DateTimePicker />);

      const calendarButton = container.querySelector(
        'button.react-datetime-picker__calendar-button',
      );

      expect(calendarButton).toBeInTheDocument();
    });

    it('renders calendar icon by default when calendarIcon is not given', async () => {
      const { container } = await render(<DateTimePicker />);

      const calendarButton = container.querySelector(
        'button.react-datetime-picker__calendar-button',
      ) as HTMLButtonElement;

      const calendarIcon = calendarButton.querySelector('svg');

      expect(calendarIcon).toBeInTheDocument();
    });

    it('renders calendar icon when given calendarIcon as a string', async () => {
      const { container } = await render(<DateTimePicker calendarIcon="📅" />);

      const calendarButton = container.querySelector(
        'button.react-datetime-picker__calendar-button',
      );

      expect(calendarButton).toHaveTextContent('📅');
    });

    it('renders calendar icon when given calendarIcon as a React element', async () => {
      function CalendarIcon() {
        return <>📅</>;
      }

      const { container } = await render(<DateTimePicker calendarIcon={<CalendarIcon />} />);

      const calendarButton = container.querySelector(
        'button.react-datetime-picker__calendar-button',
      );

      expect(calendarButton).toHaveTextContent('📅');
    });

    it('renders calendar icon when given calendarIcon as a function', async () => {
      function CalendarIcon() {
        return <>📅</>;
      }

      const { container } = await render(<DateTimePicker calendarIcon={CalendarIcon} />);

      const calendarButton = container.querySelector(
        'button.react-datetime-picker__calendar-button',
      );

      expect(calendarButton).toHaveTextContent('📅');
    });
  });

  it('renders Calendar component when given isCalendarOpen flag', async () => {
    const { container } = await render(<DateTimePicker isCalendarOpen />);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('renders Clock component when given isClockOpen flag', async () => {
    const { container } = await render(<DateTimePicker isClockOpen />);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('does not render Calendar component when given disableCalendar & isCalendarOpen flags', async () => {
    const { container } = await render(<DateTimePicker disableCalendar isCalendarOpen />);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeFalsy();
  });

  it('does not render Clock component when given disableClock & isClockOpen flags', async () => {
    const { container } = await render(<DateTimePicker disableClock isClockOpen />);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeFalsy();
  });

  it('opens Calendar component when given isCalendarOpen flag by changing props', async () => {
    const { container, rerender } = await render(<DateTimePicker />);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeFalsy();

    rerender(<DateTimePicker isCalendarOpen />);

    const calendar2 = container.querySelector('.react-calendar');

    expect(calendar2).toBeInTheDocument();
  });

  it('opens Clock component when given isClockOpen flag by changing props', async () => {
    const { container, rerender } = await render(<DateTimePicker />);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeFalsy();

    rerender(<DateTimePicker isClockOpen />);

    const clock2 = container.querySelector('.react-clock');

    expect(clock2).toBeInTheDocument();
  });

  it('opens Calendar component when clicking on a button', async () => {
    const { container } = await render(<DateTimePicker />);

    const calendar = container.querySelector('.react-calendar');
    const button = container.querySelector(
      'button.react-datetime-picker__calendar-button',
    ) as HTMLButtonElement;

    expect(calendar).toBeFalsy();

    await userEvent.click(button);

    const calendar2 = container.querySelector('.react-calendar');

    expect(calendar2).toBeInTheDocument();
  });

  function triggerFocusInEvent(element: HTMLElement) {
    element.dispatchEvent(
      new FocusEvent('focusin', { bubbles: true, cancelable: false, composed: true }),
    );
  }

  function triggerFocusEvent(element: HTMLElement) {
    triggerFocusInEvent(element);

    element.dispatchEvent(
      new FocusEvent('focus', { bubbles: false, cancelable: false, composed: true }),
    );
  }

  describe('handles opening Calendar component when focusing on an input inside properly', () => {
    it('opens Calendar component when focusing on an input inside by default', async () => {
      const { container } = await render(<DateTimePicker />);

      const calendar = container.querySelector('.react-calendar');
      const input = container.querySelector('input[name="day"]') as HTMLInputElement;

      expect(calendar).toBeFalsy();

      act(() => {
        triggerFocusEvent(input);
      });

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeInTheDocument();
    });

    it('opens Calendar component when focusing on an input inside given openWidgetsOnFocus = true', async () => {
      const { container } = await render(<DateTimePicker openWidgetsOnFocus />);

      const calendar = container.querySelector('.react-calendar');
      const input = container.querySelector('input[name="day"]') as HTMLInputElement;

      expect(calendar).toBeFalsy();

      act(() => {
        triggerFocusEvent(input);
      });

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeInTheDocument();
    });

    it('does not open Calendar component when focusing on an input inside given openWidgetsOnFocus = false', async () => {
      const { container } = await render(<DateTimePicker openWidgetsOnFocus={false} />);

      const calendar = container.querySelector('.react-calendar');
      const input = container.querySelector('input[name="day"]') as HTMLInputElement;

      expect(calendar).toBeFalsy();

      act(() => {
        triggerFocusEvent(input);
      });

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeFalsy();
    });

    it('does not open Calendar component when focusing on an input inside given shouldOpenWidgets function returning false', async () => {
      const shouldOpenWidgets = () => false;

      const { container } = await render(<DateTimePicker shouldOpenWidgets={shouldOpenWidgets} />);

      const calendar = container.querySelector('.react-calendar');
      const input = container.querySelector('input[name="day"]') as HTMLInputElement;

      expect(calendar).toBeFalsy();

      act(() => {
        triggerFocusEvent(input);
      });

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeFalsy();
    });

    it('does not open Calendar component when focusing on a select element', async () => {
      const { container } = await render(<DateTimePicker format="dd.MMMM.yyyy hh:mm:ss a" />);

      const calendar = container.querySelector('.react-calendar');
      const select = container.querySelector('select[name="month"]') as HTMLSelectElement;

      expect(calendar).toBeFalsy();

      act(() => {
        triggerFocusEvent(select);
      });

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeFalsy();
    });
  });

  describe('handles opening Clock component when focusing on an input inside properly', () => {
    it('opens Clock component when focusing on an input inside by default', async () => {
      const { container } = await render(<DateTimePicker />);

      const clock = container.querySelector('.react-clock');
      const input = container.querySelector('input[name^="hour"]') as HTMLInputElement;

      expect(clock).toBeFalsy();

      act(() => {
        triggerFocusEvent(input);
      });

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeInTheDocument();
    });

    it('opens Clock component when focusing on an input inside given openWidgetsOnFocus = true', async () => {
      const { container } = await render(<DateTimePicker openWidgetsOnFocus />);

      const clock = container.querySelector('.react-clock');
      const input = container.querySelector('input[name^="hour"]') as HTMLInputElement;

      expect(clock).toBeFalsy();

      act(() => {
        triggerFocusEvent(input);
      });

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeInTheDocument();
    });

    it('does not open Clock component when focusing on an input inside given openWidgetsOnFocus = false', async () => {
      const { container } = await render(<DateTimePicker openWidgetsOnFocus={false} />);

      const clock = container.querySelector('.react-clock');
      const input = container.querySelector('input[name^="hour"]') as HTMLInputElement;

      expect(clock).toBeFalsy();

      act(() => {
        triggerFocusEvent(input);
      });

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeFalsy();
    });

    it('does not open Clock component when focusing on an input inside given shouldOpenWidgets function returning false', async () => {
      const shouldOpenWidgets = () => false;

      const { container } = await render(<DateTimePicker shouldOpenWidgets={shouldOpenWidgets} />);

      const clock = container.querySelector('.react-clock');
      const input = container.querySelector('input[name^="hour"]') as HTMLInputElement;

      expect(clock).toBeFalsy();

      act(() => {
        triggerFocusEvent(input);
      });

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeFalsy();
    });

    it('does not open Clock component when focusing on a select element', async () => {
      const { container } = await render(<DateTimePicker format="dd.MMMM.yyyy hh:mm:ss a" />);

      const clock = container.querySelector('.react-clock');
      const select = container.querySelector('select[name="amPm"]') as HTMLSelectElement;

      expect(clock).toBeFalsy();

      act(() => {
        triggerFocusEvent(select);
      });

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeFalsy();
    });
  });

  it('closes Calendar component when clicked outside', async () => {
    const { container } = await render(<DateTimePicker isCalendarOpen />);

    await userEvent.click(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__calendar'),
    );
  });

  it('closes Calendar component when focused outside', async () => {
    const { container } = await render(<DateTimePicker isCalendarOpen />);

    triggerFocusInEvent(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__calendar'),
    );
  });

  function triggerTouchStart(element: HTMLElement) {
    element.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, cancelable: true }));
  }

  it('closes Calendar component when tapped outside', async () => {
    const { container } = await render(<DateTimePicker isCalendarOpen />);

    triggerTouchStart(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__calendar'),
    );
  });

  it('closes Clock component when clicked outside', async () => {
    const { container } = await render(<DateTimePicker isClockOpen />);

    await userEvent.click(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__clock'),
    );
  });

  it('closes Clock component when focused outside', async () => {
    const { container } = await render(<DateTimePicker isClockOpen />);

    triggerFocusInEvent(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__clock'),
    );
  });

  it('closes Clock component when tapped outside', async () => {
    const { container } = await render(<DateTimePicker isClockOpen />);

    triggerTouchStart(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__clock'),
    );
  });

  it('does not close Calendar component when focused within date inputs', async () => {
    const { container } = await render(<DateTimePicker isCalendarOpen />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const monthInput = customInputs[0] as HTMLInputElement;
    const dayInput = customInputs[1] as HTMLInputElement;

    fireEvent.blur(monthInput);
    triggerFocusEvent(dayInput);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('does not close Clock component when focused within time inputs', async () => {
    const { container } = await render(<DateTimePicker isClockOpen />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const hourInput = customInputs[3] as HTMLInputElement;
    const minuteInput = customInputs[4] as HTMLInputElement;

    fireEvent.blur(hourInput);
    triggerFocusEvent(minuteInput);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('closes Clock when Calendar is opened by a click on the calendar icon', async () => {
    const { container } = await render(<DateTimePicker isClockOpen />);

    const clock = container.querySelector('.react-clock');
    const button = container.querySelector(
      'button.react-datetime-picker__calendar-button',
    ) as HTMLButtonElement;

    expect(clock).toBeInTheDocument();

    await userEvent.click(button);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__clock'),
    );
  });

  it('opens Calendar component, followed by Clock component, when focusing on inputs inside', async () => {
    const { container } = await render(<DateTimePicker />);

    const dayInput = container.querySelector('input[name="day"]') as HTMLInputElement;

    act(() => {
      triggerFocusEvent(dayInput);
    });

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();

    const minuteInput = container.querySelector('input[name="minute"]') as HTMLInputElement;

    act(() => {
      triggerFocusEvent(minuteInput);
    });

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('closes Calendar when changing value by default', async () => {
    const { container } = await render(<DateTimePicker isCalendarOpen />);

    const firstTile = container.querySelector('.react-calendar__tile') as HTMLButtonElement;

    await act(async () => {
      await userEvent.click(firstTile);
    });

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__calendar'),
    );
  });

  it('closes Calendar when changing value with prop closeWidgets = true', async () => {
    const { container } = await render(<DateTimePicker closeWidgets isCalendarOpen />);

    const firstTile = container.querySelector('.react-calendar__tile') as HTMLButtonElement;

    await act(async () => {
      await userEvent.click(firstTile);
    });

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__calendar'),
    );
  });

  it('does not close Calendar when changing value with prop closeWidgets = false', async () => {
    const { container } = await render(<DateTimePicker closeWidgets={false} isCalendarOpen />);

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
      <DateTimePicker isCalendarOpen shouldCloseWidgets={shouldCloseWidgets} />,
    );

    const firstTile = container.querySelector('.react-calendar__tile') as HTMLButtonElement;

    await act(async () => {
      await userEvent.click(firstTile);
    });

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('does not close Calendar when changing value using inputs', async () => {
    const { container } = await render(<DateTimePicker isCalendarOpen />);

    const dayInput = container.querySelector('input[name="day"]') as HTMLInputElement;

    await act(async () => {
      await userEvent.fill(dayInput, '1');
    });

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('does not close Clock when changing value using inputs', async () => {
    const { container } = await render(<DateTimePicker isClockOpen />);

    const hourInput = container.querySelector('input[name="hour12"]') as HTMLInputElement;

    await act(async () => {
      await userEvent.fill(hourInput, '9');
    });

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('calls onChange callback when changing value', async () => {
    const value = new Date(2023, 0, 31, 21, 40, 11);
    const onChange = vi.fn();

    const { container } = await render(
      <DateTimePicker maxDetail="second" onChange={onChange} value={value} />,
    );

    const dayInput = container.querySelector('input[name="day"]') as HTMLInputElement;

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

    const { container, getByRole } = await render(
      <DateTimePicker isCalendarOpen onChange={onChange} value={value} />,
    );

    // Navigate up the calendar
    const drillUpButton = container.querySelector(
      '.react-calendar__navigation__label',
    ) as HTMLButtonElement;
    await userEvent.click(drillUpButton); // To year 2018
    await userEvent.click(drillUpButton); // To 2011 – 2020 decade

    // Click year 2019
    const twentyNineteenButton = getByRole('button', { name: '2019' });
    await userEvent.click(twentyNineteenButton);

    // Click January
    const januaryButton = getByRole('button', { name: 'January 2019' });
    await userEvent.click(januaryButton);

    // Click 1st
    const firstButton = getByRole('button', { name: 'January 1, 2019' });
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

    const { container, getByRole } = await render(
      <DateTimePicker isCalendarOpen onChange={onChange} value={value} />,
    );

    // Navigate up the calendar
    const drillUpButton = container.querySelector(
      '.react-calendar__navigation__label',
    ) as HTMLButtonElement;
    await userEvent.click(drillUpButton); // To year 2018
    await userEvent.click(drillUpButton); // To 2011 – 2020 decade

    // Click year 2019
    const twentyNineteenButton = getByRole('button', { name: '2019' });
    await userEvent.click(twentyNineteenButton);

    // Click January
    const januaryButton = getByRole('button', { name: 'January 2019' });
    await userEvent.click(januaryButton);

    // Click 1st
    const firstButton = getByRole('button', { name: 'January 1, 2019' });
    await userEvent.click(firstButton);

    expect(onChange).toHaveBeenCalledWith(nextValue);
  });

  it('calls onInvalidChange callback when changing value to an invalid one', async () => {
    const value = new Date(2023, 0, 31, 21, 40, 11);
    const onInvalidChange = vi.fn();

    const { container } = await render(
      <DateTimePicker maxDetail="second" onInvalidChange={onInvalidChange} value={value} />,
    );

    const dayInput = container.querySelector('input[name="day"]') as HTMLInputElement;

    await act(async () => {
      await userEvent.fill(dayInput, '32');
    });

    expect(onInvalidChange).toHaveBeenCalled();
  });

  it('clears the value when clicking on a button', async () => {
    const onChange = vi.fn();

    const { container } = await render(<DateTimePicker onChange={onChange} />);

    const calendar = container.querySelector('.react-calendar');
    const button = container.querySelector(
      'button.react-datetime-picker__clear-button',
    ) as HTMLButtonElement;

    expect(calendar).toBeFalsy();

    await userEvent.click(button);

    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('calls onClick callback when clicked a page (sample of mouse events family)', async () => {
    const onClick = vi.fn();

    const { container } = await render(<DateTimePicker onClick={onClick} />);

    const wrapper = container.firstElementChild as HTMLDivElement;
    await userEvent.click(wrapper);

    expect(onClick).toHaveBeenCalled();
  });

  it('calls onTouchStart callback when touched a page (sample of touch events family)', async () => {
    const onTouchStart = vi.fn();

    const { container } = await render(<DateTimePicker onTouchStart={onTouchStart} />);

    const wrapper = container.firstElementChild as HTMLDivElement;

    triggerTouchStart(wrapper);

    expect(onTouchStart).toHaveBeenCalled();
  });
});
