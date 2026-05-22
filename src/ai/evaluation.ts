import { WINNING_LINES } from '../game/constants';
import type { Cell, GameState, Player, SmallBoardStatus } from '../game/types';

// Big-board cell weights (center > corner > edge).
const BOARD_WEIGHTS: ReadonlyArray<number> = [3, 2, 3, 2, 4, 2, 3, 2, 3];

const BIG_BOARD_WIN_SCORE = 1000;
const BIG_BOARD_TWO_IN_ROW = 100;
const SMALL_BOARD_OWNED = 50;
const SMALL_BOARD_TWO_IN_ROW = 5;

export function evaluate(state: GameState): number {
  if (state.winner === 'X') return BIG_BOARD_WIN_SCORE;
  if (state.winner === 'O') return -BIG_BOARD_WIN_SCORE;
  if (state.winner === 'draw') return 0;

  let score = 0;

  // Big-board 2-in-a-row threats among small-board wins.
  score += lineThreatsForBigBoard(state.smallBoardStatuses);

  // Per small board: ownership + internal threats.
  for (let b = 0; b < 9; b++) {
    const status = state.smallBoardStatuses[b]!;
    const weight = BOARD_WEIGHTS[b]!;
    if (status === 'X') score += SMALL_BOARD_OWNED * weight;
    else if (status === 'O') score -= SMALL_BOARD_OWNED * weight;
    else if (status === null) {
      score += lineThreatsForSmallBoard(state.smallBoards[b]!) * weight;
    }
  }

  return score;
}

function lineThreatsForBigBoard(statuses: readonly SmallBoardStatus[]): number {
  let s = 0;
  for (const [a, b, c] of WINNING_LINES) {
    const cells = [statuses[a], statuses[b], statuses[c]];
    s += scoreLineForPlayer(cells, 'X') * BIG_BOARD_TWO_IN_ROW;
    s -= scoreLineForPlayer(cells, 'O') * BIG_BOARD_TWO_IN_ROW;
  }
  return s;
}

function lineThreatsForSmallBoard(board: readonly Cell[]): number {
  let s = 0;
  for (const [a, b, c] of WINNING_LINES) {
    const cells = [board[a], board[b], board[c]];
    s += scoreLineForPlayer(cells, 'X') * SMALL_BOARD_TWO_IN_ROW;
    s -= scoreLineForPlayer(cells, 'O') * SMALL_BOARD_TWO_IN_ROW;
  }
  return s;
}

/** Returns 1 if line has 2 of `player` and 1 empty (a 2-in-row threat), else 0. */
function scoreLineForPlayer(
  cells: ReadonlyArray<Cell | SmallBoardStatus | undefined>,
  player: Player,
): number {
  let mine = 0;
  let empty = 0;
  for (const c of cells) {
    if (c === player) mine++;
    else if (c === null || c === undefined) empty++;
  }
  return mine === 2 && empty === 1 ? 1 : 0;
}
