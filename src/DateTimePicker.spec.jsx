import React from 'react';
import { mount } from 'enzyme';

import DateTimePicker from './DateTimePicker';

describe('DateTimePicker', () => {
  it('passes default name to DateTimeInput', () => {
    const component = mount(
      <DateTimePicker />,
    );

    const dateTimeInput = component.find('DateTimeInput');

    expect(dateTimeInput.prop('name')).toBe('datetime');
  });

  it('passes custom name to DateTimeInput', () => {
    const name = 'testName';

    const component = mount(
      <DateTimePicker name={name} />,
    );

    const dateTimeInput = component.find('DateTimeInput');

    expect(dateTimeInput.prop('name')).toBe(name);
  });

  it('passes autoFocus flag to DateTimeInput', () => {
    const component = mount(
      <DateTimePicker autoFocus />,
    );

    const dateTimeInput = component.find('DateTimeInput');

    expect(dateTimeInput.prop('autoFocus')).toBeTruthy();
  });

  it('passes disabled flag to DateTimeInput', () => {
    const component = mount(
      <DateTimePicker disabled />,
    );

    const dateTimeInput = component.find('DateTimeInput');

    expect(dateTimeInput.prop('disabled')).toBeTruthy();
  });

  it('passes format to DateTimeInput', () => {
    const format = 'y-MM-dd h:mm:ss a';

    const component = mount(
      <DateTimePicker format={format} />,
    );

    const dateTimeInput = component.find('DateTimeInput');

    expect(dateTimeInput.prop('format')).toBe(format);
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

    const component = mount(
      <DateTimePicker {...ariaLabelProps} />,
    );

    const calendarButton = component.find('button.react-datetime-picker__calendar-button');
    const clearButton = component.find('button.react-datetime-picker__clear-button');
    const dateTimeInput = component.find('DateTimeInput');

    expect(calendarButton.prop('aria-label')).toBe(ariaLabelProps.calendarAriaLabel);
    expect(clearButton.prop('aria-label')).toBe(ariaLabelProps.clearAriaLabel);
    expect(dateTimeInput.prop('amPmAriaLabel')).toBe(ariaLabelProps.amPmAriaLabel);
    expect(dateTimeInput.prop('dayAriaLabel')).toBe(ariaLabelProps.dayAriaLabel);
    expect(dateTimeInput.prop('hourAriaLabel')).toBe(ariaLabelProps.hourAriaLabel);
    expect(dateTimeInput.prop('minuteAriaLabel')).toBe(ariaLabelProps.minuteAriaLabel);
    expect(dateTimeInput.prop('monthAriaLabel')).toBe(ariaLabelProps.monthAriaLabel);
    expect(dateTimeInput.prop('nativeInputAriaLabel')).toBe(ariaLabelProps.nativeInputAriaLabel);
    expect(dateTimeInput.prop('secondAriaLabel')).toBe(ariaLabelProps.secondAriaLabel);
    expect(dateTimeInput.prop('yearAriaLabel')).toBe(ariaLabelProps.yearAriaLabel);
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

    const component = mount(
      <DateTimePicker {...placeholderProps} />,
    );

    const dateTimeInput = component.find('DateTimeInput');

    expect(dateTimeInput.prop('dayPlaceholder')).toBe(placeholderProps.dayPlaceholder);
    expect(dateTimeInput.prop('hourPlaceholder')).toBe(placeholderProps.hourPlaceholder);
    expect(dateTimeInput.prop('minutePlaceholder')).toBe(placeholderProps.minutePlaceholder);
    expect(dateTimeInput.prop('monthPlaceholder')).toBe(placeholderProps.monthPlaceholder);
    expect(dateTimeInput.prop('secondPlaceholder')).toBe(placeholderProps.secondPlaceholder);
    expect(dateTimeInput.prop('yearPlaceholder')).toBe(placeholderProps.yearPlaceholder);
  });

  describe('passes value to DateTimeInput', () => {
    it('passes single value to DateTimeInput', () => {
      const value = new Date(2019, 0, 1);

      const component = mount(
        <DateTimePicker value={value} />,
      );

      const dateTimeInput = component.find('DateTimeInput');

      expect(dateTimeInput.prop('value')).toBe(value);
    });

    it('passes the first item of an array of values to DateTimeInput', () => {
      const value1 = new Date(2019, 0, 1);
      const value2 = new Date(2019, 6, 1);

      const component = mount(
        <DateTimePicker value={[value1, value2]} />,
      );

      const dateTimeInput = component.find('DateTimeInput');

      expect(dateTimeInput.prop('value')).toBe(value1);
    });
  });

  it('applies className to its wrapper when given a string', () => {
    const className = 'testClassName';

    const component = mount(
      <DateTimePicker className={className} />,
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
      />,
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
      />,
    );

    const clock = component.find('Clock');
    const calendarWrapperClassName = clock.prop('className');

    expect(calendarWrapperClassName.includes(clockClassName)).toBe(true);
  });

  it('renders DateTimeInput component', () => {
    const component = mount(
      <DateTimePicker />,
    );

    const dateTimeInput = component.find('DateTimeInput');

    expect(dateTimeInput).toHaveLength(1);
  });

  it('renders clear button', () => {
    const component = mount(
      <DateTimePicker />,
    );

    const clearButton = component.find('button.react-datetime-picker__clear-button');

    expect(clearButton).toHaveLength(1);
  });

  it('renders calendar button', () => {
    const component = mount(
      <DateTimePicker />,
    );

    const calendarButton = component.find('button.react-datetime-picker__calendar-button');

    expect(calendarButton).toHaveLength(1);
  });

  it('renders DateTimeInput and Calendar components when given isCalendarOpen flag', () => {
    const component = mount(
      <DateTimePicker isCalendarOpen />,
    );

    const dateTimeInput = component.find('DateTimeInput');
    const calendar = component.find('Calendar');

    expect(dateTimeInput).toHaveLength(1);
    expect(calendar).toHaveLength(1);
  });

  it('renders DateTimeInput and Clock components when given isClockOpen flag', () => {
    const component = mount(
      <DateTimePicker isClockOpen />,
    );

    const dateTimeInput = component.find('DateTimeInput');
    const clock = component.find('Clock');

    expect(dateTimeInput).toHaveLength(1);
    expect(clock).toHaveLength(1);
  });

  it('does not render Calendar component when given disableCalendar & isCalendarOpen flags', () => {
    const component = mount(
      <DateTimePicker disableCalendar isCalendarOpen />,
    );

    const dateTimeInput = component.find('DateTimeInput');
    const calendar = component.find('Calendar');

    expect(dateTimeInput).toHaveLength(1);
    expect(calendar).toHaveLength(0);
  });

  it('does not render Clock component when given disableClock & isClockOpen flags', () => {
    const component = mount(
      <DateTimePicker disableClock isClockOpen />,
    );

    const dateTimeInput = component.find('DateTimeInput');
    const clock = component.find('Clock');

    expect(dateTimeInput).toHaveLength(1);
    expect(clock).toHaveLength(0);
  });

  it('opens Calendar component when given isCalendarOpen flag by changing props', () => {
    const component = mount(
      <DateTimePicker />,
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
      <DateTimePicker />,
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
      <DateTimePicker />,
    );

    const calendar = component.find('Calendar');
    const button = component.find('button.react-datetime-picker__calendar-button');

    expect(calendar).toHaveLength(0);

    button.simulate('click');
    component.update();

    const calendar2 = component.find('Calendar');

    expect(calendar2).toHaveLength(1);
  });

  describe('handles opening Calendar component when focusing on an input inside properly', () => {
    it('opens Calendar component when focusing on an input inside by default', () => {
      const component = mount(
        <DateTimePicker />,
      );

      const calendar = component.find('Calendar');
      const input = component.find('input[name="day"]');

      expect(calendar).toHaveLength(0);

      input.simulate('focus');
      component.update();

      const calendar2 = component.find('Calendar');

      expect(calendar2).toHaveLength(1);
    });

    it('opens Calendar component when focusing on an input inside given openWidgetsOnFocus = true', () => {
      const component = mount(
        <DateTimePicker openWidgetsOnFocus />,
      );

      const calendar = component.find('Calendar');
      const input = component.find('input[name="day"]');

      expect(calendar).toHaveLength(0);

      input.simulate('focus');
      component.update();

      const calendar2 = component.find('Calendar');

      expect(calendar2).toHaveLength(1);
    });

    it('does not open Calendar component when focusing on an input inside given openWidgetsOnFocus = false', () => {
      const component = mount(
        <DateTimePicker openWidgetsOnFocus={false} />,
      );

      const calendar = component.find('Calendar');
      const input = component.find('input[name="day"]');

      expect(calendar).toHaveLength(0);

      input.simulate('focus');
      component.update();

      const calendar2 = component.find('Calendar');

      expect(calendar2).toHaveLength(0);
    });

    it('does not open Calendar component when focusing on a select element', () => {
      const component = mount(
        <DateTimePicker format="dd.MMMM.yyyy hh:mm:ss a" />,
      );

      const calendar = component.find('Calendar');
      const select = component.find('select[name="month"]');

      expect(calendar).toHaveLength(0);

      select.simulate('focus');
      component.update();

      const calendar2 = component.find('Calendar');

      expect(calendar2).toHaveLength(0);
    });
  });

  describe('handles opening Clock component when focusing on an input inside properly', () => {
    it('opens Clock component when focusing on an input inside by default', () => {
      const component = mount(
        <DateTimePicker />,
      );

      const clock = component.find('Clock');
      const input = component.find('input[name^="hour"]');

      expect(clock).toHaveLength(0);

      input.simulate('focus');
      component.update();

      const clock2 = component.find('Clock');

      expect(clock2).toHaveLength(1);
    });

    it('opens Clock component when focusing on an input inside given openWidgetsOnFocus = true', () => {
      const component = mount(
        <DateTimePicker openWidgetsOnFocus />,
      );

      const clock = component.find('Clock');
      const input = component.find('input[name^="hour"]');

      expect(clock).toHaveLength(0);

      input.simulate('focus');
      component.update();

      const clock2 = component.find('Clock');

      expect(clock2).toHaveLength(1);
    });

    it('does not open Clock component when focusing on an input inside given openWidgetsOnFocus = false', () => {
      const component = mount(
        <DateTimePicker openWidgetsOnFocus={false} />,
      );

      const clock = component.find('Clock');
      const input = component.find('input[name^="hour"]');

      expect(clock).toHaveLength(0);

      input.simulate('focus');
      component.update();

      const clock2 = component.find('Clock');

      expect(clock2).toHaveLength(0);
    });

    it('does not open Clock component when focusing on a select element', () => {
      const component = mount(
        <DateTimePicker format="dd.MMMM.yyyy hh:mm:ss a" />,
      );

      const clock = component.find('Clock');
      const select = component.find('select[name="amPm"]');

      expect(clock).toHaveLength(0);

      select.simulate('focus');
      component.update();

      const clock2 = component.find('Clock');

      expect(clock2).toHaveLength(0);
    });
  });

  it('closes Calendar component when clicked outside', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const component = mount(
      <DateTimePicker isCalendarOpen />,
      { attachTo: root },
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
      { attachTo: root },
    );

    const event = document.createEvent('FocusEvent');
    event.initEvent('focusin', true, true);
    document.body.dispatchEvent(event);
    component.update();

    expect(component.state('isCalendarOpen')).toBe(false);
  });

  it('closes Calendar component when tapped outside', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const component = mount(
      <DateTimePicker isCalendarOpen />,
      { attachTo: root },
    );

    const event = document.createEvent('TouchEvent');
    event.initEvent('touchstart', true, true);
    document.body.dispatchEvent(event);
    component.update();

    expect(component.state('isCalendarOpen')).toBe(false);
  });

  it('closes Clock component when clicked outside', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const component = mount(
      <DateTimePicker isClockOpen />,
      { attachTo: root },
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
      { attachTo: root },
    );

    const event = document.createEvent('FocusEvent');
    event.initEvent('focusin', true, true);
    document.body.dispatchEvent(event);
    component.update();

    expect(component.state('isClockOpen')).toBe(false);
  });

  it('closes Clock component when tapped outside', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const component = mount(
      <DateTimePicker isClockOpen />,
      { attachTo: root },
    );

    const event = document.createEvent('TouchEvent');
    event.initEvent('touchstart', true, true);
    document.body.dispatchEvent(event);
    component.update();

    expect(component.state('isClockOpen')).toBe(false);
  });

  it('does not close Calendar component when focused within date inputs', () => {
    const component = mount(
      <DateTimePicker isCalendarOpen />,
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
      <DateTimePicker isClockOpen />,
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
      <DateTimePicker isClockOpen />,
    );

    const clock = component.find('Clock');
    const button = component.find('button.react-datetime-picker__calendar-button');

    expect(clock).toHaveLength(1);

    button.simulate('click');
    component.update();

    const clock2 = component.find('Clock');

    expect(clock2).toHaveLength(1);
  });

  it('closes Calendar when calling internal onChange by default', () => {
    const component = mount(
      <DateTimePicker isCalendarOpen />,
    );

    const { onChange } = component.instance();

    onChange(new Date());

    expect(component.state('isCalendarOpen')).toBe(false);
  });

  it('does not close Calendar when calling internal onChange with prop closeWidgets = false', () => {
    const component = mount(
      <DateTimePicker
        closeWidgets={false}
        isCalendarOpen
      />,
    );

    const { onChange } = component.instance();

    onChange(new Date());

    expect(component.state('isCalendarOpen')).toBe(true);
  });

  it('does not close Calendar when calling internal onChange with closeWidgets = false', () => {
    const component = mount(
      <DateTimePicker isCalendarOpen />,
    );

    const { onChange } = component.instance();

    onChange(new Date(), false);

    expect(component.state('isCalendarOpen')).toBe(true);
  });

  it('closes Clock when calling internal onChange by default', () => {
    const component = mount(
      <DateTimePicker isClockOpen />,
    );

    const { onChange } = component.instance();

    onChange(new Date());

    expect(component.state('isClockOpen')).toBe(false);
  });

  it('does not close Clock when calling internal onChange with prop closeWidgets = false', () => {
    const component = mount(
      <DateTimePicker
        closeWidgets={false}
        isClockOpen
      />,
    );

    const { onChange } = component.instance();

    onChange(new Date());

    expect(component.state('isClockOpen')).toBe(true);
  });

  it('does not close Clock when calling internal onChange with closeWidgets = false', () => {
    const component = mount(
      <DateTimePicker isClockOpen />,
    );

    const { onChange } = component.instance();

    onChange(new Date(), false);

    expect(component.state('isClockOpen')).toBe(true);
  });

  it('calls onChange callback when calling internal internal onChange', () => {
    const nextValue = new Date(2019, 0, 1, 21, 40, 11, 458);
    const onChange = jest.fn();

    const component = mount(
      <DateTimePicker
        onChange={onChange}
        value={new Date(2018, 6, 17)}
      />,
    );

    const { onChange: onChangeInternal } = component.instance();

    onChangeInternal(nextValue);

    expect(onChange).toHaveBeenCalledWith(nextValue);
  });

  it('calls onChange callback with merged new date & old time when calling internal onDateChange', () => {
    const hours = 21;
    const minutes = 40;
    const seconds = 11;
    const ms = 458;

    const nextValue = new Date(2019, 0, 1);
    const onChange = jest.fn();

    const component = mount(
      <DateTimePicker
        onChange={onChange}
        value={new Date(2018, 6, 17, hours, minutes, seconds, ms)}
      />,
    );

    const { onDateChange } = component.instance();

    onDateChange(nextValue);

    expect(onChange).toHaveBeenCalledWith(new Date(2019, 0, 1, hours, minutes, seconds, ms));
  });

  it('clears the value when clicking on a button', () => {
    const onChange = jest.fn();

    const component = mount(
      <DateTimePicker onChange={onChange} />,
    );

    const calendar = component.find('Calendar');
    const button = component.find('button.react-datetime-picker__clear-button');

    expect(calendar).toHaveLength(0);

    button.simulate('click');
    component.update();

    expect(onChange).toHaveBeenCalledWith(null);
  });
});
