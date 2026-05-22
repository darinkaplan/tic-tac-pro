import { WINNING_LINES } from './constants';
import type { Cell, SmallBoardStatus } from './types';

export function checkSmallBoardWinner(board: readonly Cell[]): SmallBoardStatus {
  for (const [a, b, c] of WINNING_LINES) {
    const cell = board[a];
    if (cell !== null && cell !== undefined && cell === board[b] && cell === board[c]) {
      return cell;
    }
  }
  if (board.every((c) => c !== null)) return 'draw';
  return null;
}
