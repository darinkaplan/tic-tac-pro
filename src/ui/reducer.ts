import { applyMove, initialState } from '../game/rules';
import type { GameState, Move } from '../game/types';

export type Action =
  | { type: 'MOVE'; move: Move }
  | { type: 'NEW_GAME' }
  | { type: 'UNDO' };

export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'MOVE':
      return applyMove(state, action.move);
    case 'NEW_GAME':
      return initialState();
    case 'UNDO': {
      if (state.history.length === 0) return state;
      const moves = state.history.slice(0, -1);
      let s = initialState();
      for (const m of moves) s = applyMove(s, m);
      return s;
    }
  }
}
