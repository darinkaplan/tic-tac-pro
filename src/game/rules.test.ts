import { describe, it, expect } from 'vitest';
import {
  applyMove,
  checkBigBoardWinner,
  checkSmallBoardWinner,
  initialState,
  isGameOver,
  legalMoves,
} from './rules';
import type { Cell, GameState, SmallBoardStatus } from './types';

const empty: Cell[] = Array(9).fill(null);

describe('checkSmallBoardWinner', () => {
  it('returns null on an empty board', () => {
    expect(checkSmallBoardWinner(empty)).toBeNull();
  });

  it('detects a row win for X', () => {
    const board: Cell[] = ['X', 'X', 'X', null, null, null, null, null, null];
    expect(checkSmallBoardWinner(board)).toBe('X');
  });

  it('detects a column win for O', () => {
    const board: Cell[] = ['O', null, null, 'O', null, null, 'O', null, null];
    expect(checkSmallBoardWinner(board)).toBe('O');
  });

  it('detects a diagonal win', () => {
    const board: Cell[] = ['X', null, null, null, 'X', null, null, null, 'X'];
    expect(checkSmallBoardWinner(board)).toBe('X');
  });

  it('detects a draw when full with no winner', () => {
    const board: Cell[] = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    expect(checkSmallBoardWinner(board)).toBe('draw');
  });

  it('returns null when partially filled with no win and no draw', () => {
    const board: Cell[] = ['X', 'O', null, null, 'X', null, null, null, 'O'];
    expect(checkSmallBoardWinner(board)).toBeNull();
  });
});

describe('initialState', () => {
  it('starts with X to move, no forced board, no winner', () => {
    const s = initialState();
    expect(s.currentPlayer).toBe('X');
    expect(s.forcedBoard).toBeNull();
    expect(s.winner).toBeNull();
    expect(s.history).toEqual([]);
  });

  it('has 9 empty small boards', () => {
    const s = initialState();
    expect(s.smallBoards).toHaveLength(9);
    s.smallBoards.forEach((b) => {
      expect(b).toHaveLength(9);
      expect(b.every((c) => c === null)).toBe(true);
    });
  });

  it('has 9 null small-board statuses', () => {
    const s = initialState();
    expect(s.smallBoardStatuses).toEqual(Array(9).fill(null));
  });
});

describe('legalMoves', () => {
  it('returns all 81 cells as legal on the opening move', () => {
    const moves = legalMoves(initialState());
    expect(moves).toHaveLength(81);
    expect(moves.every((m) => m.player === 'X')).toBe(true);
  });

  it('restricts moves to the forced small board', () => {
    const s: GameState = { ...initialState(), forcedBoard: 4 };
    const moves = legalMoves(s);
    expect(moves).toHaveLength(9);
    expect(moves.every((m) => m.boardIdx === 4)).toBe(true);
  });

  it('grants free choice when the forced board is already won', () => {
    const statuses = Array(9).fill(null) as SmallBoardStatus[];
    statuses[4] = 'X';
    const s: GameState = {
      ...initialState(),
      forcedBoard: 4,
      smallBoardStatuses: statuses,
    };
    const moves = legalMoves(s);
    expect(moves).toHaveLength(72);
    expect(moves.every((m) => m.boardIdx !== 4)).toBe(true);
  });

  it('grants free choice when the forced board is drawn', () => {
    const statuses = Array(9).fill(null) as SmallBoardStatus[];
    statuses[0] = 'draw';
    const s: GameState = {
      ...initialState(),
      forcedBoard: 0,
      smallBoardStatuses: statuses,
    };
    const moves = legalMoves(s);
    expect(moves).toHaveLength(72);
    expect(moves.every((m) => m.boardIdx !== 0)).toBe(true);
  });

  it('excludes cells that are already occupied', () => {
    const board = Array(9).fill(null) as Cell[];
    board[0] = 'X';
    const boards = Array.from({ length: 9 }, (_, i) => (i === 4 ? board : (Array(9).fill(null) as Cell[])));
    const s: GameState = {
      ...initialState(),
      smallBoards: boards,
      forcedBoard: 4,
    };
    const moves = legalMoves(s);
    expect(moves).toHaveLength(8);
    expect(moves.every((m) => m.cellIdx !== 0)).toBe(true);
  });

  it('returns no legal moves when the game has a winner', () => {
    const s: GameState = { ...initialState(), winner: 'X' };
    expect(legalMoves(s)).toEqual([]);
  });
});

describe('applyMove', () => {
  it('places the current player and switches turns', () => {
    const s = applyMove(initialState(), { boardIdx: 0, cellIdx: 0, player: 'X' });
    expect(s.smallBoards[0]![0]).toBe('X');
    expect(s.currentPlayer).toBe('O');
    expect(s.history).toHaveLength(1);
  });

  it('sets forcedBoard to the cellIdx of the move just played', () => {
    const s = applyMove(initialState(), { boardIdx: 0, cellIdx: 5, player: 'X' });
    expect(s.forcedBoard).toBe(5);
  });

  it('clears forcedBoard when the target small board is already won', () => {
    const statuses = Array(9).fill(null) as SmallBoardStatus[];
    statuses[5] = 'X';
    const s: GameState = {
      ...initialState(),
      smallBoardStatuses: statuses,
    };
    const next = applyMove(s, { boardIdx: 0, cellIdx: 5, player: 'X' });
    expect(next.forcedBoard).toBeNull();
  });

  it('clears forcedBoard when the target small board is full (drawn)', () => {
    const fullDrawnBoard: Cell[] = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    const boards = Array.from({ length: 9 }, (_, i) => (i === 5 ? fullDrawnBoard : (Array(9).fill(null) as Cell[])));
    const statuses = Array(9).fill(null) as SmallBoardStatus[];
    statuses[5] = 'draw';
    const s: GameState = {
      ...initialState(),
      smallBoards: boards,
      smallBoardStatuses: statuses,
    };
    const next = applyMove(s, { boardIdx: 0, cellIdx: 5, player: 'X' });
    expect(next.forcedBoard).toBeNull();
  });

  it('updates smallBoardStatuses when a move wins a small board', () => {
    const board: Cell[] = ['X', 'X', null, null, null, null, null, null, null];
    const boards = Array.from({ length: 9 }, (_, i) => (i === 0 ? board : (Array(9).fill(null) as Cell[])));
    const s: GameState = { ...initialState(), smallBoards: boards };
    const next = applyMove(s, { boardIdx: 0, cellIdx: 2, player: 'X' });
    expect(next.smallBoardStatuses[0]).toBe('X');
  });

  it('throws when wrong player tries to move', () => {
    const s = initialState();
    expect(() => applyMove(s, { boardIdx: 0, cellIdx: 0, player: 'O' })).toThrow();
  });

  it('throws when cell is already occupied', () => {
    const s = initialState();
    const occupied = applyMove(s, { boardIdx: 0, cellIdx: 0, player: 'X' });
    expect(() => applyMove(occupied, { boardIdx: 0, cellIdx: 0, player: 'O' })).toThrow();
  });

  it('appends the move to history immutably', () => {
    const s = initialState();
    const s1 = applyMove(s, { boardIdx: 4, cellIdx: 4, player: 'X' });
    expect(s.history).toEqual([]);
    expect(s1.history).toHaveLength(1);
  });
});

describe('checkBigBoardWinner', () => {
  it('returns null when no big-board line is complete', () => {
    expect(checkBigBoardWinner(Array(9).fill(null))).toBeNull();
  });

  it('detects a row win on the big board', () => {
    const statuses: SmallBoardStatus[] = ['X', 'X', 'X', null, null, null, null, null, null];
    expect(checkBigBoardWinner(statuses)).toBe('X');
  });

  it('treats drawn small boards as neutral (not a win)', () => {
    const statuses: SmallBoardStatus[] = ['X', 'draw', 'X', null, null, null, null, null, null];
    expect(checkBigBoardWinner(statuses)).toBeNull();
  });

  it('returns draw when all 9 small boards are closed and no big-board line is complete', () => {
    const statuses: SmallBoardStatus[] = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'];
    expect(checkBigBoardWinner(statuses)).toBe('draw');
  });

  it('returns null when some boards are still open', () => {
    const statuses: SmallBoardStatus[] = ['X', 'O', null, null, null, null, null, null, null];
    expect(checkBigBoardWinner(statuses)).toBeNull();
  });
});

describe('isGameOver', () => {
  it('is false at start', () => {
    expect(isGameOver(initialState())).toBe(false);
  });

  it('is true when there is a winner', () => {
    const s: GameState = { ...initialState(), winner: 'X' };
    expect(isGameOver(s)).toBe(true);
  });

  it('is true when the game is a draw', () => {
    const s: GameState = { ...initialState(), winner: 'draw' };
    expect(isGameOver(s)).toBe(true);
  });
});

describe('end-to-end — short legal sequence', () => {
  it('plays four legal moves and tracks forcedBoard correctly', () => {
    let s = initialState();
    s = applyMove(s, { boardIdx: 4, cellIdx: 0, player: 'X' });
    expect(s.forcedBoard).toBe(0);
    expect(s.currentPlayer).toBe('O');

    s = applyMove(s, { boardIdx: 0, cellIdx: 4, player: 'O' });
    expect(s.forcedBoard).toBe(4);
    expect(s.currentPlayer).toBe('X');

    s = applyMove(s, { boardIdx: 4, cellIdx: 1, player: 'X' });
    expect(s.forcedBoard).toBe(1);

    s = applyMove(s, { boardIdx: 1, cellIdx: 4, player: 'O' });
    expect(s.forcedBoard).toBe(4);
    expect(s.history).toHaveLength(4);
  });
});
