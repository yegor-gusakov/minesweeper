/**
 * Updates 2d matrix immutable. Returns new matrix with new cell value,
 * without mutation of the source matrix
 * @param {number} value New value of the cell of the matrix
 * @param {number} x X coordinate
 * @param {number} y Y coordinate
 * @param {number[][]} matrix The 2d array to change
 * @return {number[][]} The new matrix
 */
export default function updateMatrixValue(value, x, y, matrix) {
  const columnCopy = matrix[x].slice();
  columnCopy[y] = value;

  const matrixCopy = matrix.slice();
  matrixCopy[x] = columnCopy;

  return matrixCopy;
}
