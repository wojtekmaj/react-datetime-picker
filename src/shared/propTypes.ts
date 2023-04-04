import PropTypes from 'prop-types';

const allViews = ['hour', 'minute', 'second'];
const allValueTypes = [...allViews];

export function isMinDate(props: Record<string, unknown>, propName: string, componentName: string) {
  const { [propName]: minDate } = props;

  if (!minDate) {
    return null;
  }

  if (!(minDate instanceof Date)) {
    return new Error(
      `Invalid prop \`${propName}\` of type \`${typeof minDate}\` supplied to \`${componentName}\`, expected instance of \`Date\`.`,
    );
  }

  const { maxDate } = props;

  if (maxDate && minDate > maxDate) {
    return new Error(
      `Invalid prop \`${propName}\` of type \`${typeof minDate}\` supplied to \`${componentName}\`, minDate cannot be larger than maxDate.`,
    );
  }

  return null;
}

export function isMaxDate(props: Record<string, unknown>, propName: string, componentName: string) {
  const { [propName]: maxDate } = props;

  if (!maxDate) {
    return null;
  }

  if (!(maxDate instanceof Date)) {
    return new Error(
      `Invalid prop \`${propName}\` of type \`${typeof maxDate}\` supplied to \`${componentName}\`, expected instance of \`Date\`.`,
    );
  }

  const { minDate } = props;

  if (minDate && maxDate < minDate) {
    return new Error(
      `Invalid prop \`${propName}\` of type \`${typeof maxDate}\` supplied to \`${componentName}\`, maxDate cannot be smaller than minDate.`,
    );
  }

  return null;
}

export const isValueType = PropTypes.oneOf(allValueTypes);
