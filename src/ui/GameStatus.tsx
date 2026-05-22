import type { GameState } from '../game/types';

interface GameStatusProps {
  state: GameState;
}

export function GameStatus({ state }: GameStatusProps) {
  if (state.winner === 'X' || state.winner === 'O') {
    return (
      <div className="text-center py-4">
        <div className="text-3xl font-black text-atsf-gold">{state.winner} wins!</div>
      </div>
    );
  }
  if (state.winner === 'draw') {
    return (
      <div className="text-center py-4">
        <div className="text-3xl font-black text-atsf-cream/80 uppercase tracking-widest">Draw</div>
      </div>
    );
  }
  return (
    <div className="text-center py-4">
      <div className="text-lg text-atsf-cream/70">Turn</div>
      <div className="text-3xl font-bold text-atsf-gold">{state.currentPlayer}</div>
      {state.forcedBoard !== null && (
        <div className="text-xs text-atsf-cream/50 mt-1">must play in highlighted board</div>
      )}
      {state.forcedBoard === null && state.history.length > 0 && (
        <div className="text-xs text-atsf-cream/50 mt-1">free choice — sent board was closed</div>
      )}
    </div>
  );
}
