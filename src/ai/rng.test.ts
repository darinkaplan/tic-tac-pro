import { describe, it, expect } from 'vitest';
import { createRng, pickFrom } from './rng';

describe('createRng', () => {
  it('produces deterministic sequences for a given seed', () => {
    const a = createRng(42);
    const b = createRng(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it('produces different sequences for different seeds', () => {
    const a = createRng(1);
    const b = createRng(2);
    expect(a()).not.toBe(b());
  });

  it('returns values in [0, 1)', () => {
    const r = createRng(99);
    for (let i = 0; i < 100; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('pickFrom', () => {
  it('returns one of the input items', () => {
    const r = createRng(1);
    const items = ['a', 'b', 'c'];
    expect(items).toContain(pickFrom(items, r));
  });

  it('is deterministic given the same RNG state', () => {
    const items = ['a', 'b', 'c', 'd'];
    const a = createRng(7);
    const b = createRng(7);
    expect(pickFrom(items, a)).toBe(pickFrom(items, b));
  });

  it('throws on empty array', () => {
    const r = createRng(1);
    expect(() => pickFrom([], r)).toThrow();
  });
});
