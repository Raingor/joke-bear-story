import { type GameState } from './engine';
import { nodes, type ChapterId } from './story';

export const bearAtlas = './characters/bear-story-poses.png';

export const poses = {
  sleepy: { frame: 0, label: '小熊伸懶腰打呵欠' },
  discover: { frame: 1, label: '小熊發現桌上的信，驚訝地睜大眼睛' },
  read: { frame: 2, label: '小熊雙手拿著信，認真讀著' },
  umbrella: { frame: 3, label: '小熊撐開小黃傘' },
  tea: { frame: 4, label: '小熊閉著眼睛，捧著杯子喝熱茶' },
  think: { frame: 5, label: '小熊歪著頭，摸摸臉頰想事情' },
  walk: { frame: 6, label: '小熊背著綠色小包，踏出一步' },
  nervous: { frame: 7, label: '小熊把手收在胸前，有一點緊張' },
  ready: { frame: 8, label: '小熊繫好圍裙，捲起袖子準備烘焙' },
  knead: { frame: 9, label: '小熊雙手在木板上揉麵' },
  proof: { frame: 10, label: '小熊蹲下來，仔細看碗裡發酵的麵糰' },
  baked: { frame: 11, label: '小熊戴著隔熱手套，捧起剛出爐的麵包' },
  share: { frame: 12, label: '小熊把香香的麵包遞給朋友' },
  pack: { frame: 13, label: '小熊把麵包包進小紙袋' },
  reach: { frame: 14, label: '小熊蹲在岸邊，伸手接紙船' },
  tie: { frame: 15, label: '小熊用麻繩仔細固定木板' },
  boat: { frame: 16, label: '小熊捧著接回來的小紙船，開心地微笑' },
  shelter: { frame: 17, label: '小熊把傘撐向朋友那一邊' },
  stamp: { frame: 18, label: '小熊拿著放大鏡，研究一枚小郵票' },
  sort: { frame: 19, label: '小熊把三封信抱在手裡，仔細分揀' },
  posted: { frame: 20, label: '小熊高高舉起貼好郵票的信' },
  write: { frame: 21, label: '小熊坐下來，握著鉛筆寫信' },
  sunset: { frame: 22, label: '小熊背對著你，安靜坐著看日落' },
  wave: { frame: 23, label: '小熊拿著寫好的信，微笑揮手' },
} as const;

export type Pose = keyof typeof poses;

interface MomentSpec {
  poses: readonly [Pose, Pose];
  caption: string;
}

export interface BearMoment {
  pose: Pose;
  caption: string;
  detail?: string;
  variant?: number;
}

export const nodeMoments: Record<string, MomentSpec> = {
  wake: { poses: ['sleepy', 'think'], caption: '揉揉眼睛，先讓今天慢慢醒來。' },
  'letter-notice': { poses: ['discover', 'think'], caption: '咦？桌上的信，好像是自己的字。' },
  'home-search': { poses: ['think', 'nervous'], caption: '先四處看看。出發需要一點小小準備。' },
  'read-letter': { poses: ['read', 'discover'], caption: '小熊把信翻開，又讀了一次。' },
  'leave-choice': { poses: ['nervous', 'think'], caption: '門開了一條縫，還差一點勇氣。' },
  'leave-brave': { poses: ['walk', 'umbrella'], caption: '背起小包，這一步就已經算數。' },
  'leave-soft': { poses: ['umbrella', 'walk'], caption: '小黃傘打開了，肚子也準備好了。' },
  'bakery-arrive': { poses: ['think', 'nervous'], caption: '奶油香從轉角飄過來，腳步自己停下了。' },
  'bakery-talk': { poses: ['nervous', 'think'], caption: '自己烤麵包？先看看這雙圓圓的手。' },
  'bake-choice': { poses: ['think', 'nervous'], caption: '第一次試試，或是跟朋友一起試試。' },
  'bake-puzzle': { poses: ['read', 'think'], caption: '小熊先把配方讀好，不急著進烤箱。' },
  'bread-done': { poses: ['baked', 'pack'], caption: '叮！一朵有個性的雲，熱呼呼地出爐。' },
  'bread-choice': { poses: ['think', 'pack'], caption: '這份香香的快樂，要怎麼收好呢？' },
  'bread-share': { poses: ['share', 'baked'], caption: '把最香的那一角，往兔兔那邊遞。' },
  'bread-pack': { poses: ['pack', 'baked'], caption: '小熊把麵包包好，留給傍晚的自己。' },
  'bridge-arrive': { poses: ['reach', 'think'], caption: '岸邊有一隻小紙船，正在等人接它。' },
  'bridge-choice': { poses: ['think', 'nervous'], caption: '小熊停下腳步，看看紙船，也看看朋友。' },
  'bridge-puzzle': { poses: ['reach', 'think'], caption: '站在乾乾的岸上，先想好怎麼修踏板。' },
  'bridge-fixed': { poses: ['boat', 'shelter'], caption: '紙船接回來了，船裡的小葉子也沒淋濕。' },
  'bridge-wait': { poses: ['shelter', 'umbrella'], caption: '傘往朋友那邊挪一點，陪伴也有它的方法。' },
  'bridge-alone': { poses: ['walk', 'umbrella'], caption: '跟兔兔約好山丘見，小熊自己走一段。' },
  'post-arrive': { poses: ['stamp', 'think'], caption: '郵局到了。這裡也收沒說出口的話。' },
  'post-talk': { poses: ['read', 'think'], caption: '小熊把信拿出來，問問寄給明天的方法。' },
  'sort-puzzle': { poses: ['sort', 'read'], caption: '三封信，三個地址。先讀懂裡面的心意。' },
  'post-stamp': { poses: ['posted', 'stamp'], caption: '山丘郵票貼好了：慢慢來，也會到。' },
  'post-choice': { poses: ['think', 'read'], caption: '空白的地方，已經悄悄裝進一些小事。' },
  'post-heart': { poses: ['wave', 'posted'], caption: '小熊數數今天遇見的小事，開心揮揮手。' },
  'post-blank': { poses: ['read', 'think'], caption: '把信紙收好，空白也一起帶上山丘。' },
  'hill-arrive': { poses: ['sunset', 'think'], caption: '小熊坐下來，先好好看一眼天空。' },
  'hill-search': { poses: ['think', 'sunset'], caption: '把腳步放下，看看這裡藏著什麼。' },
  'hill-talk': { poses: ['tea', 'share'], caption: '熱可可還燙著，朋友已經坐在身旁。' },
  'last-choice': { poses: ['write', 'read'], caption: '拿起鉛筆，給明天的自己留一句話。' },
  finish: { poses: ['posted', 'wave'], caption: '今天的小小冒險，收進信裡了。' },
};

function selectMoment(spec: MomentSpec, previous?: BearMoment, detail?: string): BearMoment {
  const pose = spec.poses.find(candidate => candidate !== previous?.pose) || spec.poses[0];
  const variant = pose === previous?.pose ? ((previous?.variant || 0) + 1) % 3 : 0;
  return { pose, caption: spec.caption, variant, ...(detail ? { detail } : {}) };
}

export function storyMoment(state: GameState, previous?: BearMoment): BearMoment {
  if (state.ending) {
    const finalMoments: Record<NonNullable<GameState['ending']>, MomentSpec> = {
      tomorrow: { poses: ['posted', 'wave'], caption: '小熊舉起貼好郵票的信，把今天寄給明天。' },
      together: { poses: ['share', 'tea'], caption: '小熊把麵包分給朋友，留下兩個人的日落。' },
      brave: { poses: ['wave', 'posted'], caption: '帶著信揮揮手，謝謝今天勇敢出發的自己。' },
      rest: { poses: ['sunset', 'sleepy'], caption: '小熊靜靜坐下。今天先好好休息。' },
    };
    return selectMoment(finalMoments[state.ending], previous);
  }
  return selectMoment(nodeMoments[state.node], previous);
}

const itemMoments: Record<string, MomentSpec> = {
  letter: { poses: ['read', 'discover'], caption: '小熊把信捧起來，看看還沒寫完的那一頁。' },
  umbrella: { poses: ['umbrella', 'shelter'], caption: '小熊試著撐開傘。歪一點，也能遮雨。' },
  bread: { poses: ['pack', 'share'], caption: '紙袋裡還留著雲朵麵包的香氣。' },
  stamp: { poses: ['stamp', 'posted'], caption: '小熊把郵票湊近看看，收好這份小小心意。' },
};

export function clickMoment(
  state: GameState,
  action: string,
  data: Record<string, string | undefined>,
  previous: BearMoment,
): BearMoment {
  if (action === 'puzzle-open' && nodes[state.node].puzzle && state.solved.includes(nodes[state.node].puzzle!)) {
    const done: Record<string, MomentSpec> = {
      baking: { poses: ['baked', 'share'], caption: '烤箱叮了一聲。小熊想再看一眼剛做好的麵包。' },
      bridge: { poses: ['boat', 'shelter'], caption: '小踏板修好了，小熊再看看接回來的紙船。' },
      sorting: { poses: ['posted', 'wave'], caption: '三封信都回家了，小熊舉起今天的山丘郵票。' },
    };
    return selectMoment(done[nodes[state.node].puzzle!], previous);
  }
  if (action === 'inspect') {
    const discoveries: Record<string, MomentSpec> = {
      desk: itemMoments.letter,
      umbrella: itemMoments.umbrella,
      tea: { poses: ['tea', 'sleepy'], caption: '捧起杯子喝一小口。呼——先暖暖身子。' },
      sunset: { poses: ['sunset', 'think'], caption: '小熊轉過身，安靜收好橘子汽水色的天空。' },
      bench: { poses: ['tea', 'share'], caption: '小熊替朋友留個位置，慢慢坐一小會兒。' },
      mailbox: { poses: ['posted', 'stamp'], caption: '小熊拿著信，看看山丘郵筒的收信時間。' },
    };
    return selectMoment(discoveries[data.hotspot!] || nodeMoments[state.node], previous);
  }
  if (action === 'item') return selectMoment(itemMoments[data.item!] || nodeMoments[state.node], previous);
  if (action === 'puzzle-open') {
    const puzzle = nodes[state.node].puzzle;
    const specs: Record<string, MomentSpec> = {
      baking: { poses: ['ready', 'knead'], caption: '圍裙繫好，袖子捲好。小熊準備動手了。' },
      bridge: { poses: ['think', 'reach'], caption: '先在岸上挑好材料，再把小踏板修穩。' },
      sorting: { poses: ['stamp', 'read'], caption: '把信封靠近看看，地址線索就藏在上面。' },
    };
    return selectMoment(specs[puzzle!], previous);
  }
  if (action === 'bake-step') {
    if (data.result === 'retry') {
      return selectMoment({ poses: ['nervous', 'think'], caption: '小熊愣了一下：順序好像不太對，重新試試吧。' }, previous);
    }
    const steps: Record<string, MomentSpec> = {
      knead: { poses: ['knead', 'ready'], caption: '小熊用兩隻手，把空氣慢慢揉進麵糰。' },
      rest: { poses: ['proof', 'think'], caption: '蹲下來等等，麵糰正在偷偷長大。' },
      bake: { poses: ['baked', 'pack'], caption: '戴上隔熱手套，等烤箱裡飄出香味。' },
    };
    return selectMoment(steps[data.step!], previous);
  }
  if (action === 'bridge-material') {
    if (data.result === 'retry') {
      return selectMoment({ poses: ['nervous', 'think'], caption: '小熊試了試，踏板還不夠穩。換兩樣材料看看。' }, previous);
    }
    const materials: Record<string, MomentSpec> = {
      wood: { poses: ['tie', 'reach'], caption: '把長木板搭好，再看看要怎麼固定。' },
      rope: { poses: ['tie', 'reach'], caption: '小熊握好麻繩，把踏板的繩結繫緊。' },
      flower: { poses: ['think', 'nervous'], caption: '花很可愛，不過踏板需要更牢靠的材料。' },
      fish: { poses: ['nervous', 'think'], caption: '小魚乾好像比較適合野餐，再想想。' },
    };
    if (state.solved.includes('bridge')) return selectMoment({ poses: ['boat', 'shelter'], caption: '踏板穩了！小熊捧起接回來的紙船。' }, previous);
    return selectMoment(materials[data.material!], previous);
  }
  if (action === 'sort-pick') {
    return selectMoment({ poses: ['read', 'stamp'], caption: '小熊雙手拿起這封信，認真讀讀地址。' }, previous, data.letter);
  }
  if (action === 'sort-drop') {
    if (data.result === 'retry') {
      return selectMoment({ poses: ['nervous', 'think'], caption: '小熊把信收回來：地址好像不在這裡，再看一次。' }, previous);
    }
    return selectMoment(state.solved.includes('sorting')
      ? { poses: ['posted', 'wave'], caption: '三封信都找到家了，小熊舉起今天的山丘郵票。' }
      : { poses: ['sort', 'stamp'], caption: '把這封心意送到，再看看下一封。' }, previous, data.box);
  }
  if (action === 'puzzle-reset') {
    return selectMoment(nodes[state.node].puzzle === 'baking'
      ? { poses: ['ready', 'think'], caption: '重新把袖子捲好，慢慢試一次就好。' }
      : { poses: ['think', 'nervous'], caption: '小熊把材料放回去，重新想一想。' }, previous);
  }
  if (action === 'puzzle-close') {
    if (nodes[state.node].puzzle === 'baking' && state.solved.includes('baking')) {
      return selectMoment({ poses: ['pack', 'share'], caption: '把親手做好的麵包先收好，香味還暖暖的。' }, previous);
    }
    if (nodes[state.node].puzzle === 'sorting' && state.solved.includes('sorting')) {
      return selectMoment({ poses: ['stamp', 'wave'], caption: '小熊把郵票小心收好，準備繼續走。' }, previous);
    }
    if (nodes[state.node].puzzle === 'bridge' && state.solved.includes('bridge')) {
      return selectMoment({ poses: ['boat', 'reach'], caption: '小熊把紙船交給兔兔，準備繼續往前。' }, previous);
    }
  }
  if (action === 'journal' || action === 'ending-journal' || action === 'help') {
    return selectMoment({ poses: ['read', 'think'], caption: '小熊翻開今天的收藏，回想剛才的小事。' }, previous);
  }
  if (action === 'sound') {
    return selectMoment({ poses: ['think', 'sleepy'], caption: '小熊停一下，聽聽今天的聲音。' }, previous);
  }
  return storyMoment(state, previous);
}

export function bearSprite(moment: BearMoment, className: string): string {
  const pose = poses[moment.pose];
  const column = pose.frame % 6;
  const row = Math.floor(pose.frame / 6);
  return `<svg class="${className}" data-pose="${moment.pose}" data-frame="${pose.frame}" data-variant="${moment.variant || 0}" viewBox="${column * 256} ${row * 256} 256 256" width="256" height="256" role="img" aria-label="${pose.label}">
    <image href="${bearAtlas}" x="0" y="0" width="1536" height="1024" />
  </svg>`;
}

export function actorPosition(chapter: ChapterId, moment: BearMoment): string {
  if (chapter === 'home') {
    if (['read', 'discover'].includes(moment.pose)) return 'desk';
    if (moment.pose === 'tea') return 'tea';
    if (moment.pose === 'umbrella' || moment.pose === 'shelter') return 'door';
  }
  if (chapter === 'bridge') {
    return ['reach', 'tie', 'boat', 'shelter', 'umbrella'].includes(moment.pose) ? 'bank' : 'bridge';
  }
  if (chapter === 'hill' && moment.pose === 'sunset') return 'sunset';
  return 'center';
}
