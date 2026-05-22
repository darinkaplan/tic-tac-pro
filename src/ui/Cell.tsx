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
        'bg-atsf-navy/40 hover:bg-atsf-navy-light/40',
        'disabled:hover:bg-atsf-navy/40 disabled:cursor-not-allowed',
        'border border-atsf-navy-light/30',
        'transition-colors',
        isX ? 'text-atsf-gold' : '',
        isO ? 'text-atsf-cream' : '',
      ].join(' ')}
      aria-label={value ?? 'empty cell'}
    >
      {value ?? ''}
    </button>
  );
}
