import { describe, it, expect } from 'vitest';
import { pickEasyMove } from './easy';
import { initialState, applyMove } from '../game/rules';
import type { Cell, GameState } from '../game/types';

describe('pickEasyMove', () => {
  it('takes an immediate small-board win when available', () => {
    const board: Cell[] = ['X', 'X', null, null, null, null, null, null, null];
    const boards = Array.from({ length: 9 }, (_, i) => (i === 0 ? board : (Array(9).fill(null) as Cell[])));
    const s: GameState = { ...initialState(), smallBoards: boards, forcedBoard: 0 };
    const choice = pickEasyMove(s, { seed: 1 });
    expect(choice.move).toEqual({ boardIdx: 0, cellIdx: 2, player: 'X' });
    expect(choice.reasoning).toMatch(/wins.*board 0/i);
  });

  it('blocks the opponent when they would win next', () => {
    const board: Cell[] = ['O', 'O', null, null, null, null, null, null, null];
    const boards = Array.from({ length: 9 }, (_, i) => (i === 4 ? board : (Array(9).fill(null) as Cell[])));
    const s: GameState = { ...initialState(), smallBoards: boards, forcedBoard: 4, currentPlayer: 'X' };
    const choice = pickEasyMove(s, { seed: 1 });
    expect(choice.move.cellIdx).toBe(2);
    expect(choice.reasoning).toMatch(/blocks/i);
  });

  it('prefers the center cell of the forced board when no tactical priority', () => {
    const s: GameState = { ...initialState(), forcedBoard: 2 };
    const choice = pickEasyMove(s, { seed: 1 });
    expect(choice.move.boardIdx).toBe(2);
    expect(choice.move.cellIdx).toBe(4);
    expect(choice.reasoning).toMatch(/center/i);
  });

  it('prefers the center board when free-choice and no priorities', () => {
    const s: GameState = { ...initialState(), forcedBoard: null };
    const choice = pickEasyMove(s, { seed: 1 });
    expect(choice.move.boardIdx).toBe(4);
    expect(choice.move.cellIdx).toBe(4);
  });

  it('falls back to random when no priority and center is taken', () => {
    const centerBoard = Array(9).fill(null) as Cell[];
    centerBoard[4] = 'X';
    const boards = Array.from({ length: 9 }, (_, i) => (i === 4 ? centerBoard : (Array(9).fill(null) as Cell[])));
    const s: GameState = { ...initialState(), smallBoards: boards, forcedBoard: 4, currentPlayer: 'O' };
    const choice = pickEasyMove(s, { seed: 1 });
    expect(choice.move.boardIdx).toBe(4);
    expect([0, 1, 2, 3, 5, 6, 7, 8]).toContain(choice.move.cellIdx);
    expect(choice.reasoning).toMatch(/random|legal/i);
  });

  it('returns an empty candidates array', () => {
    const choice = pickEasyMove(initialState(), { seed: 1 });
    expect(choice.candidates).toEqual([]);
  });

  it('plays a complete game without throwing', () => {
    let s = initialState();
    for (let i = 0; i < 81 && !s.winner; i++) {
      const choice = pickEasyMove(s, { seed: i });
      s = applyMove(s, choice.move);
    }
    expect(['X', 'O', 'draw']).toContain(s.winner);
  });
});
