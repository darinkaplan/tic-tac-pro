import { describe, it, expect } from 'vitest';
import { reducer, initialAppState, type Action } from './reducer';

describe('reducer — game actions', () => {
  it('MOVE applies the move and records reasoning when provided', () => {
    const s0 = initialAppState();
    const action: Action = {
      type: 'MOVE',
      move: { boardIdx: 0, cellIdx: 0, player: 'X' },
      reasoning: 'Test move',
    };
    const s1 = reducer(s0, action);
    expect(s1.game.smallBoards[0]![0]).toBe('X');
    expect(s1.ui.reasoningHistory).toHaveLength(1);
    expect(s1.ui.reasoningHistory[0]!.reasoning).toBe('Test move');
    expect(s1.ui.reasoningHistory[0]!.byAI).toBe(true);
  });

  it('MOVE without reasoning records an empty entry (human move)', () => {
    const s0 = initialAppState();
    const s1 = reducer(s0, { type: 'MOVE', move: { boardIdx: 0, cellIdx: 0, player: 'X' } });
    expect(s1.ui.reasoningHistory).toHaveLength(1);
    expect(s1.ui.reasoningHistory[0]!.reasoning).toBe('');
    expect(s1.ui.reasoningHistory[0]!.byAI).toBe(false);
  });

  it('UNDO removes the last reasoning entry', () => {
    let s = initialAppState();
    s = reducer(s, { type: 'MOVE', move: { boardIdx: 0, cellIdx: 0, player: 'X' } });
    s = reducer(s, { type: 'MOVE', move: { boardIdx: 0, cellIdx: 1, player: 'O' } });
    const undone = reducer(s, { type: 'UNDO' });
    expect(undone.ui.reasoningHistory).toHaveLength(1);
  });

  it('NEW_GAME resets game and reasoning, optionally setting mode', () => {
    let s = initialAppState();
    s = reducer(s, { type: 'MOVE', move: { boardIdx: 0, cellIdx: 0, player: 'X' } });
    const reset = reducer(s, { type: 'NEW_GAME', mode: 'vs-easy' });
    expect(reset.game.history).toHaveLength(0);
    expect(reset.ui.reasoningHistory).toHaveLength(0);
    expect(reset.ui.mode).toBe('vs-easy');
  });
});

describe('reducer — UI actions', () => {
  it('SET_MODE updates mode but does not touch game state', () => {
    const s0 = initialAppState();
    const s1 = reducer(s0, { type: 'SET_MODE', mode: 'medium-vs-medium' });
    expect(s1.ui.mode).toBe('medium-vs-medium');
    expect(s1.game).toBe(s0.game);
  });

  it('SET_AUTOPLAY toggles autoplay flag', () => {
    const s1 = reducer(initialAppState(), { type: 'SET_AUTOPLAY', autoPlay: true });
    expect(s1.ui.autoPlay).toBe(true);
  });

  it('SET_AUTOPLAY_SPEED updates speed', () => {
    const s1 = reducer(initialAppState(), { type: 'SET_AUTOPLAY_SPEED', ms: 2000 });
    expect(s1.ui.autoPlaySpeedMs).toBe(2000);
  });

  it('SET_AI_THINKING flips the thinking flag', () => {
    const s1 = reducer(initialAppState(), { type: 'SET_AI_THINKING', thinking: true });
    expect(s1.ui.aiThinking).toBe(true);
  });
});
