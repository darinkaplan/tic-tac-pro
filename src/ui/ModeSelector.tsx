import { MODES, type GameMode } from './types';

interface ModeSelectorProps {
  value: GameMode;
  onChange: (mode: GameMode) => void;
  disabled?: boolean;
}

export function ModeSelector({ value, onChange, disabled }: ModeSelectorProps) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-atsf-ink-muted">Mode</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as GameMode)}
        className="px-3 py-1.5 rounded border border-atsf-border bg-atsf-surface text-atsf-ink font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {MODES.map((m) => (
          <option key={m.id} value={m.id}>{m.label}</option>
        ))}
      </select>
    </label>
  );
}
