/** A pure-function PRNG factory returning a function that yields values in [0, 1). */
export function createRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Pick one element from a non-empty array using the given RNG. Throws on empty. */
export function pickFrom<T>(items: ReadonlyArray<T>, rng: () => number): T {
  if (items.length === 0) throw new Error('pickFrom: empty array');
  const idx = Math.floor(rng() * items.length);
  return items[idx]!;
}
