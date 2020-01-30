import createMineField from '../utils/createMineField';
import showEmptyCellsAround from '../utils/showEmptyCellsAround';
import updateMatrixValue from '../utils/updateMatrixValue';

import { CLOSED, EXPLODED, FLAGGED, OPENED, SUSPICIOUS } from '../constants/states';
import { EMPTY, MINE } from '../constants/cells';
import { LOSS, PLAYING, WAITING, WIN } from '../constants/gameStates';

/**
 * Ending the game
 */
export function end(state) {
  const statemapWithOpenedMines = state.statemap.map((column, x) => {
    return column.map((item, y) => {
      return state.minefield[x][y] === MINE ? OPENED : item;
    });
  });

  return {
    ...state,
    statemap: statemapWithOpenedMines,
    gameState: LOSS
  };
}

/**
 * Initialization the minefield
 */
export function init(state) {
  return {
    ...state,
    minefield: createMineField(state.width, state.height, state.mines),
    statemap: Array(state.width)
      .fill(undefined)
      .map(() => new Uint8Array(state.height)),
    gameState: WAITING,
    flags: 0,
    moves: 0
  };
}

/**
 * Makes map with empty cell by specified coordinates
 * That needs for first move
 */
export function makeMapByPoint(state, action) {
  const { x, y } = action.payload;

  let minefield;
  const LOOP_LIMIT = 1e4;
  // Making finite loop to prevent unexpected behavior
  for (let i = 0; i <= LOOP_LIMIT; i++) {
    if (i === LOOP_LIMIT) {
      throw new Error('Error generating map');
    }

    minefield = createMineField(state.width, state.height, state.mines);
    if (minefield[x][y] === EMPTY) {
      break;
    }
  }

  return {
    ...state,
    minefield
  };
}

/**
 * Open cell
 */
export function openCell(state, action) {
  // If game is not playing, return
  if (state.gameState !== WAITING && state.gameState !== PLAYING) {
    return state;
  }

  const { x, y } = action.payload;
  const cellState = state.statemap[x][y];

  // If cell is alredy opeend of flagged, do nothing
  if (cellState === OPENED || cellState === FLAGGED) {
    return state;
  }

  const cellType = state.minefield[x][y];

  // If is mine, showing all mines
  if (cellType === MINE) {
    const statemapWithOpenedMines = state.statemap.map((column, x) => {
      return column.map((item, y) => {
        return state.minefield[x][y] === MINE ? OPENED : item;
      });
    });

    // Mark exploded mine
    const newStatemap = updateMatrixValue(
      EXPLODED,
      x,
      y,
      statemapWithOpenedMines
    );

    return {
      ...state,
      statemap: newStatemap,
      gameState: LOSS,
      moves: ++state.moves
    };
  }

  // Just open the cell
  const statemap =
    cellType === EMPTY
      ? // Opening alll empty space
        showEmptyCellsAround(x, y, state.minefield, state.statemap)
      : // If is number, just open the cell
        updateMatrixValue(OPENED, x, y, state.statemap);

  // Counting closed cells
  const closedNumber = statemap.reduce((acc, column, x) => {
    return (
      acc +
      column.reduce((acc, item, y) => {
        return item !== OPENED ? acc + 1 : acc;
      }, 0)
    );
  }, 0);

  // Just open the cell
  if (closedNumber !== state.mines) {
    return {
      ...state,
      statemap,
      gameState: PLAYING,
      moves: ++state.moves
    };
  }

  // If game is winned
  const winStatemap = statemap.map((column, x) => {
    return column.map((item, y) => {
      return state.minefield[x][y] === MINE ? FLAGGED : OPENED;
    });
  });

  return {
    ...state,
    statemap: winStatemap,
    gameState: WIN,
    flags: state.mines,
    moves: ++state.moves
  };
}

/**
 * Resize the minefield
 */
export function resize(state, action) {
  return {
    ...state,
    width: action.payload.width,
    height: action.payload.heigth
  };
}

/**
 * Set mines number
 */
export function setMines(state, action) {
  return {
    ...state,
    mines: action.payload.mines
  };
}

/**
 * Starting the game
 */
export function start(state) {
  return {
    ...state,
    isPlaying: true
  };
}

/**
 * Toggle flag
 */
export function toggleFlag(state, action) {
  if (state.gameState !== WAITING && state.gameState !== PLAYING) {
    return state;
  }

  const { x, y } = action.payload;
  const curCellState = state.statemap[x][y];

  if (
    curCellState !== CLOSED &&
    curCellState !== FLAGGED &&
    curCellState !== SUSPICIOUS
  ) {
    return state;
  }

  let currentFlags = state.flags;

  // Next cell state
  let nextCellState;
  switch (curCellState) {
    case CLOSED: {
      currentFlags++;
      nextCellState = FLAGGED;
      break;
    }

    case FLAGGED: {
      currentFlags--;
      nextCellState = SUSPICIOUS;
      break;
    }

    case SUSPICIOUS: {
      nextCellState = CLOSED;
      break;
    }

    default: {
      throw new Error('Unexpected state');
    }
  }

  const statemap = updateMatrixValue(nextCellState, x, y, state.statemap);

  return {
    ...state,
    statemap,
    flags: currentFlags,
    moves: ++state.moves
  };
}
