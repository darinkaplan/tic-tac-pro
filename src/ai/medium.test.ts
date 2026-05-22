import { describe, it, expect } from 'vitest';
import { pickMediumMove } from './medium';
import { initialState, applyMove } from '../game/rules';
import type { Cell, GameState } from '../game/types';

describe('pickMediumMove', () => {
  it('takes a small-board win when one move ahead', () => {
    const board: Cell[] = ['X', 'X', null, null, null, null, null, null, null];
    const boards = Array.from({ length: 9 }, (_, i) => (i === 0 ? board : (Array(9).fill(null) as Cell[])));
    const s: GameState = { ...initialState(), smallBoards: boards, forcedBoard: 0 };
    const choice = pickMediumMove(s, { seed: 1, depth: 3 });
    expect(choice.move).toEqual({ boardIdx: 0, cellIdx: 2, player: 'X' });
  });

  it('blocks the opponent when they would win next turn', () => {
    const board: Cell[] = ['O', 'O', null, null, null, null, null, null, null];
    const boards = Array.from({ length: 9 }, (_, i) => (i === 4 ? board : (Array(9).fill(null) as Cell[])));
    const s: GameState = { ...initialState(), smallBoards: boards, forcedBoard: 4 };
    const choice = pickMediumMove(s, { seed: 1, depth: 3 });
    expect(choice.move.cellIdx).toBe(2);
  });

  it('returns up to 3 candidates sorted by score descending', () => {
    const choice = pickMediumMove(initialState(), { seed: 1, depth: 2 });
    expect(choice.candidates.length).toBeGreaterThan(0);
    expect(choice.candidates.length).toBeLessThanOrEqual(3);
    for (let i = 1; i < choice.candidates.length; i++) {
      expect(choice.candidates[i]!.score).toBeLessThanOrEqual(choice.candidates[i - 1]!.score);
    }
  });

  it('reasoning includes the candidate count and an effect description', () => {
    const choice = pickMediumMove(initialState(), { seed: 1, depth: 2 });
    expect(choice.reasoning).toMatch(/\d+ candidate/i);
    expect(choice.reasoning).toMatch(/sends|wins|blocks/i);
  });

  it('plays a complete game without throwing (depth 2)', () => {
    let s = initialState();
    for (let i = 0; i < 81 && !s.winner; i++) {
      const choice = pickMediumMove(s, { seed: i, depth: 2 });
      s = applyMove(s, choice.move);
    }
    expect(['X', 'O', 'draw']).toContain(s.winner);
  });

  it('depth-4 completes in under 1 second on the initial state', () => {
    const start = performance.now();
    pickMediumMove(initialState(), { seed: 1, depth: 4 });
    const ms = performance.now() - start;
    expect(ms).toBeLessThan(1000);
  });
});
