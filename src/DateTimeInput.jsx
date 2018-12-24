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
import { getAmPmLabels } from './shared/utils';

const defaultMinDate = new Date(-8.64e15);
const defaultMaxDate = new Date(8.64e15);
const allViews = ['hour', 'minute', 'second'];

const datesAreDifferent = (date1, date2) => (
  (date1 && !date2)
  || (!date1 && date2)
  || (date1 && date2 && date1.getTime() !== date2.getTime())
);

const findPreviousInput = (element) => {
  const previousElement = element.previousElementSibling; // Divider between inputs
  if (!previousElement) {
    return null;
  }
  return previousElement.previousElementSibling; // Actual input
};

const findNextInput = (element) => {
  const nextElement = element.nextElementSibling; // Divider between inputs
  if (!nextElement) {
    return null;
  }
  return nextElement.nextElementSibling; // Actual input
};

const focus = element => element && element.focus();

const renderCustomInputs = (placeholder, elementFunctions) => {
  const pattern = new RegExp(Object.keys(elementFunctions).join('|'), 'gi');
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
      if (matches && matches[index]) {
        res.push(elementFunctions[matches[index]]());
      }
      return res;
    }, []);
};

export default class DateTimeInput extends PureComponent {
  static getDerivedStateFromProps(nextProps, prevState) {
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
    const nextValue = nextProps.value;
    if (
      // Toggling calendar visibility resets values
      nextState.isCalendarOpen // Flag was toggled
      || datesAreDifferent(nextValue, prevState.value)
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
    const { locale, maxDetail } = this.props;

    const options = { hour: 'numeric' };
    const level = allViews.indexOf(maxDetail);
    if (level >= 1) {
      options.minute = 'numeric';
    }
    if (level >= 2) {
      options.second = 'numeric';
    }

    return getFormatter(locale, options);
  }

  get formatNumber() {
    const { locale } = this.props;

    const options = { useGrouping: false };

    return getFormatter(locale, options);
  }

  get dateDivider() {
    const { locale } = this.props;
    const date = new Date(2017, 11, 11);

    return formatDate(locale, date).match(/[^0-9a-z]/i)[0];
  }

  get timeDivider() {
    const date = new Date(2017, 0, 1, 21, 12, 13);

    return this.formatTime(date).match(/[^0-9a-z]/i)[0];
  }

  get datePlaceholder() {
    const { locale } = this.props;

    const year = 2017;
    const monthIndex = 11;
    const day = 11;

    const date = new Date(year, monthIndex, day);

    return (
      formatDate(locale, date)
        .replace(this.formatNumber(year), 'year')
        .replace(this.formatNumber(monthIndex + 1), 'month')
        .replace(this.formatNumber(day), 'day')
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
      this.formatTime(date)
        .replace(this.formatNumber(hour24), 'hour-24')
        .replace(this.formatNumber(hour12), 'hour-12')
        .replace(this.formatNumber(minute), 'minute')
        .replace(this.formatNumber(second), 'second')
        .replace(new RegExp(getAmPmLabels(locale).join('|')), 'ampm')
    );
  }

  get maxTime() {
    const { maxDate } = this.props;

    if (!maxDate) {
      return null;
    }

    const { year, month, day } = this.state;

    if (
      getYear(maxDate) !== year
      || getMonth(maxDate) !== month
      || getDay(maxDate) !== day
    ) {
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

    if (
      getYear(minDate) !== year
      || getMonth(minDate) !== month
      || getDay(minDate) !== day
    ) {
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
      const [/* nativeInput */, firstInput] = event.target.children;
      focus(firstInput);
    }
  }

  onKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowLeft': {
        event.preventDefault();

        const input = event.target;
        const previousInput = findPreviousInput(input);
        focus(previousInput);
        break;
      }
      case 'ArrowRight':
      case this.dateDivider:
      case this.timeDivider: {
        event.preventDefault();

        const input = event.target;
        const nextInput = findNextInput(input);
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

  renderDay = () => {
    const { maxDetail, showLeadingZeros } = this.props;
    const { day, month, year } = this.state;

    return (
      <DayInput
        key="day"
        {...this.commonInputProps}
        maxDetail={maxDetail}
        month={month}
        showLeadingZeros={showLeadingZeros}
        year={year}
        value={day}
      />
    );
  }

  renderMonth = () => {
    const { maxDetail, showLeadingZeros } = this.props;
    const { month } = this.state;

    return (
      <MonthInput
        key="month"
        {...this.commonInputProps}
        maxDetail={maxDetail}
        showLeadingZeros={showLeadingZeros}
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

  renderHour12 = () => {
    const { hour } = this.state;

    return (
      <Hour12Input
        key="hour12"
        {...this.commonInputProps}
        value={hour}
      />
    );
  }

  renderHour24 = () => {
    const { hour } = this.state;

    return (
      <Hour24Input
        key="hour24"
        {...this.commonInputProps}
        value={hour}
      />
    );
  }

  renderMinute = () => {
    const { maxDetail } = this.props;
    const { hour, minute } = this.state;

    return (
      <MinuteInput
        key="minute"
        {...this.commonInputProps}
        hour={hour}
        maxDetail={maxDetail}
        value={minute}
      />
    );
  }

  renderSecond = () => {
    const { maxDetail } = this.props;
    const { hour, minute, second } = this.state;

    return (
      <SecondInput
        key="second"
        {...this.commonInputProps}
        hour={hour}
        maxDetail={maxDetail}
        minute={minute}
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

  renderCustomDateInputs() {
    const { datePlaceholder } = this;
    const elementFunctions = {
      day: this.renderDay,
      month: this.renderMonth,
      year: this.renderYear,
    };

    return renderCustomInputs(datePlaceholder, elementFunctions);
  }

  renderCustomTimeInputs() {
    const { timePlaceholder } = this;
    const elementFunctions = {
      'hour-12': this.renderHour12,
      'hour-24': this.renderHour24,
      minute: this.renderMinute,
      second: this.renderSecond,
      ampm: this.renderAmPm,
    };

    return renderCustomInputs(timePlaceholder, elementFunctions);
  }

  renderNativeInput() {
    const {
      disabled,
      maxDate,
      minDate,
      name,
      required,
      value,
    } = this.props;

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
        {this.renderCustomDateInputs()}
        <Divider>
          {'\u00a0'}
        </Divider>
        {this.renderCustomTimeInputs()}
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
  ]),
};

polyfill(DateTimeInput);
