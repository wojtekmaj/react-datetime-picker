import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const allViews = ['hour', 'minute', 'second'];

export default class MaxDetailOptions extends PureComponent {
  onChange = (event) => {
    const { setState } = this.props;

    const { value } = event.target;

    setState({ maxDetail: value });
  }

  render() {
    const { maxDetail } = this.props;

    return (
      <fieldset id="detailoptions">
        <legend htmlFor="viewoptions">
          Maximum detail
        </legend>

        <div>
          <input
            checked={maxDetail === 'hour'}
            id="maxDetailHour"
            name="maxDetail"
            onChange={this.onChange}
            type="radio"
            value="hour"
          />
          <label htmlFor="maxDetailHour">
            Hour
          </label>
        </div>
        <div>
          <input
            checked={maxDetail === 'minute'}
            id="maxDetailMinute"
            name="maxDetail"
            onChange={this.onChange}
            type="radio"
            value="minute"
          />
          <label htmlFor="maxDetailMinute">
            Minute
          </label>
        </div>
        <div>
          <input
            checked={maxDetail === 'second'}
            id="maxDetailSecond"
            name="maxDetail"
            onChange={this.onChange}
            type="radio"
            value="second"
          />
          <label htmlFor="maxDetailSecond">
            Second
          </label>
        </div>
      </fieldset>
    );
  }
}

MaxDetailOptions.propTypes = {
  maxDetail: PropTypes.oneOf(allViews).isRequired,
  setState: PropTypes.func.isRequired,
};
