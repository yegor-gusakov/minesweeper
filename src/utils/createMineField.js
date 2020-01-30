import { EMPTY, MINE } from '../constants/cells';

/**
 * Creates minefield with fixed size and fixed number of mines, but rundom
 * positions of mines
 * @param {number} width Width of minefield
 * @param {number} height Height of minefield
 * @param {number} mines Nuber of mines on the minefield
 * @return {Array<Uint8Array>}
 */
export default function createMineField(width, height, mines) {
  // Limiting the mines
  if (mines > width * height) {
    return createMineField(width, height, width * height);
  }

  // Generate empty minefield
  const minefield = new Array(width)
    .fill(null)
    .map(item => new Uint8Array(height));

  // Generate mines on the map
  let minesGenerated = 0;
  while (minesGenerated < mines) {
    const x = (Math.random() * width) | 0;
    const y = (Math.random() * height) | 0;

    // If mine is alredy in cell
    if (minefield[x][y] === MINE) {
      continue;
    }

    minefield[x][y] = MINE;
    minesGenerated++;
  }

  // Offsets for calculating mines around items
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

  // Calculating the number of mines around each cell
  const calculatedMap = minefield.map((column, x) => {
    return column.map((item, y) => {
      if (item !== EMPTY) {
        return item;
      }

      // Counting mines arount item
      return offsets.reduce((counter, offset) => {
        const curX = x + offset[0];
        const curY = y + offset[1];

        return minefield[curX] && minefield[curX][curY] === MINE
          ? counter + 1
          : counter;
      }, 0);
    });
  });

  return calculatedMap;
}
