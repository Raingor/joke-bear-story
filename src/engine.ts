import {
  endings, items, memories, nodes, puzzleRewards,
  type Effect, type EndingId, type ItemId, type MemoryId, type PuzzleId,
} from './story';

export interface GameState {
  version: 1;
  node: string;
  warmth: number;
  courage: number;
  inventory: ItemId[];
  memories: MemoryId[];
  flags: string[];
  visited: string[];
  inspected: string[];
  solved: PuzzleId[];
  ending: EndingId | null;
}

export function newGame(): GameState {
  return {
    version: 1, node: 'wake', warmth: 0, courage: 0, inventory: [], memories: [],
    flags: [], visited: ['wake'], inspected: [], solved: [], ending: null,
  };
}

function applyEffect(state: GameState, effect?: Effect): void {
  if (!effect) return;
  state.warmth += effect.warmth || 0;
  state.courage += effect.courage || 0;
  if (effect.item && !state.inventory.includes(effect.item)) state.inventory.push(effect.item);
  if (effect.memory && !state.memories.includes(effect.memory)) state.memories.push(effect.memory);
  if (effect.flag && !state.flags.includes(effect.flag)) state.flags.push(effect.flag);
}

export function pickEnding(state: GameState): EndingId {
  if (state.flags.includes('write-rest')) return 'rest';
  if (state.flags.includes('write-warm') && state.warmth >= 2 && state.memories.length >= 4) return 'tomorrow';
  if (state.flags.includes('write-brave') && state.courage >= 2) return 'brave';
  if (state.warmth >= 2) return 'together';
  if (state.courage >= 2) return 'brave';
  return 'rest';
}

function move(state: GameState, next: string): GameState {
  if (!nodes[next]) return state;
  state.node = next;
  if (state.visited.at(-1) !== next) state.visited.push(next);
  if (nodes[next].final) state.ending = pickEnding(state);
  return state;
}

export function canContinue(state: GameState): boolean {
  const node = nodes[state.node];
  if (node.choices || node.final) return false;
  if (node.puzzle) return state.solved.includes(node.puzzle);
  return (node.required || []).every(hotspot => state.inspected.includes(`${node.id}:${hotspot}`));
}

export function advance(state: GameState): GameState {
  const node = nodes[state.node];
  return canContinue(state) && node.next ? move(structuredClone(state), node.next) : state;
}

export function choose(state: GameState, index: number): GameState {
  const choice = nodes[state.node].choices?.[index];
  if (!choice) return state;
  const next = structuredClone(state);
  applyEffect(next, choice.effect);
  return move(next, choice.next);
}

export function inspect(state: GameState, hotspotId: string): GameState {
  const hotspot = nodes[state.node].explore?.find(item => item.id === hotspotId);
  const key = `${state.node}:${hotspotId}`;
  if (!hotspot || state.inspected.includes(key)) return state;
  const next = structuredClone(state);
  next.inspected.push(key);
  applyEffect(next, hotspot.effect);
  return next;
}

export const bakingSteps = ['knead', 'rest', 'bake'] as const;
export const bridgeMaterials = ['wood', 'rope'] as const;
export const mailDestinations: Record<string, string> = { flower: 'bakery', fish: 'brook', moon: 'hill' };

export function validPuzzle(id: PuzzleId, answer: readonly string[]): boolean {
  if (id === 'baking') return answer.length === 3 && answer.every((step, index) => step === bakingSteps[index]);
  if (id === 'bridge') return answer.length === 2 && bridgeMaterials.every(material => answer.includes(material));
  return answer.length === 3 && answer.every(pair => {
    const [letter, destination] = pair.split(':');
    return mailDestinations[letter] === destination;
  }) && new Set(answer).size === 3;
}

export function solve(state: GameState, answer: readonly string[]): GameState {
  const puzzle = nodes[state.node].puzzle;
  if (!puzzle || state.solved.includes(puzzle) || !validPuzzle(puzzle, answer)) return state;
  const next = structuredClone(state);
  next.solved.push(puzzle);
  for (const reward of puzzleRewards[puzzle]) applyEffect(next, reward);
  return next;
}

const allowedFlags = new Set([
  'shared', 'helped', 'waited', 'bench', 'mailbox', 'write-warm', 'write-brave', 'write-rest',
]);
const allInspections = new Set(Object.values(nodes).flatMap(node => (node.explore || []).map(hotspot => `${node.id}:${hotspot.id}`)));
const allPuzzles = new Set(['baking', 'bridge', 'sorting']);

export function parseSave(raw: string | null): GameState | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    if (!value || value.version !== 1 || typeof value.node !== 'string' || !nodes[value.node]) return null;
    if (!Number.isInteger(value.warmth) || value.warmth < 0 || value.warmth > 8
      || !Number.isInteger(value.courage) || value.courage < 0 || value.courage > 8) return null;
    const validList = (list: unknown, allowed: Set<string>, max: number) => Array.isArray(list)
      && list.length <= max && list.every(entry => typeof entry === 'string' && allowed.has(entry))
      && new Set(list).size === list.length;
    if (!validList(value.inventory, new Set(Object.keys(items)), 4)
      || !validList(value.memories, new Set(Object.keys(memories)), 5)
      || !validList(value.flags, allowedFlags, 12)
      || !validList(value.inspected, allInspections, 6)
      || !validList(value.solved, allPuzzles, 3)
      || !validList(value.visited, new Set(Object.keys(nodes)), Object.keys(nodes).length)) return null;
    if (value.visited[0] !== 'wake' || value.visited.at(-1) !== value.node) return null;
    if (nodes[value.node].final ? !Object.hasOwn(endings, value.ending) || value.ending !== pickEnding(value) : value.ending !== null) return null;
    return {
      version: 1, node: value.node, warmth: value.warmth, courage: value.courage,
      inventory: value.inventory, memories: value.memories, flags: value.flags,
      visited: value.visited, inspected: value.inspected, solved: value.solved, ending: value.ending,
    };
  } catch {
    return null;
  }
}
