/**
 * The 8 winning lines on any 3x3 board, expressed as triples of cell indices (row-major).
 * Three rows, three columns, two diagonals.
 */
export const WINNING_LINES: ReadonlyArray<readonly [number, number, number]> = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],            // diagonals
] as const;
