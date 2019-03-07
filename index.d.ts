// Type definitions for react-datetime-picker
// Project: react-datetime-picker
// Definitions by: Idaho Edokpayi https://www.npmjs.com/~doiedokpayi
import * as React from "react";
import { DatePickerProps } from "react-date-picker";

export = DateTimePicker;

interface DateTimePickerProps extends DatePickerProps {
  clockClassName?: string | string[];
  disableClock?: boolean;
  isCalendarOpen?: boolean;
  isClockOpen?: boolean;
}
interface IDateTimePickerState {
  isCalendarOpen: boolean;
  isCalendarOpenProps: boolean;
}

declare class DateTimePicker extends React.Component<
  DateTimePickerProps,
  IDateTimePickerState
> {
  public props: DateTimePickerProps;
  constructor(props: DateTimePickerProps);
  render(): JSX.Element;
}
