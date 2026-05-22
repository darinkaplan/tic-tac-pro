import { describe, it, expect } from 'vitest';
import { pickAIMove } from './index';
import { initialState } from '../game/rules';

describe('pickAIMove', () => {
  it('dispatches to Easy for level=easy', () => {
    const choice = pickAIMove('easy', initialState(), { seed: 1 });
    expect(choice.move.player).toBe('X');
    expect(choice.candidates).toEqual([]);
  });

  it('dispatches to Medium for level=medium', () => {
    const choice = pickAIMove('medium', initialState(), { seed: 1, depth: 2 });
    expect(choice.candidates.length).toBeGreaterThan(0);
  });
});
