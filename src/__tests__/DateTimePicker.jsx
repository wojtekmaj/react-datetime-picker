import React from 'react';
import { mount } from 'enzyme';

import DateTimePicker from '../DateTimePicker';

/* eslint-disable comma-dangle */

describe('DateTimePicker', () => {
  it('applies className to its wrapper when given a string', () => {
    const className = 'testClassName';

    const component = mount(
      <DateTimePicker className={className} />
    );

    const wrapperClassName = component.prop('className');

    expect(wrapperClassName.includes(className)).toBe(true);
  });

  it('applies calendarClassName to the calendar when given a string', () => {
    const calendarClassName = 'testClassName';

    const component = mount(
      <DateTimePicker
        calendarClassName={calendarClassName}
        isCalendarOpen
      />
    );

    const calendar = component.find('Calendar');
    const calendarWrapperClassName = calendar.prop('className');

    expect(calendarWrapperClassName.includes(calendarClassName)).toBe(true);
  });

  it('applies clockClassName to the clock when given a string', () => {
    const clockClassName = 'testClassName';

    const component = mount(
      <DateTimePicker
        clockClassName={clockClassName}
        isClockOpen
      />
    );

    const clock = component.find('Clock');
    const calendarWrapperClassName = clock.prop('className');

    expect(calendarWrapperClassName.includes(clockClassName)).toBe(true);
  });

  it('renders DateTimeInput component', () => {
    const component = mount(
      <DateTimePicker />
    );

    const dateInput = component.find('DateTimeInput');

    expect(dateInput).toHaveLength(1);
  });

  it('renders clear button', () => {
    const component = mount(
      <DateTimePicker />
    );

    const clearButton = component.find('button.react-datetime-picker__clear-button');

    expect(clearButton).toHaveLength(1);
  });

  it('renders calendar button', () => {
    const component = mount(
      <DateTimePicker />
    );

    const calendarButton = component.find('button.react-datetime-picker__calendar-button');

    expect(calendarButton).toHaveLength(1);
  });

  it('renders DateInput and Calendar component when given isOpen flag', () => {
    const component = mount(
      <DateTimePicker isCalendarOpen />
    );

    const dateInput = component.find('DateTimeInput');
    const calendar = component.find('Calendar');

    expect(dateInput).toHaveLength(1);
    expect(calendar).toHaveLength(1);
  });

  it('renders DateInput and Clock component when given isOpen flag', () => {
    const component = mount(
      <DateTimePicker isClockOpen />
    );

    const dateInput = component.find('DateTimeInput');
    const clock = component.find('Clock');

    expect(dateInput).toHaveLength(1);
    expect(clock).toHaveLength(1);
  });

  it('opens Calendar component when given isCalendarOpen flag by changing props', () => {
    const component = mount(
      <DateTimePicker />
    );

    const calendar = component.find('Calendar');

    expect(calendar).toHaveLength(0);

    component.setProps({ isCalendarOpen: true });
    component.update();

    const calendar2 = component.find('Calendar');

    expect(calendar2).toHaveLength(1);
  });

  it('opens Clock component when given isClockOpen flag by changing props', () => {
    const component = mount(
      <DateTimePicker />
    );

    const clock = component.find('Clock');

    expect(clock).toHaveLength(0);

    component.setProps({ isClockOpen: true });
    component.update();

    const clock2 = component.find('Clock');

    expect(clock2).toHaveLength(1);
  });

  it('opens Calendar component when clicking on a button', () => {
    const component = mount(
      <DateTimePicker />
    );

    const calendar = component.find('Calendar');
    const button = component.find('button.react-datetime-picker__calendar-button');

    expect(calendar).toHaveLength(0);

    button.simulate('click');
    component.update();

    const calendar2 = component.find('Calendar');

    expect(calendar2).toHaveLength(1);
  });

  it('opens Calendar component when focusing on a date input inside', () => {
    const component = mount(
      <DateTimePicker />
    );

    const calendar = component.find('Calendar');
    const input = component.find('input[name="day"]');

    expect(calendar).toHaveLength(0);

    input.simulate('focus');
    component.update();

    const calendar2 = component.find('Calendar');

    expect(calendar2).toHaveLength(1);
  });

  it('opens Clock component when focusing on a time input inside', () => {
    const component = mount(
      <DateTimePicker />
    );

    const clock = component.find('Clock');
    const input = component.find('input[name="hour"]');

    expect(clock).toHaveLength(0);

    input.simulate('focus');
    component.update();

    const clock2 = component.find('Clock');

    expect(clock2).toHaveLength(1);
  });
});
