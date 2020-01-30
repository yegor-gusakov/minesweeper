import pipe from '../utils/pipe';
import updateMatrixValue from './updateMatrixValue';

import { EMPTY } from '../constants/cells';
import { FLAGGED, OPENED } from '../constants/states';

/**
 * The offsets of cells
 */
const offsets = [
  [-1, 0],
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [0, -1]
];

/**
 * Shows empty cells around the specified element
 * @param {number} x X-coordinate
 * @param {number} y Y-coordinate
 * @param {number[][]} minefield Minefield for getting types of cells
 * @param {number[][]} statemap Map of states for matating
 * @return {number[][]} Updated statemap
 */
export default function showEmptyCellsAround(x, y, minefield, statemap) {
  if (statemap[x] === undefined || statemap[x][y] === undefined) {
    return statemap;
  }

  if (statemap[x][y] === OPENED) {
    return statemap;
  }

  // Open the cell
  const statemapWithOpenedCell =
    statemap[x][y] !== FLAGGED
      ? updateMatrixValue(OPENED, x, y, statemap)
      : statemap;

  if (minefield[x][y] !== EMPTY) {
    return statemapWithOpenedCell;
  }

  const functionsList = offsets.map(([offsetX, offsetY]) => {
    return map =>
      showEmptyCellsAround(x + offsetX, y + offsetY, minefield, map);
  });

  return pipe(...functionsList)(statemapWithOpenedCell);
}
