import { describe, it, expect } from 'vitest';
import { checkSmallBoardWinner, initialState, legalMoves } from './rules';
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
