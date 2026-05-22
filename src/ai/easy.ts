import { applyMove, legalMoves } from '../game/rules';
import type { GameState } from '../game/types';
import { createRng, pickFrom } from './rng';
import type { AIChoice, AIOptions } from './index';

const CENTER = 4;

export function pickEasyMove(state: GameState, opts: AIOptions): AIChoice {
  const moves = legalMoves(state);
  if (moves.length === 0) throw new Error('pickEasyMove: no legal moves');

  // 1. Win a small board if possible.
  for (const m of moves) {
    const next = applyMove(state, m);
    if (next.smallBoardStatuses[m.boardIdx] === state.currentPlayer) {
      return {
        move: m,
        reasoning: `Wins small board ${m.boardIdx} (cell ${m.cellIdx})`,
        candidates: [],
      };
    }
  }

  // 2. Block an opponent's immediate win.
  const opponent = state.currentPlayer === 'X' ? 'O' : 'X';
  for (const m of moves) {
    const hypothetical: GameState = { ...state, currentPlayer: opponent };
    try {
      const next = applyMove(hypothetical, { ...m, player: opponent });
      if (next.smallBoardStatuses[m.boardIdx] === opponent) {
        return {
          move: m,
          reasoning: `Blocks ${opponent}'s win in board ${m.boardIdx}`,
          candidates: [],
        };
      }
    } catch {
      // Illegal hypothetical — skip.
    }
  }

  // 3. If forced to a specific board, prefer its center cell.
  if (state.forcedBoard !== null) {
    const centerOfForced = moves.find(
      (m) => m.boardIdx === state.forcedBoard && m.cellIdx === CENTER,
    );
    if (centerOfForced) {
      return {
        move: centerOfForced,
        reasoning: `Claims center cell of board ${centerOfForced.boardIdx}`,
        candidates: [],
      };
    }
  }

  // 4. Free choice and the center board's center cell is open: take (4, 4).
  if (state.forcedBoard === null) {
    const centerOfCenter = moves.find((m) => m.boardIdx === CENTER && m.cellIdx === CENTER);
    if (centerOfCenter) {
      return {
        move: centerOfCenter,
        reasoning: 'Plays in the center board (center cell)',
        candidates: [],
      };
    }
  }

  // 5. Random legal move (deterministic via seed).
  const rng = createRng(opts.seed + state.history.length);
  const m = pickFrom(moves, rng);
  return {
    move: m,
    reasoning: `Random legal move in board ${m.boardIdx}`,
    candidates: [],
  };
}
