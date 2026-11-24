import { describe, expect, it } from 'vitest';
import {
  advance, canContinue, choose, inspect, newGame, parseSave, pickEnding, solve, validPuzzle, type GameState,
} from './engine';

function inspectAll(state: GameState): GameState {
  for (const hotspot of ['desk', 'umbrella', 'tea', 'sunset', 'bench', 'mailbox']) {
    if (state.node === 'home-search' || state.node === 'hill-search') state = inspect(state, hotspot);
  }
  return state;
}

function play(choices: number[], writeChoice: number): GameState {
  let state = newGame();
  state = advance(state);
  state = advance(state);
  state = inspectAll(state);
  expect(canContinue(state)).toBe(true);
  state = advance(state);
  state = advance(state);
  state = choose(state, choices[0]);
  state = advance(state);
  state = advance(state);
  state = advance(state);
  expect(state.node).toBe('bake-choice');
  state = choose(state, choices[1]);
  state = solve(state, ['knead', 'rest', 'bake']);
  expect(state.solved).toContain('baking');
  state = advance(state);
  state = advance(state);
  state = choose(state, choices[2]);
  state = advance(state);
  state = advance(state);
  state = choose(state, choices[3]);
  if (state.node === 'bridge-puzzle') {
    state = solve(state, ['wood', 'rope']);
    expect(state.solved).toContain('bridge');
    state = advance(state);
  }
  state = advance(state);
  state = advance(state);
  state = advance(state);
  expect(state.node).toBe('sort-puzzle');
  state = solve(state, ['flower:bakery', 'fish:brook', 'moon:hill']);
  expect(state.solved).toContain('sorting');
  state = advance(state);
  state = advance(state);
  state = choose(state, choices[4]);
  state = advance(state);
  state = advance(state);
  state = inspectAll(state);
  expect(state.node).toBe('hill-search');
  state = advance(state);
  state = advance(state);
  state = choose(state, writeChoice);
  return state;
}

describe('story engine', () => {
  it('starts with the first node and nothing collected', () => {
    const state = newGame();
    expect(state.node).toBe('wake');
    expect(state.inventory).toEqual([]);
    expect(state.memories).toEqual([]);
  });

  it('blocks continuing until required hotspots are inspected', () => {
    let state = newGame();
    state = advance(state);
    state = advance(state);
    expect(state.node).toBe('home-search');
    expect(canContinue(state)).toBe(false);
    state = inspect(state, 'desk');
    expect(canContinue(state)).toBe(false);
    state = inspect(state, 'umbrella');
    expect(canContinue(state)).toBe(true);
    expect(state.inventory).toEqual(['letter', 'umbrella']);
  });

  it('does not collect the same hotspot twice', () => {
    let state = newGame();
    state = advance(state);
    state = advance(state);
    state = inspect(state, 'tea');
    const again = inspect(state, 'tea');
    expect(again.memories).toEqual(['tea']);
    expect(again.warmth).toBe(0);
  });

  it('validates each puzzle answer', () => {
    expect(validPuzzle('baking', ['knead', 'rest', 'bake'])).toBe(true);
    expect(validPuzzle('baking', ['bake', 'rest', 'knead'])).toBe(false);
    expect(validPuzzle('bridge', ['rope', 'wood'])).toBe(true);
    expect(validPuzzle('bridge', ['wood', 'fish'])).toBe(false);
    expect(validPuzzle('sorting', ['flower:bakery', 'fish:brook', 'moon:hill'])).toBe(true);
    expect(validPuzzle('sorting', ['flower:brook', 'fish:bakery', 'moon:hill'])).toBe(false);
    expect(validPuzzle('sorting', ['flower:bakery', 'flower:bakery', 'moon:hill'])).toBe(false);
  });

  it('reaches the letter ending with a full, warm playthrough', () => {
    const state = play([0, 0, 0, 0, 0], 0);
    expect(state.node).toBe('finish');
    expect(state.ending).toBe('tomorrow');
    expect(state.memories).toHaveLength(5);
    expect(state.inventory).toContain('stamp');
    expect(pickEnding(state)).toBe('tomorrow');
  });

  it('reaches the together ending when warmth outweighs a hesitant letter', () => {
    const state = play([1, 1, 0, 1, 0], 1);
    expect(state.ending).toBe('together');
  });

  it('reaches the brave ending through two bold choices', () => {
    const state = play([0, 0, 1, 2, 0], 1);
    expect(state.courage).toBeGreaterThanOrEqual(2);
    expect(state.ending).toBe('brave');
  });

  it('honours the rest choice regardless of stats', () => {
    const state = play([0, 0, 0, 0, 0], 2);
    expect(state.ending).toBe('rest');
  });

  it('round-trips a save and rejects tampered saves', () => {
    const state = play([0, 0, 0, 0, 0], 0);
    const restored = parseSave(JSON.stringify(state));
    expect(restored).toEqual(state);
    expect(parseSave('not json')).toBeNull();
    expect(parseSave(JSON.stringify({ ...state, node: 'nowhere' }))).toBeNull();
    expect(parseSave(JSON.stringify({ ...state, warmth: 99 }))).toBeNull();
    expect(parseSave(JSON.stringify({ ...state, inventory: ['letter', 'letter'] }))).toBeNull();
    expect(parseSave(JSON.stringify({ ...state, ending: 'brave' }))).toBeNull();
  });

  it('keeps the ending consistent after a reload', () => {
    const state = play([1, 1, 0, 1, 0], 1);
    const restored = parseSave(JSON.stringify(state));
    expect(restored?.ending).toBe('together');
    expect(pickEnding(restored!)).toBe('together');
  });
});
