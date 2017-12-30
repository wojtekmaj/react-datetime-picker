import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  getISOLocalDateTime,
} from '../shared/dates';
import { isMaxDate, isMinDate } from '../shared/propTypes';

const nativeValueParser = getISOLocalDateTime;

export default class NativeInput extends PureComponent {
  stopPropagation = event => event.stopPropagation()

  render() {
    const {
      maxDate, minDate, onChange, required, value,
    } = this.props;

    return (
      <input
        type="datetime-local"
        max={maxDate ? nativeValueParser(maxDate) : null}
        min={minDate ? nativeValueParser(minDate) : null}
        name="datetime"
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
  maxDate: isMaxDate,
  minDate: isMinDate,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
};
