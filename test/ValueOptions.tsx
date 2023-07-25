import React from 'react';
import { getISOLocalDateTime } from '@wojtekmaj/date-utils';

import type { LooseValue } from './shared/types';

type ValueOptionsProps = {
  setValue: (value: LooseValue) => void;
  value?: LooseValue;
};

export default function ValueOptions({ setValue, value }: ValueOptionsProps) {
  const [date] = Array.isArray(value) ? value : [value];

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value: nextValue } = event.target;

    setValue(nextValue && new Date(nextValue));
  }

  return (
    <fieldset>
      <legend>Set date and time externally</legend>

      <div>
        <label htmlFor="datetime">Date and time</label>
        <input
          id="datetime"
          onChange={onChange}
          type="datetime-local"
          value={date && date instanceof Date ? getISOLocalDateTime(date) : date || undefined}
        />
        &nbsp;
        <button onClick={() => setValue(null)} type="button">
          Clear to null
        </button>
        <button onClick={() => setValue('')} type="button">
          Clear to empty string
        </button>
      </div>
    </fieldset>
  );
}
