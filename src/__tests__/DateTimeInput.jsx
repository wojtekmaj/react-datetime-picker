import React from 'react';
import { mount } from 'enzyme';

import DateTimeInput from '../DateTimeInput';

/* eslint-disable comma-dangle */

const keyCodes = {
  ArrowLeft: 37,
  ArrowUp: 38,
  ArrowRight: 39,
  ArrowDown: 40,
  '-': 189,
  '.': 190,
  '/': 191,
};

const getKey = key => ({
  keyCode: keyCodes[key],
  which: keyCodes[key],
  key,
});

describe('DateTimeInput', () => {
  it('renders a native input and custom inputs', () => {
    const component = mount(
      <DateTimeInput />
    );

    const nativeInput = component.find('input[type="datetime-local"]');
    const customInputs = component.find('input[type="number"]');

    expect(nativeInput).toHaveLength(1);
    expect(customInputs).toHaveLength(5);
  });

  it('does not render second input when maxDetail is "minute" or less', () => {
    const component = mount(
      <DateTimeInput maxDetail="minute" />
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.find('input[name="day"]');
    const monthInput = customInputs.find('input[name="month"]');
    const yearInput = customInputs.find('input[name="year"]');
    const secondInput = customInputs.find('input[name="second"]');
    const minuteInput = customInputs.find('input[name="minute"]');
    const hourInput = customInputs.find('input[name="hour"]');

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
      <DateTimeInput maxDetail="hour" />
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.find('input[name="day"]');
    const monthInput = customInputs.find('input[name="month"]');
    const yearInput = customInputs.find('input[name="year"]');
    const secondInput = customInputs.find('input[name="second"]');
    const minuteInput = customInputs.find('input[name="minute"]');
    const hourInput = customInputs.find('input[name="hour"]');

    expect(customInputs).toHaveLength(4);

    expect(yearInput).toHaveLength(1);
    expect(monthInput).toHaveLength(1);
    expect(dayInput).toHaveLength(1);
    expect(hourInput).toHaveLength(1);
    expect(minuteInput).toHaveLength(0);
    expect(secondInput).toHaveLength(0);
  });

  it('shows a given date in all inputs correctly', () => {
    const date = new Date(2017, 8, 30, 22, 17, 0);

    const component = mount(
      <DateTimeInput
        maxDetail="second"
        value={date}
      />
    );

    const nativeInput = component.find('input[type="datetime-local"]');
    const customInputs = component.find('input[type="number"]');

    expect(nativeInput.getDOMNode().value).toBe('2017-09-30T22:17');
    expect(customInputs.at(0).getDOMNode().value).toBe('9');
    expect(customInputs.at(1).getDOMNode().value).toBe('30');
    expect(customInputs.at(2).getDOMNode().value).toBe('2017');
    expect(customInputs.at(3).getDOMNode().value).toBe('22');
    expect(customInputs.at(4).getDOMNode().value).toBe('17');
    expect(customInputs.at(5).getDOMNode().value).toBe('0');
  });

  it('clears the value correctly', () => {
    const date = new Date(2017, 8, 30, 22, 17, 0);

    const component = mount(
      <DateTimeInput
        maxDetail="second"
        value={date}
      />
    );

    component.setProps({ value: null });

    const nativeInput = component.find('input[type="datetime-local"]');
    const customInputs = component.find('input[type="number"]');

    expect(nativeInput.getDOMNode().value).toBe('');
    expect(customInputs.at(0).getDOMNode().value).toBe('');
    expect(customInputs.at(1).getDOMNode().value).toBe('');
    expect(customInputs.at(2).getDOMNode().value).toBe('');
    expect(customInputs.at(3).getDOMNode().value).toBe('');
    expect(customInputs.at(4).getDOMNode().value).toBe('');
    expect(customInputs.at(5).getDOMNode().value).toBe('');
  });

  it('renders custom inputs in a proper order (en-US)', () => {
    const component = mount(
      <DateTimeInput
        locale="en-US"
        maxDetail="second"
      />
    );

    const customInputs = component.find('input[type="number"]');

    expect(customInputs.at(0).prop('name')).toBe('month');
    expect(customInputs.at(1).prop('name')).toBe('day');
    expect(customInputs.at(2).prop('name')).toBe('year');
    expect(customInputs.at(3).prop('name')).toBe('hour');
    expect(customInputs.at(4).prop('name')).toBe('minute');
    expect(customInputs.at(5).prop('name')).toBe('second');
  });

  it('renders proper input separators (en-US)', () => {
    const component = mount(
      <DateTimeInput
        locale="en-US"
      />
    );

    const separators = component.find('.react-datetime-picker__button__input__divider');

    expect(separators).toHaveLength(4);
    expect(separators.at(0).text()).toBe('/');
    expect(separators.at(2).text()).toBe('\u00a0'); // Non-breaking space
    expect(separators.at(3).text()).toBe(':');
  });

  it('renders proper amount of separators', () => {
    const component = mount(
      <DateTimeInput maxDetail="hour" />
    );

    const separators = component.find('.react-datetime-picker__button__input__divider');
    const customInputs = component.find('input[type="number"]');

    expect(separators).toHaveLength(customInputs.length - 1);
  });

  it('jumps to the next field when right arrow is pressed', () => {
    const component = mount(
      <DateTimeInput />
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.at(0);
    const monthInput = customInputs.at(1);

    dayInput.getDOMNode().focus();

    expect(document.activeElement).toBe(dayInput.getDOMNode());

    dayInput.simulate('keydown', getKey('ArrowRight'));

    expect(document.activeElement).toBe(monthInput.getDOMNode());
  });

  it('jumps to the next field when separator key is pressed', () => {
    const component = mount(
      <DateTimeInput />
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.at(0);
    const monthInput = customInputs.at(1);

    dayInput.getDOMNode().focus();

    expect(document.activeElement).toBe(dayInput.getDOMNode());

    const separators = component.find('.react-datetime-picker__button__input__divider');
    const separatorKey = separators.at(0).text();
    dayInput.simulate('keydown', getKey(separatorKey));

    expect(document.activeElement).toBe(monthInput.getDOMNode());
  });

  it('does not jump to the next field when right arrow is pressed when the last input is focused', () => {
    const component = mount(
      <DateTimeInput />
    );

    const customInputs = component.find('input[type="number"]');
    const minuteInput = customInputs.at(4);

    minuteInput.getDOMNode().focus();

    expect(document.activeElement).toBe(minuteInput.getDOMNode());

    minuteInput.simulate('keydown', getKey('ArrowRight'));

    expect(document.activeElement).toBe(minuteInput.getDOMNode());
  });

  it('jumps to the previous field when left arrow is pressed', () => {
    const component = mount(
      <DateTimeInput />
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.at(0);
    const monthInput = customInputs.at(1);

    monthInput.getDOMNode().focus();

    expect(document.activeElement).toBe(monthInput.getDOMNode());

    monthInput.simulate('keydown', getKey('ArrowLeft'));

    expect(document.activeElement).toBe(dayInput.getDOMNode());
  });

  it('does not jump to the next field when right arrow is pressed when the last input is focused', () => {
    const component = mount(
      <DateTimeInput />
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.at(0);

    dayInput.getDOMNode().focus();

    expect(document.activeElement).toBe(dayInput.getDOMNode());

    dayInput.simulate('keydown', getKey('ArrowLeft'));

    expect(document.activeElement).toBe(dayInput.getDOMNode());
  });
});
