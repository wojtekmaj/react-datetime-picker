'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import makeEventProps from 'make-event-props';
import clsx from 'clsx';
import Calendar from 'react-calendar';
import Clock from 'react-clock';
import Fit from 'react-fit';

import DateTimeInput from './DateTimeInput.js';

import { isMaxDate, isMinDate, rangeOf } from './shared/propTypes.js';

import type { ReactNodeArray } from 'prop-types';
import type {
  ClassName,
  CloseReason,
  Detail,
  LooseValue,
  OpenReason,
  Value,
} from './shared/types.js';

const isBrowser = typeof document !== 'undefined';

const baseClassName = 'react-datetime-picker';
const outsideActionEvents = ['mousedown', 'focusin', 'touchstart'] as const;
const allViews = ['hour', 'minute', 'second'] as const;

const iconProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 19,
  height: 19,
  viewBox: '0 0 19 19',
  stroke: 'black',
  strokeWidth: 2,
};

const CalendarIcon = (
  <svg
    {...iconProps}
    className={`${baseClassName}__calendar-button__icon ${baseClassName}__button__icon`}
  >
    <rect fill="none" height="15" width="15" x="2" y="2" />
    <line x1="6" x2="6" y1="0" y2="4" />
    <line x1="13" x2="13" y1="0" y2="4" />
  </svg>
);

const ClearIcon = (
  <svg
    {...iconProps}
    className={`${baseClassName}__clear-button__icon ${baseClassName}__button__icon`}
  >
    <line x1="4" x2="15" y1="4" y2="15" />
    <line x1="15" x2="4" y1="4" y2="15" />
  </svg>
);

type Icon = React.ReactElement | ReactNodeArray | null | string | number | boolean;

type IconOrRenderFunction = Icon | React.ComponentType | React.ReactElement;

type CalendarProps = Omit<
  React.ComponentPropsWithoutRef<typeof Calendar>,
  'className' | 'maxDetail' | 'onChange'
>;

type ClockProps = Omit<React.ComponentPropsWithoutRef<typeof Clock>, 'value'>;

type EventProps = ReturnType<typeof makeEventProps>;

export type DateTimePickerProps = {
  /**
   * `aria-label` for the AM/PM select input.
   *
   * @example 'Select AM/PM'
   */
  amPmAriaLabel?: string;
  /**
   * Automatically focuses the input on mount.
   *
   * @example true
   */
  autoFocus?: boolean;
  /**
   * `aria-label` for the calendar button.
   *
   * @example 'Toggle calendar'
   */
  calendarAriaLabel?: string;
  /**
   * Class name(s) that will be added along with `"react-calendar"` to the main React-Calendar `<div>` element.
   *
   * @example 'class1 class2'
   * @example ['class1', 'class2 class3']
   */
  calendarClassName?: ClassName;
  /**
   * Content of the calendar button. Setting the value explicitly to `null` will hide the icon.
   *
   * @example 'Calendar'
   * @example <CalendarIcon />
   * @example CalendarIcon
   */
  calendarIcon?: IconOrRenderFunction | null;
  /**
   * Class name(s) that will be added along with `"react-datetime-picker"` to the main React-DateTime-Picker `<div>` element.
   *
   * @example 'class1 class2'
   * @example ['class1', 'class2 class3']
   */
  className?: ClassName;
  /**
   * `aria-label` for the clear button.
   *
   * @example 'Clear value'
   */
  clearAriaLabel?: string;
  /**
   * Content of the clear button. Setting the value explicitly to `null` will hide the icon.
   *
   * @example 'Clear'
   * @example <ClearIcon />
   * @example ClearIcon
   */
  clearIcon?: IconOrRenderFunction | null;
  /**
   * Class name(s) that will be added along with `"react-clock"` to the main React-Calendar `<div>` element.
   *
   * @example 'class1 class2'
   * @example ['class1', 'class2 class3']
   */
  clockClassName?: ClassName;
  /**
   * Whether to close the widgets on value selection. **Note**: It's recommended to use `shouldCloseWidgets` function instead.
   *
   * @default true
   * @example false
   */
  closeWidgets?: boolean;
  /**
   * `data-testid` attribute for the main React-DateTime-Picker `<div>` element.
   *
   * @example 'datetime-picker'
   */
  'data-testid'?: string;
  /**
   * `aria-label` for the day input.
   *
   * @example 'Day'
   */
  dayAriaLabel?: string;
  /**
   * `placeholder` for the day input.
   *
   * @default '--'
   * @example 'dd'
   */
  dayPlaceholder?: string;
  /**
   * When set to `true`, will remove the calendar and the button toggling its visibility.
   *
   * @default false
   * @example true
   */
  disableCalendar?: boolean;
  /**
   * When set to `true`, will remove the clock.
   *
   * @default false
   * @example true
   */
  disableClock?: boolean;
  /**
   * Whether the date time picker should be disabled.
   *
   * @default false
   * @example true
   */
  disabled?: boolean;
  /**
   * Input format based on [Unicode Technical Standard #35](https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table). Supported values are: `y`, `M`, `MM`, `MMM`, `MMMM`, `d`, `dd`, `H`, `HH`, `h`, `hh`, `m`, `mm`, `s`, `ss`, `a`.
   *
   * **Note**: When using SSR, setting this prop may help resolving hydration errors caused by locale mismatch between server and client.
   *
   * @example 'y-MM-dd h:mm:ss a'
   */
  format?: string;
  /**
   * `aria-label` for the hour input.
   *
   * @example 'Hour'
   */
  hourAriaLabel?: string;
  /**
   * `placeholder` for the hour input.
   *
   * @default '--'
   * @example 'hh'
   */
  hourPlaceholder?: string;
  /**
   * `id` attribute for the main React-DateTime-Picker `<div>` element.
   *
   * @example 'datetime-picker'
   */
  id?: string;
  /**
   * Whether the calendar should be opened.
   *
   * @default false
   * @example true
   */
  isCalendarOpen?: boolean;
  /**
   * Whether the clock should be opened.
   *
   * @default false
   * @example true
   */
  isClockOpen?: boolean;
  /**
   * Locale that should be used by the datetime picker and the calendar. Can be any [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag).
   *
   * **Note**: When using SSR, setting this prop may help resolving hydration errors caused by locale mismatch between server and client.
   *
   * @example 'hu-HU'
   */
  locale?: string;
  /**
   * Maximum date that the user can select. Periods partially overlapped by maxDate will also be selectable, although React-DateTime-Picker will ensure that no later date is selected.
   *
   * @example new Date()
   */
  maxDate?: Date;
  /**
   * The most detailed calendar view that the user shall see. View defined here also becomes the one on which clicking an item in the calendar will select a date and pass it to onChange. Can be `"hour"`, `"minute"` or `"second"`.
   *
   * Don't need hour picking? Try [React-Date-Picker](https://github.com/wojtekmaj/react-date-picker)!
   *
   * @default 'minute'
   * @example 'second'
   */
  maxDetail?: Detail;
  /**
   * Minimum date that the user can select. Periods partially overlapped by minDate will also be selectable, although React-DateTimeRange-Picker will ensure that no earlier date is selected.
   *
   * @example new Date()
   */
  minDate?: Date;
  /**
   * `aria-label` for the minute input.
   *
   * @example 'Minute'
   */
  minuteAriaLabel?: string;
  /**
   * `placeholder` for the minute input.
   *
   * @default '--'
   * @example 'mm'
   */
  minutePlaceholder?: string;
  /**
   * `aria-label` for the month input.
   *
   * @example 'Month'
   */
  monthAriaLabel?: string;
  /**
   * `placeholder` for the month input.
   *
   * @default '--'
   * @example 'mm'
   */
  monthPlaceholder?: string;
  /**
   * Input name.
   *
   * @default 'datetime'
   */
  name?: string;
  /**
   * `aria-label` for the native datetime input.
   *
   * @example 'Date'
   */
  nativeInputAriaLabel?: string;
  /**
   * Function called when the calendar closes.
   *
   * @example () => alert('Calendar closed')
   */
  onCalendarClose?: () => void;
  /**
   * Function called when the calendar opens.
   *
   * @example () => alert('Calendar opened')
   */
  onCalendarOpen?: () => void;
  /**
   * Function called when the user picks a valid datetime. If any of the fields were excluded using custom `format`, `new Date(y, 0, 1, 0, 0, 0)`, where `y` is the current year, is going to serve as a "base".
   *
   * @example (value) => alert('New date is: ', value)
   */
  onChange?: (value: Value) => void;
  /**
   * Function called when the clock closes.
   *
   * @example () => alert('Clock closed')
   */
  onClockClose?: () => void;
  /**
   * Function called when the clock opens.
   *
   * @example () => alert('Clock opened')
   */
  onClockOpen?: () => void;
  /**
   * Function called when the user focuses an input.
   *
   * @example (event) => alert('Focused input: ', event.target.name)
   */
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;
  /**
   * Function called when the user picks an invalid datetime.
   *
   * @example () => alert('Invalid datetime');
   */
  onInvalidChange?: () => void;
  /**
   * Whether to open the widgets on input focus.
   *
   * **Note**: It's recommended to use `shouldOpenWidgets` function instead.
   *
   * @default true
   * @example false
   */
  openWidgetsOnFocus?: boolean;
  /**
   * Element to render the widgets in using portal.
   *
   * @example document.getElementById('my-div')
   */
  portalContainer?: HTMLElement | null;
  /**
   * Whether datetime input should be required.
   *
   * @default false
   * @example true
   */
  required?: boolean;
  /**
   * `aria-label` for the second input.
   *
   * @example 'Second'
   */
  secondAriaLabel?: string;
  /**
   * `placeholder` for the second input.
   *
   * @default '--'
   * @example 'ss'
   */
  secondPlaceholder?: string;
  /**
   * Function called before the widgets close. `reason` can be `"buttonClick"`, `"escape"`, `"outsideAction"`, or `"select"`. `widget` can be `"calendar"` or `"clock"`. If it returns `false`, the widget will not close.
   *
   * @example ({ reason, widget }) => reason !== 'outsideAction' && widget === 'calendar'`
   */
  shouldCloseWidgets?: (props: { reason: CloseReason; widget: 'calendar' | 'clock' }) => boolean;
  /**
   * Function called before the widgets open. `reason` can be `"buttonClick"` or `"focus"`. `widget` can be `"calendar"` or `"clock"`. If it returns `false`, the widget will not open.
   *
   * @example ({ reason, widget }) => reason !== 'focus' && widget === 'calendar'`
   */
  shouldOpenWidgets?: (props: { reason: OpenReason; widget: 'calendar' | 'clock' }) => boolean;
  /**
   * Whether leading zeros should be rendered in datetime inputs.
   *
   * @default false
   * @example true
   */
  showLeadingZeros?: boolean;
  /**
   * Input value. Note that if you pass an array of values, only first value will be fully utilized.
   *
   * @example new Date(2017, 0, 1, 22, 15)
   * @example [new Date(2017, 0, 1, 22, 15), new Date(2017, 0, 1, 23, 45)]
   * @example ["2017-01-01T22:15:00", "2017-01-01T23:45:00"]
   */
  value?: LooseValue;
  /**
   * `aria-label` for the year input.
   *
   * @example 'Year'
   */
  yearAriaLabel?: string;
  /**
   * `placeholder` for the year input.
   *
   * @default '----'
   * @example 'yyyy'
   */
  yearPlaceholder?: string;
} & CalendarProps &
  ClockProps &
  Omit<EventProps, 'onChange' | 'onFocus'>;

const DateTimePicker: React.FC<DateTimePickerProps> = function DateTimePicker(props) {
  const {
    amPmAriaLabel,
    autoFocus,
    calendarAriaLabel,
    calendarIcon = CalendarIcon,
    className,
    clearAriaLabel,
    clearIcon = ClearIcon,
    closeWidgets: shouldCloseWidgetsOnSelect = true,
    'data-testid': dataTestid,
    dayAriaLabel,
    dayPlaceholder,
    disableCalendar,
    disableClock,
    disabled,
    format,
    hourAriaLabel,
    hourPlaceholder,
    id,
    isCalendarOpen: isCalendarOpenProps = null,
    isClockOpen: isClockOpenProps = null,
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
    onCalendarClose,
    onCalendarOpen,
    onChange: onChangeProps,
    onClockClose,
    onClockOpen,
    onFocus: onFocusProps,
    onInvalidChange,
    openWidgetsOnFocus = true,
    required,
    secondAriaLabel,
    secondPlaceholder,
    shouldCloseWidgets,
    shouldOpenWidgets,
    showLeadingZeros,
    value,
    yearAriaLabel,
    yearPlaceholder,
    ...otherProps
  } = props;

  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean | null>(isCalendarOpenProps);
  const [isClockOpen, setIsClockOpen] = useState<boolean | null>(isClockOpenProps);
  const wrapper = useRef<HTMLDivElement>(null);
  const calendarWrapper = useRef<HTMLDivElement>(null);
  const clockWrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsCalendarOpen(isCalendarOpenProps);
  }, [isCalendarOpenProps]);

  useEffect(() => {
    setIsClockOpen(isClockOpenProps);
  }, [isClockOpenProps]);

  function openCalendar({ reason }: { reason: OpenReason }) {
    if (shouldOpenWidgets) {
      if (!shouldOpenWidgets({ reason, widget: 'calendar' })) {
        return;
      }
    }

    setIsClockOpen(isClockOpen ? false : isClockOpen);
    setIsCalendarOpen(true);

    if (onCalendarOpen) {
      onCalendarOpen();
    }
  }

  const closeCalendar = useCallback(
    ({ reason }: { reason: CloseReason }) => {
      if (shouldCloseWidgets) {
        if (!shouldCloseWidgets({ reason, widget: 'calendar' })) {
          return;
        }
      }

      setIsCalendarOpen(false);

      if (onCalendarClose) {
        onCalendarClose();
      }
    },
    [onCalendarClose, shouldCloseWidgets],
  );

  function toggleCalendar() {
    if (isCalendarOpen) {
      closeCalendar({ reason: 'buttonClick' });
    } else {
      openCalendar({ reason: 'buttonClick' });
    }
  }

  function openClock({ reason }: { reason: OpenReason }) {
    if (shouldOpenWidgets) {
      if (!shouldOpenWidgets({ reason, widget: 'clock' })) {
        return;
      }
    }

    setIsCalendarOpen(isCalendarOpen ? false : isCalendarOpen);
    setIsClockOpen(true);

    if (onClockOpen) {
      onClockOpen();
    }
  }

  const closeClock = useCallback(
    ({ reason }: { reason: CloseReason }) => {
      if (shouldCloseWidgets) {
        if (!shouldCloseWidgets({ reason, widget: 'clock' })) {
          return;
        }
      }

      setIsClockOpen(false);

      if (onClockClose) {
        onClockClose();
      }
    },
    [onClockClose, shouldCloseWidgets],
  );

  const closeWidgets = useCallback(
    ({ reason }: { reason: CloseReason }) => {
      closeCalendar({ reason });
      closeClock({ reason });
    },
    [closeCalendar, closeClock],
  );

  function onChange(value: Value, shouldCloseWidgets: boolean = shouldCloseWidgetsOnSelect) {
    if (shouldCloseWidgets) {
      closeWidgets({ reason: 'select' });
    }

    if (onChangeProps) {
      onChangeProps(value);
    }
  }

  type DatePiece = Date | null;

  function onDateChange(
    nextValue: DatePiece | [DatePiece, DatePiece],
    shouldCloseWidgets?: boolean,
  ) {
    // React-Calendar passes an array of values when selectRange is enabled
    const [nextValueFrom] = Array.isArray(nextValue) ? nextValue : [nextValue];
    const [valueFrom] = Array.isArray(value) ? value : [value];

    if (valueFrom && nextValueFrom) {
      const valueFromDate = new Date(valueFrom);
      const nextValueFromWithHour = new Date(nextValueFrom);
      nextValueFromWithHour.setHours(
        valueFromDate.getHours(),
        valueFromDate.getMinutes(),
        valueFromDate.getSeconds(),
        valueFromDate.getMilliseconds(),
      );

      onChange(nextValueFromWithHour, shouldCloseWidgets);
    } else {
      onChange(nextValueFrom, shouldCloseWidgets);
    }
  }

  function onFocus(event: React.FocusEvent<HTMLInputElement>) {
    if (onFocusProps) {
      onFocusProps(event);
    }

    if (
      // Internet Explorer still fires onFocus on disabled elements
      disabled ||
      !openWidgetsOnFocus ||
      event.target.dataset.select === 'true'
    ) {
      return;
    }

    switch (event.target.name) {
      case 'day':
      case 'month':
      case 'year': {
        if (isCalendarOpen) {
          return;
        }

        openCalendar({ reason: 'focus' });
        break;
      }
      case 'hour12':
      case 'hour24':
      case 'minute':
      case 'second': {
        if (isClockOpen) {
          return;
        }

        openClock({ reason: 'focus' });
        break;
      }
      default:
    }
  }

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeWidgets({ reason: 'escape' });
      }
    },
    [closeWidgets],
  );

  function clear() {
    onChange(null);
  }

  function stopPropagation(event: React.FocusEvent) {
    event.stopPropagation();
  }

  const onOutsideAction = useCallback(
    (event: Event) => {
      const { current: wrapperEl } = wrapper;
      const { current: calendarWrapperEl } = calendarWrapper;
      const { current: clockWrapperEl } = clockWrapper;

      // Try event.composedPath first to handle clicks inside a Shadow DOM.
      const target = (
        'composedPath' in event ? event.composedPath()[0] : (event as Event).target
      ) as HTMLElement;

      if (
        target &&
        wrapperEl &&
        !wrapperEl.contains(target) &&
        (!calendarWrapperEl || !calendarWrapperEl.contains(target)) &&
        (!clockWrapperEl || !clockWrapperEl.contains(target))
      ) {
        closeWidgets({ reason: 'outsideAction' });
      }
    },
    [calendarWrapper, clockWrapper, closeWidgets, wrapper],
  );

  const handleOutsideActionListeners = useCallback(
    (shouldListen = isCalendarOpen || isClockOpen) => {
      outsideActionEvents.forEach((event) => {
        if (shouldListen) {
          document.addEventListener(event, onOutsideAction);
        } else {
          document.removeEventListener(event, onOutsideAction);
        }
      });

      if (shouldListen) {
        document.addEventListener('keydown', onKeyDown);
      } else {
        document.removeEventListener('keydown', onKeyDown);
      }
    },
    [isCalendarOpen, isClockOpen, onOutsideAction, onKeyDown],
  );

  useEffect(() => {
    handleOutsideActionListeners();

    return () => {
      handleOutsideActionListeners(false);
    };
  }, [handleOutsideActionListeners]);

  function renderInputs() {
    const [valueFrom] = Array.isArray(value) ? value : [value];

    const ariaLabelProps = {
      amPmAriaLabel,
      dayAriaLabel,
      hourAriaLabel,
      minuteAriaLabel,
      monthAriaLabel,
      nativeInputAriaLabel,
      secondAriaLabel,
      yearAriaLabel,
    };

    const placeholderProps = {
      dayPlaceholder,
      hourPlaceholder,
      minutePlaceholder,
      monthPlaceholder,
      secondPlaceholder,
      yearPlaceholder,
    };

    return (
      <div className={`${baseClassName}__wrapper`}>
        <DateTimeInput
          {...ariaLabelProps}
          {...placeholderProps}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
          className={`${baseClassName}__inputGroup`}
          disabled={disabled}
          format={format}
          isWidgetOpen={isCalendarOpen || isClockOpen}
          locale={locale}
          maxDate={maxDate}
          maxDetail={maxDetail}
          minDate={minDate}
          name={name}
          onChange={onChange}
          onInvalidChange={onInvalidChange}
          required={required}
          showLeadingZeros={showLeadingZeros}
          value={valueFrom}
        />
        {clearIcon !== null && (
          <button
            aria-label={clearAriaLabel}
            className={`${baseClassName}__clear-button ${baseClassName}__button`}
            disabled={disabled}
            onClick={clear}
            onFocus={stopPropagation}
            type="button"
          >
            {typeof clearIcon === 'function' ? React.createElement(clearIcon) : clearIcon}
          </button>
        )}
        {calendarIcon !== null && !disableCalendar && (
          <button
            aria-label={calendarAriaLabel}
            className={`${baseClassName}__calendar-button ${baseClassName}__button`}
            disabled={disabled}
            onClick={toggleCalendar}
            onFocus={stopPropagation}
            type="button"
          >
            {typeof calendarIcon === 'function' ? React.createElement(calendarIcon) : calendarIcon}
          </button>
        )}
      </div>
    );
  }

  function renderCalendar() {
    if (isCalendarOpen === null || disableCalendar) {
      return null;
    }

    const {
      calendarClassName,
      className: dateTimePickerClassName, // Unused, here to exclude it from calendarProps
      maxDetail: dateTimePickerMaxDetail, // Unused, here to exclude it from calendarProps
      onChange: onChangeProps, // Unused, here to exclude it from calendarProps
      portalContainer,
      value,
      ...calendarProps
    } = props;

    const className = `${baseClassName}__calendar`;
    const classNames = clsx(className, `${className}--${isCalendarOpen ? 'open' : 'closed'}`);

    const calendar = (
      <Calendar
        className={calendarClassName}
        onChange={(value) => onDateChange(value)}
        value={value}
        {...calendarProps}
      />
    );

    return portalContainer ? (
      createPortal(
        <div ref={calendarWrapper} className={classNames}>
          {calendar}
        </div>,
        portalContainer,
      )
    ) : (
      <Fit>
        <div
          ref={(ref) => {
            if (ref && !isCalendarOpen) {
              ref.removeAttribute('style');
            }
          }}
          className={classNames}
        >
          {calendar}
        </div>
      </Fit>
    );
  }

  function renderClock() {
    if (isClockOpen === null || disableClock) {
      return null;
    }

    const {
      clockClassName,
      className: dateTimePickerClassName, // Unused, here to exclude it from clockProps
      maxDetail = 'minute',
      onChange,
      portalContainer,
      value,
      ...clockProps
    } = props;

    const className = `${baseClassName}__clock`;
    const classNames = clsx(className, `${className}--${isClockOpen ? 'open' : 'closed'}`);

    const [valueFrom] = Array.isArray(value) ? value : [value];

    const maxDetailIndex = allViews.indexOf(maxDetail);

    const clock = (
      <Clock
        className={clockClassName}
        renderMinuteHand={maxDetailIndex > 0}
        renderSecondHand={maxDetailIndex > 1}
        value={valueFrom}
        {...clockProps}
      />
    );

    return portalContainer ? (
      createPortal(
        <div ref={clockWrapper} className={classNames}>
          {clock}
        </div>,
        portalContainer,
      )
    ) : (
      <Fit>
        <div
          ref={(ref) => {
            if (ref && !isClockOpen) {
              ref.removeAttribute('style');
            }
          }}
          className={classNames}
        >
          {clock}
        </div>
      </Fit>
    );
  }

  const eventProps = useMemo(() => makeEventProps(otherProps), [otherProps]);

  return (
    <div
      className={clsx(
        baseClassName,
        `${baseClassName}--${isCalendarOpen || isClockOpen ? 'open' : 'closed'}`,
        `${baseClassName}--${disabled ? 'disabled' : 'enabled'}`,
        className,
      )}
      data-testid={dataTestid}
      id={id}
      {...eventProps}
      onFocus={onFocus}
      ref={wrapper}
    >
      {renderInputs()}
      {renderCalendar()}
      {renderClock()}
    </div>
  );
};

const isValue = PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]);

const isValueOrValueArray = PropTypes.oneOfType([isValue, rangeOf(isValue)]);

DateTimePicker.propTypes = {
  amPmAriaLabel: PropTypes.string,
  autoFocus: PropTypes.bool,
  calendarAriaLabel: PropTypes.string,
  calendarClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  calendarIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  clearAriaLabel: PropTypes.string,
  clearIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  clockClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  closeWidgets: PropTypes.bool,
  'data-testid': PropTypes.string,
  dayAriaLabel: PropTypes.string,
  dayPlaceholder: PropTypes.string,
  disableCalendar: PropTypes.bool,
  disableClock: PropTypes.bool,
  disabled: PropTypes.bool,
  format: PropTypes.string,
  hourAriaLabel: PropTypes.string,
  hourPlaceholder: PropTypes.string,
  id: PropTypes.string,
  isCalendarOpen: PropTypes.bool,
  isClockOpen: PropTypes.bool,
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
  onCalendarClose: PropTypes.func,
  onCalendarOpen: PropTypes.func,
  onChange: PropTypes.func,
  onClockClose: PropTypes.func,
  onClockOpen: PropTypes.func,
  onFocus: PropTypes.func,
  openWidgetsOnFocus: PropTypes.bool,
  required: PropTypes.bool,
  secondAriaLabel: PropTypes.string,
  secondPlaceholder: PropTypes.string,
  showLeadingZeros: PropTypes.bool,
  value: isValueOrValueArray,
  yearAriaLabel: PropTypes.string,
  yearPlaceholder: PropTypes.string,
};

if (isBrowser) {
  DateTimePicker.propTypes.portalContainer = PropTypes.instanceOf(HTMLElement);
}

export default DateTimePicker;
