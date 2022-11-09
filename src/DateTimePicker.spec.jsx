import React, { createRef } from 'react';
import { act, fireEvent, render, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DateTimePicker from './DateTimePicker';

async function waitForElementToBeRemovedOrHidden(callback) {
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

  // See https://github.com/jsdom/jsdom/issues/3041
  it.skip('passes autoFocus flag to DateTimeInput', () => {
    // eslint-disable-next-line jsx-a11y/no-autofocus
    const { container } = render(<DateTimePicker autoFocus />);

    const customInputs = container.querySelectorAll('input[data-input]');

    expect(customInputs[0]).toHaveAttribute('autofocus');
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

    const wrapper = container.firstChild;

    expect(wrapper).toHaveClass(className);
  });

  it('applies "--open" className to its wrapper when given isCalendarOpen flag', () => {
    const { container } = render(<DateTimePicker isCalendarOpen />);

    const wrapper = container.firstChild;

    expect(wrapper).toHaveClass('react-datetime-picker--open');
  });

  it('applies "--open" className to its wrapper when given isClockOpen flag', () => {
    const { container } = render(<DateTimePicker isClockOpen />);

    const wrapper = container.firstChild;

    expect(wrapper).toHaveClass('react-datetime-picker--open');
  });

  it('applies calendarClassName to the calendar when given a string', () => {
    const calendarClassName = 'testClassName';

    const { container } = render(
      <DateTimePicker calendarClassName={calendarClassName} isCalendarOpen />,
    );

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toHaveClass(calendarClassName);
  });

  it('applies clockClassName to the clock when given a string', () => {
    const clockClassName = 'testClassName';

    const { container } = render(<DateTimePicker clockClassName={clockClassName} isClockOpen />);

    const clock = container.querySelector('.react-clock');

    expect(clock).toHaveClass(clockClassName);
  });

  it('renders DateTimeInput component', () => {
    const { container } = render(<DateTimePicker />);

    const nativeInput = container.querySelector('input[type="datetime-local"]');

    expect(nativeInput).toBeInTheDocument();
  });

  it('renders clear button', () => {
    const { container } = render(<DateTimePicker />);

    const clearButton = container.querySelector('button.react-datetime-picker__clear-button');

    expect(clearButton).toBeInTheDocument();
  });

  it('renders calendar button', () => {
    const { container } = render(<DateTimePicker />);

    const calendarButton = container.querySelector('button.react-datetime-picker__calendar-button');

    expect(calendarButton).toBeInTheDocument();
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
    const button = container.querySelector('button.react-datetime-picker__calendar-button');

    expect(calendar).toBeFalsy();

    fireEvent.click(button);

    const calendar2 = container.querySelector('.react-calendar');

    expect(calendar2).toBeInTheDocument();
  });

  describe('handles opening Calendar component when focusing on an input inside properly', () => {
    it('opens Calendar component when focusing on an input inside by default', () => {
      const { container } = render(<DateTimePicker />);

      const calendar = container.querySelector('.react-calendar');
      const input = container.querySelector('input[name="day"]');

      expect(calendar).toBeFalsy();

      fireEvent.focus(input);

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeInTheDocument();
    });

    it('opens Calendar component when focusing on an input inside given openWidgetsOnFocus = true', () => {
      const { container } = render(<DateTimePicker openWidgetsOnFocus />);

      const calendar = container.querySelector('.react-calendar');
      const input = container.querySelector('input[name="day"]');

      expect(calendar).toBeFalsy();

      fireEvent.focus(input);

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeInTheDocument();
    });

    it('does not open Calendar component when focusing on an input inside given openWidgetsOnFocus = false', () => {
      const { container } = render(<DateTimePicker openWidgetsOnFocus={false} />);

      const calendar = container.querySelector('.react-calendar');
      const input = container.querySelector('input[name="day"]');

      expect(calendar).toBeFalsy();

      fireEvent.focus(input);

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeFalsy();
    });

    it('does not open Calendar component when focusing on a select element', () => {
      const { container } = render(<DateTimePicker format="dd.MMMM.yyyy hh:mm:ss a" />);

      const calendar = container.querySelector('.react-calendar');
      const select = container.querySelector('select[name="month"]');

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
      const input = container.querySelector('input[name^="hour"]');

      expect(clock).toBeFalsy();

      fireEvent.focus(input);

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeInTheDocument();
    });

    it('opens Clock component when focusing on an input inside given openWidgetsOnFocus = true', () => {
      const { container } = render(<DateTimePicker openWidgetsOnFocus />);

      const clock = container.querySelector('.react-clock');
      const input = container.querySelector('input[name^="hour"]');

      expect(clock).toBeFalsy();

      fireEvent.focus(input);

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeInTheDocument();
    });

    it('does not open Clock component when focusing on an input inside given openWidgetsOnFocus = false', () => {
      const { container } = render(<DateTimePicker openWidgetsOnFocus={false} />);

      const clock = container.querySelector('.react-clock');
      const input = container.querySelector('input[name^="hour"]');

      expect(clock).toBeFalsy();

      fireEvent.focus(input);

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeFalsy();
    });

    it('does not open Clock component when focusing on a select element', () => {
      const { container } = render(<DateTimePicker format="dd.MMMM.yyyy hh:mm:ss a" />);

      const clock = container.querySelector('.react-clock');
      const select = container.querySelector('select[name="amPm"]');

      expect(clock).toBeFalsy();

      fireEvent.focus(select);

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeFalsy();
    });
  });

  it('closes Calendar component when clicked outside', async () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const { container } = render(<DateTimePicker isCalendarOpen />, { attachTo: root });

    userEvent.click(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__calendar'),
    );
  });

  it('closes Calendar component when focused outside', async () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const { container } = render(<DateTimePicker isCalendarOpen />, { attachTo: root });

    fireEvent.focusIn(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__calendar'),
    );
  });

  it('closes Calendar component when tapped outside', async () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const { container } = render(<DateTimePicker isCalendarOpen />, { attachTo: root });

    fireEvent.touchStart(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__calendar'),
    );
  });

  it('closes Clock component when clicked outside', async () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const { container } = render(<DateTimePicker isClockOpen />, { attachTo: root });

    userEvent.click(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__clock'),
    );
  });

  it('closes Clock component when focused outside', async () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const { container } = render(<DateTimePicker isClockOpen />, { attachTo: root });

    fireEvent.focusIn(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__clock'),
    );
  });

  it('closes Clock component when tapped outside', async () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const { container } = render(<DateTimePicker isClockOpen />, { attachTo: root });

    fireEvent.touchStart(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__clock'),
    );
  });

  it('does not close Calendar component when focused within date inputs', () => {
    const { container } = render(<DateTimePicker isCalendarOpen />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const dayInput = customInputs[0];
    const monthInput = customInputs[1];

    fireEvent.blur(dayInput);
    fireEvent.focus(monthInput);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('does not close Clock component when focused within time inputs', () => {
    const { container } = render(<DateTimePicker isClockOpen />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const hourInput = customInputs[3];
    const minuteInput = customInputs[4];

    fireEvent.blur(hourInput);
    fireEvent.focus(minuteInput);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('closes Clock when Calendar is opened by a click on the calendar icon', async () => {
    const { container } = render(<DateTimePicker isClockOpen />);

    const clock = container.querySelector('.react-clock');
    const button = container.querySelector('button.react-datetime-picker__calendar-button');

    expect(clock).toBeInTheDocument();

    fireEvent.click(button);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__clock'),
    );
  });

  it('closes Calendar when calling internal onChange by default', async () => {
    const instance = createRef();

    const { container } = render(<DateTimePicker isCalendarOpen ref={instance} />);

    const { onChange: onChangeInternal } = instance.current;

    act(() => {
      onChangeInternal(new Date());
    });

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__calendar'),
    );
  });

  it('does not close Calendar when calling internal onChange with prop closeWidgets = false', () => {
    const instance = createRef();

    const { container } = render(
      <DateTimePicker closeWidgets={false} isCalendarOpen ref={instance} />,
    );

    const { onChange: onChangeInternal } = instance.current;

    act(() => {
      onChangeInternal(new Date());
    });

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('does not close Calendar when calling internal onChange with closeWidgets = false', () => {
    const instance = createRef();

    const { container } = render(<DateTimePicker isCalendarOpen ref={instance} />);

    const { onChange: onChangeInternal } = instance.current;

    act(() => {
      onChangeInternal(new Date(), false);
    });

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('closes Clock when calling internal onChange by default', async () => {
    const instance = createRef();

    const { container } = render(<DateTimePicker isClockOpen ref={instance} />);

    const { onChange: onChangeInternal } = instance.current;

    act(() => {
      onChangeInternal(new Date());
    });

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetime-picker__clock'),
    );
  });

  it('does not close Clock when calling internal onChange with prop closeWidgets = false', () => {
    const instance = createRef();

    const { container } = render(
      <DateTimePicker closeWidgets={false} isClockOpen ref={instance} />,
    );

    const { onChange: onChangeInternal } = instance.current;

    act(() => {
      onChangeInternal(new Date());
    });

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('does not close Clock when calling internal onChange with closeWidgets = false', () => {
    const instance = createRef();

    const { container } = render(<DateTimePicker isClockOpen ref={instance} />);

    const { onChange: onChangeInternal } = instance.current;

    act(() => {
      onChangeInternal(new Date(), false);
    });

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('calls onChange callback when calling internal internal onChange', () => {
    const instance = createRef();
    const nextValue = new Date(2019, 0, 1, 21, 40, 11, 458);
    const onChange = jest.fn();

    render(<DateTimePicker onChange={onChange} value={new Date(2018, 6, 17)} ref={instance} />);

    const { onChange: onChangeInternal } = instance.current;

    act(() => {
      onChangeInternal(nextValue);
    });

    expect(onChange).toHaveBeenCalledWith(nextValue);
  });

  it('calls onChange callback with merged new date & old time when calling internal onDateChange', () => {
    const instance = createRef();
    const hours = 21;
    const minutes = 40;
    const seconds = 11;
    const ms = 458;

    const nextValue = new Date(2019, 0, 1);
    const onChange = jest.fn();

    render(
      <DateTimePicker
        onChange={onChange}
        value={new Date(2018, 6, 17, hours, minutes, seconds, ms)}
        ref={instance}
      />,
    );

    const { onDateChange: onDateChangeInternal } = instance.current;

    act(() => {
      onDateChangeInternal(nextValue);
    });

    expect(onChange).toHaveBeenCalledWith(new Date(2019, 0, 1, hours, minutes, seconds, ms));
  });

  it('clears the value when clicking on a button', () => {
    const onChange = jest.fn();

    const { container } = render(<DateTimePicker onChange={onChange} />);

    const calendar = container.querySelector('.react-calendar');
    const button = container.querySelector('button.react-datetime-picker__clear-button');

    expect(calendar).toBeFalsy();

    fireEvent.click(button);

    expect(onChange).toHaveBeenCalledWith(null);
  });
});
