import React, { PureComponent } from 'react';
import DateTimePicker from 'react-datetime-picker/src/entry.nostyle';
import 'react-datetime-picker/src/DateTimePicker.less';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-calendar/src/Calendar.less';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-clock/src/Clock.less';

import ValidityOptions from './ValidityOptions';
import MaxDetailOptions from './MaxDetailOptions';
import LocaleOptions from './LocaleOptions';
import ValueOptions from './ValueOptions';
import ViewOptions from './ViewOptions';

import './Test.less';

const now = new Date();

/* eslint-disable no-console */

export default class Test extends PureComponent {
  state = {
    disabled: false,
    locale: null,
    maxDate: null,
    maxDetail: 'minute',
    minDate: null,
    required: true,
    showLeadingZeros: true,
    showNeighboringMonth: false,
    showWeekNumbers: false,
    value: now,
  }

  onChange = value => this.setState({ value })

  render() {
    const {
      disabled,
      locale,
      maxDate,
      maxDetail,
      minDate,
      required,
      showLeadingZeros,
      showNeighboringMonth,
      showWeekNumbers,
      value,
    } = this.state;

    const setState = state => this.setState(state);

    return (
      <div className="Test">
        <header>
          <h1>
            react-datetime-picker test page
          </h1>
        </header>
        <div className="Test__container">
          <aside className="Test__container__options">
            <MaxDetailOptions
              maxDetail={maxDetail}
              setState={setState}
            />
            <ValidityOptions
              maxDate={maxDate}
              minDate={minDate}
              required={required}
              setState={setState}
            />
            <LocaleOptions
              setState={setState}
              locale={locale}
            />
            <ValueOptions
              setState={setState}
              value={value}
            />
            <ViewOptions
              disabled={disabled}
              setState={setState}
              showLeadingZeros={showLeadingZeros}
              showNeighboringMonth={showNeighboringMonth}
              showWeekNumbers={showWeekNumbers}
            />
          </aside>
          <main className="Test__container__content">
            <form
              onSubmit={(event) => {
                event.preventDefault();

                console.warn('DateTimePicker triggered submitting the form.');
                console.log(event);
              }}
            >
              <DateTimePicker
                className="myCustomTimePickerClassName"
                calendarClassName="myCustomCalendarClassName"
                clockClassName="myCustomClockClassName"
                disabled={disabled}
                locale={locale}
                maxDetail={maxDetail}
                maxDate={maxDate}
                minDate={minDate}
                name="myCustomName"
                onChange={this.onChange}
                onCalendarOpen={() => console.log('Calendar opened')}
                onCalendarClose={() => console.log('Calendar closed')}
                onClockOpen={() => console.log('Clock opened')}
                onClockClose={() => console.log('Clock closed')}
                required={required}
                showLeadingZeros={showLeadingZeros}
                showNeighboringMonth={showNeighboringMonth}
                showWeekNumbers={showWeekNumbers}
                value={value}
              />
              <br />
              <br />
              <button
                type="submit"
                id="submit"
              >
                Submit
              </button>
            </form>
          </main>
        </div>
      </div>
    );
  }
}
