import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import './Scoreboard.scss';
import { LOSS, WIN } from '../../constants/gameStates';
import Timer from '../Timer/Timer';

const Scoreboard = ({ flags, gameState, mines, moves }) => {
  const dispatch = useDispatch();

  /**
   * Returns the emoji from the game state
   * @param {number} gameState State of the game
   * @return {string}
   */
  const getEmojiByGameState = (gameState) => {
    switch (gameState) {
      case WIN:
        return '😎';
      case LOSS:
        return '😵';
      default:
        return '🙂'; // WAITING and PLAYING
    }
  };

  /**
   * Starts/restarts the game
   */
  const startGame = () => {
    dispatch({
      type: 'INIT'
    });
  };

  const [isTimerShown, showTimer] = useState(true);
  const minesLeft = mines - flags;

  return (
    <div className="scoreboard">
      <div className="mines">
        {minesLeft}
      </div>

      <div className="status" onClick={startGame}>
        {getEmojiByGameState(gameState)}
      </div>

      <div className="time-moves-box">
        <Timer isTimerShown={isTimerShown}
               gameState={gameState}
               onClick={() => showTimer(false)}
        />
        {isTimerShown ||
          <span className="moves-count"
                onClick={() => showTimer(true)}>
            {moves}
          </span>
        }
      </div>
    </div>
  );
};

Scoreboard.propTypes = {
  flags: PropTypes.number.isRequired,
  gameState: PropTypes.number.isRequired,
  mines: PropTypes.number.isRequired,
  moves: PropTypes.number.isRequired
};

Scoreboard.defaultProps = {
  flags: 0,
  gameState: 0,
  mines: 10,
  moves: 0
};

export default connect()(Scoreboard);
