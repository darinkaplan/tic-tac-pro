import { ModeSelector } from './ModeSelector';
import type { GameMode } from './types';

interface ControlsProps {
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
  onNewGame: () => void;
  onUndo: () => void;
  canUndo: boolean;
  modeChangeDisabled: boolean;
}

export function Controls({ mode, onModeChange, onNewGame, onUndo, canUndo, modeChangeDisabled }: ControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-4">
      <ModeSelector value={mode} onChange={onModeChange} disabled={modeChangeDisabled} />
      <button
        type="button"
        onClick={onNewGame}
        className="px-4 py-2 bg-atsf-gold text-white font-semibold rounded hover:bg-atsf-gold-light transition-colors"
      >
        New Game
      </button>
      <button
        type="button"
        onClick={onUndo}
        disabled={!canUndo}
        className="px-4 py-2 bg-atsf-ink text-atsf-paper font-semibold rounded hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
      >
        Undo
      </button>
    </div>
  );
}
