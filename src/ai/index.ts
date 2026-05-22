import { pickEasyMove } from './easy';
import { pickMediumMove } from './medium';
import type { GameState, Move } from '../game/types';

export type AILevel = 'easy' | 'medium';

export interface ScoredMove {
  move: Move;
  score: number;
}

export interface AIChoice {
  move: Move;
  reasoning: string;
  candidates: ReadonlyArray<ScoredMove>;
}

export interface AIOptions {
  seed: number;
  depth?: number;
}

export function pickAIMove(level: AILevel, state: GameState, opts: AIOptions): AIChoice {
  if (level === 'easy') return pickEasyMove(state, opts);
  return pickMediumMove(state, opts);
}
