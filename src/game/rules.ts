import { WINNING_LINES } from './constants';
import type { Cell, GameState, GameStatus, Move, SmallBoardStatus } from './types';

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

export function checkBigBoardWinner(statuses: readonly SmallBoardStatus[]): GameStatus {
  for (const [a, b, c] of WINNING_LINES) {
    const s = statuses[a];
    if (s === 'X' || s === 'O') {
      if (s === statuses[b] && s === statuses[c]) return s;
    }
  }
  if (statuses.every((s) => s !== null)) return 'draw';
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

export function applyMove(state: GameState, move: Move): GameState {
  if (move.player !== state.currentPlayer) {
    throw new Error(`Illegal move: not ${move.player}'s turn`);
  }
  if (state.winner !== null) {
    throw new Error('Illegal move: game is over');
  }
  if (state.smallBoardStatuses[move.boardIdx] !== null) {
    throw new Error(`Illegal move: small board ${move.boardIdx} is closed`);
  }
  if (
    state.forcedBoard !== null &&
    state.forcedBoard !== move.boardIdx &&
    state.smallBoardStatuses[state.forcedBoard] === null
  ) {
    throw new Error(`Illegal move: must play in board ${state.forcedBoard}`);
  }
  const targetBoard = state.smallBoards[move.boardIdx]!;
  if (targetBoard[move.cellIdx] !== null) {
    throw new Error(`Illegal move: cell ${move.cellIdx} of board ${move.boardIdx} is occupied`);
  }

  const newBoard = targetBoard.slice();
  newBoard[move.cellIdx] = move.player;
  const newSmallBoards = state.smallBoards.map((b, i) => (i === move.boardIdx ? newBoard : b));

  const newStatus = checkSmallBoardWinner(newBoard);
  const newStatuses = state.smallBoardStatuses.map((s, i) => (i === move.boardIdx ? newStatus : s));

  const nextForced = newStatuses[move.cellIdx] === null ? move.cellIdx : null;
  const newWinner = checkBigBoardWinner(newStatuses);

  return {
    smallBoards: newSmallBoards,
    smallBoardStatuses: newStatuses,
    currentPlayer: move.player === 'X' ? 'O' : 'X',
    forcedBoard: nextForced,
    winner: newWinner,
    history: [...state.history, move],
  };
}

export function isGameOver(state: GameState): boolean {
  return state.winner !== null;
}
