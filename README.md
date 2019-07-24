[![npm](https://img.shields.io/npm/v/react-datetime-picker.svg)](https://www.npmjs.com/package/react-datetime-picker) ![downloads](https://img.shields.io/npm/dt/react-datetime-picker.svg) ![build](https://img.shields.io/travis/wojtekmaj/react-datetime-picker/master.svg) ![dependencies](https://img.shields.io/david/wojtekmaj/react-datetime-picker.svg
) ![dev dependencies](https://img.shields.io/david/dev/wojtekmaj/react-datetime-picker.svg
) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

# React-DateTime-Picker

A datetime picker for your React app.

* Supports virtually any language
* No moment.js needed

## tl;dr
* Install by executing `npm install react-datetime-picker` or `yarn add react-datetime-picker`.
* Import by adding `import DateTimePicker from 'react-datetime-picker'`.
* Use by adding `<DateTimePicker />`. Use `onChange` prop for getting new values.

## Demo

Minimal demo page is included in sample directory.

[Online demo](http://projects.wojtekmaj.pl/react-datetime-picker/) is also available!

## Looking for *just* a date picker or a time picker?

React-DateTime-Picker will play nicely with [React-Date-Picker](https://github.com/wojtekmaj/react-date-picker) and [React-Time-Picker](https://github.com/wojtekmaj/react-time-picker). Check them out!

## Getting started

### Compatibility

Your project needs to use React 16 or later. If you use older version of React, please refer to the table below to find suitable React-DateTime-Picker version.

|React version|Newest supported React-DateTime-Picker|
|----|----|
|>16.0|latest|
|>15.5|1.0.1|

[React-Calendar](https://github.com/wojtekmaj/react-calendar), on which React-DateTime-Picker relies heavily, uses modern web technologies. That's why it's so fast, lightweight and easy to style. This, however, comes at a cost of [supporting only modern browsers](https://caniuse.com/#feat=internationalization).

#### Legacy browsers

If you need to support legacy browsers like Internet Explorer 10, you will need to use [Intl.js](https://github.com/andyearnshaw/Intl.js/) or another Intl polyfill along with React-DateTime-Picker.

### Installation

Add React-DateTime-Picker to your project by executing `npm install react-datetime-picker` or `yarn add react-datetime-picker`.

### Usage

Here's an example of basic usage:

```js
import React, { Component } from 'react';
import DateTimePicker from 'react-datetime-picker';

class MyApp extends Component {
  state = {
    date: new Date(),
  }

  onChange = date => this.setState({ date })

  render() {
    return (
      <div>
        <DateTimePicker
          onChange={this.onChange}
          value={this.state.date}
        />
      </div>
    );
  }
}
```

### Custom styling

If you don't want to use default React-DateTime-Picker styling to build upon it, you can import React-DateTime-Picker by using `import DateTimePicker from 'react-datetime-picker/dist/entry.nostyle';` instead.

## User guide

### DateTimePicker

Displays an input field complete with custom inputs, native input, a calendar, and a clock.

#### Props

|Prop name|Description|Default value|Example values|
|----|----|----|----|
|amPmAriaLabel|`aria-label` for the AM/PM select input.|n/a|`"Select AM/PM"`|
|calendarAriaLabel|`aria-label` for the calendar button.|n/a|`"Toggle calendar"`|
|calendarClassName|Class name(s) that will be added along with `"react-calendar"` to the main React-Calendar `<div>` element.|n/a|<ul><li>String: `"class1 class2"`</li><li>Array of strings: `["class1", "class2 class3"]`</li></ul>|
|calendarIcon|Content of the calendar button. Setting the value explicitly to `null` will hide the icon.|(default icon)|<ul><li>String: `"Calendar"`</li><li>React element: `<CalendarIcon />`</li></ul>|
|clearAriaLabel|`aria-label` for the clear button.|n/a|`"Clear value"`|
|clearIcon|Content of the clear button. Setting the value explicitly to `null` will hide the icon.|(default icon)|<ul><li>String: `"Clear"`</li><li>React element: `<ClearIcon />`</li></ul>|
|clockClassName|Class name(s) that will be added along with `"react-clock"` to the main React-Calendar `<div>` element.|n/a|<ul><li>String: `"class1 class2"`</li><li>Array of strings: `["class1", "class2 class3"]`</li></ul>|
|className|Class name(s) that will be added along with `"react-datetime-picker"` to the main React-DateTime-Picker `<div>` element.|n/a|<ul><li>String: `"class1 class2"`</li><li>Array of strings: `["class1", "class2 class3"]`</li></ul>|
|dayAriaLabel|`aria-label` for the day input.|n/a|`"Day"`|
|dayPlaceholder|`placeholder` for the day input.|`"--"`|`"dd"`|
|disabled|Whether the date picker should be disabled.|`false`|`true`|
|disableCalendar|When set to `true`, will remove the clock and the button toggling its visibility.|`false`|`true`|
|disableClock|When set to `true`, will remove the clock.|`false`|`true`|
|format|Input format based on [Unicode Technical Standard #35](https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table). Supported values are: `y`, `M`, `MM`, `MMM`, `MMMM`, `d`, `dd`, `H`, `HH`, `h`, `hh`, `m`, `mm`, `s`, `ss`, `a`.|n/a|`"y-MM-dd h:mm:ss a"`|
|hourAriaLabel|`aria-label` for the hour input.|n/a|`"Hour"`|
|hourPlaceholder|`placeholder` for the hour input.|`"--"`|`"hh"`|
|isCalendarOpen|Whether the calendar should be opened.|`false`|`true`|
|isClockOpen|Whether the clock should be opened.|`false`|`true`|
|locale|Locale that should be used by the datetime picker and the calendar. Can be any [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag).|User's browser settings|`"hu-HU"`|
|maxDate|Maximum date that the user can select. Periods partially overlapped by maxDate will also be selectable, although React-DateTime-Picker will ensure that no later date is selected.|n/a|Date: `new Date()`|
|maxDetail|The most detailed calendar view that the user shall see. View defined here also becomes the one on which clicking an item in the calendar will select a date and pass it to onChange. Can be `"month"`, `"year"`, `"decade"` or `"century"`.|`"month"`|`"year"`|
|minDate|Minimum date that the user can select. Periods partially overlapped by minDate will also be selectable, although React-DateTime-Picker will ensure that no earlier date is selected.|n/a|Date: `new Date()`|
|minDetail|The least detailed calendar view that the user shall see. Can be `"month"`, `"year"`, `"decade"` or `"century"`.|`"century"`|`"decade"`|
|minuteAriaLabel|`aria-label` for the minute input.|n/a|`"Minute"`|
|minutePlaceholder|`placeholder` for the minute input.|`"--"`|`"mm"`|
|monthAriaLabel|`aria-label` for the month input.|n/a|`"Month"`|
|monthPlaceholder|`placeholder` for the month input.|`"--"`|`"mm"`|
|name|Input name.|`"datetime"`|`"myCustomName"`|
|nativeInputAriaLabel|`aria-label` for the native datetime input.|n/a|`"Date"`|
|onCalendarClose|Function called when the calendar closes.|n/a|`() => alert('Calendar closed')`|
|onCalendarOpen|Function called when the calendar opens.|n/a|`() => alert('Calendar opened')`|
|onChange|Function called when the user clicks an item on the most detailed view available.|n/a|`(value) => alert('New date is: ', value)`|
|onClockClose|Function called when the clock closes.|n/a|`() => alert('Clock closed')`|
|onClockOpen|Function called when the clock opens.|n/a|`() => alert('Clock opened')`|
|returnValue|Which dates shall be passed by the calendar to the onChange function and onClick{Period} functions. Can be `"start"`, `"end"` or `"range"`. The latter will cause an array with start and end values to be passed.|` "start"`|`"range"`|
|required|Whether datetime input should be required.|`false`|`true`|
|secondAriaLabel|`aria-label` for the second input.|n/a|`"Second"`|
|secondPlaceholder|`placeholder` for the second input.|`"--"`|`"ss"`|
|showLeadingZeros|Whether leading zeros should be rendered in datetime inputs.|`false`|`true`|
|value|Input value.|n/a|<ul><li>Date: `new Date()`</li><li>An array of dates: `[new Date(2017, 0, 1), new Date(2017, 7, 1)]`</li></ul>|
|yearAriaLabel|`aria-label` for the year input.|n/a|`"Year"`|
|yearPlaceholder|`aria-label` for the year input.|`"----"`|`"yyyy"`|

### Calendar

DateTimePicker component passes all props to React-Calendar, with the exception of `className` (you can use `calendarClassName` for that instead). There are tons of customizations you can do! For more information, see [Calendar component props](https://github.com/wojtekmaj/react-calendar#props).

### Clock

DateTimePicker component passes all props to React-Clock, with the exception of `className` (you can use `clockClassName` for that instead). There are tons of customizations you can do! For more information, see [Clock component props](https://github.com/wojtekmaj/react-clock#props).

## License

The MIT License.

## Author

<table>
  <tr>
    <td>
      <img src="https://github.com/wojtekmaj.png?s=100" width="100">
    </td>
    <td>
      Wojciech Maj<br />
      <a href="mailto:kontakt@wojtekmaj.pl">kontakt@wojtekmaj.pl</a><br />
      <a href="http://wojtekmaj.pl">http://wojtekmaj.pl</a>
    </td>
  </tr>
</table>
