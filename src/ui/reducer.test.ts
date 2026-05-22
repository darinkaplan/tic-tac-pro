import { describe, it, expect } from 'vitest';
import { reducer, type Action } from './reducer';
import { initialState } from '../game/rules';

describe('reducer', () => {
  it('handles MOVE — applies the move via game rules', () => {
    const s0 = initialState();
    const action: Action = { type: 'MOVE', move: { boardIdx: 0, cellIdx: 0, player: 'X' } };
    const s1 = reducer(s0, action);
    expect(s1.smallBoards[0]![0]).toBe('X');
    expect(s1.currentPlayer).toBe('O');
  });

  it('handles NEW_GAME — returns a fresh initial state', () => {
    const s0 = initialState();
    const mid = reducer(s0, { type: 'MOVE', move: { boardIdx: 0, cellIdx: 0, player: 'X' } });
    const reset = reducer(mid, { type: 'NEW_GAME' });
    expect(reset).toEqual(s0);
  });

  it('handles UNDO — pops the last move by replaying from initial', () => {
    let s = initialState();
    s = reducer(s, { type: 'MOVE', move: { boardIdx: 0, cellIdx: 0, player: 'X' } });
    s = reducer(s, { type: 'MOVE', move: { boardIdx: 0, cellIdx: 1, player: 'O' } });
    const undone = reducer(s, { type: 'UNDO' });
    expect(undone.history).toHaveLength(1);
    expect(undone.currentPlayer).toBe('O');
  });

  it('UNDO on initial state is a no-op', () => {
    const s0 = initialState();
    expect(reducer(s0, { type: 'UNDO' })).toEqual(s0);
  });
});
