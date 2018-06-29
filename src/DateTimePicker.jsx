import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';
import detectElementOverflow from 'detect-element-overflow';

import Calendar from 'react-calendar/dist/entry.nostyle';
import Clock from 'react-clock/dist/entry.nostyle';

import DateTimeInput from './DateTimeInput';

import { isMaxDate, isMinDate } from './shared/propTypes';

const allViews = ['hour', 'minute', 'second'];

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
    document.addEventListener('mousedown', this.onClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onClick);
  }

  onClick = (event) => {
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
    // Internet Explorer still fires onFocus on disabled elements
    if (this.props.disabled) {
      return;
    }
    switch (event.target.name) {
      case 'day':
      case 'month':
      case 'year':
        this.openCalendar();
        break;
      case 'hour':
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

  closeWidgets = () => {
    this.setState({
      isCalendarOpen: false,
      isClockOpen: false,
    });
  }

  openCalendar = () => {
    this.setState({
      isCalendarOpen: true,
      isClockOpen: false,
    });
  }

  closeCalendar = () => {
    this.setState({ isCalendarOpen: false });
  }

  toggleCalendar = () => {
    this.setState(prevState => ({
      isCalendarOpen: !prevState.isCalendarOpen,
      isClockOpen: false
    }));
  }

  stopPropagation = event => event.stopPropagation();

  clear = () => this.onChange(null);

  renderInputs() {
    const { disabled } = this.props;

    const { isCalendarOpen, isClockOpen } = this.state;

    return (
      <div className="react-datetime-picker__button">
        <DateTimeInput
          disabled={disabled}
          locale={this.props.locale}
          isWidgetOpen={isCalendarOpen || isClockOpen}
          maxDetail={this.props.maxDetail}
          maxDate={this.props.maxDate}
          minDate={this.props.minDate}
          name={this.props.name}
          onChange={this.onTimeChange}
          placeholder={this.placeholder}
          required={this.props.required}
          showLeadingZeros={this.props.showLeadingZeros}
          value={this.props.value}
        />
        {this.props.clearIcon !== null && (
          <button
            className="react-datetime-picker__clear-button react-datetime-picker__button__icon"
            disabled={disabled}
            onClick={this.clear}
            onFocus={this.stopPropagation}
            type="button"
          >
            {this.props.clearIcon}
          </button>
        )}
        {this.props.calendarIcon !== null && (
          <button
            className="react-datetime-picker__calendar-button react-datetime-picker__button__icon"
            disabled={disabled}
            onClick={this.toggleCalendar}
            onFocus={this.stopPropagation}
            onBlur={this.resetValue}
            type="button"
          >
            {this.props.calendarIcon}
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
      maxDetail: dateTimePickerMaxDetail, // Unused, here to exclude it from calendarProps
      className: dateTimePickerClassName, // Unused, here to exclude it from calendarProps
      onChange,
      value,
      ...calendarProps
    } = this.props;

    const className = 'react-datetime-picker__calendar';

    return (
      <div
        className={mergeClassNames(
          className,
          `${className}--${isCalendarOpen ? 'open' : 'closed'}`,
        )}
        ref={(ref) => {
          if (!ref) {
            return;
          }

          ref.classList.remove(`${className}--above-label`);

          const collisions = detectElementOverflow(ref, document.body);

          if (collisions.collidedBottom) {
            ref.classList.add(`${className}--above-label`);
          }
        }}
      >
        <Calendar
          className={calendarClassName}
          onChange={this.onDateChange}
          value={value || null}
          {...calendarProps}
        />
      </div>
    );
  }

  renderClock() {
    const { isClockOpen } = this.state;

    if (isClockOpen === null) {
      return null;
    }

    const {
      clockClassName,
      className: timePickerClassName, // Unused, here to exclude it from clockProps
      maxDetail,
      onChange,
      ...clockProps
    } = this.props;

    const className = 'react-datetime-picker__clock';

    const maxDetailIndex = allViews.indexOf(maxDetail);

    return (
      <div
        className={mergeClassNames(
          className,
          `${className}--${isClockOpen ? 'open' : 'closed'}`,
        )}
        ref={(ref) => {
          if (!ref) {
            return;
          }

          ref.classList.remove(`${className}--above-label`);

          const collisions = detectElementOverflow(ref, document.body);

          if (collisions.collidedBottom) {
            ref.classList.add(`${className}--above-label`);
          }
        }}
      >
        <Clock
          className={clockClassName}
          renderMinuteHand={maxDetailIndex > 0}
          renderSecondHand={maxDetailIndex > 1}
          {...clockProps}
        />
      </div>
    );
  }

  render() {
    const className = 'react-datetime-picker';

    return (
      <div
        className={mergeClassNames(
          className,
          `${className}--${this.state.isCalendarOpen || this.state.isClockOpen ? 'open' : 'closed'}`,
          `${className}--${this.props.disabled ? 'disabled' : 'enabled'}`,
          this.props.className,
        )}
        onFocus={this.onFocus}
        ref={(ref) => { this.wrapper = ref; }}
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
  clearIcon: ClearIcon,
  calendarIcon: CalendarIcon,
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
  clockClassName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  calendarIcon: PropTypes.node,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  clearIcon: PropTypes.node,
  disabled: PropTypes.bool,
  isCalendarOpen: PropTypes.bool,
  isClockOpen: PropTypes.bool,
  maxDetail: PropTypes.oneOf(allViews),
  maxDate: isMaxDate,
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
