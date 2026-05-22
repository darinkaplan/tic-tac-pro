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

// Stub: real implementation lands in Task 5.
export function pickAIMove(_level: AILevel, _state: GameState, _opts: AIOptions): AIChoice {
  throw new Error('pickAIMove: not implemented yet (Task 5)');
}
