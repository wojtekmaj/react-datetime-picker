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

  get eventProps() {
    return makeEventProps(this.props);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.onOutsideAction);
    document.addEventListener('focusin', this.onOutsideAction);
  }

  componentDidUpdate(prevProps, prevState) {
    const { isCalendarOpen, isClockOpen } = this.state;
    const {
      onCalendarClose,
      onCalendarOpen,
      onClockClose,
      onClockOpen,
    } = this.props;

    if (isCalendarOpen !== prevState.isCalendarOpen) {
      callIfDefined(isCalendarOpen ? onCalendarOpen : onCalendarClose);
    }

    if (isClockOpen !== prevState.isClockOpen) {
      callIfDefined(isClockOpen ? onClockOpen : onClockClose);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onOutsideAction);
    document.removeEventListener('focusin', this.onOutsideAction);
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

  onTimeChange = (value, closeWidgets = true) => {
    this.onChange(value, closeWidgets);
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

  renderInputs() {
    const {
      calendarIcon,
      clearIcon,
      disabled,
      locale,
      maxDetail,
      maxDate,
      minDate,
      name,
      required,
      showLeadingZeros,
      value,
    } = this.props;

    const { isCalendarOpen, isClockOpen } = this.state;

    return (
      <div className={`${baseClassName}__wrapper`}>
        <DateTimeInput
          className={`${baseClassName}__inputGroup`}
          disabled={disabled}
          locale={locale}
          isWidgetOpen={isCalendarOpen || isClockOpen}
          maxDetail={maxDetail}
          maxDate={maxDate}
          minDate={minDate}
          name={name}
          onChange={this.onTimeChange}
          placeholder={this.placeholder}
          required={required}
          showLeadingZeros={showLeadingZeros}
          value={value}
        />
        {clearIcon !== null && (
          <button
            className={`${baseClassName}__clear-button ${baseClassName}__button`}
            disabled={disabled}
            onClick={this.clear}
            onFocus={this.stopPropagation}
            type="button"
          >
            {clearIcon}
          </button>
        )}
        {calendarIcon !== null && (
          <button
            className={`${baseClassName}__calendar-button ${baseClassName}__button`}
            disabled={disabled}
            onClick={this.toggleCalendar}
            onFocus={this.stopPropagation}
            onBlur={this.resetValue}
            type="button"
          >
            {calendarIcon}
          </button>
        )}
      </div>
    );
  }

  renderCalendar() {
    const { isCalendarOpen } = this.state;

    if (isCalendarOpen === null) {
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
      className: timePickerClassName, // Unused, here to exclude it from clockProps
      maxDetail,
      onChange,
      ...clockProps
    } = this.props;

    const className = `${baseClassName}__clock`;

    const maxDetailIndex = allViews.indexOf(maxDetail);

    return (
      <Fit>
        <div className={mergeClassNames(className, `${className}--${isClockOpen ? 'open' : 'closed'}`)}>
          <Clock
            className={clockClassName}
            renderMinuteHand={maxDetailIndex > 0}
            renderSecondHand={maxDetailIndex > 1}
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

const CalendarIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19">
    <g stroke="black" strokeWidth="2">
      <rect width="15" height="15" x="2" y="2" fill="none" />
      <line x1="6" y1="0" x2="6" y2="4" />
      <line x1="13" y1="0" x2="13" y2="4" />
    </g>
  </svg>
);

const ClearIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19">
    <g stroke="black" strokeWidth="2">
      <line x1="4" y1="4" x2="15" y2="15" />
      <line x1="15" y1="4" x2="4" y2="15" />
    </g>
  </svg>
);

DateTimePicker.defaultProps = {
  calendarIcon: CalendarIcon,
  clearIcon: ClearIcon,
  isCalendarOpen: null,
  isClockOpen: null,
  maxDetail: 'minute',
};

DateTimePicker.propTypes = {
  ...Calendar.propTypes,
  ...Clock.propTypes,
  calendarClassName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  calendarIcon: PropTypes.node,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  clearIcon: PropTypes.node,
  clockClassName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  disabled: PropTypes.bool,
  disableClock: PropTypes.bool,
  isCalendarOpen: PropTypes.bool,
  isClockOpen: PropTypes.bool,
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

polyfill(DateTimePicker);
