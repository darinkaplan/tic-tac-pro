import { applyMove, initialState } from '../game/rules';
import type { GameState, Move } from '../game/types';
import type { GameMode, ReasoningEntry, UIState } from './types';

export interface AppState {
  game: GameState;
  ui: UIState;
}

export type Action =
  | { type: 'MOVE'; move: Move; reasoning?: string }
  | { type: 'NEW_GAME'; mode?: GameMode }
  | { type: 'UNDO' }
  | { type: 'SET_MODE'; mode: GameMode }
  | { type: 'SET_AUTOPLAY'; autoPlay: boolean }
  | { type: 'SET_AUTOPLAY_SPEED'; ms: number }
  | { type: 'SET_AI_THINKING'; thinking: boolean };

const DEFAULT_AUTOPLAY_SPEED_MS = 1500;

function newSeed(): number {
  return Math.floor(Math.random() * 0xFFFFFFFF);
}

export function initialAppState(mode: GameMode = 'local-2p'): AppState {
  return {
    game: initialState(),
    ui: {
      mode,
      seed: newSeed(),
      reasoningHistory: [],
      autoPlay: false,
      autoPlaySpeedMs: DEFAULT_AUTOPLAY_SPEED_MS,
      aiThinking: false,
    },
  };
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'MOVE': {
      const game = applyMove(state.game, action.move);
      const entry: ReasoningEntry = {
        move: action.move,
        reasoning: action.reasoning ?? '',
        byAI: action.reasoning !== undefined,
      };
      return {
        game,
        ui: { ...state.ui, reasoningHistory: [...state.ui.reasoningHistory, entry] },
      };
    }
    case 'NEW_GAME': {
      const mode = action.mode ?? state.ui.mode;
      return {
        game: initialState(),
        ui: {
          ...state.ui,
          mode,
          seed: newSeed(),
          reasoningHistory: [],
          aiThinking: false,
        },
      };
    }
    case 'UNDO': {
      if (state.game.history.length === 0) return state;
      // In human-vs-AI modes, popping a single move puts the AI on turn and
      // it deterministically replays the same move — so undo pops 2 to land
      // back on the human's previous decision point. If there's only 1 move
      // (human played, AI hasn't replied yet) we still pop 1.
      const isVsAI = state.ui.mode === 'vs-easy' || state.ui.mode === 'vs-medium';
      const popCount = isVsAI && state.game.history.length >= 2 ? 2 : 1;
      const moves = state.game.history.slice(0, -popCount);
      let game = initialState();
      for (const m of moves) game = applyMove(game, m);
      return {
        game,
        ui: { ...state.ui, reasoningHistory: state.ui.reasoningHistory.slice(0, -popCount) },
      };
    }
    case 'SET_MODE':
      return { ...state, ui: { ...state.ui, mode: action.mode } };
    case 'SET_AUTOPLAY':
      return { ...state, ui: { ...state.ui, autoPlay: action.autoPlay } };
    case 'SET_AUTOPLAY_SPEED':
      return { ...state, ui: { ...state.ui, autoPlaySpeedMs: action.ms } };
    case 'SET_AI_THINKING':
      return { ...state, ui: { ...state.ui, aiThinking: action.thinking } };
  }
}
