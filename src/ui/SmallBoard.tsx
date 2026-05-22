import { Cell } from './Cell';
import type { Cell as CellValue, SmallBoardStatus } from '../game/types';

interface SmallBoardProps {
  cells: readonly CellValue[];
  status: SmallBoardStatus;
  /** Whether this board is currently the target of the forced-board rule. */
  isForced: boolean;
  /** Whether moves are currently allowed here. */
  isPlayable: boolean;
  onCellClick: (cellIdx: number) => void;
}

export function SmallBoard({ cells, status, isForced, isPlayable, onCellClick }: SmallBoardProps) {
  const isWon = status === 'X' || status === 'O';
  const isDrawn = status === 'draw';

  const wrapperClasses = [
    'relative grid grid-cols-3 gap-0.5 p-1 rounded',
    'border-2 transition-all',
    isForced ? 'border-atsf-gold ring-2 ring-atsf-gold/40' : 'border-atsf-border',
    !isPlayable && !isWon && !isDrawn ? 'opacity-50' : '',
    'bg-atsf-surface',
  ].join(' ');

  return (
    <div className={wrapperClasses}>
      {cells.map((cell, i) => (
        <Cell
          key={i}
          value={cell}
          onClick={() => onCellClick(i)}
          disabled={!isPlayable || isWon || isDrawn}
        />
      ))}
      {isWon && (
        <div className="absolute inset-0 flex items-center justify-center bg-atsf-surface/85 rounded pointer-events-none">
          <span className="text-6xl md:text-7xl font-black text-atsf-gold">{status}</span>
        </div>
      )}
      {isDrawn && (
        <div className="absolute inset-0 flex items-center justify-center bg-atsf-surface/85 rounded pointer-events-none">
          <span className="text-2xl font-bold text-atsf-ink-muted uppercase tracking-widest">draw</span>
        </div>
      )}
    </div>
  );
}
