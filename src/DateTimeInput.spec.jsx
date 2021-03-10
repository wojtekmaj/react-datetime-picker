import React from 'react';
import { mount } from 'enzyme';

import DateTimeInput from './DateTimeInput';

import { muteConsole, restoreConsole } from '../test-utils';

const hasFullICU = (() => {
  try {
    const date = new Date(2018, 0, 1, 21);
    const formatter = new Intl.DateTimeFormat('de-DE', { hour: 'numeric' });
    return formatter.format(date) === '21';
  } catch (err) {
    return false;
  }
})();

const itIfFullICU = hasFullICU ? it : it.skip;

const keyCodes = {
  ArrowLeft: 37,
  ArrowUp: 38,
  ArrowRight: 39,
  ArrowDown: 40,
  '-': 189,
  '.': 190,
  '/': 191,
};

const getKey = (key) => ({
  keyCode: keyCodes[key],
  which: keyCodes[key],
  key,
});

describe('DateTimeInput', () => {
  const defaultProps = {
    className: 'react-datetime-picker__inputGroup',
  };

  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'container';
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  it('renders a native input and custom inputs', () => {
    const component = mount(
      <DateTimeInput {...defaultProps} />,
    );

    const nativeInput = component.find('input[type="datetime-local"]');
    const customInputs = component.find('input[type="number"]');

    expect(nativeInput).toHaveLength(1);
    expect(customInputs).toHaveLength(5);
  });

  it('does not render second input when maxDetail is "minute" or less', () => {
    const component = mount(
      <DateTimeInput
        {...defaultProps}
        maxDetail="minute"
      />,
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.find('input[name="day"]');
    const monthInput = customInputs.find('input[name="month"]');
    const yearInput = customInputs.find('input[name="year"]');
    const secondInput = customInputs.find('input[name="second"]');
    const minuteInput = customInputs.find('input[name="minute"]');
    const hourInput = customInputs.find('input[name^="hour"]');

    expect(customInputs).toHaveLength(5);

    expect(yearInput).toHaveLength(1);
    expect(monthInput).toHaveLength(1);
    expect(dayInput).toHaveLength(1);
    expect(hourInput).toHaveLength(1);
    expect(minuteInput).toHaveLength(1);
    expect(secondInput).toHaveLength(0);
  });

  it('does not render second and minute inputs when maxDetail is "hour" or less', () => {
    const component = mount(
      <DateTimeInput
        {...defaultProps}
        maxDetail="hour"
      />,
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.find('input[name="day"]');
    const monthInput = customInputs.find('input[name="month"]');
    const yearInput = customInputs.find('input[name="year"]');
    const secondInput = customInputs.find('input[name="second"]');
    const minuteInput = customInputs.find('input[name="minute"]');
    const hourInput = customInputs.find('input[name^="hour"]');

    expect(customInputs).toHaveLength(4);

    expect(yearInput).toHaveLength(1);
    expect(monthInput).toHaveLength(1);
    expect(dayInput).toHaveLength(1);
    expect(hourInput).toHaveLength(1);
    expect(minuteInput).toHaveLength(0);
    expect(secondInput).toHaveLength(0);
  });

  it('shows a given date in all inputs correctly given Date (12-hour format)', () => {
    const date = new Date(2017, 8, 30, 22, 17, 0);

    const component = mount(
      <DateTimeInput
        {...defaultProps}
        maxDetail="second"
        value={date}
      />,
    );

    const nativeInput = component.find('input[type="datetime-local"]');
    const customInputs = component.find('input[type="number"]');

    expect(nativeInput.prop('value')).toBe('2017-09-30T22:17:00');
    expect(customInputs.at(0).prop('value')).toBe('9');
    expect(customInputs.at(1).prop('value')).toBe('30');
    expect(customInputs.at(2).prop('value')).toBe('2017');
    expect(customInputs.at(3).prop('value')).toBe('10');
    expect(customInputs.at(4).prop('value')).toBe('17');
    expect(customInputs.at(5).prop('value')).toBe('0');
  });

  it('shows a given date in all inputs correctly given array of Date objects (12-hour format)', () => {
    const date = [new Date(2017, 8, 30, 22, 17, 0), new Date(2017, 8, 30, 0, 0, 0, -1)];

    const component = mount(
      <DateTimeInput
        {...defaultProps}
        maxDetail="second"
        value={date}
      />,
    );

    const nativeInput = component.find('input[type="datetime-local"]');
    const customInputs = component.find('input[type="number"]');

    expect(nativeInput.prop('value')).toBe('2017-09-30T22:17:00');
    expect(customInputs.at(0).prop('value')).toBe('9');
    expect(customInputs.at(1).prop('value')).toBe('30');
    expect(customInputs.at(2).prop('value')).toBe('2017');
    expect(customInputs.at(3).prop('value')).toBe('10');
    expect(customInputs.at(4).prop('value')).toBe('17');
    expect(customInputs.at(5).prop('value')).toBe('0');
  });

  it('shows a given date in all inputs correctly given ISO string (12-hour format)', () => {
    const date = '2017-09-30T22:17:00.000';

    const component = mount(
      <DateTimeInput
        {...defaultProps}
        maxDetail="second"
        value={date}
      />,
    );

    const nativeInput = component.find('input[type="datetime-local"]');
    const customInputs = component.find('input[type="number"]');

    expect(nativeInput.prop('value')).toBe('2017-09-30T22:17:00');
    expect(customInputs.at(0).prop('value')).toBe('9');
    expect(customInputs.at(1).prop('value')).toBe('30');
    expect(customInputs.at(2).prop('value')).toBe('2017');
    expect(customInputs.at(3).prop('value')).toBe('10');
    expect(customInputs.at(4).prop('value')).toBe('17');
    expect(customInputs.at(5).prop('value')).toBe('0');
  });

  itIfFullICU('shows a given date in all inputs correctly given Date (24-hour format)', () => {
    const date = new Date(2017, 8, 30, 22, 17, 0);

    const component = mount(
      <DateTimeInput
        {...defaultProps}
        locale="de-DE"
        maxDetail="second"
        value={date}
      />,
    );

    const nativeInput = component.find('input[type="datetime-local"]');
    const customInputs = component.find('input[type="number"]');

    expect(nativeInput.prop('value')).toBe('2017-09-30T22:17:00');
    expect(customInputs.at(0).prop('value')).toBe('2017');
    expect(customInputs.at(1).prop('value')).toBe('9');
    expect(customInputs.at(2).prop('value')).toBe('30');
    expect(customInputs.at(3).prop('value')).toBe('22');
    expect(customInputs.at(4).prop('value')).toBe('17');
    expect(customInputs.at(5).prop('value')).toBe('0');
  });

  itIfFullICU('shows a given date in all inputs correctly given array of Date objects (24-hour format)', () => {
    const date = [new Date(2017, 8, 30, 22, 17, 0), new Date(2017, 8, 30, 0, 0, 0, -1)];

    const component = mount(
      <DateTimeInput
        {...defaultProps}
        locale="de-DE"
        maxDetail="second"
        value={date}
      />,
    );

    const nativeInput = component.find('input[type="datetime-local"]');
    const customInputs = component.find('input[type="number"]');

    expect(nativeInput.prop('value')).toBe('2017-09-30T22:17:00');
    expect(customInputs.at(0).prop('value')).toBe('2017');
    expect(customInputs.at(1).prop('value')).toBe('9');
    expect(customInputs.at(2).prop('value')).toBe('30');
    expect(customInputs.at(3).prop('value')).toBe('22');
    expect(customInputs.at(4).prop('value')).toBe('17');
    expect(customInputs.at(5).prop('value')).toBe('0');
  });

  itIfFullICU('shows a given date in all inputs correctly given ISO string (24-hour format)', () => {
    const date = '2017-09-30T22:17:00.000';

    const component = mount(
      <DateTimeInput
        {...defaultProps}
        locale="de-DE"
        maxDetail="second"
        value={date}
      />,
    );

    const nativeInput = component.find('input[type="datetime-local"]');
    const customInputs = component.find('input[type="number"]');

    expect(nativeInput.prop('value')).toBe('2017-09-30T22:17:00');
    expect(customInputs.at(0).prop('value')).toBe('2017');
    expect(customInputs.at(1).prop('value')).toBe('9');
    expect(customInputs.at(2).prop('value')).toBe('30');
    expect(customInputs.at(3).prop('value')).toBe('22');
    expect(customInputs.at(4).prop('value')).toBe('17');
    expect(customInputs.at(5).prop('value')).toBe('0');
  });

  it('shows empty value in all inputs correctly given null', () => {
    const component = mount(
      <DateTimeInput
        {...defaultProps}
        maxDetail="second"
        value={null}
      />,
    );

    const nativeInput = component.find('input[type="datetime-local"]');
    const customInputs = component.find('input[type="number"]');

    expect(nativeInput.prop('value')).toBeFalsy();
    expect(customInputs.at(0).prop('value')).toBeFalsy();
    expect(customInputs.at(1).prop('value')).toBeFalsy();
    expect(customInputs.at(2).prop('value')).toBeFalsy();
    expect(customInputs.at(3).prop('value')).toBeFalsy();
    expect(customInputs.at(4).prop('value')).toBeFalsy();
    expect(customInputs.at(5).prop('value')).toBeFalsy();
  });

  it('shows empty value in all inputs correctly given an array of nulls', () => {
    const component = mount(
      <DateTimeInput
        {...defaultProps}
        maxDetail="second"
        value={[null, null]}
      />,
    );

    const nativeInput = component.find('input[type="datetime-local"]');
    const customInputs = component.find('input[type="number"]');

    expect(nativeInput.prop('value')).toBeFalsy();
    expect(customInputs.at(0).prop('value')).toBeFalsy();
    expect(customInputs.at(1).prop('value')).toBeFalsy();
    expect(customInputs.at(2).prop('value')).toBeFalsy();
    expect(customInputs.at(3).prop('value')).toBeFalsy();
    expect(customInputs.at(4).prop('value')).toBeFalsy();
    expect(customInputs.at(5).prop('value')).toBeFalsy();
  });

  it('clears the value correctly', () => {
    const date = new Date(2017, 8, 30, 22, 17, 0);

    const component = mount(
      <DateTimeInput
        {...defaultProps}
        maxDetail="second"
        value={date}
      />,
    );

    component.setProps({ value: null });

    const nativeInput = component.find('input[type="datetime-local"]');
    const customInputs = component.find('input[type="number"]');

    expect(nativeInput.prop('value')).toBeFalsy();
    expect(customInputs.at(0).prop('value')).toBeFalsy();
    expect(customInputs.at(1).prop('value')).toBeFalsy();
    expect(customInputs.at(2).prop('value')).toBeFalsy();
    expect(customInputs.at(3).prop('value')).toBeFalsy();
    expect(customInputs.at(4).prop('value')).toBeFalsy();
    expect(customInputs.at(5).prop('value')).toBeFalsy();
  });

  it('renders custom inputs in a proper order (12-hour format)', () => {
    const component = mount(
      <DateTimeInput
        {...defaultProps}
        maxDetail="second"
      />,
    );

    const customInputs = component.find('input[type="number"]');

    expect(customInputs.at(0).prop('name')).toBe('month');
    expect(customInputs.at(1).prop('name')).toBe('day');
    expect(customInputs.at(2).prop('name')).toBe('year');
    expect(customInputs.at(3).prop('name')).toBe('hour12');
    expect(customInputs.at(4).prop('name')).toBe('minute');
    expect(customInputs.at(5).prop('name')).toBe('second');
  });

  itIfFullICU('renders custom inputs in a proper order (24-hour format)', () => {
    const component = mount(
      <DateTimeInput
        {...defaultProps}
        locale="de-DE"
        maxDetail="second"
      />,
    );

    const customInputs = component.find('input[type="number"]');

    expect(customInputs.at(0).prop('name')).toBe('year');
    expect(customInputs.at(1).prop('name')).toBe('month');
    expect(customInputs.at(2).prop('name')).toBe('day');
    expect(customInputs.at(3).prop('name')).toBe('hour24');
    expect(customInputs.at(4).prop('name')).toBe('minute');
    expect(customInputs.at(5).prop('name')).toBe('second');
  });

  describe('renders custom inputs in a proper order given format', () => {
    it('renders "y" properly', () => {
      const component = mount(
        <DateTimeInput
          {...defaultProps}
          format="y"
        />,
      );

      const componentInput = component.find('YearInput');
      const customInputs = component.find('input[type="number"]');

      expect(componentInput).toHaveLength(1);
      expect(customInputs).toHaveLength(1);
    });

    it('renders "yyyy" properly', () => {
      const component = mount(
        <DateTimeInput
          {...defaultProps}
          format="yyyy"
        />,
      );

      const componentInput = component.find('YearInput');
      const customInputs = component.find('input[type="number"]');

      expect(componentInput).toHaveLength(1);
      expect(customInputs).toHaveLength(1);
    });

    it('renders "M" properly', () => {
      const component = mount(
        <DateTimeInput
          {...defaultProps}
          format="M"
        />,
      );

      const componentInput = component.find('MonthInput');
      const customInputs = component.find('input[type="number"]');

      expect(componentInput).toHaveLength(1);
      expect(customInputs).toHaveLength(1);
    });

    it('renders "MM" properly', () => {
      const component = mount(
        <DateTimeInput
          {...defaultProps}
          format="MM"
        />,
      );

      const componentInput = component.find('MonthInput');
      const customInputs = component.find('input[type="number"]');

      expect(componentInput).toHaveLength(1);
      expect(customInputs).toHaveLength(1);
      expect(componentInput.prop('showLeadingZeros')).toBeTruthy();
    });

    it('renders "MMM" properly', () => {
      const component = mount(
        <DateTimeInput
          {...defaultProps}
          format="MMM"
        />,
      );

      const componentSelect = component.find('MonthSelect');
      const customInputs = component.find('select');

      expect(componentSelect).toHaveLength(1);
      expect(componentSelect.prop('short')).toBeTruthy();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "MMMM" properly', () => {
      const component = mount(
        <DateTimeInput
          {...defaultProps}
          format="MMMM"
        />,
      );

      const componentSelect = component.find('MonthSelect');
      const customInputs = component.find('select');

      expect(componentSelect).toHaveLength(1);
      expect(componentSelect.prop('short')).toBeFalsy();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "d" properly', () => {
      const component = mount(
        <DateTimeInput
          {...defaultProps}
          format="d"
        />,
      );

      const componentInput = component.find('DayInput');
      const customInputs = component.find('input[type="number"]');

      expect(componentInput).toHaveLength(1);
      expect(customInputs).toHaveLength(1);
    });

    it('renders "dd" properly', () => {
      const component = mount(
        <DateTimeInput
          {...defaultProps}
          format="dd"
        />,
      );

      const componentInput = component.find('DayInput');
      const customInputs = component.find('input[type="number"]');

      expect(componentInput).toHaveLength(1);
      expect(customInputs).toHaveLength(1);
      expect(componentInput.prop('showLeadingZeros')).toBeTruthy();
    });

    it('throws error for "ddd"', () => {
      muteConsole();

      const renderComponent = () => mount(
        <DateTimeInput
          {...defaultProps}
          format="ddd"
        />,
      );

      expect(renderComponent).toThrow('Unsupported token: ddd');

      restoreConsole();
    });

    it('renders "yyyy-MM-dd" properly', () => {
      const component = mount(
        <DateTimeInput
          {...defaultProps}
          format="yyyy-MM-d"
        />,
      );

      const monthInput = component.find('MonthInput');
      const dayInput = component.find('DayInput');
      const customInputs = component.find('input[type="number"]');

      expect(monthInput).toHaveLength(1);
      expect(dayInput).toHaveLength(1);
      expect(customInputs).toHaveLength(3);
      expect(customInputs.at(0).prop('name')).toBe('year');
      expect(customInputs.at(1).prop('name')).toBe('month');
      expect(customInputs.at(2).prop('name')).toBe('day');
      expect(monthInput.prop('showLeadingZeros')).toBeTruthy();
      expect(dayInput.prop('showLeadingZeros')).toBeFalsy();
    });

    it('renders "h" properly', () => {
      const component = mount(
        <DateTimeInput
          {...defaultProps}
          format="h"
        />,
      );

      const componentInput = component.find('Hour12Input');
      const customInputs = component.find('input[type="number"]');

      expect(componentInput).toHaveLength(1);
      expect(customInputs).toHaveLength(1);
    });

    it('renders "hh" properly', () => {
      const component = mount(
        <DateTimeInput
          {...defaultProps}
          format="hh"
        />,
      );

      const componentInput = component.find('Hour12Input');
      const customInputs = component.find('input[type="number"]');

      expect(componentInput).toHaveLength(1);
      expect(customInputs).toHaveLength(1);
      expect(componentInput.prop('showLeadingZeros')).toBeTruthy();
    });

    it('throws error for "hhh"', () => {
      muteConsole();

      const renderComponent = () => mount(
        <DateTimeInput
          {...defaultProps}
          format="hhh"
        />,
      );

      expect(renderComponent).toThrow('Unsupported token: hhh');

      restoreConsole();
    });

    it('renders "H" properly', () => {
      const component = mount(
        <DateTimeInput
          {...defaultProps}
          format="H"
        />,
      );

      const componentInput = component.find('Hour24Input');
      const customInputs = component.find('input[type="number"]');

      expect(componentInput).toHaveLength(1);
      expect(customInputs).toHaveLength(1);
    });

    it('renders "HH" properly', () => {
      const component = mount(
        <DateTimeInput
          {...defaultProps}
          format="HH"
        />,
      );

      const componentInput = component.find('Hour24Input');
      const customInputs = component.find('input[type="number"]');

      expect(componentInput).toHaveLength(1);
      expect(customInputs).toHaveLength(1);
      expect(componentInput.prop('showLeadingZeros')).toBeTruthy();
    });

    it('throws error for "HHH"', () => {
      muteConsole();

      const renderComponent = () => mount(
        <DateTimeInput
          {...defaultProps}
          format="HHH"
        />,
      );

      expect(renderComponent).toThrow('Unsupported token: HHH');

      restoreConsole();
    });

    it('renders "m" properly', () => {
      const component = mount(
        <DateTimeInput
          {...defaultProps}
          format="m"
        />,
      );

      const componentInput = component.find('MinuteInput');
      const customInputs = component.find('input[type="number"]');

      expect(componentInput).toHaveLength(1);
      expect(customInputs).toHaveLength(1);
    });

    it('renders "mm" properly', () => {
      const component = mount(
        <DateTimeInput
          {...defaultProps}
          format="mm"
        />,
      );

      const componentInput = component.find('MinuteInput');
      const customInputs = component.find('input[type="number"]');

      expect(componentInput).toHaveLength(1);
      expect(customInputs).toHaveLength(1);
      expect(componentInput.prop('showLeadingZeros')).toBeTruthy();
    });

    it('throws error for "mmm"', () => {
      muteConsole();

      const renderComponent = () => mount(
        <DateTimeInput
          {...defaultProps}
          format="mmm"
        />,
      );

      expect(renderComponent).toThrow('Unsupported token: mmm');

      restoreConsole();
    });

    it('renders "s" properly', () => {
      const component = mount(
        <DateTimeInput
          {...defaultProps}
          format="s"
        />,
      );

      const componentInput = component.find('SecondInput');
      const customInputs = component.find('input[type="number"]');

      expect(componentInput).toHaveLength(1);
      expect(customInputs).toHaveLength(1);
    });

    it('renders "ss" properly', () => {
      const component = mount(
        <DateTimeInput
          {...defaultProps}
          format="ss"
        />,
      );

      const componentInput = component.find('SecondInput');
      const customInputs = component.find('input[type="number"]');

      expect(componentInput).toHaveLength(1);
      expect(customInputs).toHaveLength(1);
      expect(componentInput.prop('showLeadingZeros')).toBeTruthy();
    });

    it('throws error for "sss"', () => {
      muteConsole();

      const renderComponent = () => mount(
        <DateTimeInput
          {...defaultProps}
          format="sss"
        />,
      );

      expect(renderComponent).toThrow('Unsupported token: sss');

      restoreConsole();
    });

    it('renders "a" properly', () => {
      const component = mount(
        <DateTimeInput
          {...defaultProps}
          format="a"
        />,
      );

      const componentInput = component.find('AmPm');
      const customInputs = component.find('input[type="number"]');

      expect(componentInput).toHaveLength(1);
      expect(customInputs).toHaveLength(0);
    });
  });

  it('renders proper input separators', () => {
    const component = mount(
      <DateTimeInput {...defaultProps} />,
    );

    const separators = component.find('.react-datetime-picker__inputGroup__divider');

    expect(separators).toHaveLength(5);
    expect(separators.at(0).text()).toBe('/');
    expect(separators.at(1).text()).toBe('/');
    expect(separators.at(2).text()).toBe('\u00a0'); // Non-breaking space
    expect(separators.at(3).text()).toBe(':');
    expect(separators.at(4).text()).toBe(' ');
  });

  it('renders proper amount of separators', () => {
    const component = mount(
      <DateTimeInput
        {...defaultProps}
        maxDetail="hour"
      />,
    );

    const separators = component.find('.react-datetime-picker__inputGroup__divider');
    const customInputs = component.find('input[type="number"]');
    const ampm = component.find('select');

    expect(separators).toHaveLength(customInputs.length + ampm.length - 1);
  });

  it('jumps to the next field when right arrow is pressed', () => {
    const component = mount(
      <DateTimeInput {...defaultProps} />,
      { attachTo: container },
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.at(0);
    const monthInput = customInputs.at(1);

    dayInput.getDOMNode().focus();

    expect(document.activeElement).toBe(dayInput.getDOMNode());

    dayInput.simulate('keydown', getKey('ArrowRight'));

    expect(document.activeElement).toBe(monthInput.getDOMNode());
  });

  it('jumps to the next field when date separator key is pressed', () => {
    const component = mount(
      <DateTimeInput {...defaultProps} />,
      { attachTo: container },
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.at(0);
    const monthInput = customInputs.at(1);

    dayInput.getDOMNode().focus();

    expect(document.activeElement).toBe(dayInput.getDOMNode());

    const separators = component.find('.react-datetime-picker__inputGroup__divider');
    const separatorsTexts = separators.map((el) => el.text()).filter((el) => el.trim());
    const separatorKey = separatorsTexts[0];
    dayInput.simulate('keydown', getKey(separatorKey));

    expect(document.activeElement).toBe(monthInput.getDOMNode());
  });

  it('jumps to the next field when time separator key is pressed', () => {
    const component = mount(
      <DateTimeInput {...defaultProps} />,
      { attachTo: container },
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.at(0);
    const monthInput = customInputs.at(1);

    dayInput.getDOMNode().focus();

    expect(document.activeElement).toBe(dayInput.getDOMNode());

    const separators = component.find('.react-datetime-picker__inputGroup__divider');
    const separatorsTexts = separators.map((el) => el.text()).filter((el) => el.trim());
    const separatorKey = separatorsTexts[separatorsTexts.length - 1];
    dayInput.simulate('keydown', getKey(separatorKey));

    expect(document.activeElement).toBe(monthInput.getDOMNode());
  });

  it('does not jump to the next field when right arrow is pressed when the last input is focused', () => {
    const component = mount(
      <DateTimeInput {...defaultProps} />,
      { attachTo: container },
    );

    const select = component.find('select');

    select.getDOMNode().focus();

    expect(document.activeElement).toBe(select.getDOMNode());

    select.simulate('keydown', getKey('ArrowRight'));

    expect(document.activeElement).toBe(select.getDOMNode());
  });

  it('jumps to the previous field when left arrow is pressed', () => {
    const component = mount(
      <DateTimeInput {...defaultProps} />,
      { attachTo: container },
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.at(0);
    const monthInput = customInputs.at(1);

    monthInput.getDOMNode().focus();

    expect(document.activeElement).toBe(monthInput.getDOMNode());

    monthInput.simulate('keydown', getKey('ArrowLeft'));

    expect(document.activeElement).toBe(dayInput.getDOMNode());
  });

  it('does not jump to the previous field when left arrow is pressed when the first input is focused', () => {
    const component = mount(
      <DateTimeInput {...defaultProps} />,
      { attachTo: container },
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.at(0);

    dayInput.getDOMNode().focus();

    expect(document.activeElement).toBe(dayInput.getDOMNode());

    dayInput.simulate('keydown', getKey('ArrowLeft'));

    expect(document.activeElement).toBe(dayInput.getDOMNode());
  });

  it('jumps to the next field when a value which can\'t be extended to another valid value is entered', () => {
    const component = mount(
      <DateTimeInput {...defaultProps} />,
      { attachTo: container },
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.at(0);
    const monthInput = customInputs.at(1);

    dayInput.getDOMNode().focus();
    dayInput.getDOMNode().value = '4';

    dayInput.simulate('keyup', { target: dayInput.getDOMNode(), key: '4' });

    expect(document.activeElement).toBe(monthInput.getDOMNode());
  });

  it('jumps to the next field when a value as long as the length of maximum value is entered', () => {
    const component = mount(
      <DateTimeInput {...defaultProps} />,
      { attachTo: container },
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.at(0);
    const monthInput = customInputs.at(1);

    dayInput.getDOMNode().focus();
    dayInput.getDOMNode().value = '03';

    dayInput.simulate('keyup', { target: dayInput.getDOMNode(), key: '3' });

    expect(document.activeElement).toBe(monthInput.getDOMNode());
  });

  it('does not jump the next field when a value which can be extended to another valid value is entered', () => {
    const component = mount(
      <DateTimeInput {...defaultProps} />,
      { attachTo: container },
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.at(0);

    dayInput.getDOMNode().focus();
    dayInput.getDOMNode().value = '1';

    dayInput.simulate('keyup', { target: dayInput.getDOMNode(), key: '1' });

    expect(document.activeElement).toBe(dayInput.getDOMNode());
  });

  it('triggers onChange correctly when changed custom input', () => {
    const onChange = jest.fn();
    const date = new Date(2017, 8, 30, 22, 17, 0);

    const component = mount(
      <DateTimeInput
        {...defaultProps}
        onChange={onChange}
        value={date}
      />,
    );

    const customInputs = component.find('input[type="number"]');
    const hourInput = customInputs.at(3);

    hourInput.getDOMNode().value = '20';
    hourInput.simulate('change');

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(new Date(2017, 8, 30, 20, 17, 0), false);
  });

  it('triggers onChange correctly when changed custom input with year < 100', () => {
    const onChange = jest.fn();
    const date = new Date();
    date.setFullYear(19, 8, 30);
    date.setHours(22, 17, 0, 0);

    const component = mount(
      <DateTimeInput
        {...defaultProps}
        onChange={onChange}
        value={date}
      />,
    );

    const customInputs = component.find('input[type="number"]');
    const hourInput = customInputs.at(3);

    hourInput.getDOMNode().value = '20';
    hourInput.simulate('change');

    const nextDate = new Date();
    nextDate.setFullYear(19, 8, 30);
    nextDate.setHours(20, 17, 0, 0);

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(nextDate, false);
  });

  it('triggers onChange correctly when cleared custom inputs', () => {
    const onChange = jest.fn();
    const date = new Date(2017, 8, 30, 22, 17, 0);

    const component = mount(
      <DateTimeInput
        {...defaultProps}
        maxDetail="second"
        onChange={onChange}
        value={date}
      />,
    );

    const customInputs = component.find('input[type="number"]');

    customInputs.forEach((customInput) => {
      customInput.getDOMNode().value = ''; // eslint-disable-line no-param-reassign
      customInput.simulate('change');
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(null, false);
  });

  it('triggers onChange correctly when changed native input', () => {
    const onChange = jest.fn();
    const date = new Date(2017, 8, 30, 22, 17, 0);

    const component = mount(
      <DateTimeInput
        {...defaultProps}
        onChange={onChange}
        value={date}
      />,
    );

    const nativeInput = component.find('input[type="datetime-local"]');

    nativeInput.getDOMNode().value = '2017-09-30T20:17:00';
    nativeInput.simulate('change');

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(new Date(2017, 8, 30, 20, 17, 0), false);
  });

  it('triggers onChange correctly when changed native input with year < 100', () => {
    const onChange = jest.fn();
    const date = new Date();
    date.setFullYear(19, 8, 20);
    date.setHours(22, 17, 0, 0);

    const component = mount(
      <DateTimeInput
        {...defaultProps}
        onChange={onChange}
        value={date}
      />,
    );

    const nativeInput = component.find('input[type="datetime-local"]');

    nativeInput.getDOMNode().value = '0019-09-20T20:17:00';
    nativeInput.simulate('change');

    const nextDate = new Date();
    nextDate.setFullYear(19, 8, 20);
    nextDate.setHours(20, 17, 0, 0);

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(nextDate, false);
  });

  it('triggers onChange correctly when cleared native input', () => {
    const onChange = jest.fn();
    const date = new Date(2017, 8, 30, 22, 17, 0);

    const component = mount(
      <DateTimeInput
        {...defaultProps}
        onChange={onChange}
        value={date}
      />,
    );

    const nativeInput = component.find('input[type="datetime-local"]');

    nativeInput.getDOMNode().value = '';
    nativeInput.simulate('change');

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(null, false);
  });
});
