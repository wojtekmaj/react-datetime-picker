import { CalendarProps } from "react-calendar";

declare module "react-datetime-picker" {
  export default function DateTimePicker(
    props: DateTimePickerProps
  ): JSX.Element;

  export interface DateTimePickerProps extends CalendarProps {
    amPmAriaLabel?: string;
    autoFocus?: boolean;
    calendarAriaLabel?: string;
    calendarClassName?: string | string[];
    calendarIcon?: JSX.Element | null;
    className?: string | string[];
    clearAriaLabel?: string;
    clearIcon?: JSX.Element | null;
    clockClassName?: string | string[];
    closeWidgets?: boolean;
    dayAriaLabel?: string;
    dayPlaceholder?: string;
    disableCalendar?: boolean;
    disableClock?: boolean;
    disabled?: boolean;
    format?: string;
    hourAriaLabel?: string;
    hourPlaceholder?: string;
    isCalendarOpen?: boolean;
    isClockOpen?: boolean;
    minuteAriaLabel?: string;
    minutePlaceholder?: string;
    monthAriaLabel?: string;
    monthPlaceholder?: string;
    name?: string;
    nativeInputAriaLabel?: string;
    onCalendarClose?: () => void;
    onCalendarOpen?: () => void;
    onChange?: (value: Date) => void;
    onClockClose?: () => void;
    onClockOpen?: () => void;
    onFocus?: () => void;
    required?: boolean;
    secondAriaLabel?: string;
    secondPlaceholder?: string;
    showLeadingZeros?: boolean;
    value?: Date | Date[];
    yearAriaLabel?: string;
    yearPlaceholder?: string;
  }
}
