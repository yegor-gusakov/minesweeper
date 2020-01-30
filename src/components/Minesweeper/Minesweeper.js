import React from 'react';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import './Minesweeper.scss';
import Cell from '../Cell/Cell';
import { WAITING } from '../../constants/gameStates';

const Minesweeper = ({ gameState, minefield, statemap }) => {
  const dispatch = useDispatch();

  /**
   * Handles item toggle flag
   */
  const onItemToggleFlag = (x, y) => event => {
    dispatch({
      type: 'TOGGLE_FLAG',
      payload: { x, y }
    });
  };

  /**
   * Handles item click
   */
  const openTheCell = (x, y) => event => {
    // Generate map with empty cell by specified coordinates
    if (gameState === WAITING) {
      dispatch({
        type: 'MAKE_MAP_BY_POINT',
        payload: { x, y }
      });
    }

    dispatch({
      type: 'OPEN_CELL',
      payload: { x, y }
    });
  };

  return (
    <div className="minefield">
      {minefield.map((column, x) => (
        <div className="column" key={'column_' + x} >
          {Array.from(column).map((item, y) => (
            <Cell
              key={'item_' + y}
              type={item}
              itemState={statemap[x][y]}
              onItemClick={openTheCell(x, y)}
              onItemToggleFlag={onItemToggleFlag(x, y)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

Minesweeper.propTypes = {
  gameState: PropTypes.number.isRequired,
  minefield: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.number)).isRequired,
  statemap: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.number)).isRequired
};

Minesweeper.defaultProps = {
  gameState: 0,
  minefield: [],
  statemap: []
};

export default connect()(Minesweeper);
