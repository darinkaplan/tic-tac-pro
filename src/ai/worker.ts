// Web Worker entry: runs AI moves off the main thread so the UI stays
// responsive while minimax searches.

import { pickAIMove, type AIChoice, type AILevel, type AIOptions } from './index';
import type { GameState } from '../game/types';

export interface WorkerRequest {
  id: number;
  level: AILevel;
  state: GameState;
  opts: AIOptions;
}

export type WorkerResponse =
  | { id: number; ok: true; choice: AIChoice }
  | { id: number; ok: false; error: string };

self.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const { id, level, state, opts } = e.data;
  try {
    const choice = pickAIMove(level, state, opts);
    const response: WorkerResponse = { id, ok: true, choice };
    self.postMessage(response);
  } catch (err) {
    const response: WorkerResponse = {
      id,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
    self.postMessage(response);
  }
};
