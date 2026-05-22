import { useReducer } from 'react';
import { initialState } from './game/rules';
import { reducer } from './ui/reducer';
import { BigBoard } from './ui/BigBoard';
import { GameStatus } from './ui/GameStatus';
import { Controls } from './ui/Controls';

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  const handleMove = (boardIdx: number, cellIdx: number) => {
    dispatch({ type: 'MOVE', move: { boardIdx, cellIdx, player: state.currentPlayer } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <header className="mb-4 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-atsf-gold tracking-tight">Tic-Tac-Pro</h1>
        <p className="text-xs text-atsf-ink-muted mt-1">Advantage Testing</p>
      </header>
      <GameStatus state={state} />
      <div className="w-full max-w-2xl">
        <BigBoard state={state} onMove={handleMove} />
      </div>
      <Controls
        onNewGame={() => dispatch({ type: 'NEW_GAME' })}
        onUndo={() => dispatch({ type: 'UNDO' })}
        canUndo={state.history.length > 0}
      />
    </div>
  );
}
