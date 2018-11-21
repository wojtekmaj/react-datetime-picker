import React from 'react';
import { mount } from 'enzyme';

import DateTimePicker from '../DateTimePicker';

/* eslint-disable comma-dangle */

describe('DateTimePicker', () => {
  it('passes default name to DateTimeInput', () => {
    const component = mount(
      <DateTimePicker />
    );

    const dateTimeInput = component.find('DateTimeInput');

    expect(dateTimeInput.prop('name')).toBe('datetime');
  });

  it('passes custom name to DateTimeInput', () => {
    const name = 'testName';

    const component = mount(
      <DateTimePicker name={name} />
    );

    const dateTimeInput = component.find('DateTimeInput');

    expect(dateTimeInput.prop('name')).toBe(name);
  });

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

    const dateTimeInput = component.find('DateTimeInput');

    expect(dateTimeInput).toHaveLength(1);
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

  it('renders DateTimeInput and Calendar components when given isCalendarOpen flag', () => {
    const component = mount(
      <DateTimePicker isCalendarOpen />
    );

    const dateTimeInput = component.find('DateTimeInput');
    const calendar = component.find('Calendar');

    expect(dateTimeInput).toHaveLength(1);
    expect(calendar).toHaveLength(1);
  });

  it('renders DateTimeInput and Clock components when given isClockOpen flag', () => {
    const component = mount(
      <DateTimePicker isClockOpen />
    );

    const dateTimeInput = component.find('DateTimeInput');
    const clock = component.find('Clock');

    expect(dateTimeInput).toHaveLength(1);
    expect(clock).toHaveLength(1);
  });

  it('does not render Clock component when given disableClock & isClockOpen flags', () => {
    const component = mount(
      <DateTimePicker disableClock isClockOpen />
    );

    const dateTimeInput = component.find('DateTimeInput');
    const clock = component.find('Clock');

    expect(dateTimeInput).toHaveLength(1);
    expect(clock).toHaveLength(0);
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
    const input = component.find('input[name^="hour"]');

    expect(clock).toHaveLength(0);

    input.simulate('focus');
    component.update();

    const clock2 = component.find('Clock');

    expect(clock2).toHaveLength(1);
  });

  it('closes Calendar component when clicked outside', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const component = mount(
      <DateTimePicker isCalendarOpen />,
      { attachTo: root }
    );

    const event = document.createEvent('MouseEvent');
    event.initEvent('mousedown', true, true);
    document.body.dispatchEvent(event);
    component.update();

    expect(component.state('isCalendarOpen')).toBe(false);
  });

  it('closes Calendar component when focused outside', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const component = mount(
      <DateTimePicker isCalendarOpen />,
      { attachTo: root }
    );

    const event = document.createEvent('FocusEvent');
    event.initEvent('focusin', true, true);
    document.body.dispatchEvent(event);
    component.update();

    expect(component.state('isCalendarOpen')).toBe(false);
  });

  it('closes Clock component when clicked outside', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const component = mount(
      <DateTimePicker isClockOpen />,
      { attachTo: root }
    );

    const event = document.createEvent('MouseEvent');
    event.initEvent('mousedown', true, true);
    document.body.dispatchEvent(event);
    component.update();

    expect(component.state('isClockOpen')).toBe(false);
  });

  it('closes Clock component when focused outside', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const component = mount(
      <DateTimePicker isClockOpen />,
      { attachTo: root }
    );

    const event = document.createEvent('FocusEvent');
    event.initEvent('focusin', true, true);
    document.body.dispatchEvent(event);
    component.update();

    expect(component.state('isClockOpen')).toBe(false);
  });

  it('does not close Calendar component when focused within date inputs', () => {
    const component = mount(
      <DateTimePicker isCalendarOpen />
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.at(0);
    const monthInput = customInputs.at(1);

    dayInput.simulate('blur');
    monthInput.simulate('focus');
    component.update();

    expect(component.state('isCalendarOpen')).toBe(true);
    expect(component.state('isClockOpen')).toBe(false);
  });

  it('does not close Clock component when focused within time inputs', () => {
    const component = mount(
      <DateTimePicker isClockOpen />
    );

    const customInputs = component.find('input[type="number"]');
    const hourInput = customInputs.at(3);
    const minuteInput = customInputs.at(4);

    hourInput.simulate('blur');
    minuteInput.simulate('focus');
    component.update();

    expect(component.state('isCalendarOpen')).toBe(false);
    expect(component.state('isClockOpen')).toBe(true);
  });

  it('closes Clock when Calendar is opened by a click on the calendar icon', () => {
    const component = mount(
      <DateTimePicker isClockOpen />
    );

    const clock = component.find('Clock');
    const button = component.find('button.react-datetime-picker__calendar-button');

    expect(clock).toHaveLength(1);

    button.simulate('click');
    component.update();

    const clock2 = component.find('Clock');

    expect(clock2).toHaveLength(1);
  });
});
