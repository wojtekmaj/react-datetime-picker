import React from 'react';
import PropTypes from 'prop-types';
import {
  getHours,
  getHoursMinutes,
  getISOLocalDate,
  getISOLocalDateTime,
} from '@wojtekmaj/date-utils';

import { isMaxDate, isMinDate, isValueType } from '../shared/propTypes';

export default function NativeInput({
  ariaLabel,
  disabled,
  maxDate,
  minDate,
  name,
  onChange,
  required,
  value,
  valueType,
}) {
  const nativeValueParser = (() => {
    switch (valueType) {
      case 'hour':
        return (receivedValue) => `${getISOLocalDate(receivedValue)}T${getHours(receivedValue)}:00`;
      case 'minute':
        return (receivedValue) =>
          `${getISOLocalDate(receivedValue)}T${getHoursMinutes(receivedValue)}`;
      case 'second':
        return getISOLocalDateTime;
      default:
        throw new Error('Invalid valueType.');
    }
  })();

  const step = (() => {
    switch (valueType) {
      case 'hour':
        return 3600;
      case 'minute':
        return 60;
      case 'second':
        return 1;
      default:
        throw new Error('Invalid valueType.');
    }
  })();

  function stopPropagation(event) {
    event.stopPropagation();
  }

  return (
    <input
      aria-label={ariaLabel}
      disabled={disabled}
      hidden
      max={maxDate ? nativeValueParser(maxDate) : null}
      min={minDate ? nativeValueParser(minDate) : null}
      name={name}
      onChange={onChange}
      onFocus={stopPropagation}
      required={required}
      step={step}
      style={{
        visibility: 'hidden',
        position: 'absolute',
        zIndex: '-999',
      }}
      type="datetime-local"
      value={value ? nativeValueParser(value) : ''}
    />
  );
}

NativeInput.propTypes = {
  ariaLabel: PropTypes.string,
  disabled: PropTypes.bool,
  maxDate: isMaxDate,
  minDate: isMinDate,
  name: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  valueType: isValueType,
};
