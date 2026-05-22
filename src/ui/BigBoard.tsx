import { SmallBoard } from './SmallBoard';
import type { GameState } from '../game/types';
import { legalMoves } from '../game/rules';

interface BigBoardProps {
  state: GameState;
  onMove: (boardIdx: number, cellIdx: number) => void;
}

export function BigBoard({ state, onMove }: BigBoardProps) {
  const legal = legalMoves(state);
  const playableBoards = new Set(legal.map((m) => m.boardIdx));

  return (
    <div className="grid grid-cols-3 gap-2 md:gap-3 p-2 md:p-3 bg-atsf-parchment rounded-lg shadow-xl shadow-atsf-ink/15">
      {state.smallBoards.map((cells, boardIdx) => (
        <SmallBoard
          key={boardIdx}
          cells={cells}
          status={state.smallBoardStatuses[boardIdx]!}
          isForced={state.forcedBoard === boardIdx && state.smallBoardStatuses[boardIdx] === null}
          isPlayable={playableBoards.has(boardIdx)}
          onCellClick={(cellIdx) => onMove(boardIdx, cellIdx)}
        />
      ))}
    </div>
  );
}
