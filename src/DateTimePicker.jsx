import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import makeEventProps from 'make-event-props';
import clsx from 'clsx';
import Calendar from 'react-calendar';
import Clock from 'react-clock';
import Fit from 'react-fit';

import DateTimeInput from './DateTimeInput';

import { isMaxDate, isMinDate } from './shared/propTypes';

const baseClassName = 'react-datetime-picker';
const outsideActionEvents = ['mousedown', 'focusin', 'touchstart'];
const allViews = ['hour', 'minute', 'second'];

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

const isValue = PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]);

export default function DateTimePicker(props) {
  const {
    amPmAriaLabel,
    autoFocus,
    calendarAriaLabel,
    calendarIcon,
    className,
    clearAriaLabel,
    clearIcon,
    closeWidgets: shouldCloseWidgetsProps,
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
    isCalendarOpen: isCalendarOpenProps,
    isClockOpen: isClockOpenProps,
    locale,
    maxDate,
    maxDetail,
    minDate,
    minuteAriaLabel,
    minutePlaceholder,
    monthAriaLabel,
    monthPlaceholder,
    name,
    nativeInputAriaLabel,
    onCalendarClose,
    onCalendarOpen,
    onChange: onChangeProps,
    onClockClose,
    onClockOpen,
    onFocus: onFocusProps,
    openWidgetsOnFocus,
    required,
    secondAriaLabel,
    secondPlaceholder,
    showLeadingZeros,
    value,
    yearAriaLabel,
    yearPlaceholder,
    ...otherProps
  } = props;

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isClockOpen, setIsClockOpen] = useState(false);
  const wrapper = useRef();
  const calendarWrapper = useRef();
  const clockWrapper = useRef();

  useEffect(() => {
    setIsCalendarOpen(isCalendarOpenProps);
  }, [isCalendarOpenProps]);

  useEffect(() => {
    setIsClockOpen(isClockOpenProps);
  }, [isClockOpenProps]);

  function openCalendar() {
    setIsClockOpen(false);
    setIsCalendarOpen(true);

    if (onCalendarOpen) {
      onCalendarOpen();
    }
  }

  const closeCalendar = useCallback(() => {
    setIsCalendarOpen(false);

    if (onCalendarClose) {
      onCalendarClose();
    }
  }, [onCalendarClose]);

  function toggleCalendar() {
    if (isCalendarOpen) {
      closeCalendar();
    } else {
      openCalendar();
    }
  }

  function openClock() {
    setIsCalendarOpen(false);
    setIsClockOpen(true);

    if (onClockOpen) {
      onClockOpen();
    }
  }

  const closeClock = useCallback(() => {
    setIsClockOpen(false);

    if (onClockClose) {
      onClockClose();
    }
  }, [onClockClose]);

  const closeWidgets = useCallback(() => {
    closeCalendar();
    closeClock();
  }, [closeCalendar, closeClock]);

  function onChange(value, shouldCloseWidgets = shouldCloseWidgetsProps) {
    if (shouldCloseWidgets) {
      closeWidgets();
    }

    if (onChangeProps) {
      onChangeProps(value);
    }
  }

  function onDateChange(nextValue, shouldCloseWidgets) {
    if (value) {
      const nextValueWithHour = new Date(nextValue);
      nextValueWithHour.setHours(
        value.getHours(),
        value.getMinutes(),
        value.getSeconds(),
        value.getMilliseconds(),
      );

      onChange(nextValueWithHour, shouldCloseWidgets);
    } else {
      onChange(nextValue, shouldCloseWidgets);
    }
  }

  function onFocus(event) {
    if (onFocusProps) {
      onFocusProps(event);
    }

    if (
      // Internet Explorer still fires onFocus on disabled elements
      disabled ||
      isCalendarOpen ||
      isClockOpen ||
      !openWidgetsOnFocus ||
      event.target.dataset.select === 'true'
    ) {
      return;
    }

    switch (event.target.name) {
      case 'day':
      case 'month':
      case 'year':
        openCalendar();
        break;
      case 'hour12':
      case 'hour24':
      case 'minute':
      case 'second':
        openClock();
        break;
      default:
    }
  }

  const onKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        closeWidgets();
      }
    },
    [closeWidgets],
  );

  function clear() {
    onChange(null);
  }

  function stopPropagation(event) {
    event.stopPropagation();
  }

  const onOutsideAction = useCallback(
    (event) => {
      const { current: wrapperEl } = wrapper;
      const { current: calendarWrapperEl } = calendarWrapper;
      const { current: clockWrapperEl } = clockWrapper;

      // Try event.composedPath first to handle clicks inside a Shadow DOM.
      const target = 'composedPath' in event ? event.composedPath()[0] : event.target;

      if (
        wrapperEl &&
        !wrapperEl.contains(target) &&
        (!calendarWrapperEl || !calendarWrapperEl.contains(target)) &&
        (!clockWrapperEl || !clockWrapperEl.contains(target))
      ) {
        closeWidgets();
      }
    },
    [calendarWrapper, clockWrapper, closeWidgets, wrapper],
  );

  const handleOutsideActionListeners = useCallback(
    (shouldListen = isCalendarOpen || isClockOpen) => {
      const action = shouldListen ? 'addEventListener' : 'removeEventListener';

      outsideActionEvents.forEach((event) => {
        document[action](event, onOutsideAction);
      });

      document[action]('keydown', onKeyDown);
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
    const [valueFrom] = [].concat(value);

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
        value={value || null}
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
      maxDetail,
      onChange,
      portalContainer,
      value,
      ...clockProps
    } = props;

    const className = `${baseClassName}__clock`;
    const classNames = clsx(className, `${className}--${isClockOpen ? 'open' : 'closed'}`);

    const [valueFrom] = [].concat(value);

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

  const {
    onChange: onChangeEventProps, // Unused, here to exclude it from eventPropsWithoutOnChange
    ...eventPropsWithoutOnChange
  } = eventProps;

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
      {...eventPropsWithoutOnChange}
      onFocus={onFocus}
      ref={wrapper}
    >
      {renderInputs()}
      {renderCalendar()}
      {renderClock()}
    </div>
  );
}

DateTimePicker.defaultProps = {
  calendarIcon: CalendarIcon,
  clearIcon: ClearIcon,
  closeWidgets: true,
  isCalendarOpen: null,
  isClockOpen: null,
  maxDetail: 'minute',
  openWidgetsOnFocus: true,
};

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
  portalContainer: PropTypes.object,
  required: PropTypes.bool,
  secondAriaLabel: PropTypes.string,
  secondPlaceholder: PropTypes.string,
  showLeadingZeros: PropTypes.bool,
  value: PropTypes.oneOfType([isValue, PropTypes.arrayOf(isValue)]),
  yearAriaLabel: PropTypes.string,
  yearPlaceholder: PropTypes.string,
};
