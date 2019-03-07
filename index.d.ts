// Type definitions for react-datetime-picker
// Project: react-datetime-picker
// Definitions by: Idaho Edokpayi https://www.npmjs.com/~doiedokpayi
import * as React from "react";

export = DateTimePicker;

declare class DateTimePicker extends React.Component<DateTimePicker.IDateTimePickerProps, DateTimePicker.IDateTimePickerState> {
    public props: DateTimePicker.IDateTimePickerProps;    
    constructor(props: DateTimePicker.IDateTimePickerProps);        
    render(): React.ReactNode;
}

declare namespace DateTimePicker{
    export interface IDateTimePickerProps{
        calendarClassName?: string|string[];
        clockClassName?: string|string[];
        calendarIcon?: string| JSX.Element;
        className?: string|string[];
        clearIcon?: string|JSX.Element;
        disabled?: boolean;
        disableClock?: boolean;
        isCalendarOpen?: boolean;
        isClockOpen?: boolean;
        locale?: string;
        maxDate?: Date;
        maxDetail?: string;
        minDate?: Date;
        minDetail?: string;
        name?: string;
        onChange: (value: Date) => void;
        returnValue?: string;
        required?: boolean;
        showLeadingZeros?: boolean;
        value: Date|Date[];}
    export interface IDateTimePickerState{
        isCalendarOpen: boolean;
        isCalendarOpenProps: boolean;}
}