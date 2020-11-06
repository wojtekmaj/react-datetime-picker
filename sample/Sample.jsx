import React, { Component } from 'react';
import { render } from 'react-dom';
import DateTimePicker from 'react-datetime-picker';

import './Sample.less';

export default class Sample extends Component {
  state = {
    value: new Date(),
  }

  onChange = (value) => this.setState({ value })

  render() {
    const { value } = this.state;

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
              onChange={this.onChange}
              secondAriaLabel="Second"
              value={value}
              yearAriaLabel="Year"
            />
          </main>
        </div>
      </div>
    );
  }
}

render(<Sample />, document.getElementById('react-container'));
