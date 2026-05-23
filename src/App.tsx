import { useEffect, useReducer, useRef } from 'react';
import { initialAppState, reducer } from './ui/reducer';
import { BigBoard } from './ui/BigBoard';
import { GameStatus } from './ui/GameStatus';
import { Controls } from './ui/Controls';
import { AIControls } from './ui/AIControls';
import { TeachingPanel } from './ui/TeachingPanel';
import { type AILevel } from './ai';
import { pickAIMoveAsync } from './ai/workerClient';
import type { GameMode } from './ui/types';
import type { Player } from './game/types';

function aiLevelForCurrentTurn(mode: GameMode, currentPlayer: Player): AILevel | null {
  if (mode === 'local-2p') return null;
  if (mode === 'easy-vs-easy') return 'easy';
  if (mode === 'medium-vs-medium') return 'medium';
  // Human plays X. AI plays O.
  if (currentPlayer === 'X') return null;
  return mode === 'vs-easy' ? 'easy' : 'medium';
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, () => initialAppState());
  const autoPlayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const aiLevel = state.game.winner === null
    ? aiLevelForCurrentTurn(state.ui.mode, state.game.currentPlayer)
    : null;
  const isHumanTurn = aiLevel === null;
  const anyAI = state.ui.mode !== 'local-2p';
  const isWatchMode = state.ui.mode === 'easy-vs-easy' || state.ui.mode === 'medium-vs-medium';

  // AI move dispatch via Web Worker (non-blocking). Triggers when:
  //   - vs-easy / vs-medium and it's the AI's turn (short delay before posting)
  //   - watch mode AND autoPlay is on (autoPlaySpeedMs delay)
  useEffect(() => {
    if (aiLevel === null || state.ui.aiThinking) return;
    const shouldFire = state.ui.autoPlay || !isWatchMode;
    if (!shouldFire) return;

    const delay = isWatchMode ? state.ui.autoPlaySpeedMs : 350;
    autoPlayTimer.current = setTimeout(() => {
      dispatch({ type: 'SET_AI_THINKING', thinking: true });
      pickAIMoveAsync(aiLevel, state.game, { seed: state.ui.seed, depth: 4 })
        .then((choice) => {
          dispatch({
            type: 'MOVE',
            move: choice.move,
            reasoning: choice.reasoning,
            candidates: choice.candidates,
          });
        })
        .finally(() => {
          dispatch({ type: 'SET_AI_THINKING', thinking: false });
        });
    }, delay);

    return () => {
      if (autoPlayTimer.current) clearTimeout(autoPlayTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiLevel, state.game, state.ui.mode, state.ui.autoPlay, state.ui.autoPlaySpeedMs, state.ui.seed, isWatchMode]);

  const handleHumanMove = (boardIdx: number, cellIdx: number) => {
    if (!isHumanTurn || state.ui.aiThinking) return;
    dispatch({
      type: 'MOVE',
      move: { boardIdx, cellIdx, player: state.game.currentPlayer },
    });
  };

  const handleStep = () => {
    if (aiLevel === null || state.ui.aiThinking) return;
    dispatch({ type: 'SET_AI_THINKING', thinking: true });
    pickAIMoveAsync(aiLevel, state.game, { seed: state.ui.seed, depth: 4 })
      .then((choice) => {
        dispatch({
          type: 'MOVE',
          move: choice.move,
          reasoning: choice.reasoning,
          candidates: choice.candidates,
        });
      })
      .finally(() => {
        dispatch({ type: 'SET_AI_THINKING', thinking: false });
      });
  };

  const handleModeChange = (mode: GameMode) => {
    if (state.game.history.length > 0) {
      const ok = window.confirm('Changing mode will start a new game. Continue?');
      if (!ok) return;
    }
    dispatch({ type: 'NEW_GAME', mode });
  };

  const canStep = isWatchMode && aiLevel !== null && !state.ui.aiThinking;

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8">
      <header className="mb-4 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-atsf-gold tracking-tight">Tic-Tac-Pro</h1>
        <p className="text-xs text-atsf-ink-muted mt-1">Advantage Testing</p>
      </header>

      <GameStatus state={state.game} />

      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-4 items-start justify-center">
        <div className="w-full max-w-2xl mx-auto">
          <BigBoard state={state.game} onMove={handleHumanMove} />
        </div>
        {anyAI && (
          <TeachingPanel entries={state.ui.reasoningHistory} thinking={state.ui.aiThinking} />
        )}
      </div>

      <AIControls
        visible={isWatchMode}
        canStep={canStep}
        autoPlay={state.ui.autoPlay}
        speedMs={state.ui.autoPlaySpeedMs}
        onStep={handleStep}
        onToggleAuto={(v) => dispatch({ type: 'SET_AUTOPLAY', autoPlay: v })}
        onSpeedChange={(ms) => dispatch({ type: 'SET_AUTOPLAY_SPEED', ms })}
      />

      <Controls
        mode={state.ui.mode}
        onModeChange={handleModeChange}
        onNewGame={() => dispatch({ type: 'NEW_GAME' })}
        onUndo={() => dispatch({ type: 'UNDO' })}
        canUndo={state.game.history.length > 0 && !state.ui.aiThinking}
        modeChangeDisabled={state.ui.aiThinking}
      />
    </div>
  );
}
