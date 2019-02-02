import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getISOLocalDateTime } from '../src/shared/dates';

export default class ValueOptions extends PureComponent {
  onChange = (event) => {
    const { value } = event.target;

    this.setValue(value ? new Date(value) : value);
  }

  setValue = (value) => {
    const { setState } = this.props;

    setState({ value });
  }

  render() {
    const { value } = this.props;

    return (
      <fieldset id="valueOptions">
        <legend htmlFor="valueOptions">
          Set date and time externally
        </legend>

        <div>
          <label htmlFor="datetime">
            Date and time
          </label>
          <input
            id="datetime"
            onChange={this.onChange}
            type="datetime-local"
            value={value ? getISOLocalDateTime(value) : ''}
          />
          &nbsp;
          <button
            type="button"
            onClick={() => this.setValue(null)}
          >
            Clear to null
          </button>
          <button
            type="button"
            onClick={() => this.setValue('')}
          >
            Clear to empty string
          </button>
        </div>
      </fieldset>
    );
  }
}

ValueOptions.propTypes = {
  setState: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ])),
  ]),
};
