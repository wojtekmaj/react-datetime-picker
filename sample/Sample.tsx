import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';

import './Sample.css';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Sample() {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div className="Sample">
      <header>
        <h1>react-datetime-picker sample page</h1>
      </header>
      <div className="Sample__container">
        <main className="Sample__container__content">
          <DateTimePicker
            amPmAriaLabel="Select AM/PM"
            calendarAriaLabel="Toggle calendar"
            clearAriaLabel="Clear value"
            dayAriaLabel="Day"
            hourAriaLabel="Hour"
            maxDetail="second"
            minuteAriaLabel="Minute"
            monthAriaLabel="Month"
            nativeInputAriaLabel="Date and time"
            onChange={onChange}
            secondAriaLabel="Second"
            value={value}
            yearAriaLabel="Year"
          />
        </main>
      </div>
    </div>
  );
}
