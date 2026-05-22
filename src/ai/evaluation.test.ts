import { describe, it, expect } from 'vitest';
import { evaluate } from './evaluation';
import { applyMove, initialState } from '../game/rules';
import type { GameState, SmallBoardStatus } from '../game/types';

describe('evaluate', () => {
  it('returns 0 for an empty board', () => {
    expect(evaluate(initialState())).toBe(0);
  });

  it('returns a large positive number when X wins the big board', () => {
    const s: GameState = { ...initialState(), winner: 'X' };
    expect(evaluate(s)).toBeGreaterThanOrEqual(1000);
  });

  it('returns a large negative number when O wins the big board', () => {
    const s: GameState = { ...initialState(), winner: 'O' };
    expect(evaluate(s)).toBeLessThanOrEqual(-1000);
  });

  it('returns 0 on a draw', () => {
    const s: GameState = { ...initialState(), winner: 'draw' };
    expect(evaluate(s)).toBe(0);
  });

  it('rewards X for owning the center small board', () => {
    const statuses = Array(9).fill(null) as SmallBoardStatus[];
    statuses[4] = 'X';
    const s: GameState = { ...initialState(), smallBoardStatuses: statuses };
    expect(evaluate(s)).toBeGreaterThan(0);
  });

  it('produces a non-zero score after a single opening move', () => {
    const s = applyMove(initialState(), { boardIdx: 4, cellIdx: 4, player: 'X' });
    expect(evaluate(s)).toBeGreaterThan(0);
  });

  it('values center-of-center higher than corner-of-center as an opening', () => {
    const center = applyMove(initialState(), { boardIdx: 4, cellIdx: 4, player: 'X' });
    const corner = applyMove(initialState(), { boardIdx: 4, cellIdx: 0, player: 'X' });
    expect(evaluate(center)).toBeGreaterThan(evaluate(corner));
  });

  it('is symmetric under player swap', () => {
    const statuses = Array(9).fill(null) as SmallBoardStatus[];
    statuses[0] = 'X';
    statuses[4] = 'X';
    const sX: GameState = { ...initialState(), smallBoardStatuses: statuses };

    const statusesO = Array(9).fill(null) as SmallBoardStatus[];
    statusesO[0] = 'O';
    statusesO[4] = 'O';
    const sO: GameState = { ...initialState(), smallBoardStatuses: statusesO };

    expect(evaluate(sX)).toBe(-evaluate(sO));
  });
});
