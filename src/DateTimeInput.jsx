import React, { createRef, PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  getYear,
  getMonthHuman,
  getDate,
  getHours,
  getMinutes,
  getSeconds,
  getHoursMinutesSeconds,
} from '@wojtekmaj/date-utils';

import DayInput from 'react-date-picker/dist/DateInput/DayInput';
import MonthInput from 'react-date-picker/dist/DateInput/MonthInput';
import MonthSelect from 'react-date-picker/dist/DateInput/MonthSelect';
import YearInput from 'react-date-picker/dist/DateInput/YearInput';
import Hour12Input from 'react-time-picker/dist/TimeInput/Hour12Input';
import Hour24Input from 'react-time-picker/dist/TimeInput/Hour24Input';
import MinuteInput from 'react-time-picker/dist/TimeInput/MinuteInput';
import SecondInput from 'react-time-picker/dist/TimeInput/SecondInput';
import AmPm from 'react-time-picker/dist/TimeInput/AmPm';
import Divider from './Divider';
import NativeInput from './DateTimeInput/NativeInput';

import { getFormatter, getNumberFormatter, formatDate } from './shared/dateFormatter';
import { convert12to24, convert24to12 } from './shared/dates';
import { isMaxDate, isMinDate } from './shared/propTypes';
import { between, getAmPmLabels } from './shared/utils';

const getFormatterOptionsCache = {};

const defaultMinDate = new Date();
defaultMinDate.setFullYear(1, 0, 1);
defaultMinDate.setHours(0, 0, 0, 0);
const defaultMaxDate = new Date(8.64e15);
const allViews = ['hour', 'minute', 'second'];

function toDate(value) {
  if (value instanceof Date) {
    return value;
  }

  return new Date(value);
}

function datesAreDifferent(date1, date2) {
  return (
    (date1 && !date2) ||
    (!date1 && date2) ||
    (date1 && date2 && date1.getTime() !== date2.getTime())
  );
}

function isSameDate(date, year, month, day) {
  return (
    year === getYear(date).toString() &&
    month === getMonthHuman(date).toString() &&
    day === getDate(date).toString()
  );
}

function getValue(value, index) {
  if (!value) {
    return null;
  }

  const rawValue = Array.isArray(value) && value.length === 2 ? value[index] : value;

  if (!rawValue) {
    return null;
  }

  const valueDate = toDate(rawValue);

  if (isNaN(valueDate.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }

  return valueDate;
}

function getDetailValue({ value, minDate, maxDate }, index) {
  const valuePiece = getValue(value, index);

  if (!valuePiece) {
    return null;
  }

  return between(valuePiece, minDate, maxDate);
}

const getDetailValueFrom = (args) => getDetailValue(args, 0);

const getDetailValueTo = (args) => getDetailValue(args, 1);

function isInternalInput(element) {
  return element.dataset.input === 'true';
}

function findInput(element, property) {
  let nextElement = element;
  do {
    nextElement = nextElement[property];
  } while (nextElement && !isInternalInput(nextElement));
  return nextElement;
}

function focus(element) {
  if (element) {
    element.focus();
  }
}

function renderCustomInputs(placeholder, elementFunctions, allowMultipleInstances) {
  const usedFunctions = [];
  const pattern = new RegExp(
    Object.keys(elementFunctions)
      .map((el) => `${el}+`)
      .join('|'),
    'g',
  );
  const matches = placeholder.match(pattern);

  return placeholder.split(pattern).reduce((arr, element, index) => {
    const divider = element && (
      // eslint-disable-next-line react/no-array-index-key
      <Divider key={`separator_${index}`}>{element}</Divider>
    );
    const res = [...arr, divider];
    const currentMatch = matches && matches[index];

    if (currentMatch) {
      const renderFunction =
        elementFunctions[currentMatch] ||
        elementFunctions[
          Object.keys(elementFunctions).find((elementFunction) =>
            currentMatch.match(elementFunction),
          )
        ];

      if (!allowMultipleInstances && usedFunctions.includes(renderFunction)) {
        res.push(currentMatch);
      } else {
        res.push(renderFunction(currentMatch, index));
        usedFunctions.push(renderFunction);
      }
    }
    return res;
  }, []);
}

const formatNumber = getNumberFormatter({ useGrouping: false });

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
    const nextValue = getDetailValueFrom({ value: nextProps.value, minDate, maxDate });
    const values = [nextValue, prevState.value];
    if (
      // Toggling calendar visibility resets values
      nextState.isCalendarOpen || // Flag was toggled
      datesAreDifferent(
        ...values.map((value) => getDetailValueFrom({ value, minDate, maxDate })),
      ) ||
      datesAreDifferent(...values.map((value) => getDetailValueTo({ value, minDate, maxDate })))
    ) {
      if (nextValue) {
        [, nextState.amPm] = convert24to12(getHours(nextValue));
        nextState.year = getYear(nextValue).toString();
        nextState.month = getMonthHuman(nextValue).toString();
        nextState.day = getDate(nextValue).toString();
        nextState.hour = getHours(nextValue).toString();
        nextState.minute = getMinutes(nextValue).toString();
        nextState.second = getSeconds(nextValue).toString();
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

  dayInput = createRef();

  monthInput = createRef();

  yearInput = createRef();

  amPmInput = createRef();

  hour12Input = createRef();

  hour24Input = createRef();

  minuteInput = createRef();

  secondInput = createRef();

  get formatTime() {
    const { maxDetail } = this.props;

    const level = allViews.indexOf(maxDetail);
    const formatterOptions =
      getFormatterOptionsCache[level] ||
      (() => {
        const options = { hour: 'numeric' };
        if (level >= 1) {
          options.minute = 'numeric';
        }
        if (level >= 2) {
          options.second = 'numeric';
        }

        getFormatterOptionsCache[level] = options;

        return options;
      })();

    return getFormatter(formatterOptions);
  }

  get formatNumber() {
    return formatNumber;
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
    const formattedDate = formatDate(locale, date);

    const datePieces = ['year', 'month', 'day'];
    const datePieceReplacements = ['y', 'M', 'd'];

    function formatDatePiece(name, dateToFormat) {
      const formatterOptions =
        getFormatterOptionsCache[name] ||
        (() => {
          const options = { useGrouping: false, [name]: 'numeric' };

          getFormatterOptionsCache[name] = options;

          return options;
        })();

      return getFormatter(formatterOptions)(locale, dateToFormat).match(/\d{1,}/);
    }

    let placeholder = formattedDate;
    datePieces.forEach((datePiece, index) => {
      const formattedDatePiece = formatDatePiece(datePiece, date);
      const datePieceReplacement = datePieceReplacements[index];
      placeholder = placeholder.replace(formattedDatePiece, datePieceReplacement);
    });
    // See: https://github.com/wojtekmaj/react-date-picker/issues/396
    placeholder = placeholder.replace('17', 'y');

    return placeholder;
  }

  get timePlaceholder() {
    const { locale } = this.props;

    const hour24 = 21;
    const hour12 = 9;
    const minute = 13;
    const second = 14;
    const date = new Date(2017, 0, 1, hour24, minute, second);

    return this.formatTime(locale, date)
      .replace(this.formatNumber(locale, hour12), 'h')
      .replace(this.formatNumber(locale, hour24), 'H')
      .replace(this.formatNumber(locale, minute), 'mm')
      .replace(this.formatNumber(locale, second), 'ss')
      .replace(new RegExp(getAmPmLabels(locale).join('|')), 'a');
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

    return getHoursMinutesSeconds(maxDate || defaultMaxDate);
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

    return getHoursMinutesSeconds(minDate || defaultMinDate);
  }

  get commonInputProps() {
    const { className, disabled, isWidgetOpen, maxDate, minDate, required } = this.props;

    return {
      className,
      disabled,
      maxDate: maxDate || defaultMaxDate,
      minDate: minDate || defaultMinDate,
      onChange: this.onChange,
      onKeyDown: this.onKeyDown,
      onKeyUp: this.onKeyUp,
      placeholder: '--',
      // This is only for showing validity when editing
      required: required || isWidgetOpen,
    };
  }

  get commonTimeInputProps() {
    const { maxTime, minTime } = this;

    return {
      maxTime,
      minTime,
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
  };

  onKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowRight':
      case this.dateDivider:
      case this.timeDivider: {
        event.preventDefault();

        const { target: input } = event;
        const property =
          event.key === 'ArrowLeft' ? 'previousElementSibling' : 'nextElementSibling';
        const nextInput = findInput(input, property);
        focus(nextInput);
        break;
      }
      default:
    }
  };

  onKeyUp = (event) => {
    const { key, target: input } = event;

    const isNumberKey = !isNaN(parseInt(key, 10));

    if (!isNumberKey) {
      return;
    }

    const { value } = input;
    const max = input.getAttribute('max');

    /**
     * Given 1, the smallest possible number the user could type by adding another digit is 10.
     * 10 would be a valid value given max = 12, so we won't jump to the next input.
     * However, given 2, smallers possible number would be 20, and thus keeping the focus in
     * this field doesn't make sense.
     */
    if (value * 10 > max || value.length >= max.length) {
      const property = 'nextElementSibling';
      const nextInput = findInput(input, property);
      focus(nextInput);
    }
  };

  /**
   * Called when non-native date input is changed.
   */
  onChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case 'hour12': {
        this.setState(
          (prevState) => ({
            hour: value ? convert12to24(parseInt(value, 10), prevState.amPm).toString() : '',
          }),
          this.onChangeExternal,
        );
        break;
      }
      case 'hour24': {
        this.setState({ hour: value }, this.onChangeExternal);
        break;
      }
      default: {
        this.setState({ [name]: value }, this.onChangeExternal);
      }
    }
  };

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
      const day = parseInt(dayString, 10) || 1;

      const [hourString, minuteString, secondString] = valueTime.split(':');
      const hour = parseInt(hourString, 10) || 0;
      const minute = parseInt(minuteString, 10) || 0;
      const second = parseInt(secondString, 10) || 0;

      const proposedValue = new Date();
      proposedValue.setFullYear(year, monthIndex, day);
      proposedValue.setHours(hour, minute, second, 0);

      return proposedValue;
    })();

    onChange(processedValue, false);
  };

  onChangeAmPm = (event) => {
    const { value } = event.target;

    this.setState({ amPm: value }, this.onChangeExternal);
  };

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
      this.amPmInput.current,
      this.dayInput.current,
      this.monthInput.current,
      this.yearInput.current,
      this.hour12Input.current,
      this.hour24Input.current,
      this.minuteInput.current,
      this.secondInput.current,
    ].filter(Boolean);

    const formElementsWithoutSelect = formElements.slice(1);

    const values = {};
    formElements.forEach((formElement) => {
      values[formElement.name] = formElement.value;
    });

    if (formElementsWithoutSelect.every((formElement) => !formElement.value)) {
      onChange(null, false);
    } else if (
      formElements.every((formElement) => formElement.value && formElement.validity.valid)
    ) {
      const year = parseInt(values.year, 10) || new Date().getFullYear();
      const monthIndex = parseInt(values.month || 1, 10) - 1;
      const day = parseInt(values.day || 1, 10);
      const hour = parseInt(values.hour24 || convert12to24(values.hour12, values.amPm) || 0, 10);
      const minute = parseInt(values.minute || 0, 10);
      const second = parseInt(values.second || 0, 10);

      const proposedValue = new Date();
      proposedValue.setFullYear(year, monthIndex, day);
      proposedValue.setHours(hour, minute, second, 0);

      const processedValue = proposedValue;
      onChange(processedValue, false);
    }
  };

  renderDay = (currentMatch, index) => {
    const { autoFocus, dayAriaLabel, dayPlaceholder, showLeadingZeros } = this.props;
    const { day, month, year } = this.state;

    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZerosFromFormat = currentMatch && currentMatch.length === 2;

    return (
      <DayInput
        key="day"
        {...this.commonInputProps}
        ariaLabel={dayAriaLabel}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={index === 0 && autoFocus}
        inputRef={this.dayInput}
        month={month}
        placeholder={dayPlaceholder}
        showLeadingZeros={showLeadingZerosFromFormat || showLeadingZeros}
        value={day}
        year={year}
      />
    );
  };

  renderMonth = (currentMatch, index) => {
    const { autoFocus, locale, monthAriaLabel, monthPlaceholder, showLeadingZeros } = this.props;
    const { month, year } = this.state;

    if (currentMatch && currentMatch.length > 4) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    if (currentMatch.length > 2) {
      return (
        <MonthSelect
          key="month"
          {...this.commonInputProps}
          ariaLabel={monthAriaLabel}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={index === 0 && autoFocus}
          inputRef={this.monthInput}
          locale={locale}
          placeholder={monthPlaceholder}
          short={currentMatch.length === 3}
          value={month}
          year={year}
        />
      );
    }

    const showLeadingZerosFromFormat = currentMatch && currentMatch.length === 2;

    return (
      <MonthInput
        key="month"
        {...this.commonInputProps}
        ariaLabel={monthAriaLabel}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={index === 0 && autoFocus}
        inputRef={this.monthInput}
        placeholder={monthPlaceholder}
        showLeadingZeros={showLeadingZerosFromFormat || showLeadingZeros}
        value={month}
        year={year}
      />
    );
  };

  renderYear = (currentMatch, index) => {
    const { autoFocus, yearAriaLabel, yearPlaceholder } = this.props;
    const { year } = this.state;

    return (
      <YearInput
        key="year"
        {...this.commonInputProps}
        ariaLabel={yearAriaLabel}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={index === 0 && autoFocus}
        inputRef={this.yearInput}
        placeholder={yearPlaceholder}
        value={year}
        valueType="day"
      />
    );
  };

  renderHour = (currentMatch, index) => {
    if (/h/.test(currentMatch)) {
      return this.renderHour12(currentMatch, index);
    }

    return this.renderHour24(currentMatch, index);
  };

  renderHour12 = (currentMatch, index) => {
    const { autoFocus, hourAriaLabel, hourPlaceholder } = this.props;
    const { amPm, hour } = this.state;

    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZeros = currentMatch && currentMatch.length === 2;

    return (
      <Hour12Input
        key="hour12"
        {...this.commonInputProps}
        {...this.commonTimeInputProps}
        amPm={amPm}
        ariaLabel={hourAriaLabel}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={index === 0 && autoFocus}
        inputRef={this.hour12Input}
        placeholder={hourPlaceholder}
        showLeadingZeros={showLeadingZeros}
        value={hour}
      />
    );
  };

  renderHour24 = (currentMatch, index) => {
    const { autoFocus, hourAriaLabel, hourPlaceholder } = this.props;
    const { hour } = this.state;

    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZeros = currentMatch && currentMatch.length === 2;

    return (
      <Hour24Input
        key="hour24"
        {...this.commonInputProps}
        {...this.commonTimeInputProps}
        ariaLabel={hourAriaLabel}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={index === 0 && autoFocus}
        inputRef={this.hour24Input}
        placeholder={hourPlaceholder}
        showLeadingZeros={showLeadingZeros}
        value={hour}
      />
    );
  };

  renderMinute = (currentMatch, index) => {
    const { autoFocus, minuteAriaLabel, minutePlaceholder } = this.props;
    const { hour, minute } = this.state;

    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZeros = currentMatch && currentMatch.length === 2;

    return (
      <MinuteInput
        key="minute"
        {...this.commonInputProps}
        {...this.commonTimeInputProps}
        ariaLabel={minuteAriaLabel}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={index === 0 && autoFocus}
        hour={hour}
        inputRef={this.minuteInput}
        placeholder={minutePlaceholder}
        showLeadingZeros={showLeadingZeros}
        value={minute}
      />
    );
  };

  renderSecond = (currentMatch, index) => {
    const { autoFocus, secondAriaLabel, secondPlaceholder } = this.props;
    const { hour, minute, second } = this.state;

    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZeros = currentMatch ? currentMatch.length === 2 : true;

    return (
      <SecondInput
        key="second"
        {...this.commonInputProps}
        {...this.commonTimeInputProps}
        ariaLabel={secondAriaLabel}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={index === 0 && autoFocus}
        hour={hour}
        inputRef={this.secondInput}
        minute={minute}
        placeholder={secondPlaceholder}
        showLeadingZeros={showLeadingZeros}
        value={second}
      />
    );
  };

  renderAmPm = (currentMatch, index) => {
    const { amPmAriaLabel, autoFocus, locale } = this.props;
    const { amPm } = this.state;

    return (
      <AmPm
        key="ampm"
        {...this.commonInputProps}
        {...this.commonTimeInputProps}
        ariaLabel={amPmAriaLabel}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={index === 0 && autoFocus}
        inputRef={this.amPmInput}
        locale={locale}
        onChange={this.onChangeAmPm}
        value={amPm}
      />
    );
  };

  renderCustomInputs() {
    const { placeholder } = this;
    const { format } = this.props;

    const elementFunctions = {
      d: this.renderDay,
      M: this.renderMonth,
      y: this.renderYear,
      h: this.renderHour,
      H: this.renderHour,
      m: this.renderMinute,
      s: this.renderSecond,
      a: this.renderAmPm,
    };

    const allowMultipleInstances = typeof format !== 'undefined';
    return renderCustomInputs(placeholder, elementFunctions, allowMultipleInstances);
  }

  renderNativeInput() {
    const { disabled, maxDate, minDate, name, nativeInputAriaLabel, required } = this.props;
    const { value } = this.state;

    return (
      <NativeInput
        key="time"
        ariaLabel={nativeInputAriaLabel}
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
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div className={className} onClick={this.onClick}>
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

const isValue = PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]);

DateTimeInput.propTypes = {
  amPmAriaLabel: PropTypes.string,
  autoFocus: PropTypes.bool,
  className: PropTypes.string.isRequired,
  dayAriaLabel: PropTypes.string,
  dayPlaceholder: PropTypes.string,
  disabled: PropTypes.bool,
  format: PropTypes.string,
  hourAriaLabel: PropTypes.string,
  hourPlaceholder: PropTypes.string,
  isWidgetOpen: PropTypes.bool,
  locale: PropTypes.string,
  maxDate: isMaxDate,
  maxDetail: PropTypes.oneOf(allViews),
  minDate: isMinDate,
  minuteAriaLabel: PropTypes.string,
  minutePlaceholder: PropTypes.string,
  monthAriaLabel: PropTypes.string,
  monthPlaceholder: PropTypes.string,
  name: PropTypes.string,
  nativeInputAriaLabel: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  secondAriaLabel: PropTypes.string,
  secondPlaceholder: PropTypes.string,
  showLeadingZeros: PropTypes.bool,
  value: PropTypes.oneOfType([isValue, PropTypes.arrayOf(isValue)]),
  yearAriaLabel: PropTypes.string,
  yearPlaceholder: PropTypes.string,
};
