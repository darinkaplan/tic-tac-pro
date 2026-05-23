// Lazy-instantiated worker client. Wraps the AI worker behind a Promise-based
// API so calling code can `await pickAIMoveAsync(...)`.

import AIWorker from './worker.ts?worker';
import type { AIChoice, AILevel, AIOptions } from './index';
import type { GameState } from '../game/types';
import type { WorkerResponse } from './worker';

let worker: Worker | null = null;
let nextId = 1;
const pending = new Map<number, { resolve: (c: AIChoice) => void; reject: (e: Error) => void }>();

function getWorker(): Worker {
  if (worker) return worker;
  worker = new AIWorker();
  worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
    const slot = pending.get(e.data.id);
    if (!slot) return;
    pending.delete(e.data.id);
    if (e.data.ok) slot.resolve(e.data.choice);
    else slot.reject(new Error(e.data.error));
  };
  return worker;
}

export function pickAIMoveAsync(
  level: AILevel,
  state: GameState,
  opts: AIOptions,
): Promise<AIChoice> {
  return new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject });
    getWorker().postMessage({ id, level, state, opts });
  });
}
