interface AIControlsProps {
  /** True when at least one side is AI. Controls visibility. */
  visible: boolean;
  /** True if waiting on user to click "Next" (i.e., autoPlay off and an AI has a pending move). */
  canStep: boolean;
  autoPlay: boolean;
  speedMs: number;
  onStep: () => void;
  onToggleAuto: (autoPlay: boolean) => void;
  onSpeedChange: (ms: number) => void;
}

export function AIControls({ visible, canStep, autoPlay, speedMs, onStep, onToggleAuto, onSpeedChange }: AIControlsProps) {
  if (!visible) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-2">
      <button
        type="button"
        onClick={onStep}
        disabled={!canStep || autoPlay}
        className="px-3 py-1.5 bg-atsf-ink text-atsf-paper font-semibold rounded disabled:opacity-40 disabled:cursor-not-allowed transition-opacity hover:opacity-90"
      >
        Next move
      </button>
      <label className="flex items-center gap-2 text-sm text-atsf-ink-muted">
        <input
          type="checkbox"
          checked={autoPlay}
          onChange={(e) => onToggleAuto(e.target.checked)}
        />
        Auto-play
      </label>
      <label className="flex items-center gap-2 text-sm text-atsf-ink-muted">
        Speed
        <input
          type="range"
          min={300}
          max={4000}
          step={100}
          value={speedMs}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          disabled={!autoPlay}
          className="w-32"
        />
        <span className="font-mono text-xs">{(speedMs / 1000).toFixed(1)}s</span>
      </label>
    </div>
  );
}
