'use client';

import { useEffect, useRef, useState } from 'react';
import {
  getYear,
  getMonthHuman,
  getDate,
  getHours,
  getMinutes,
  getSeconds,
  getHoursMinutesSeconds,
} from '@wojtekmaj/date-utils';

import Divider from './Divider.js';
import DayInput from 'react-date-picker/dist/esm/DateInput/DayInput';
import MonthInput from 'react-date-picker/dist/esm/DateInput/MonthInput';
import MonthSelect from 'react-date-picker/dist/esm/DateInput/MonthSelect';
import YearInput from 'react-date-picker/dist/esm/DateInput/YearInput';
import Hour12Input from 'react-time-picker/dist/esm/TimeInput/Hour12Input';
import Hour24Input from 'react-time-picker/dist/esm/TimeInput/Hour24Input';
import MinuteInput from 'react-time-picker/dist/esm/TimeInput/MinuteInput';
import SecondInput from 'react-time-picker/dist/esm/TimeInput/SecondInput';
import AmPm from 'react-time-picker/dist/esm/TimeInput/AmPm';
import NativeInput from './DateTimeInput/NativeInput.js';

import { getFormatter, getNumberFormatter, formatDate } from './shared/dateFormatter.js';
import { convert12to24, convert24to12 } from './shared/dates.js';
import { between, getAmPmLabels } from './shared/utils.js';

import type { AmPmType, Detail, LooseValuePiece } from './shared/types.js';

const getFormatterOptionsCache: Record<string, Intl.DateTimeFormatOptions> = {};

const defaultMinDate = new Date();
defaultMinDate.setFullYear(1, 0, 1);
defaultMinDate.setHours(0, 0, 0, 0);
const defaultMaxDate = new Date(8.64e15);
const allViews = ['hour', 'minute', 'second'] as const;

function toDate(value: Date | string): Date {
  if (value instanceof Date) {
    return value;
  }

  return new Date(value);
}

function isSameDate(date: Date, year: string | null, month: string | null, day: string | null) {
  return (
    year === getYear(date).toString() &&
    month === getMonthHuman(date).toString() &&
    day === getDate(date).toString()
  );
}

function getValue(
  value: string | Date | null | undefined | (string | Date | null | undefined)[],
  index: 0 | 1,
): Date | null {
  const rawValue = Array.isArray(value) ? value[index] : value;

  if (!rawValue) {
    return null;
  }

  const valueDate = toDate(rawValue);

  if (isNaN(valueDate.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }

  return valueDate;
}

type DetailArgs = {
  value?: LooseValuePiece;
  minDate?: Date;
  maxDate?: Date;
};

function getDetailValue({ value, minDate, maxDate }: DetailArgs, index: 0 | 1) {
  const valuePiece = getValue(value, index);

  if (!valuePiece) {
    return null;
  }

  return between(valuePiece, minDate, maxDate);
}

const getDetailValueFrom = (args: DetailArgs) => getDetailValue(args, 0);

function isInternalInput(element: HTMLElement) {
  return element.dataset.input === 'true';
}

function findInput(
  element: HTMLElement,
  property: 'previousElementSibling' | 'nextElementSibling',
) {
  let nextElement: HTMLElement | null = element;
  do {
    nextElement = nextElement[property] as HTMLElement | null;
  } while (nextElement && !isInternalInput(nextElement));
  return nextElement;
}

function focus(element?: HTMLElement | null) {
  if (element) {
    element.focus();
  }
}

type RenderFunction = (match: string, index: number) => React.ReactNode;

function renderCustomInputs(
  placeholder: string,
  elementFunctions: Record<string, RenderFunction>,
  allowMultipleInstances: boolean,
) {
  const usedFunctions: RenderFunction[] = [];
  const pattern = new RegExp(
    Object.keys(elementFunctions)
      .map((el) => `${el}+`)
      .join('|'),
    'g',
  );
  const matches = placeholder.match(pattern);

  return placeholder.split(pattern).reduce<React.ReactNode[]>((arr, element, index) => {
    const divider = element && (
      // eslint-disable-next-line react/no-array-index-key
      <Divider key={`separator_${index}`}>{element}</Divider>
    );
    arr.push(divider);
    const currentMatch = matches && matches[index];

    if (currentMatch) {
      const renderFunction =
        elementFunctions[currentMatch] ||
        elementFunctions[
          Object.keys(elementFunctions).find((elementFunction) =>
            currentMatch.match(elementFunction),
          ) as string
        ];

      if (!renderFunction) {
        return arr;
      }

      if (!allowMultipleInstances && usedFunctions.includes(renderFunction)) {
        arr.push(currentMatch);
      } else {
        arr.push(renderFunction(currentMatch, index));
        usedFunctions.push(renderFunction);
      }
    }

    return arr;
  }, []);
}

const formatNumber = getNumberFormatter({ useGrouping: false });

type DateTimeInputProps = {
  amPmAriaLabel?: string;
  autoFocus?: boolean;
  className: string;
  dayAriaLabel?: string;
  dayPlaceholder?: string;
  disabled?: boolean;
  format?: string;
  hourAriaLabel?: string;
  hourPlaceholder?: string;
  isWidgetOpen?: boolean | null;
  locale?: string;
  maxDate?: Date;
  maxDetail?: Detail;
  minDate?: Date;
  minuteAriaLabel?: string;
  minutePlaceholder?: string;
  monthAriaLabel?: string;
  monthPlaceholder?: string;
  name?: string;
  nativeInputAriaLabel?: string;
  onChange?: (value: Date | null, shouldCloseWidgets: boolean) => void;
  onInvalidChange?: () => void;
  required?: boolean;
  secondAriaLabel?: string;
  secondPlaceholder?: string;
  showLeadingZeros?: boolean;
  value?: string | Date | null;
  yearAriaLabel?: string;
  yearPlaceholder?: string;
};

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
  onInvalidChange,
  required,
  secondAriaLabel,
  secondPlaceholder,
  showLeadingZeros,
  value: valueProps,
  yearAriaLabel,
  yearPlaceholder,
}: DateTimeInputProps) {
  const [amPm, setAmPm] = useState<AmPmType | null>(null);
  const [year, setYear] = useState<string | null>(null);
  const [month, setMonth] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [hour, setHour] = useState<string | null>(null);
  const [minute, setMinute] = useState<string | null>(null);
  const [second, setSecond] = useState<string | null>(null);
  const [value, setValue] = useState<Date | null>(null);
  const amPmInput = useRef<HTMLSelectElement>(null);
  const yearInput = useRef<HTMLInputElement>(null);
  const monthInput = useRef<HTMLInputElement>(null);
  const monthSelect = useRef<HTMLSelectElement>(null);
  const dayInput = useRef<HTMLInputElement>(null);
  const hour12Input = useRef<HTMLInputElement>(null);
  const hour24Input = useRef<HTMLInputElement>(null);
  const minuteInput = useRef<HTMLInputElement>(null);
  const secondInput = useRef<HTMLInputElement>(null);
  const [isWidgetOpen, setIsWidgetOpenOpen] = useState(isWidgetOpenProps);
  const lastPressedKey = useRef<KeyboardEvent['key'] | undefined>(undefined);

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
      setValue(toDate(nextValue));
    } else {
      setAmPm(null);
      setYear(null);
      setMonth(null);
      setDay(null);
      setHour(null);
      setMinute(null);
      setSecond(null);
      setValue(null);
    }
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
        const options: Intl.DateTimeFormatOptions = { hour: 'numeric' };
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

    const datePieces = ['year', 'month', 'day'] as const;
    const datePieceReplacements = ['y', 'M', 'd'];

    function formatDatePiece(name: keyof Intl.DateTimeFormatOptions, dateToFormat: Date) {
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
        const datePieceReplacement = datePieceReplacements[index] as string;
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
      return undefined;
    }

    if (!isSameDate(maxDate, year, month, day)) {
      return undefined;
    }

    return getHoursMinutesSeconds(maxDate || defaultMaxDate);
  })();

  const minTime = (() => {
    if (!minDate) {
      return undefined;
    }

    if (!isSameDate(minDate, year, month, day)) {
      return undefined;
    }

    return getHoursMinutesSeconds(minDate || defaultMinDate);
  })();

  function onClick(event: React.MouseEvent<HTMLDivElement> & { target: HTMLDivElement }) {
    if (event.target === event.currentTarget) {
      // Wrapper was directly clicked
      const firstInput = event.target.children[1] as HTMLInputElement;
      focus(firstInput);
    }
  }

  function onKeyDown(
    event:
      | (React.KeyboardEvent<HTMLInputElement> & { target: HTMLInputElement })
      | (React.KeyboardEvent<HTMLSelectElement> & { target: HTMLSelectElement }),
  ) {
    lastPressedKey.current = event.key;

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

  function onKeyUp(event: React.KeyboardEvent<HTMLInputElement> & { target: HTMLInputElement }) {
    const { key, target: input } = event;

    const isLastPressedKey = lastPressedKey.current === key;

    if (!isLastPressedKey) {
      return;
    }

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

    type NonFalsy<T> = T extends false | 0 | '' | null | undefined | 0n ? never : T;

    function filterBoolean<T>(value: T): value is NonFalsy<typeof value> {
      return Boolean(value);
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
    ].filter(filterBoolean);

    const formElementsWithoutSelect = formElements.slice(1);

    const values: Record<string, string | number> & {
      amPm?: AmPmType;
    } = {};
    formElements.forEach((formElement) => {
      values[formElement.name] =
        formElement.type === 'number'
          ? 'valueAsNumber' in formElement
            ? formElement.valueAsNumber
            : Number(formElement.value)
          : formElement.value;
    });

    const isEveryValueEmpty = formElementsWithoutSelect.every((formElement) => !formElement.value);

    if (isEveryValueEmpty) {
      onChangeProps(null, false);
      return;
    }

    const isEveryValueFilled = formElements.every((formElement) => formElement.value);
    const isEveryValueValid = formElements.every((formElement) => formElement.validity.valid);

    if (isEveryValueFilled && isEveryValueValid) {
      const year = Number(values.year || new Date().getFullYear());
      const monthIndex = Number(values.month || 1) - 1;
      const day = Number(values.day || 1);
      const hour = Number(
        values.hour24 ||
          (values.hour12 && values.amPm && convert12to24(values.hour12, values.amPm)) ||
          0,
      );
      const minute = Number(values.minute || 0);
      const second = Number(values.second || 0);

      const proposedValue = new Date();
      proposedValue.setFullYear(year, monthIndex, day);
      proposedValue.setHours(hour, minute, second, 0);

      onChangeProps(proposedValue, false);
      return;
    }

    if (!onInvalidChange) {
      return;
    }

    onInvalidChange();
  }

  /**
   * Called when non-native date input is changed.
   */
  function onChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;

    switch (name) {
      case 'amPm':
        setAmPm(value as AmPmType);
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
        setHour(value ? convert12to24(value, amPm || 'am').toString() : '');
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
  function onChangeNative(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;

    if (!onChangeProps) {
      return;
    }

    const processedValue = (() => {
      if (!value) {
        return null;
      }

      const [valueDate, valueTime] = value.split('T') as [string, string];

      const [yearString, monthString, dayString] = valueDate.split('-') as [string, string, string];
      const year = Number(yearString);
      const monthIndex = Number(monthString) - 1 || 0;
      const day = Number(dayString) || 1;

      const [hourString, minuteString, secondString] = valueTime.split(':') as [
        string,
        string,
        string,
      ];
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

  function renderDay(currentMatch: string, index: number) {
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

  function renderMonth(currentMatch: string, index: number) {
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

  function renderYear(currentMatch: string, index: number) {
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

  function renderHour12(currentMatch: string, index: number) {
    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZeros = currentMatch ? currentMatch.length === 2 : false;

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

  function renderHour24(currentMatch: string, index: number) {
    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZeros = currentMatch ? currentMatch.length === 2 : false;

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

  function renderHour(currentMatch: string, index: number) {
    if (/h/.test(currentMatch)) {
      return renderHour12(currentMatch, index);
    }

    return renderHour24(currentMatch, index);
  }

  function renderMinute(currentMatch: string, index: number) {
    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZeros = currentMatch ? currentMatch.length === 2 : false;

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

  function renderSecond(currentMatch: string, index: number) {
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

  function renderAmPm(currentMatch: string, index: number) {
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
