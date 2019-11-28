import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import makeEventProps from 'make-event-props';
import mergeClassNames from 'merge-class-names';
import Fit from 'react-fit';

import Calendar from 'react-calendar/dist/entry.nostyle';
import Clock from 'react-clock/dist/entry.nostyle';

import DateTimeInput from './DateTimeInput';

import { isMaxDate, isMinDate } from './shared/propTypes';
import { callIfDefined } from './shared/utils';

const allViews = ['hour', 'minute', 'second'];
const baseClassName = 'react-datetime-picker';
const outsideActionEvents = ['mousedown', 'focusin', 'touchstart'];

export default class DateTimePicker extends PureComponent {
  static getDerivedStateFromProps(nextProps, prevState) {
    const nextState = {};

    if (nextProps.isCalendarOpen !== prevState.isCalendarOpenProps) {
      nextState.isCalendarOpen = nextProps.isCalendarOpen;
      nextState.isCalendarOpenProps = nextProps.isCalendarOpen;
    }

    if (nextProps.isClockOpen !== prevState.isClockOpenProps) {
      nextState.isClockOpen = nextProps.isClockOpen;
      nextState.isClockOpenProps = nextProps.isClockOpen;
    }

    return nextState;
  }

  state = {};

  componentDidMount() {
    this.handleOutsideActionListeners();
  }

  componentDidUpdate(prevProps, prevState) {
    const { isCalendarOpen, isClockOpen } = this.state;
    const {
      onCalendarClose,
      onCalendarOpen,
      onClockClose,
      onClockOpen,
    } = this.props;

    const isWidgetOpen = isCalendarOpen || isClockOpen;
    const prevIsWidgetOpen = prevState.isCalendarOpen || prevState.isClockOpen;

    if (isWidgetOpen !== prevIsWidgetOpen) {
      this.handleOutsideActionListeners();
    }

    if (isCalendarOpen !== prevState.isCalendarOpen) {
      callIfDefined(isCalendarOpen ? onCalendarOpen : onCalendarClose);
    }

    if (isClockOpen !== prevState.isClockOpen) {
      callIfDefined(isClockOpen ? onClockOpen : onClockClose);
    }
  }

  componentWillUnmount() {
    this.handleOutsideActionListeners(false);
  }

  get eventProps() {
    return makeEventProps(this.props);
  }

  onOutsideAction = (event) => {
    if (this.wrapper && !this.wrapper.contains(event.target)) {
      this.closeWidgets();
    }
  }

  onDateChange = (value, closeWidgets = true) => {
    const { value: prevValue } = this.props;

    if (prevValue) {
      const valueWithHour = new Date(value);
      valueWithHour.setHours(
        prevValue.getHours(),
        prevValue.getMinutes(),
        prevValue.getSeconds(),
        prevValue.getMilliseconds(),
      );

      this.onChange(valueWithHour, closeWidgets);
    } else {
      this.onChange(value, closeWidgets);
    }
  }

  onChange = (value, closeWidgets = true) => {
    this.setState(prevState => ({
      isCalendarOpen: prevState.isCalendarOpen && !closeWidgets,
      isClockOpen: prevState.isClockOpen && !closeWidgets,
    }));

    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  }

  onFocus = (event) => {
    const { disabled, onFocus } = this.props;

    if (onFocus) {
      onFocus(event);
    }

    // Internet Explorer still fires onFocus on disabled elements
    if (disabled) {
      return;
    }

    switch (event.target.name) {
      case 'day':
      case 'month':
      case 'year':
        this.openCalendar();
        break;
      case 'hour12':
      case 'hour24':
      case 'minute':
      case 'second':
        this.openClock();
        break;
      default:
    }
  }

  openClock = () => {
    this.setState({
      isCalendarOpen: false,
      isClockOpen: true,
    });
  }

  openCalendar = () => {
    this.setState({
      isCalendarOpen: true,
      isClockOpen: false,
    });
  }

  toggleCalendar = () => {
    this.setState(prevState => ({
      isCalendarOpen: !prevState.isCalendarOpen,
      isClockOpen: false,
    }));
  }

  closeWidgets = () => {
    this.setState((prevState) => {
      if (!prevState.isCalendarOpen && !prevState.isClockOpen) {
        return null;
      }

      return {
        isCalendarOpen: false,
        isClockOpen: false,
      };
    });
  }

  stopPropagation = event => event.stopPropagation();

  clear = () => this.onChange(null);

  handleOutsideActionListeners(shouldListen) {
    const { isCalendarOpen, isClockOpen } = this.state;
    const isWidgetOpen = isCalendarOpen || isClockOpen;

    const shouldListenWithFallback = typeof shouldListen !== 'undefined' ? shouldListen : isWidgetOpen;
    const fnName = shouldListenWithFallback ? 'addEventListener' : 'removeEventListener';
    outsideActionEvents.forEach(eventName => document[fnName](eventName, this.onOutsideAction));
  }

  renderInputs() {
    const {
      amPmAriaLabel,
      autoFocus,
      calendarAriaLabel,
      calendarIcon,
      clearAriaLabel,
      clearIcon,
      dayAriaLabel,
      dayPlaceholder,
      disableCalendar,
      disabled,
      format,
      hourAriaLabel,
      hourPlaceholder,
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
      required,
      secondAriaLabel,
      secondPlaceholder,
      showLeadingZeros,
      value,
      yearAriaLabel,
      yearPlaceholder,
    } = this.props;
    const { isCalendarOpen, isClockOpen } = this.state;

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
          onChange={this.onChange}
          placeholder={this.placeholder}
          required={required}
          showLeadingZeros={showLeadingZeros}
          value={valueFrom}
        />
        {clearIcon !== null && (
          <button
            aria-label={clearAriaLabel}
            className={`${baseClassName}__clear-button ${baseClassName}__button`}
            disabled={disabled}
            onClick={this.clear}
            onFocus={this.stopPropagation}
            type="button"
          >
            {clearIcon}
          </button>
        )}
        {calendarIcon !== null && !disableCalendar && (
          <button
            aria-label={calendarAriaLabel}
            className={`${baseClassName}__calendar-button ${baseClassName}__button`}
            disabled={disabled}
            onBlur={this.resetValue}
            onClick={this.toggleCalendar}
            onFocus={this.stopPropagation}
            type="button"
          >
            {calendarIcon}
          </button>
        )}
      </div>
    );
  }

  renderCalendar() {
    const { disableCalendar } = this.props;
    const { isCalendarOpen } = this.state;

    if (isCalendarOpen === null || disableCalendar) {
      return null;
    }

    const {
      calendarClassName,
      className: dateTimePickerClassName, // Unused, here to exclude it from calendarProps
      maxDetail: dateTimePickerMaxDetail, // Unused, here to exclude it from calendarProps
      onChange,
      value,
      ...calendarProps
    } = this.props;

    const className = `${baseClassName}__calendar`;

    return (
      <Fit>
        <div className={mergeClassNames(className, `${className}--${isCalendarOpen ? 'open' : 'closed'}`)}>
          <Calendar
            className={calendarClassName}
            onChange={this.onDateChange}
            value={value || null}
            {...calendarProps}
          />
        </div>
      </Fit>
    );
  }

  renderClock() {
    const { disableClock } = this.props;
    const { isClockOpen } = this.state;

    if (isClockOpen === null || disableClock) {
      return null;
    }

    const {
      clockClassName,
      className: dateTimePickerClassName, // Unused, here to exclude it from clockProps
      maxDetail,
      onChange,
      value,
      ...clockProps
    } = this.props;

    const className = `${baseClassName}__clock`;
    const [valueFrom] = [].concat(value);

    const maxDetailIndex = allViews.indexOf(maxDetail);

    return (
      <Fit>
        <div className={mergeClassNames(className, `${className}--${isClockOpen ? 'open' : 'closed'}`)}>
          <Clock
            className={clockClassName}
            renderMinuteHand={maxDetailIndex > 0}
            renderSecondHand={maxDetailIndex > 1}
            value={valueFrom}
            {...clockProps}
          />
        </div>
      </Fit>
    );
  }

  render() {
    const { className, disabled } = this.props;
    const { isCalendarOpen, isClockOpen } = this.state;

    return (
      <div
        className={mergeClassNames(
          baseClassName,
          `${baseClassName}--${isCalendarOpen || isClockOpen ? 'open' : 'closed'}`,
          `${baseClassName}--${disabled ? 'disabled' : 'enabled'}`,
          className,
        )}
        {...this.eventProps}
        onFocus={this.onFocus}
        ref={(ref) => {
          if (!ref) {
            return;
          }

          this.wrapper = ref;
        }}
      >
        {this.renderInputs()}
        {this.renderCalendar()}
        {this.renderClock()}
      </div>
    );
  }
}

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

DateTimePicker.defaultProps = {
  calendarIcon: CalendarIcon,
  clearIcon: ClearIcon,
  isCalendarOpen: null,
  isClockOpen: null,
  maxDetail: 'minute',
};

const isValue = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.instanceOf(Date),
]);

DateTimePicker.propTypes = {
  amPmAriaLabel: PropTypes.string,
  autoFocus: PropTypes.bool,
  calendarAriaLabel: PropTypes.string,
  calendarClassName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  calendarIcon: PropTypes.node,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  clearAriaLabel: PropTypes.string,
  clearIcon: PropTypes.node,
  clockClassName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  dayAriaLabel: PropTypes.string,
  dayPlaceholder: PropTypes.string,
  disableCalendar: PropTypes.bool,
  disableClock: PropTypes.bool,
  disabled: PropTypes.bool,
  format: PropTypes.string,
  hourAriaLabel: PropTypes.string,
  hourPlaceholder: PropTypes.string,
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
  required: PropTypes.bool,
  secondAriaLabel: PropTypes.string,
  secondPlaceholder: PropTypes.string,
  showLeadingZeros: PropTypes.bool,
  value: PropTypes.oneOfType([
    isValue,
    PropTypes.arrayOf(isValue),
  ]),
  yearAriaLabel: PropTypes.string,
  yearPlaceholder: PropTypes.string,
};

polyfill(DateTimePicker);
