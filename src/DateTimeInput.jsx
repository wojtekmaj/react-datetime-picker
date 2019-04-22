import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';

import DayInput from 'react-date-picker/dist/DateInput/DayInput';
import MonthInput from 'react-date-picker/dist/DateInput/MonthInput';
import YearInput from 'react-date-picker/dist/DateInput/YearInput';
import Hour12Input from 'react-time-picker/dist/TimeInput/Hour12Input';
import Hour24Input from 'react-time-picker/dist/TimeInput/Hour24Input';
import MinuteInput from 'react-time-picker/dist/TimeInput/MinuteInput';
import SecondInput from 'react-time-picker/dist/TimeInput/SecondInput';
import AmPm from 'react-time-picker/dist/TimeInput/AmPm';
import Divider from './Divider';
import NativeInput from './DateTimeInput/NativeInput';

import { getFormatter, formatDate } from './shared/dateFormatter';
import {
  getDay,
  getHours,
  getMinutes,
  getMonth,
  getSeconds,
  getYear,
  getHoursMinutesSeconds,
  convert12to24,
  convert24to12,
} from './shared/dates';
import { isMaxDate, isMinDate } from './shared/propTypes';
import { between, getAmPmLabels } from './shared/utils';

const defaultMinDate = new Date(-8.64e15);
const defaultMaxDate = new Date(8.64e15);
const allViews = ['hour', 'minute', 'second'];

const datesAreDifferent = (date1, date2) => (
  (date1 && !date2)
  || (!date1 && date2)
  || (date1 && date2 && date1.getTime() !== date2.getTime())
);

const isSameDate = (date, year, month, day) => (
  getYear(date) === year
  && getMonth(date) === month
  && getDay(date) === day
);

const getValueFromRange = (valueOrArrayOfValues, index) => {
  if (Array.isArray(valueOrArrayOfValues)) {
    return valueOrArrayOfValues[index];
  }

  return valueOrArrayOfValues;
};

const parseAndValidateDate = (rawValue) => {
  if (!rawValue) {
    return null;
  }

  const valueDate = new Date(rawValue);

  if (isNaN(valueDate.getTime())) {
    throw new Error(`Invalid date: ${rawValue}`);
  }

  return valueDate;
};

const getDetailValue = (value, minDate, maxDate) => {
  if (!value) {
    return null;
  }

  return between(value, minDate, maxDate);
};

const getValueFrom = (value) => {
  const valueFrom = getValueFromRange(value, 0);

  return parseAndValidateDate(valueFrom);
};

const getDetailValueFrom = (value, minDate, maxDate) => {
  const valueFrom = getValueFrom(value);

  return getDetailValue(valueFrom, minDate, maxDate);
};

const getValueTo = (value) => {
  const valueTo = getValueFromRange(value, 1);

  return parseAndValidateDate(valueTo);
};

const getDetailValueTo = (value, minDate, maxDate) => {
  const valueTo = getValueTo(value);

  return getDetailValue(valueTo, minDate, maxDate);
};

const isValidInput = element => element.tagName === 'INPUT' && element.type === 'number';

const findInput = (element, property) => {
  let nextElement = element;
  do {
    nextElement = nextElement[property];
  } while (nextElement && !isValidInput(nextElement));
  return nextElement;
};

const focus = element => element && element.focus();

const renderCustomInputs = (placeholder, elementFunctions) => {
  const pattern = new RegExp(
    Object.keys(elementFunctions).map(el => `${el}+`).join('|'), 'g',
  );
  const matches = placeholder.match(pattern);

  return placeholder.split(pattern)
    .reduce((arr, element, index) => {
      const divider = element && (
        // eslint-disable-next-line react/no-array-index-key
        <Divider key={`separator_${index}`}>
          {element}
        </Divider>
      );
      const res = [...arr, divider];
      const currentMatch = matches && matches[index];
      if (currentMatch) {
        const renderFunction = (
          elementFunctions[currentMatch]
          || elementFunctions[
            Object.keys(elementFunctions)
              .find(elementFunction => currentMatch.match(elementFunction))
          ]
        );
        res.push(renderFunction(currentMatch));
      }
      return res;
    }, []);
};

export default class DateTimeInput extends PureComponent {
  static getDerivedStateFromProps(nextProps, prevState) {
    const { minDate, maxDate } = nextProps;

    const nextState = {};

    /**
     * If isWidgetOpen flag has changed, we have to update it.
     * It's saved in state purely for use in getDerivedStateFromProps.
     */
    if (nextProps.isWidgetOpen !== prevState.isWidgetOpen) {
      nextState.isWidgetOpen = nextProps.isWidgetOpen;
    }

    /**
     * If the next value is different from the current one  (with an exception of situation in
     * which values provided are limited by minDate and maxDate so that the dates are the same),
     * get a new one.
     */
    const nextValue = getDetailValueFrom(nextProps.value, minDate, maxDate);
    const values = [nextValue, prevState.value];
    if (
      // Toggling calendar visibility resets values
      nextState.isCalendarOpen // Flag was toggled
      || datesAreDifferent(
        ...values.map(value => getDetailValueFrom(value, minDate, maxDate)),
      )
      || datesAreDifferent(
        ...values.map(value => getDetailValueTo(value, minDate, maxDate)),
      )
    ) {
      if (nextValue) {
        [, nextState.amPm] = convert24to12(getHours(nextValue));
        nextState.year = getYear(nextValue);
        nextState.month = getMonth(nextValue);
        nextState.day = getDay(nextValue);
        nextState.hour = getHours(nextValue);
        nextState.minute = getMinutes(nextValue);
        nextState.second = getSeconds(nextValue);
      } else {
        nextState.amPm = null;
        nextState.year = null;
        nextState.month = null;
        nextState.day = null;
        nextState.hour = null;
        nextState.minute = null;
        nextState.second = null;
      }
      nextState.value = nextValue;
    }

    return nextState;
  }

  state = {
    amPm: null,
    year: null,
    month: null,
    day: null,
    hour: null,
    minute: null,
    second: null,
  };

  get formatTime() {
    const { maxDetail } = this.props;

    const options = { hour: 'numeric' };
    const level = allViews.indexOf(maxDetail);
    if (level >= 1) {
      options.minute = 'numeric';
    }
    if (level >= 2) {
      options.second = 'numeric';
    }

    return getFormatter(options);
  }

  // eslint-disable-next-line class-methods-use-this
  get formatNumber() {
    const options = { useGrouping: false };

    return getFormatter(options);
  }

  get dateDivider() {
    return this.datePlaceholder.match(/[^0-9a-z]/i)[0];
  }

  get timeDivider() {
    return this.timePlaceholder.match(/[^0-9a-z]/i)[0];
  }

  get datePlaceholder() {
    const { locale } = this.props;

    const year = 2017;
    const monthIndex = 11;
    const day = 11;

    const date = new Date(year, monthIndex, day);

    return (
      formatDate(locale, date)
        .replace(this.formatNumber(locale, year), 'y')
        .replace(this.formatNumber(locale, monthIndex + 1), 'M')
        .replace(this.formatNumber(locale, day), 'd')
    );
  }

  get timePlaceholder() {
    const { locale } = this.props;

    const hour24 = 21;
    const hour12 = 9;
    const minute = 13;
    const second = 14;
    const date = new Date(2017, 0, 1, hour24, minute, second);

    return (
      this.formatTime(locale, date)
        .replace(this.formatNumber(locale, hour12), 'h')
        .replace(this.formatNumber(locale, hour24), 'H')
        .replace(this.formatNumber(locale, minute), 'mm')
        .replace(this.formatNumber(locale, second), 'ss')
        .replace(new RegExp(getAmPmLabels(locale).join('|')), 'a')
    );
  }

  get placeholder() {
    const { format } = this.props;

    if (format) {
      return format;
    }

    return `${this.datePlaceholder}\u00a0${this.timePlaceholder}`;
  }

  get maxTime() {
    const { maxDate } = this.props;

    if (!maxDate) {
      return null;
    }

    const { year, month, day } = this.state;

    if (!isSameDate(maxDate, year, month, day)) {
      return null;
    }

    return getHoursMinutesSeconds(maxDate);
  }

  get minTime() {
    const { minDate } = this.props;

    if (!minDate) {
      return null;
    }

    const { year, month, day } = this.state;

    if (!isSameDate(minDate, year, month, day)) {
      return null;
    }

    return getHoursMinutesSeconds(minDate);
  }

  get commonInputProps() {
    const { maxTime, minTime } = this;
    const {
      className,
      disabled,
      isWidgetOpen,
      maxDate,
      minDate,
      required,
    } = this.props;

    return {
      className,
      disabled,
      maxDate: maxDate || defaultMaxDate,
      maxTime,
      minDate: minDate || defaultMinDate,
      minTime,
      onChange: this.onChange,
      onKeyDown: this.onKeyDown,
      placeholder: '--',
      // This is only for showing validity when editing
      required: required || isWidgetOpen,
      itemRef: (ref, name) => {
        // Save a reference to each input field
        this[`${name}Input`] = ref;
      },
    };
  }

  /**
   * Returns value type that can be returned with currently applied settings.
   */
  get valueType() {
    const { maxDetail } = this.props;

    return maxDetail;
  }

  onClick = (event) => {
    if (event.target === event.currentTarget) {
      // Wrapper was directly clicked
      const firstInput = event.target.children[1];
      focus(firstInput);
    }
  }

  onKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowRight':
      case this.dateDivider:
      case this.timeDivider: {
        event.preventDefault();

        const input = event.target;
        const property = event.key === 'ArrowLeft' ? 'previousElementSibling' : 'nextElementSibling';
        const nextInput = findInput(input, property);
        focus(nextInput);
        break;
      }
      default:
    }
  }

  /**
   * Called when non-native date input is changed.
   */
  onChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case 'hour12': {
        this.setState(
          prevState => ({
            hour: value ? convert12to24(parseInt(value, 10), prevState.amPm) : null,
          }),
          this.onChangeExternal,
        );
        break;
      }
      case 'hour24': {
        this.setState(
          { hour: value ? parseInt(value, 10) : null },
          this.onChangeExternal,
        );
        break;
      }
      default: {
        this.setState(
          { [name]: value ? parseInt(value, 10) : null },
          this.onChangeExternal,
        );
      }
    }
  }

  /**
   * Called when native date input is changed.
   */
  onChangeNative = (event) => {
    const { onChange } = this.props;
    const { value } = event.target;

    if (!onChange) {
      return;
    }

    const processedValue = (() => {
      if (!value) {
        return null;
      }

      const [valueDate, valueTime] = value.split('T');

      const [yearString, monthString, dayString] = valueDate.split('-');
      const year = parseInt(yearString, 10);
      const monthIndex = parseInt(monthString, 10) - 1 || 0;
      const date = parseInt(dayString, 10) || 1;

      const [hourString, minuteString, secondString] = valueTime.split(':');
      const hour = parseInt(hourString, 10) || 0;
      const minute = parseInt(minuteString, 10) || 0;
      const second = parseInt(secondString, 10) || 0;

      return new Date(year, monthIndex, date, hour, minute, second);
    })();

    onChange(processedValue, false);
  }

  onChangeAmPm = (event) => {
    const { value } = event.target;

    this.setState(
      ({ amPm: value }),
      this.onChangeExternal,
    );
  }

  /**
   * Called after internal onChange. Checks input validity. If all fields are valid,
   * calls props.onChange.
   */
  onChangeExternal = () => {
    const { onChange } = this.props;

    if (!onChange) {
      return;
    }

    const formElements = [
      this.dayInput,
      this.monthInput,
      this.yearInput,
      this.hour12Input,
      this.hour24Input,
      this.minuteInput,
      this.secondInput,
      this.amPmInput,
    ].filter(Boolean);

    const formElementsWithoutSelect = formElements.slice(0, -1);

    const values = {};
    formElements.forEach((formElement) => {
      values[formElement.name] = formElement.value;
    });

    if (formElementsWithoutSelect.every(formElement => !formElement.value)) {
      onChange(null, false);
    } else if (
      formElements.every(formElement => formElement.value && formElement.checkValidity())
    ) {
      const hour = values.hour24 || convert12to24(values.hour12, values.amPm);
      const proposedValue = new Date(
        values.year,
        (values.month || 1) - 1,
        values.day || 1,
        hour,
        values.minute || 0,
        values.second || 0,
      );
      const processedValue = proposedValue;
      onChange(processedValue, false);
    }
  }

  renderDay = (currentMatch) => {
    const { showLeadingZeros } = this.props;
    const { day, month, year } = this.state;

    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZerosFromFormat = currentMatch && currentMatch.length === 2;

    return (
      <DayInput
        key="day"
        {...this.commonInputProps}
        month={month}
        showLeadingZeros={showLeadingZerosFromFormat || showLeadingZeros}
        value={day}
        year={year}
      />
    );
  }

  renderMonth = (currentMatch) => {
    const { showLeadingZeros } = this.props;
    const { month } = this.state;

    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZerosFromFormat = currentMatch && currentMatch.length === 2;

    return (
      <MonthInput
        key="month"
        {...this.commonInputProps}
        showLeadingZeros={showLeadingZerosFromFormat || showLeadingZeros}
        value={month}
      />
    );
  }

  renderYear = () => {
    const { year } = this.state;

    return (
      <YearInput
        key="year"
        {...this.commonInputProps}
        value={year}
        valueType="day"
      />
    );
  }

  renderHour12 = (currentMatch) => {
    const { hour } = this.state;

    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZeros = currentMatch && currentMatch.length === 2;

    return (
      <Hour12Input
        key="hour12"
        {...this.commonInputProps}
        showLeadingZeros={showLeadingZeros}
        value={hour}
      />
    );
  }

  renderHour24 = (currentMatch) => {
    const { hour } = this.state;

    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZeros = currentMatch && currentMatch.length === 2;

    return (
      <Hour24Input
        key="hour24"
        {...this.commonInputProps}
        showLeadingZeros={showLeadingZeros}
        value={hour}
      />
    );
  }

  renderMinute = (currentMatch) => {
    const { hour, minute } = this.state;

    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZeros = currentMatch && currentMatch.length === 2;

    return (
      <MinuteInput
        key="minute"
        {...this.commonInputProps}
        hour={hour}
        showLeadingZeros={showLeadingZeros}
        value={minute}
      />
    );
  }

  renderSecond = (currentMatch) => {
    const { hour, minute, second } = this.state;

    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZeros = currentMatch ? currentMatch.length === 2 : true;

    return (
      <SecondInput
        key="second"
        {...this.commonInputProps}
        hour={hour}
        minute={minute}
        showLeadingZeros={showLeadingZeros}
        value={second}
      />
    );
  }

  renderAmPm = () => {
    const { amPm } = this.state;
    const { locale } = this.props;

    return (
      <AmPm
        key="ampm"
        {...this.commonInputProps}
        locale={locale}
        onChange={this.onChangeAmPm}
        value={amPm}
      />
    );
  }

  renderCustomInputs() {
    const { placeholder } = this;
    const elementFunctions = {
      d: this.renderDay,
      M: this.renderMonth,
      y: this.renderYear,
      h: this.renderHour12,
      H: this.renderHour24,
      m: this.renderMinute,
      s: this.renderSecond,
      a: this.renderAmPm,
    };

    return renderCustomInputs(placeholder, elementFunctions);
  }

  renderNativeInput() {
    const {
      disabled,
      maxDate,
      minDate,
      name,
      required,
    } = this.props;
    const { value } = this.state;

    return (
      <NativeInput
        key="time"
        disabled={disabled}
        maxDate={maxDate || defaultMaxDate}
        minDate={minDate || defaultMinDate}
        name={name}
        onChange={this.onChangeNative}
        required={required}
        value={value}
        valueType={this.valueType}
      />
    );
  }

  render() {
    const { className } = this.props;

    return (
      <div
        className={className}
        onClick={this.onClick}
        role="presentation"
      >
        {this.renderNativeInput()}
        {this.renderCustomInputs()}
      </div>
    );
  }
}

DateTimeInput.defaultProps = {
  maxDetail: 'minute',
  name: 'datetime',
};

DateTimeInput.propTypes = {
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  format: PropTypes.string,
  isWidgetOpen: PropTypes.bool,
  locale: PropTypes.string,
  maxDate: isMaxDate,
  maxDetail: PropTypes.oneOf(allViews),
  minDate: isMinDate,
  name: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  showLeadingZeros: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  ]),
};

polyfill(DateTimeInput);
