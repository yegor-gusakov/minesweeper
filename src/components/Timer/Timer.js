import React, { Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import PropTypes from 'prop-types';

import './Timer.scss';
import { LOSS, PLAYING, WAITING, WIN } from '../../constants/gameStates';

class Timer extends Component {
  state = {
    time: 0,
    timeStart: 0
  };

  /**
   * Returns minutes from timestamp
   * @param {number} timestamp
   * @return {number} The minutes
   */
  getMinutes = timestamp => (timestamp / 60 / 1e3) | 0;

  /**
   * Returns seconds from timestamp
   * @param {number} timestamp
   * @return {string} The seconds to hundredths as string
   */
  getSeconds = timestamp => ((timestamp % (1000 * 60)) / 1000).toFixed(2);

  /**
   * Updates the time
   */
  timeUpdate = () => {
    this.setState({
      time: Date.now() - this.state.timeStart
    });
  };

  shouldComponentUpdate(nextProps) {
    const { timeStart } = this.state;
    const curGameState = this.props.gameState;
    const nextGameState = nextProps.gameState;

    if (nextGameState === 1) {
      const curTime = Date.now() - timeStart;
      if (timeStart && curTime >= (999 * 1000)) {
        // Ending the game
        this.props.dispatch({
          type: 'END'
        });
      }
    }

    if (curGameState !== WAITING && nextGameState === WAITING) {
      // Ending the timer
      clearInterval(this.interval);
      // Waiting
      this.setState({
        time: 0,
        timeStart: 0
      });
    } else if (curGameState !== PLAYING && nextGameState === PLAYING) {
      // Starting the game
      this.setState({
        time: 0,
        timeStart: Date.now()
      });

      this.interval = setInterval(this.timeUpdate, 10);
    } else if (
      curGameState !== WIN &&
      curGameState !== LOSS &&
      (nextGameState === WIN || nextGameState === LOSS)
    ) {
      // Ending the timer
      clearInterval(this.interval);
    }
    return true;
  }

  render() {
    const { isTimerShown, onClick } = this.props;
    const { time } = this.state;
    return (
      <span className={cx('time', {'hidden': !isTimerShown})}
            onClick={onClick}>
        {this.getMinutes(time)}:{this.getSeconds(time)}
      </span>
    );
  }
}

Timer.propTypes = {
  gameState: PropTypes.number.isRequired,
  isTimerShown: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

Timer.defaultProps = {
  gameState: 0,
  isTimerShown: true,
  onClick: () => {}
};

export default connect()(Timer);
