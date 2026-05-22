import { applyMove, legalMoves } from '../game/rules';
import type { GameState, Move, Player } from '../game/types';
import { evaluate } from './evaluation';
import type { AIChoice, AIOptions, ScoredMove } from './index';

const DEFAULT_DEPTH = 4;
const TOP_N_CANDIDATES = 3;

export function pickMediumMove(state: GameState, opts: AIOptions): AIChoice {
  const moves = legalMoves(state);
  if (moves.length === 0) throw new Error('pickMediumMove: no legal moves');

  const depth = opts.depth ?? DEFAULT_DEPTH;
  const maximizing = state.currentPlayer === 'X';

  const scored: ScoredMove[] = moves.map((m) => {
    const next = applyMove(state, m);
    const score = minimax(next, depth - 1, -Infinity, Infinity, !maximizing);
    return { move: m, score };
  });

  // Best for current player first.
  scored.sort((a, b) => (maximizing ? b.score - a.score : a.score - b.score));

  const best = scored[0]!;
  const candidates = scored.slice(0, TOP_N_CANDIDATES);
  const reasoning = buildReasoning(state, best.move, best.score, scored.length);

  return { move: best.move, reasoning, candidates };
}

function minimax(
  state: GameState,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
): number {
  if (depth === 0 || state.winner !== null) {
    return evaluate(state);
  }
  const moves = legalMoves(state);
  if (moves.length === 0) return evaluate(state);

  if (maximizing) {
    let best = -Infinity;
    for (const m of moves) {
      const next = applyMove(state, m);
      const v = minimax(next, depth - 1, alpha, beta, false);
      if (v > best) best = v;
      if (v > alpha) alpha = v;
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const m of moves) {
      const next = applyMove(state, m);
      const v = minimax(next, depth - 1, alpha, beta, true);
      if (v < best) best = v;
      if (v < beta) beta = v;
      if (beta <= alpha) break;
    }
    return best;
  }
}

function buildReasoning(state: GameState, move: Move, _score: number, totalCandidates: number): string {
  const next = applyMove(state, move);
  const opponent: Player = move.player === 'X' ? 'O' : 'X';
  let effect = '';

  if (next.smallBoardStatuses[move.boardIdx] === move.player) {
    effect = `Wins board ${move.boardIdx}.`;
  } else if (didBlock(state, move, opponent)) {
    effect = `Blocks ${opponent}'s win in board ${move.boardIdx}.`;
  } else if (next.forcedBoard === null) {
    effect = `Sends ${opponent} to a closed board (free choice).`;
  } else {
    effect = `Sends ${opponent} to board ${next.forcedBoard}.`;
  }

  return `Best of ${totalCandidates} candidates. ${effect}`;
}

function didBlock(state: GameState, move: Move, opponent: Player): boolean {
  const hypothetical: GameState = { ...state, currentPlayer: opponent };
  try {
    const next = applyMove(hypothetical, { ...move, player: opponent });
    return next.smallBoardStatuses[move.boardIdx] === opponent;
  } catch {
    return false;
  }
}
