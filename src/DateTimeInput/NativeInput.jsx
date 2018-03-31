import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getISOLocalDateTime } from '../shared/dates';
import { isMaxDate, isMinDate } from '../shared/propTypes';

const nativeValueParser = getISOLocalDateTime;

export default class NativeInput extends PureComponent {
  stopPropagation = event => event.stopPropagation();

  render() {
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
};
