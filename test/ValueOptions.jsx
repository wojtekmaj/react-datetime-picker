import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getISOLocalDateTime } from '../src/shared/dates';

export default class ValueOptions extends Component {
  setValue = value => this.props.setState({ value });

  onChange = (event) => {
    const { value } = event.target;

    this.setValue(value);
  }

  render() {
    const { value } = this.props;

    return (
      <fieldset id="valueOptions">
        <legend htmlFor="valueOptions">Set date and time externally</legend>

        <div>
          <label htmlFor="datetime">Date and time</label>
          <input
            id="datetime"
            onChange={this.onChange}
            type="datetime-local"
            value={value ? getISOLocalDateTime(value) : ''}
          />&nbsp;
          <button onClick={() => this.setValue(null)}>Clear to null</button>
          <button onClick={() => this.setValue('')}>Clear to empty string</button>
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
    PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  ]),
};
