import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import DateTimePicker from './DateTimePicker.js';

async function waitForElementToBeRemovedOrHidden(callback: () => HTMLElement | null) {
  const element = callback();

  if (element) {
    try {
      await waitFor(() =>
        expect(element).toHaveAttribute('class', expect.stringContaining('--closed')),
      );
    } catch (error) {
      await waitForElementToBeRemoved(element);
    }
  }
}

describe('DateTimePicker', () => {
  it('passes default name to DateTimeInput', () => {
    const { container } = render(<DateTimePicker />);

    const nativeInput = container.querySelector('input[type="datetime-local"]');

    expect(nativeInput).toHaveAttribute('name', 'datetime');
  });

  it('passes custom name to DateTimeInput', () => {
    const name = 'testName';

    const { container } = render(<DateTimePicker name={name} />);

    const nativeInput = container.querySelector('input[type="datetime-local"]');

    expect(nativeInput).toHaveAttribute('name', name);
  });

  it('passes autoFocus flag to DateTimeInput', () => {
    // eslint-disable-next-line jsx-a11y/no-autofocus
    const { container } = render(<DateTimePicker autoFocus />);

    const customInputs = container.querySelectorAll('input[data-input]');

    expect(customInputs[0]).toHaveFocus();
  });

  it('passes disabled flag to DateTimeInput', () => {
    const { container } = render(<DateTimePicker disabled />);

    const nativeInput = container.querySelector('input[type="datetime-local"]');

    expect(nativeInput).toBeDisabled();
  });

  it('passes format to DateTimeInput', () => {
    const { container } = render(<DateTimePicker format="ss" />);

    const customInputs = container.querySelectorAll('input[data-input]');

    expect(customInputs).toHaveLength(1);
    expect(customInputs[0]).toHaveAttribute('name', 'second');
  });

  it('passes aria-label props to DateInput', () => {
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

    const { container } = render(<DateTimePicker {...ariaLabelProps} maxDetail="second" />);

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

  it('passes placeholder props to DateInput', () => {
    const placeholderProps = {
      dayPlaceholder: 'Day',
      hourPlaceholder: 'Hour',
      minutePlaceholder: 'Minute',
      monthPlaceholder: 'Month',
      secondPlaceholder: 'Second',
      yearPlaceholder: 'Year',
    };

    const { container } = render(<DateTimePicker {...placeholderProps} maxDetail="second" />);

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
    it('passes single value to DateTimeInput', () => {
      const value = new Date(2019, 0, 1);

      const { container } = render(<DateTimePicker value={value} />);

      const nativeInput = container.querySelector('input[type="datetime-local"]');

      expect(nativeInput).toHaveValue('2019-01-01T00:00');
    });

    it('passes the first item of an array of values to DateTimeInput', () => {
      const value1 = new Date(2019, 0, 1);
      const value2 = new Date(2019, 6, 1);

      const { container } = render(<DateTimePicker value={[value1, value2]} />);

      const nativeInput = container.querySelector('input[type="datetime-local"]');

      expect(nativeInput).toHaveValue('2019-01-01T00:00');
    });
  });

  it('applies className to its wrapper when given a string', () => {
    const className = 'testClassName';

    const { container } = render(<DateTimePicker className={className} />);

    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveClass(className);
  });

  it('applies "--open" className to its wrapper when given isCalendarOpen flag', () => {
    const { container } = render(<DateTimePicker isCalendarOpen />);

    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveClass('react-datetime-picker--open');
  });

  it('applies "--open" className to its wrapper when given isClockOpen flag', () => {
    const { container } = render(<DateTimePicker isClockOpen />);

    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveClass('react-datetime-picker--open');
  });

  it('applies calendar className to the calendar when given a string', () => {
    const calendarClassName = 'testClassName';

    const { container } = render(
      <DateTimePicker calendarProps={{ className: calendarClassName }} isCalendarOpen />,
    );

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toHaveClass(calendarClassName);
  });

  it('applies clock className to the clock when given a string', () => {
    const clockClassName = 'testClassName';

    const { container } = render(
      <DateTimePicker clockProps={{ className: clockClassName }} isClockOpen />,
    );

    const clock = container.querySelector('.react-clock');

    expect(clock).toHaveClass(clockClassName);
  });

  it('renders DateTimeInput component', () => {
    const { container } = render(<DateTimePicker />);

    const nativeInput = container.querySelector('input[type="datetime-local"]');

    expect(nativeInput).toBeInTheDocument();
  });

  describe('renders clear button properly', () => {
    it('renders clear button', () => {
      const { container } = render(<DateTimePicker />);

      const clearButton = container.querySelector('button.react-datetime-picker__clear-button');

      expect(clearButton).toBeInTheDocument();
    });

    it('renders clear icon by default when clearIcon is not given', () => {
      const { container } = render(<DateTimePicker />);

      const clearButton = container.querySelector(
        'button.react-datetime-picker__clear-button',
      ) as HTMLButtonElement;

      const clearIcon = clearButton.querySelector('svg');

      expect(clearIcon).toBeInTheDocument();
    });

    it('renders clear icon when given clearIcon as a string', () => {
      const { container } = render(<DateTimePicker clearIcon="❌" />);

      const clearButton = container.querySelector('button.react-datetime-picker__clear-button');

      expect(clearButton).toHaveTextContent('❌');
    });

    it('renders clear icon when given clearIcon as a React element', () => {
      function ClearIcon() {
        return <>❌</>;
      }

      const { container } = render(<DateTimePicker clearIcon={<ClearIcon />} />);

      const clearButton = container.querySelector('button.react-datetime-picker__clear-button');

      expect(clearButton).toHaveTextContent('❌');
    });

    it('renders clear icon when given clearIcon as a function', () => {
      function ClearIcon() {
        return <>❌</>;
      }

      const { container } = render(<DateTimePicker clearIcon={ClearIcon} />);

      const clearButton = container.querySelector('button.react-datetime-picker__clear-button');

      expect(clearButton).toHaveTextContent('❌');
    });
  });

  describe('renders calendar button properly', () => {
    it('renders calendar button', () => {
      const { container } = render(<DateTimePicker />);

      const calendarButton = container.querySelector(
        'button.react-datetime-picker__calendar-button',
      );

      expect(calendarButton).toBeInTheDocument();
    });

    it('renders calendar icon by default when calendarIcon is not given', () => {
      const { container } = render(<DateTimePicker />);

      const calendarButton = container.querySelector(
        'button.react-datetime-picker__calendar-button',
      ) as HTMLButtonElement;

      const calendarIcon = calendarButton.querySelector('svg');

      expect(calendarIcon).toBeInTheDocument();
    });

    it('renders calendar icon when given calendarIcon as a string', () => {
      const { container } = render(<DateTimePicker calendarIcon="📅" />);

      const calendarButton = container.querySelector(
        'button.react-datetime-picker__calendar-button',
      );

      expect(calendarButton).toHaveTextContent('📅');
    });

    it('renders calendar icon when given calendarIcon as a React element', () => {
      function CalendarIcon() {
        return <>📅</>;
      }

      const { container } = render(<DateTimePicker calendarIcon={<CalendarIcon />} />);

      const calendarButton = container.querySelector(
        'button.react-datetime-picker__calendar-button',
      );

      expect(calendarButton).toHaveTextContent('📅');
    });

    it('renders calendar icon when given calendarIcon as a function', () => {
      function CalendarIcon() {
        return <>📅</>;
      }

      const { container } = render(<DateTimePicker calendarIcon={CalendarIcon} />);

      const calendarButton = container.querySelector(
        'button.react-datetime-picker__calendar-button',
      );

      expect(calendarButton).toHaveTextContent('📅');
    });
  });

  it('renders Calendar component when given isCalendarOpen flag', () => {
    const { container } = render(<DateTimePicker isCalendarOpen />);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('renders Clock component when given isClockOpen flag', () => {
    const { container } = render(<DateTimePicker isClockOpen />);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('does not render Calendar component when given disableCalendar & isCalendarOpen flags', () => {
    const { container } = render(<DateTimePicker disableCalendar isCalendarOpen />);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeFalsy();
  });

  it('does not render Clock component when given disableClock & isClockOpen flags', () => {
    const { container } = render(<DateTimePicker disableClock isClockOpen />);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeFalsy();
  });

  it('opens Calendar component when given isCalendarOpen flag by changing props', () => {
    const { container, rerender } = render(<DateTimePicker />);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeFalsy();

    rerender(<DateTimePicker isCalendarOpen />);

    const calendar2 = container.querySelector('.react-calendar');

    expect(calendar2).toBeInTheDocument();
  });

  it('opens Clock component when given isClockOpen flag by changing props', () => {
    const { container, rerender } = render(<DateTimePicker />);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeFalsy();

    rerender(<DateTimePicker isClockOpen />);

    const clock2 = container.querySelector('.react-clock');

    expect(clock2).toBeInTheDocument();
  });

  it('opens Calendar component when clicking on a button', () => {
    const { container } = render(<DateTimePicker />);

    const calendar = container.querySelector('.react-calendar');
    const button = container.querySelector(
      'button.react-datetime-picker__calendar-button',
    ) as HTMLButtonElement;

    expect(calendar).toBeFalsy();

    fireEvent.click(button);

    const calendar2 = container.querySelector('.react-calendar');

    expect(calendar2).toBeInTheDocument();
  });

  describe('handles opening Calendar component when focusing on an input inside properly', () => {
    it('opens Calendar component when focusing on an input inside by default', () => {
      const { container } = render(<DateTimePicker />);

      const calendar = container.querySelector('.react-calendar');
      const input = container.querySelector('input[name="day"]') as HTMLInputElement;

      expect(calendar).toBeFalsy();

      fireEvent.focus(input);

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeInTheDocument();
    });

    it('opens Calendar component when focusing on an input inside given openWidgetsOnFocus = true', () => {
      const { container } = render(<DateTimePicker openWidgetsOnFocus />);

      const calendar = container.querySelector('.react-calendar');
      const input = container.querySelector('input[name="day"]') as HTMLInputElement;

      expect(calendar).toBeFalsy();

      fireEvent.focus(input);

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeInTheDocument();
    });

    it('does not open Calendar component when focusing on an input inside given openWidgetsOnFocus = false', () => {
      const { container } = render(<DateTimePicker openWidgetsOnFocus={false} />);

      const calendar = container.querySelector('.react-calendar');
      const input = container.querySelector('input[name="day"]') as HTMLInputElement;

      expect(calendar).toBeFalsy();

      fireEvent.focus(input);

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeFalsy();
    });

    it('does not open Calendar component when focusing on an input inside given shouldOpenWidgets function returning false', () => {
      const shouldOpenWidgets = () => false;

      const { container } = render(<DateTimePicker shouldOpenWidgets={shouldOpenWidgets} />);

      const calendar = container.querySelector('.react-calendar');
      const input = container.querySelector('input[name="day"]') as HTMLInputElement;

      expect(calendar).toBeFalsy();

      fireEvent.focus(input);

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeFalsy();
    });

    it('does not open Calendar component when focusing on a select element', () => {
      const { container } = render(<DateTimePicker format="dd.MMMM.yyyy hh:mm:ss a" />);

      const calendar = container.querySelector('.react-calendar');
      const select = container.querySelector('select[name="month"]') as HTMLSelectElement;

      expect(calendar).toBeFalsy();

      fireEvent.focus(select);

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeFalsy();
    });
  });

  describe('handles opening Clock component when focusing on an input inside properly', () => {
    it('opens Clock component when focusing on an input inside by default', () => {
      const { container } = render(<DateTimePicker />);

      const clock = container.querySelector('.react-clock');
      const input = container.querySelector('input[name^="hour"]') as HTMLInputElement;

      expect(clock).toBeFalsy();

      fireEvent.focus(input);

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeInTheDocument();
    });

    it('opens Clock component when focusing on an input inside given openWidgetsOnFocus = true', () => {
      const { container } = render(<DateTimePicker openWidgetsOnFocus />);

      const clock = container.querySelector('.react-clock');
      const input = container.querySelector('input[name^="hour"]') as HTMLInputElement;

      expect(clock).toBeFalsy();

      fireEvent.focus(input);

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeInTheDocument();
    });

    it('does not open Clock component when focusing on an input inside given openWidgetsOnFocus = false', () => {
      const { container } = render(<DateTimePicker openWidgetsOnFocus={false} />);

      const clock = container.querySelector('.react-clock');
      const input = container.querySelector('input[name^="hour"]') as HTMLInputElement;

      expect(clock).toBeFalsy();

      fireEvent.focus(input);

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeFalsy();
    });

    it('does not open Clock component when focusing on an input inside given shouldOpenWidgets function returning false', () => {
      const shouldOpenWidgets = () => false;

      const { container } = render(<DateTimePicker shouldOpenWidgets={shouldOpenWidgets} />);

      const clock = container.querySelector('.react-clock');
      const input = container.querySelector('input[name^="hour"]') as HTMLInputElement;

      expect(clock).toBeFalsy();

      fireEvent.focus(input);

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeFalsy();
    });

    it('does not open Clock component when focusing on a select element', () => {
      const { container } = render(<DateTimePicker format="dd.MMMM.yyyy hh:mm:ss a" />);

      const clock = container.querySelector('.react-clock');
      const select = container.querySelector('select[name="amPm"]') as HTMLSelectElement;

      expect(clock).toBeFalsy();

      fireEvent.focus(select);

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeFalsy();
    });
  });

  it('closes Calendar component when clicked outside', async () => {
    const { container } = render(<DateTimePicker isCalendarOpen />);

    userEvent.click(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__calendar'),
    );
  });

  it('closes Calendar component when focused outside', async () => {
    const { container } = render(<DateTimePicker isCalendarOpen />);

    fireEvent.focusIn(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__calendar'),
    );
  });

  it('closes Calendar component when tapped outside', async () => {
    const { container } = render(<DateTimePicker isCalendarOpen />);

    fireEvent.touchStart(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__calendar'),
    );
  });

  it('closes Clock component when clicked outside', async () => {
    const { container } = render(<DateTimePicker isClockOpen />);

    userEvent.click(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__clock'),
    );
  });

  it('closes Clock component when focused outside', async () => {
    const { container } = render(<DateTimePicker isClockOpen />);

    fireEvent.focusIn(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__clock'),
    );
  });

  it('closes Clock component when tapped outside', async () => {
    const { container } = render(<DateTimePicker isClockOpen />);

    fireEvent.touchStart(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__clock'),
    );
  });

  it('does not close Calendar component when focused within date inputs', () => {
    const { container } = render(<DateTimePicker isCalendarOpen />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const monthInput = customInputs[0] as HTMLInputElement;
    const dayInput = customInputs[1] as HTMLInputElement;

    fireEvent.blur(monthInput);
    fireEvent.focus(dayInput);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('does not close Clock component when focused within time inputs', () => {
    const { container } = render(<DateTimePicker isClockOpen />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const hourInput = customInputs[3] as HTMLInputElement;
    const minuteInput = customInputs[4] as HTMLInputElement;

    fireEvent.blur(hourInput);
    fireEvent.focus(minuteInput);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('closes Clock when Calendar is opened by a click on the calendar icon', async () => {
    const { container } = render(<DateTimePicker isClockOpen />);

    const clock = container.querySelector('.react-clock');
    const button = container.querySelector(
      'button.react-datetime-picker__calendar-button',
    ) as HTMLButtonElement;

    expect(clock).toBeInTheDocument();

    fireEvent.click(button);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__clock'),
    );
  });

  it('opens Calendar component, followed by Clock component, when focusing on inputs inside', () => {
    const { container } = render(<DateTimePicker />);

    const dayInput = container.querySelector('input[name="day"]') as HTMLInputElement;

    fireEvent.focus(dayInput);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();

    const minuteInput = container.querySelector('input[name="minute"]') as HTMLInputElement;

    fireEvent.focus(minuteInput);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('closes Calendar when changing value by default', async () => {
    const { container } = render(<DateTimePicker isCalendarOpen />);

    const firstTile = container.querySelector('.react-calendar__tile') as HTMLButtonElement;

    act(() => {
      fireEvent.click(firstTile);
    });

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__calendar'),
    );
  });

  it('closes Calendar when changing value with prop closeWidgets = true', async () => {
    const { container } = render(<DateTimePicker closeWidgets isCalendarOpen />);

    const firstTile = container.querySelector('.react-calendar__tile') as HTMLButtonElement;

    act(() => {
      fireEvent.click(firstTile);
    });

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__calendar'),
    );
  });

  it('does not close Calendar when changing value with prop closeWidgets = false', () => {
    const { container } = render(<DateTimePicker closeWidgets={false} isCalendarOpen />);

    const firstTile = container.querySelector('.react-calendar__tile') as HTMLButtonElement;

    act(() => {
      fireEvent.click(firstTile);
    });

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('does not close Calendar when changing value with shouldCloseWidgets function returning false', () => {
    const shouldCloseWidgets = () => false;

    const { container } = render(
      <DateTimePicker isCalendarOpen shouldCloseWidgets={shouldCloseWidgets} />,
    );

    const firstTile = container.querySelector('.react-calendar__tile') as HTMLButtonElement;

    act(() => {
      fireEvent.click(firstTile);
    });

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('does not close Calendar when changing value using inputs', () => {
    const { container } = render(<DateTimePicker isCalendarOpen />);

    const dayInput = container.querySelector('input[name="day"]') as HTMLInputElement;

    act(() => {
      fireEvent.change(dayInput, { target: { value: '1' } });
    });

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('does not close Clock when changing value using inputs', () => {
    const { container } = render(<DateTimePicker isClockOpen />);

    const hourInput = container.querySelector('input[name="hour12"]') as HTMLInputElement;

    act(() => {
      fireEvent.change(hourInput, { target: { value: '9' } });
    });

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('calls onChange callback when changing value', () => {
    const value = new Date(2023, 0, 31, 21, 40, 11);
    const onChange = vi.fn();

    const { container } = render(
      <DateTimePicker maxDetail="second" onChange={onChange} value={value} />,
    );

    const dayInput = container.querySelector('input[name="day"]') as HTMLInputElement;

    act(() => {
      fireEvent.change(dayInput, { target: { value: '1' } });
    });

    expect(onChange).toHaveBeenCalledWith(new Date(2023, 0, 1, 21, 40, 11));
  });

  it('calls onChange callback with merged new date & old time when calling internal onDateChange given Date', () => {
    const hours = 21;
    const minutes = 40;
    const seconds = 11;
    const ms = 458;

    const onChange = vi.fn();
    const value = new Date(2018, 6, 17, hours, minutes, seconds, ms);
    const nextValue = new Date(2019, 0, 1, hours, minutes, seconds, ms);

    const { container, getByRole } = render(
      <DateTimePicker isCalendarOpen onChange={onChange} value={value} />,
    );

    // Navigate up the calendar
    const drillUpButton = container.querySelector(
      '.react-calendar__navigation__label',
    ) as HTMLButtonElement;
    fireEvent.click(drillUpButton); // To year 2018
    fireEvent.click(drillUpButton); // To 2011 – 2020 decade

    // Click year 2019
    const twentyNineteenButton = getByRole('button', { name: '2019' });
    fireEvent.click(twentyNineteenButton);

    // Click January
    const januaryButton = getByRole('button', { name: 'January 2019' });
    fireEvent.click(januaryButton);

    // Click 1st
    const firstButton = getByRole('button', { name: 'January 1, 2019' });
    fireEvent.click(firstButton);

    expect(onChange).toHaveBeenCalledWith(nextValue);
  });

  it('calls onChange callback with merged new date & old time when calling internal onDateChange given ISO string', () => {
    const hours = 21;
    const minutes = 40;
    const seconds = 11;
    const ms = 458;

    const onChange = vi.fn();
    const value = new Date(2018, 6, 17, hours, minutes, seconds, ms).toISOString();
    const nextValue = new Date(2019, 0, 1, hours, minutes, seconds, ms);

    const { container, getByRole } = render(
      <DateTimePicker isCalendarOpen onChange={onChange} value={value} />,
    );

    // Navigate up the calendar
    const drillUpButton = container.querySelector(
      '.react-calendar__navigation__label',
    ) as HTMLButtonElement;
    fireEvent.click(drillUpButton); // To year 2018
    fireEvent.click(drillUpButton); // To 2011 – 2020 decade

    // Click year 2019
    const twentyNineteenButton = getByRole('button', { name: '2019' });
    fireEvent.click(twentyNineteenButton);

    // Click January
    const januaryButton = getByRole('button', { name: 'January 2019' });
    fireEvent.click(januaryButton);

    // Click 1st
    const firstButton = getByRole('button', { name: 'January 1, 2019' });
    fireEvent.click(firstButton);

    expect(onChange).toHaveBeenCalledWith(nextValue);
  });

  it('calls onInvalidChange callback when changing value to an invalid one', () => {
    const value = new Date(2023, 0, 31, 21, 40, 11);
    const onInvalidChange = vi.fn();

    const { container } = render(
      <DateTimePicker maxDetail="second" onInvalidChange={onInvalidChange} value={value} />,
    );

    const dayInput = container.querySelector('input[name="day"]') as HTMLInputElement;

    act(() => {
      fireEvent.change(dayInput, { target: { value: '32' } });
    });

    expect(onInvalidChange).toHaveBeenCalled();
  });

  it('clears the value when clicking on a button', () => {
    const onChange = vi.fn();

    const { container } = render(<DateTimePicker onChange={onChange} />);

    const calendar = container.querySelector('.react-calendar');
    const button = container.querySelector(
      'button.react-datetime-picker__clear-button',
    ) as HTMLButtonElement;

    expect(calendar).toBeFalsy();

    fireEvent.click(button);

    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('calls onClick callback when clicked a page (sample of mouse events family)', () => {
    const onClick = vi.fn();

    const { container } = render(<DateTimePicker onClick={onClick} />);

    const wrapper = container.firstElementChild as HTMLDivElement;
    fireEvent.click(wrapper);

    expect(onClick).toHaveBeenCalled();
  });

  it('calls onTouchStart callback when touched a page (sample of touch events family)', () => {
    const onTouchStart = vi.fn();

    const { container } = render(<DateTimePicker onTouchStart={onTouchStart} />);

    const wrapper = container.firstElementChild as HTMLDivElement;
    fireEvent.touchStart(wrapper);

    expect(onTouchStart).toHaveBeenCalled();
  });
});
