import React from 'react';
import PropTypes from 'prop-types';
import { getISOLocalDateTime } from '@wojtekmaj/date-utils';

export default function ValueOptions({
  setState,
  value,
}) {
  function setValue(nextValue) {
    setState({ value: nextValue });
  }

  function onChange(event) {
    const { value: nextValue } = event.target;

    setValue(nextValue && new Date(nextValue));
  }

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
          onChange={onChange}
          type="datetime-local"
          value={value ? getISOLocalDateTime(value) : ''}
        />
        &nbsp;
        <button
          onClick={() => setValue(null)}
          type="button"
        >
          Clear to null
        </button>
        <button
          onClick={() => setValue('')}
          type="button"
        >
          Clear to empty string
        </button>
      </div>
    </fieldset>
  );
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
