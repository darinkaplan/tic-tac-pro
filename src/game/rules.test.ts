import { describe, it, expect } from 'vitest';
import { checkSmallBoardWinner } from './rules';
import type { Cell } from './types';

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
