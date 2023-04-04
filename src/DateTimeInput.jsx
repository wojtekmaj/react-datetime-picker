import React, { useEffect, useRef, useState } from 'react';
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

import Divider from './Divider';
import DayInput from 'react-date-picker/dist/DateInput/DayInput';
import MonthInput from 'react-date-picker/dist/DateInput/MonthInput';
import MonthSelect from 'react-date-picker/dist/DateInput/MonthSelect';
import YearInput from 'react-date-picker/dist/DateInput/YearInput';
import Hour12Input from 'react-time-picker/dist/TimeInput/Hour12Input';
import Hour24Input from 'react-time-picker/dist/TimeInput/Hour24Input';
import MinuteInput from 'react-time-picker/dist/TimeInput/MinuteInput';
import SecondInput from 'react-time-picker/dist/TimeInput/SecondInput';
import AmPm from 'react-time-picker/dist/TimeInput/AmPm';
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

      if (!renderFunction) {
        return res;
      }

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

const isValue = PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]);

const formatNumber = getNumberFormatter({ useGrouping: false });

export default function DateTimeInput({
  amPmAriaLabel,
  autoFocus,
  className,
  dayAriaLabel,
  dayPlaceholder,
  disabled,
  format,
  hourAriaLabel,
  hourPlaceholder,
  isWidgetOpen: isWidgetOpenProps,
  locale,
  maxDate,
  maxDetail = 'minute',
  minDate,
  minuteAriaLabel,
  minutePlaceholder,
  monthAriaLabel,
  monthPlaceholder,
  name = 'datetime',
  nativeInputAriaLabel,
  onChange: onChangeProps,
  required,
  secondAriaLabel,
  secondPlaceholder,
  showLeadingZeros,
  value: valueProps,
  yearAriaLabel,
  yearPlaceholder,
}) {
  const [amPm, setAmPm] = useState(null);
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [day, setDay] = useState(null);
  const [hour, setHour] = useState(null);
  const [minute, setMinute] = useState(null);
  const [second, setSecond] = useState(null);
  const [value, setValue] = useState(null);
  const amPmInput = useRef();
  const yearInput = useRef();
  const monthInput = useRef();
  const monthSelect = useRef();
  const dayInput = useRef();
  const hour12Input = useRef();
  const hour24Input = useRef();
  const minuteInput = useRef();
  const secondInput = useRef();
  const [isWidgetOpen, setIsWidgetOpenOpen] = useState(isWidgetOpenProps);

  useEffect(() => {
    setIsWidgetOpenOpen(isWidgetOpenProps);
  }, [isWidgetOpenProps]);

  useEffect(() => {
    const nextValue = getDetailValueFrom({
      value: valueProps,
      minDate,
      maxDate,
    });

    if (nextValue) {
      setAmPm(convert24to12(getHours(nextValue))[1]);
      setYear(getYear(nextValue).toString());
      setMonth(getMonthHuman(nextValue).toString());
      setDay(getDate(nextValue).toString());
      setHour(getHours(nextValue).toString());
      setMinute(getMinutes(nextValue).toString());
      setSecond(getSeconds(nextValue).toString());
    } else {
      setAmPm(null);
      setYear(null);
      setMonth(null);
      setDay(null);
      setHour(null);
      setMinute(null);
      setSecond(null);
    }
    setValue(nextValue);
  }, [
    valueProps,
    minDate,
    maxDate,
    // Toggling widget visibility resets values
    isWidgetOpen,
  ]);

  const valueType = maxDetail;

  const formatTime = (() => {
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
  })();

  const datePlaceholder = (() => {
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
          const options = { [name]: 'numeric' };

          getFormatterOptionsCache[name] = options;

          return options;
        })();

      return getFormatter(formatterOptions)(locale, dateToFormat).match(/\d{1,}/);
    }

    let placeholder = formattedDate;
    datePieces.forEach((datePiece, index) => {
      const match = formatDatePiece(datePiece, date);

      if (match) {
        const formattedDatePiece = match[0];
        const datePieceReplacement = datePieceReplacements[index];
        placeholder = placeholder.replace(formattedDatePiece, datePieceReplacement);
      }
    });
    // See: https://github.com/wojtekmaj/react-date-picker/issues/396
    placeholder = placeholder.replace('17', 'y');

    return placeholder;
  })();

  const timePlaceholder = (() => {
    const hour24 = 21;
    const hour12 = 9;
    const minute = 13;
    const second = 14;
    const date = new Date(2017, 0, 1, hour24, minute, second);

    return formatTime(locale, date)
      .replace(formatNumber(locale, hour12), 'h')
      .replace(formatNumber(locale, hour24), 'H')
      .replace(formatNumber(locale, minute), 'mm')
      .replace(formatNumber(locale, second), 'ss')
      .replace(new RegExp(getAmPmLabels(locale).join('|')), 'a');
  })();

  const placeholder = format || `${datePlaceholder}\u00a0${timePlaceholder}`;

  const dateDivider = (() => {
    const dividers = datePlaceholder.match(/[^0-9a-z]/i);
    return dividers ? dividers[0] : null;
  })();

  const timeDivider = (() => {
    const dividers = timePlaceholder.match(/[^0-9a-z]/i);
    return dividers ? dividers[0] : null;
  })();

  const maxTime = (() => {
    if (!maxDate) {
      return null;
    }

    if (!isSameDate(maxDate, year, month, day)) {
      return null;
    }

    return getHoursMinutesSeconds(maxDate || defaultMaxDate);
  })();

  const minTime = (() => {
    if (!minDate) {
      return null;
    }

    if (!isSameDate(minDate, year, month, day)) {
      return null;
    }

    return getHoursMinutesSeconds(minDate || defaultMinDate);
  })();

  function onClick(event) {
    if (event.target === event.currentTarget) {
      // Wrapper was directly clicked
      const firstInput = event.target.children[1];
      focus(firstInput);
    }
  }

  function onKeyDown(event) {
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowRight':
      case dateDivider:
      case timeDivider: {
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
  }

  function onKeyUp(event) {
    const { key, target: input } = event;

    const isNumberKey = !isNaN(Number(key));

    if (!isNumberKey) {
      return;
    }

    const max = input.getAttribute('max');

    if (!max) {
      return;
    }

    const { value } = input;

    /**
     * Given 1, the smallest possible number the user could type by adding another digit is 10.
     * 10 would be a valid value given max = 12, so we won't jump to the next input.
     * However, given 2, smallers possible number would be 20, and thus keeping the focus in
     * this field doesn't make sense.
     */
    if (Number(value) * 10 > Number(max) || value.length >= max.length) {
      const property = 'nextElementSibling';
      const nextInput = findInput(input, property);
      focus(nextInput);
    }
  }

  /**
   * Called after internal onChange. Checks input validity. If all fields are valid,
   * calls props.onChange.
   */
  function onChangeExternal() {
    if (!onChangeProps) {
      return;
    }

    const formElements = [
      amPmInput.current,
      dayInput.current,
      monthInput.current,
      monthSelect.current,
      yearInput.current,
      hour12Input.current,
      hour24Input.current,
      minuteInput.current,
      secondInput.current,
    ].filter(Boolean);

    const formElementsWithoutSelect = formElements.slice(1);

    const values = {};
    formElements.forEach((formElement) => {
      values[formElement.name] =
        formElement.type === 'number'
          ? 'valueAsNumber' in formElement
            ? formElement.valueAsNumber
            : Number(formElement.value)
          : formElement.value;
    });

    if (formElementsWithoutSelect.every((formElement) => !formElement.value)) {
      onChangeProps(null, false);
    } else if (
      formElements.every((formElement) => formElement.value && formElement.validity.valid)
    ) {
      const year = Number(values.year || new Date().getFullYear());
      const monthIndex = Number(values.month || 1) - 1;
      const day = Number(values.day || 1);
      const hour = Number(values.hour24 || convert12to24(values.hour12, values.amPm) || 0);
      const minute = Number(values.minute || 0);
      const second = Number(values.second || 0);

      const proposedValue = new Date();
      proposedValue.setFullYear(year, monthIndex, day);
      proposedValue.setHours(hour, minute, second, 0);

      onChangeProps(proposedValue, false);
    }
  }

  /**
   * Called when non-native date input is changed.
   */
  function onChange(event) {
    const { name, value } = event.target;

    switch (name) {
      case 'amPm':
        setAmPm(value);
        break;
      case 'year':
        setYear(value);
        break;
      case 'month':
        setMonth(value);
        break;
      case 'day':
        setDay(value);
        break;
      case 'hour12':
        setHour(value ? convert12to24(Number(value), amPm).toString() : '');
        break;
      case 'hour24':
        setHour(value);
        break;
      case 'minute':
        setMinute(value);
        break;
      case 'second':
        setSecond(value);
        break;
    }

    onChangeExternal();
  }

  /**
   * Called when native date input is changed.
   */
  function onChangeNative(event) {
    const { value } = event.target;

    if (!onChangeProps) {
      return;
    }

    const processedValue = (() => {
      if (!value) {
        return null;
      }

      const [valueDate, valueTime] = value.split('T');

      const [yearString, monthString, dayString] = valueDate.split('-');
      const year = Number(yearString);
      const monthIndex = Number(monthString) - 1 || 0;
      const day = Number(dayString) || 1;

      const [hourString, minuteString, secondString] = valueTime.split(':');
      const hour = Number(hourString) || 0;
      const minute = Number(minuteString) || 0;
      const second = Number(secondString) || 0;

      const proposedValue = new Date();
      proposedValue.setFullYear(year, monthIndex, day);
      proposedValue.setHours(hour, minute, second, 0);

      return proposedValue;
    })();

    onChangeProps(processedValue, false);
  }

  const commonInputProps = {
    className,
    disabled,
    maxDate: maxDate || defaultMaxDate,
    minDate: minDate || defaultMinDate,
    onChange,
    onKeyDown,
    onKeyUp,
    // This is only for showing validity when editing
    required: Boolean(required || isWidgetOpen),
  };

  const commonTimeInputProps = {
    maxTime,
    minTime,
  };

  function renderDay(currentMatch, index) {
    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZerosFromFormat = currentMatch && currentMatch.length === 2;

    return (
      <DayInput
        key="day"
        {...commonInputProps}
        ariaLabel={dayAriaLabel}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={index === 0 && autoFocus}
        inputRef={dayInput}
        month={month}
        placeholder={dayPlaceholder}
        showLeadingZeros={showLeadingZerosFromFormat || showLeadingZeros}
        value={day}
        year={year}
      />
    );
  }

  function renderMonth(currentMatch, index) {
    if (currentMatch && currentMatch.length > 4) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    if (currentMatch.length > 2) {
      return (
        <MonthSelect
          key="month"
          {...commonInputProps}
          ariaLabel={monthAriaLabel}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={index === 0 && autoFocus}
          inputRef={monthSelect}
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
        {...commonInputProps}
        ariaLabel={monthAriaLabel}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={index === 0 && autoFocus}
        inputRef={monthInput}
        placeholder={monthPlaceholder}
        showLeadingZeros={showLeadingZerosFromFormat || showLeadingZeros}
        value={month}
        year={year}
      />
    );
  }

  function renderYear(currentMatch, index) {
    return (
      <YearInput
        key="year"
        {...commonInputProps}
        ariaLabel={yearAriaLabel}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={index === 0 && autoFocus}
        inputRef={yearInput}
        placeholder={yearPlaceholder}
        value={year}
        valueType="day"
      />
    );
  }

  function renderHour12(currentMatch, index) {
    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZeros = currentMatch && currentMatch.length === 2;

    return (
      <Hour12Input
        key="hour12"
        {...commonInputProps}
        {...commonTimeInputProps}
        amPm={amPm}
        ariaLabel={hourAriaLabel}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={index === 0 && autoFocus}
        inputRef={hour12Input}
        placeholder={hourPlaceholder}
        showLeadingZeros={showLeadingZeros}
        value={hour}
      />
    );
  }

  function renderHour24(currentMatch, index) {
    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZeros = currentMatch && currentMatch.length === 2;

    return (
      <Hour24Input
        key="hour24"
        {...commonInputProps}
        {...commonTimeInputProps}
        ariaLabel={hourAriaLabel}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={index === 0 && autoFocus}
        inputRef={hour24Input}
        placeholder={hourPlaceholder}
        showLeadingZeros={showLeadingZeros}
        value={hour}
      />
    );
  }

  function renderHour(currentMatch, index) {
    if (/h/.test(currentMatch)) {
      return renderHour12(currentMatch, index);
    }

    return renderHour24(currentMatch, index);
  }

  function renderMinute(currentMatch, index) {
    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZeros = currentMatch && currentMatch.length === 2;

    return (
      <MinuteInput
        key="minute"
        {...commonInputProps}
        {...commonTimeInputProps}
        ariaLabel={minuteAriaLabel}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={index === 0 && autoFocus}
        hour={hour}
        inputRef={minuteInput}
        placeholder={minutePlaceholder}
        showLeadingZeros={showLeadingZeros}
        value={minute}
      />
    );
  }

  function renderSecond(currentMatch, index) {
    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZeros = currentMatch ? currentMatch.length === 2 : true;

    return (
      <SecondInput
        key="second"
        {...commonInputProps}
        {...commonTimeInputProps}
        ariaLabel={secondAriaLabel}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={index === 0 && autoFocus}
        hour={hour}
        inputRef={secondInput}
        minute={minute}
        placeholder={secondPlaceholder}
        showLeadingZeros={showLeadingZeros}
        value={second}
      />
    );
  }

  function renderAmPm(currentMatch, index) {
    return (
      <AmPm
        key="ampm"
        {...commonInputProps}
        {...commonTimeInputProps}
        ariaLabel={amPmAriaLabel}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={index === 0 && autoFocus}
        inputRef={amPmInput}
        locale={locale}
        onChange={onChange}
        value={amPm}
      />
    );
  }

  function renderCustomInputsInternal() {
    const elementFunctions = {
      d: renderDay,
      M: renderMonth,
      y: renderYear,
      h: renderHour,
      H: renderHour,
      m: renderMinute,
      s: renderSecond,
      a: renderAmPm,
    };

    const allowMultipleInstances = typeof format !== 'undefined';
    return renderCustomInputs(placeholder, elementFunctions, allowMultipleInstances);
  }

  function renderNativeInput() {
    return (
      <NativeInput
        key="datetime"
        ariaLabel={nativeInputAriaLabel}
        disabled={disabled}
        maxDate={maxDate || defaultMaxDate}
        minDate={minDate || defaultMinDate}
        name={name}
        onChange={onChangeNative}
        required={required}
        value={value}
        valueType={valueType}
      />
    );
  }

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className={className} onClick={onClick}>
      {renderNativeInput()}
      {renderCustomInputsInternal()}
    </div>
  );
}

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
  value: isValue,
  yearAriaLabel: PropTypes.string,
  yearPlaceholder: PropTypes.string,
};
