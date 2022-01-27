import React from 'react';
import PropTypes from 'prop-types';
import { getISOLocalDateTime } from '@wojtekmaj/date-utils';

export default function ValidityOptions({
  maxDate,
  minDate,
  required,
  setMaxDate,
  setMinDate,
  setRequired,
}) {
  function onMinChange(event) {
    const { value } = event.target;

    setMinDate(value ? new Date(value) : null);
  }

  function onMaxChange(event) {
    const { value } = event.target;

    setMaxDate(value ? new Date(value) : null);
  }

  return (
    <fieldset id="ValidityOptions">
      <legend htmlFor="ValidityOptions">Minimum and maximum date</legend>

      <div>
        <label htmlFor="minDatetime">Minimum date</label>
        <input
          id="minDatetime"
          onChange={onMinChange}
          type="datetime-local"
          value={minDate ? getISOLocalDateTime(minDate) : ''}
        />
        &nbsp;
        <button onClick={() => setMinDate(undefined)} type="button">
          Clear
        </button>
      </div>

      <div>
        <label htmlFor="maxDatetime">Maximum date</label>
        <input
          id="maxDatetime"
          onChange={onMaxChange}
          type="datetime-local"
          value={maxDate ? getISOLocalDateTime(maxDate) : ''}
        />
        &nbsp;
        <button onClick={() => setMaxDate(undefined)} type="button">
          Clear
        </button>
      </div>

      <div>
        <input
          checked={required}
          id="required"
          onChange={(event) => setRequired(event.target.checked)}
          type="checkbox"
        />
        <label htmlFor="required">Required</label>
      </div>
    </fieldset>
  );
}

ValidityOptions.propTypes = {
  maxDate: PropTypes.instanceOf(Date),
  minDate: PropTypes.instanceOf(Date),
  required: PropTypes.bool,
  setMaxDate: PropTypes.func.isRequired,
  setMinDate: PropTypes.func.isRequired,
  setRequired: PropTypes.func.isRequired,
};
