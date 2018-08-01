import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getISOLocalDateTime } from '../shared/dates';
import { isMaxDate, isMinDate, isValueType } from '../shared/propTypes';

const nativeValueParser = getISOLocalDateTime;

export default class NativeInput extends PureComponent {
  get step() {
    const { valueType } = this.props;

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
  }

  stopPropagation = event => event.stopPropagation();

  render() {
    const { step } = this;
    const {
      disabled, maxDate, minDate, name, onChange, required, value,
    } = this.props;

    return (
      <input
        type="datetime-local"
        disabled={disabled}
        max={maxDate ? nativeValueParser(maxDate) : null}
        min={minDate ? nativeValueParser(minDate) : null}
        name={name}
        onChange={onChange}
        onFocus={this.stopPropagation}
        required={required}
        step={step}
        style={{
          visibility: 'hidden',
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
        }}
        value={value ? nativeValueParser(value) : ''}
      />
    );
  }
}

NativeInput.propTypes = {
  disabled: PropTypes.bool,
  maxDate: isMaxDate,
  minDate: isMinDate,
  name: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
  valueType: isValueType,
};
