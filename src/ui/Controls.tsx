interface ControlsProps {
  onNewGame: () => void;
  onUndo: () => void;
  canUndo: boolean;
}

export function Controls({ onNewGame, onUndo, canUndo }: ControlsProps) {
  return (
    <div className="flex gap-3 justify-center py-4">
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
