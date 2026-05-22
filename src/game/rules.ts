import { WINNING_LINES } from './constants';
import type { Cell, GameState, Move, SmallBoardStatus } from './types';

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

export function initialState(): GameState {
  return {
    smallBoards: Array.from({ length: 9 }, () => Array(9).fill(null) as Cell[]),
    smallBoardStatuses: Array(9).fill(null) as SmallBoardStatus[],
    currentPlayer: 'X',
    forcedBoard: null,
    winner: null,
    history: [],
  };
}

export function legalMoves(state: GameState): Move[] {
  if (state.winner !== null) return [];

  const playable: number[] = [];
  if (
    state.forcedBoard !== null &&
    state.smallBoardStatuses[state.forcedBoard] === null
  ) {
    playable.push(state.forcedBoard);
  } else {
    for (let b = 0; b < 9; b++) {
      if (state.smallBoardStatuses[b] === null) playable.push(b);
    }
  }

  const moves: Move[] = [];
  for (const boardIdx of playable) {
    const board = state.smallBoards[boardIdx]!;
    for (let cellIdx = 0; cellIdx < 9; cellIdx++) {
      if (board[cellIdx] === null) {
        moves.push({ boardIdx, cellIdx, player: state.currentPlayer });
      }
    }
  }
  return moves;
}
