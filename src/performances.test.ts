import { describe, expect, it } from 'vitest';
import { newGame, type GameState } from './engine';
import {
  actorPosition, bearSprite, clickMoment, nodeMoments, poses, storyMoment, type BearMoment,
} from './performances';
import { nodes, story } from './story';

function at(node: string, overrides: Partial<GameState> = {}): GameState {
  return { ...newGame(), node, visited: ['wake', node], ...overrides };
}

describe('bear performances', () => {
  it('defines exactly 24 unique atlas cells', () => {
    const frames = Object.values(poses).map(pose => pose.frame).sort((a, b) => a - b);
    expect(frames).toEqual(Array.from({ length: 24 }, (_, index) => index));
  });

  it('has a moment for every story node', () => {
    for (const node of story) {
      if (node.final) continue;
      expect(nodeMoments[node.id], node.id).toBeTruthy();
      const moment = storyMoment(at(node.id));
      expect(moment.caption.length, node.id).toBeGreaterThan(4);
      expect(moment.pose in poses, node.id).toBe(true);
    }
  });

  it('crops the atlas to the requested cell', () => {
    expect(bearSprite({ pose: 'sleepy', caption: '' }, 'bear')).toContain('viewBox="0 0 256 256"');
    expect(bearSprite({ pose: 'nervous', caption: '' }, 'bear')).toContain('viewBox="256 256 256 256"');
    expect(bearSprite({ pose: 'wave', caption: '' }, 'bear')).toContain('viewBox="1280 768 256 256"');
    expect(bearSprite({ pose: 'wave', caption: '' }, 'bear')).toContain('data-frame="23"');
  });

  it('uses a different pose for each of the room discoveries', () => {
    let moment: BearMoment = storyMoment(at('home-search'));
    const seen: string[] = [];
    for (const hotspot of ['desk', 'umbrella', 'tea']) {
      moment = clickMoment(at('home-search'), 'inspect', { hotspot }, moment);
      expect(seen).not.toContain(moment.pose);
      seen.push(moment.pose);
    }
    expect(seen).toEqual(['read', 'umbrella', 'tea']);
  });

  it('moves the bear next to the thing it is inspecting', () => {
    expect(actorPosition('home', { pose: 'read', caption: '' })).toBe('desk');
    expect(actorPosition('home', { pose: 'tea', caption: '' })).toBe('tea');
    expect(actorPosition('home', { pose: 'umbrella', caption: '' })).toBe('door');
    expect(actorPosition('bridge', { pose: 'boat', caption: '' })).toBe('bank');
    expect(actorPosition('bridge', { pose: 'walk', caption: '' })).toBe('bridge');
    expect(actorPosition('hill', { pose: 'sunset', caption: '' })).toBe('sunset');
  });

  it('shows the finished bake rather than the in-progress pose', () => {
    const solved = at('bake-puzzle', { solved: ['baking'] });
    const moment = clickMoment(solved, 'puzzle-open', {}, { pose: 'ready', caption: '' });
    expect(moment.pose).toBe('baked');
  });

  it('reacts differently to a correct and a wrong baking step', () => {
    const correct = clickMoment(at('bake-puzzle'), 'bake-step', { step: 'knead' }, { pose: 'ready', caption: '' });
    const wrong = clickMoment(at('bake-puzzle'), 'bake-step', { step: 'bake', result: 'retry' }, { pose: 'knead', caption: '' });
    expect(correct.pose).toBe('knead');
    expect(wrong.pose).toBe('nervous');
  });

  it('changes the bear on every repeated identical click', () => {
    const first = clickMoment(at('post-stamp'), 'inspect', { hotspot: 'desk' }, { pose: 'discover', caption: '' });
    const second = clickMoment(at('post-stamp'), 'inspect', { hotspot: 'desk' }, first);
    expect(`${second.pose}:${second.variant}`).not.toBe(`${first.pose}:${first.variant}`);
    expect(first.pose).not.toBe('discover');
  });

  it('gives each ending its own final pose', () => {
    const endings = {
      tomorrow: 'posted', together: 'share', brave: 'wave', rest: 'sunset',
    } as const;
    for (const [ending, pose] of Object.entries(endings)) {
      const moment = storyMoment(at('finish', { ending: ending as GameState['ending'] }));
      expect(moment.pose).toBe(pose);
    }
  });

  it('does not repeat the previous pose when the next scene allows a choice', () => {
    const previous = storyMoment(at('bakery-talk'));
    const next = storyMoment(at('bake-choice'), previous);
    expect(next.pose).not.toBe(previous.pose);
  });

  it('keeps every pose label descriptive', () => {
    for (const pose of Object.values(poses)) expect(pose.label.startsWith('小熊')).toBe(true);
  });
});
