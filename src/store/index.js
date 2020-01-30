import { createStore } from 'redux';
import { handleActions } from 'redux-actions';

import * as actionCreators from './actionCreators';
import { WAITING } from '../constants/gameStates';

/** Initial state */
const initialState = actionCreators.init({
  // Counter of flags in the minefield
  flags: 0,
  // State of the game
  gameState: WAITING,
  height: 9,
  // The mine field, 2d matrix
  minefield: [],
  mines: 10,
  // Moves count,
  moves: 0,
  // The map of states of every item of minefield
  // Empty 2d array on start
  statemap: [],
  width: 9
});

/** The store of application */
export default createStore((state = initialState, action) => {
  return handleActions(
    {
      END: actionCreators.end,
      INIT: actionCreators.init,
      MAKE_MAP_BY_POINT: actionCreators.makeMapByPoint,
      OPEN_CELL: actionCreators.openCell,
      RESIZE: actionCreators.resize,
      SET_MINES: actionCreators.setMines,
      START: actionCreators.start,
      TOGGLE_FLAG: actionCreators.toggleFlag
    },
    state
  )(state, action);
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
