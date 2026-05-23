import type { Move } from '../game/types';
import type { ScoredMove } from '../ai';

export type GameMode =
  | 'local-2p'
  | 'vs-easy'
  | 'vs-medium'
  | 'easy-vs-easy'
  | 'medium-vs-medium';

export const MODES: ReadonlyArray<{ id: GameMode; label: string }> = [
  { id: 'local-2p', label: 'Local 2-Player' },
  { id: 'vs-easy', label: 'You vs Easy AI' },
  { id: 'vs-medium', label: 'You vs Medium AI' },
  { id: 'easy-vs-easy', label: 'Easy vs Easy (watch)' },
  { id: 'medium-vs-medium', label: 'Medium vs Medium (watch)' },
];

export interface ReasoningEntry {
  move: Move;
  reasoning: string;
  byAI: boolean;
  /** Top-N scored alternatives from the AI's search. Empty for Easy AI and human moves. */
  candidates: ReadonlyArray<ScoredMove>;
}

export interface UIState {
  mode: GameMode;
  /** Tiebreaker seed for the current game. New random value on NEW_GAME. */
  seed: number;
  reasoningHistory: ReadonlyArray<ReasoningEntry>;
  autoPlay: boolean;
  autoPlaySpeedMs: number;
  /** True when an AI move is being computed. */
  aiThinking: boolean;
}
