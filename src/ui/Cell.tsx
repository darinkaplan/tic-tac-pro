import type { Cell as CellValue } from '../game/types';

interface CellProps {
  value: CellValue;
  onClick: () => void;
  disabled: boolean;
}

export function Cell({ value, onClick, disabled }: CellProps) {
  const isX = value === 'X';
  const isO = value === 'O';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || value !== null}
      className={[
        'aspect-square w-full',
        'flex items-center justify-center',
        'text-2xl md:text-3xl font-bold',
        'bg-atsf-surface hover:bg-atsf-surface-hover',
        'disabled:hover:bg-atsf-surface disabled:cursor-not-allowed',
        'border border-atsf-rule',
        'transition-colors',
        isX ? 'text-atsf-ink' : '',
        isO ? 'text-atsf-gold' : '',
      ].join(' ')}
      aria-label={value ?? 'empty cell'}
    >
      {value ?? ''}
    </button>
  );
}
