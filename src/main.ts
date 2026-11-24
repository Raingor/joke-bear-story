import { icon } from './icons';
import { sceneArt } from './scenes';
import { actorPosition, bearSprite, clickMoment, storyMoment, type BearMoment } from './performances';
import {
  advance, canContinue, choose, inspect, mailDestinations,
  newGame, parseSave, pickEnding, solve, validPuzzle, type GameState,
} from './engine';
import { chapters, endings, items, memories, nodes, type ChapterId, type PuzzleId } from './story';
import './style.css';

const SAVE_KEY = 'joke-bear-story-save-v1';
const ENDINGS_KEY = 'joke-bear-story-endings-v1';
const SOUND_KEY = 'joke-bear-story-sound-v1';

const app = document.querySelector<HTMLDivElement>('#app')!;
let state: GameState = loadGame() || newGame();
let moment: BearMoment = storyMoment(state);
let endingIds = loadEndings();
let sound = localStorage.getItem(SOUND_KEY) !== 'off';
let focusReturn: string | null = null;
let sheetOpen = false;
let helpOpen = false;
let activePuzzle: PuzzleId | null = null;
let bakingAnswer: string[] = [];
let bridgeAnswer: string[] = [];
let sortSelection: string | null = null;
let sortedLetters: string[] = [];
let toastTimer: number | undefined;
let audio: { context: AudioContext; master: GainNode } | null = null;

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function loadGame(): GameState | null {
  return parseSave(localStorage.getItem(SAVE_KEY));
}

function loadEndings(): string[] {
  try {
    const list = JSON.parse(localStorage.getItem(ENDINGS_KEY) || '[]');
    return Array.isArray(list) ? list.filter((id: unknown): id is string => typeof id === 'string' && id in endings) : [];
  } catch {
    return [];
  }
}

function save(): void {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  localStorage.setItem(ENDINGS_KEY, JSON.stringify(endingIds));
}

function tone(frequency: number, duration = 0.12, type: OscillatorType = 'sine', volume = 0.025): void {
  if (!sound) return;
  try {
    audio ??= (() => {
      const context = new AudioContext();
      const master = context.createGain();
      master.gain.value = 0.55;
      master.connect(context.destination);
      return { context, master };
    })();
    if (audio.context.state === 'suspended') void audio.context.resume();
    const oscillator = audio.context.createOscillator();
    const gain = audio.context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, audio.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.context.currentTime + duration);
    oscillator.connect(gain).connect(audio.master);
    oscillator.start();
    oscillator.stop(audio.context.currentTime + duration);
  } catch {
    sound = false;
  }
}

function chime(): void {
  tone(523.25, 0.18, 'sine', 0.03);
  setTimeout(() => tone(659.25, 0.18, 'sine', 0.025), 90);
  setTimeout(() => tone(783.99, 0.28, 'sine', 0.02), 180);
}

function toast(message: string): void {
  window.clearTimeout(toastTimer);
  let element = document.querySelector<HTMLDivElement>('#toast');
  if (!element) {
    element = document.createElement('div');
    element.id = 'toast';
    element.setAttribute('role', 'status');
    element.className = 'toast';
    document.body.append(element);
  }
  element.textContent = message;
  element.classList.add('show');
  toastTimer = window.setTimeout(() => element?.classList.remove('show'), 2600);
}

function chapterIndex(id: ChapterId): number {
  return chapters.findIndex(chapter => chapter.id === id);
}

function chapterDone(chapter: { id: ChapterId }): boolean {
  return state.visited.some(id => nodes[id]?.chapter === chapter.id);
}

function displayText(text: string): string {
  return text.split('\n').map(line => `<span>${escapeHtml(line)}</span>`).join('');
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]!));
}

function header(): string {
  return `<header class="topbar">
    <a class="brand" href="./" aria-label="小熊與未寄出的信，回到封面">${icon('letter', 'brand-mark')}<span>小熊與未寄出的信<small>JOKE BEAR · A LITTLE STORY</small></span></a>
    <nav class="top-actions" aria-label="遊戲設定">
      <button type="button" class="icon-button" data-action="journal" aria-label="打開回憶收藏" aria-expanded="false">${icon('book')}</button>
      <button type="button" class="icon-button" data-action="sound" aria-label="${sound ? '關閉音效' : '開啟音效'}" aria-pressed="${sound}">${icon(sound ? 'music' : 'muted')}</button>
      <button type="button" class="icon-button" data-action="help" aria-label="查看操作說明">${icon('help')}</button>
    </nav>
  </header>`;
}

function chapterRail(current: ChapterId): string {
  const currentIndex = chapterIndex(current);
  return `<ol class="chapter-rail" aria-label="故事章節">${chapters.map((chapter, index) => {
    const done = chapterDone(chapter);
    const status = index === currentIndex ? 'current' : done ? 'done' : 'ahead';
    return `<li class="${status}" ${index === currentIndex ? 'aria-current="step"' : ''}><span class="rail-dot">${done && index !== currentIndex ? icon('check') : String(index + 1).padStart(2, '0')}</span><span class="rail-label">${chapter.title}</span></li>`;
  }).join('')}</ol>`;
}

function inventoryBar(): string {
  return `<aside class="inventory" aria-label="小熊的包包">
    <span class="inventory-title">${icon('bag')} 包包</span>
    <div class="inventory-items">${state.inventory.length ? state.inventory.map(id => {
      const item = items[id];
      return `<button type="button" class="item-chip" data-action="item" data-item="${id}" aria-label="查看 ${item.name}">${icon(item.icon)}<span>${item.name}</span></button>`;
    }).join('') : '<span class="inventory-empty">還空空的</span>'}</div>
    <span class="stat-pair"><span title="今天收到的溫柔">${icon('heart')} ${state.warmth}</span><span title="今天累積的勇氣">${icon('star')} ${state.courage}</span></span>
  </aside>`;
}

function hotspots(): string {
  const node = nodes[state.node];
  if (!node.explore) return '';
  return `<div class="hotspot-layer">${node.explore.map(hotspot => {
    const done = state.inspected.includes(`${node.id}:${hotspot.id}`);
    return `<button type="button" class="hotspot${done ? ' done' : ''}" style="left:${hotspot.x}%;top:${hotspot.y}%" data-action="inspect" data-hotspot="${hotspot.id}" aria-label="${done ? '再看一次' : '查看'}：${hotspot.label}">${icon(done ? 'check' : hotspot.icon)}<span>${hotspot.label}</span></button>`;
  }).join('')}</div>`;
}

function letterPreview(): string {
  const written = state.flags.includes('write-warm') || state.flags.includes('write-brave') || state.flags.includes('write-rest');
  return `<div class="letter-sheet" aria-label="寫給明天的自己的信">
    <p class="letter-to">給明天的我：</p>
    <p class="letter-line">${written ? (state.flags.includes('write-warm') ? '今天的小事，我都有好好收下。' : state.flags.includes('write-brave') ? '我有點害怕，還是走到了這裡。' : '今天辛苦了，其他的明天再說。') : '<span class="letter-blank">（這裡還留著一片空白）</span>'}</p>
    <p class="letter-sign">—— 今天的小熊</p>
    ${state.inventory.includes('stamp') ? `<span class="letter-stamp">${icon('stamp')}<small>山丘郵票</small></span>` : ''}
  </div>`;
}

function bakePuzzle(): string {
  const options = [
    { id: 'knead', label: '揉麵，把空氣揉進去', icon: 'cloud' },
    { id: 'rest', label: '發酵，給它一點時間', icon: 'moon' },
    { id: 'bake', label: '烘烤，慢慢等香味', icon: 'sun' },
  ];
  const solved = state.solved.includes('baking');
  return `<div class="puzzle-card" role="group" aria-labelledby="puzzle-title">
    <div class="puzzle-head"><span class="puzzle-kicker">小配方 · 三個步驟</span><h3 id="puzzle-title">做一個歪歪的雲朵麵包</h3><p>照順序點選步驟。點錯可以重新開始。</p></div>
    <div class="answer-tray" aria-label="已選步驟">${[0, 1, 2].map(index => `<span class="tray-slot${bakingAnswer[index] ? ' filled' : ''}">${bakingAnswer[index] ? options.find(option => option.id === bakingAnswer[index])?.label.split('，')[0] : index + 1}</span>`).join('')}</div>
    <div class="puzzle-options">${options.map(option => `<button type="button" class="puzzle-option${bakingAnswer.includes(option.id) ? ' used' : ''}" data-action="bake-step" data-step="${option.id}" ${bakingAnswer.includes(option.id) || solved ? 'disabled' : ''}>${icon(option.icon)}<span>${option.label}</span></button>`).join('')}</div>
    <div class="puzzle-feedback" role="status" aria-live="polite">${solved ? `${icon('check')} 叮！麵包出爐了。` : bakingAnswer.length === 3 ? '這個順序好像怪怪的，再試一次。' : '先揉麵，再讓它休息，最後才進烤箱。'}</div>
    <div class="puzzle-actions"><button type="button" class="text-button" data-action="puzzle-reset">重新排一次</button></div>
  </div>`;
}

function bridgePuzzle(): string {
  const options = [
    { id: 'wood', label: '長木板', note: '跨過岸邊的缺口', icon: 'wood' },
    { id: 'rope', label: '一捲麻繩', note: '把踏板綁緊', icon: 'thread' },
    { id: 'flower', label: '小野花', note: '好看，但踩上去會滑', icon: 'flower' },
    { id: 'fish', label: '小魚乾', note: '紙船乘客可能喜歡', icon: 'fish' },
  ];
  const solved = state.solved.includes('bridge');
  return `<div class="puzzle-card" role="group" aria-labelledby="puzzle-title">
    <div class="puzzle-head"><span class="puzzle-kicker">岸邊小修理</span><h3 id="puzzle-title">修好取船的小踏板</h3><p>挑兩樣能讓踏板穩固的材料。不用下水。</p></div>
    <div class="answer-tray" aria-label="已選材料">${[0, 1].map(index => `<span class="tray-slot${bridgeAnswer[index] ? ' filled' : ''}">${bridgeAnswer[index] ? options.find(option => option.id === bridgeAnswer[index])?.label : `材料 ${index + 1}`}</span>`).join('')}</div>
    <div class="puzzle-options two-col">${options.map(option => `<button type="button" class="puzzle-option${bridgeAnswer.includes(option.id) ? ' used' : ''}" data-action="bridge-material" data-material="${option.id}" ${bridgeAnswer.includes(option.id) || solved ? 'disabled' : ''}>${icon(option.icon)}<span>${option.label}<small>${option.note}</small></span></button>`).join('')}</div>
    <div class="puzzle-feedback" role="status" aria-live="polite">${solved ? `${icon('check')} 踏板穩穩的，紙船接回來了。` : bridgeAnswer.length === 2 ? '這樣好像還不夠穩，再想想。' : '木板負責跨過缺口，繩子負責固定。'}</div>
    <div class="puzzle-actions"><button type="button" class="text-button" data-action="puzzle-reset">重新挑一次</button></div>
  </div>`;
}

function sortPuzzle(): string {
  const letters = [
    { id: 'flower', label: '給花店的問候', clue: '收件地址：轉角奶油香', icon: 'flower' },
    { id: 'fish', label: '給小溪的明信片', clue: '收件地址：嘩啦嘩啦的地方', icon: 'fish' },
    { id: 'moon', label: '給山丘的晚安', clue: '收件地址：離天空最近', icon: 'moon' },
  ];
  const boxes = [
    { id: 'bakery', label: '麵包店', icon: 'bread' },
    { id: 'brook', label: '小溪邊', icon: 'boat' },
    { id: 'hill', label: '山丘', icon: 'sun' },
  ];
  const solved = state.solved.includes('sorting');
  const selected = letters.find(letter => letter.id === sortSelection);
  return `<div class="puzzle-card" role="group" aria-labelledby="puzzle-title">
    <div class="puzzle-head"><span class="puzzle-kicker">郵局的小幫手</span><h3 id="puzzle-title">把三封信送回對的信箱</h3><p>先選一封信，再點它要去的信箱。</p></div>
    <div class="sort-letters" aria-label="待分類的信">${letters.map(letter => `<button type="button" class="sort-letter${sortSelection === letter.id ? ' selected' : ''}${sortedLetters.includes(letter.id) ? ' sorted' : ''}" data-action="sort-pick" data-letter="${letter.id}" aria-pressed="${sortSelection === letter.id}" ${sortedLetters.includes(letter.id) || solved ? 'disabled' : ''}>${icon(letter.icon)}<span>${letter.label}<small>${letter.clue}</small></span></button>`).join('')}</div>
    <div class="sort-boxes" aria-label="三個信箱">${boxes.map(box => `<button type="button" class="sort-box" data-action="sort-drop" data-box="${box.id}" aria-label="投進${box.label}的信箱" ${!selected || solved ? 'disabled' : ''}>${icon(box.icon)}<span>${box.label}</span></button>`).join('')}</div>
    <div class="puzzle-feedback" role="status" aria-live="polite">${solved ? `${icon('check')} 三封信都找到家了。` : selected ? `正在處理：${selected.label}` : '先點一封信，讀讀地址線索。'}</div>
  </div>`;
}

function puzzleSheet(): string {
  const node = nodes[state.node];
  if (!node.puzzle) return '';
  const content = node.puzzle === 'baking' ? bakePuzzle() : node.puzzle === 'bridge' ? bridgePuzzle() : sortPuzzle();
  return `<section class="puzzle-overlay" role="dialog" aria-modal="true" aria-label="小謎題" tabindex="-1">
    <div class="puzzle-board"><div class="puzzle-moment" data-puzzle="${node.puzzle}">
      ${bearSprite(moment, 'puzzle-bear')}
      <p class="puzzle-moment-caption" role="status">${moment.caption}</p>
    </div>${content}</div>
    <button type="button" class="text-button puzzle-close" data-action="puzzle-close">先回到故事</button></section>`;
}

function finalContent(): string {
  const ending = endings[state.ending || pickEnding(state)];
  const memoryStrip = `<div class="memory-strip" aria-label="今天收集的小事">${state.memories.map(id => `<span class="memory-token" title="${memories[id].name}">${icon(memories[id].icon)}<small>${memories[id].name}</small></span>`).join('')}</div>`;
  return `<section class="ending-card" aria-labelledby="ending-title">
    <span class="ending-icon">${icon(ending.icon)}</span>
    <p class="eyebrow">A SMALL, GOOD DAY</p>
    <h2 id="ending-title">${ending.title}</h2>
    <p class="ending-subtitle">${ending.subtitle}</p>
    <p class="ending-text">${displayText(ending.text)}</p>
    ${memoryStrip}
    ${letterPreview()}
    <div class="ending-stats"><span>${icon('heart')} 溫柔 ${state.warmth}</span><span>${icon('star')} 勇氣 ${state.courage}</span><span>${icon('book')} 回憶 ${state.memories.length} / 5</span></div>
    <div class="ending-actions">
      <button type="button" class="primary-button" data-action="ending-journal">看看全部結局 ${icon('book')}</button>
      <button type="button" class="secondary-button" data-action="restart">再走一次今天 ${icon('sun')}</button>
    </div>
    <p class="ending-hint">${ending.hint}</p>
  </section>`;
}

function render(): void {
  const node = nodes[state.node];
  const chapter = chapters[chapterIndex(node.chapter)];
  const continueAllowed = canContinue(state);
  const puzzleSolved = node.puzzle ? state.solved.includes(node.puzzle) : true;
  const dialogue = node.final ? finalContent() : `<div class="dialogue">
      <div class="speaker-row"><span class="speaker">${escapeHtml(node.speaker)}</span><span class="chapter-time">${chapter.time}</span></div>
      ${node.text ? `<p class="dialogue-text">${displayText(node.text)}</p>` : ''}
      ${node.choices ? `<div class="choices" role="group" aria-label="選擇">${node.choices.map((choice, index) => `<button type="button" class="choice" data-action="choice" data-choice="${index}"><span class="choice-main">${escapeHtml(choice.text)}</span><span class="choice-note">${escapeHtml(choice.note)}</span></button>`).join('')}</div>` : ''}
      ${node.puzzle ? `<div class="puzzle-prompt">${puzzleSolved ? `<button type="button" class="text-button" data-action="puzzle-open">${icon('check')} 看看做好的成果</button>` : `<button type="button" class="primary-button small" data-action="puzzle-open">${icon(node.puzzle === 'baking' ? 'bread' : node.puzzle === 'bridge' ? 'wood' : 'stamp')} 開始小任務</button>`}</div>` : ''}
      ${node.next && !node.choices ? `<button type="button" class="continue-button" data-action="continue" ${continueAllowed ? '' : 'disabled'}>${continueAllowed ? (node.required ? '繼續出發' : '繼續') : (node.explore ? '先看看周圍' : '完成小任務後繼續')} ${icon('check')}</button>` : ''}
    </div>`;
  app.innerHTML = `<div class="story-shell chapter-${node.chapter}">
    ${header()}
    ${chapterRail(node.chapter)}
    <main class="stage">
      <div class="scene-panel">
        <div class="scene-frame" data-actor-position="${actorPosition(node.chapter, moment)}" data-bear-pose="${moment.pose}" data-letter-taken="${state.inventory.includes('letter')}" data-umbrella-taken="${state.inventory.includes('umbrella')}" data-boat-rescued="${state.solved.includes('bridge') || state.flags.includes('waited')}">
          ${sceneArt(node.chapter)}
          <span class="scene-weather">${icon(chapter.weather)} ${chapter.weather === 'cloud' ? '小雨轉陰' : chapter.weather === 'umbrella' ? '雨停了' : '雲隙光'}</span>
          <span class="scene-place">${chapter.note}<small>${chapter.time}</small></span>
          ${hotspots()}
          ${bearSprite(moment, 'bear')}
          ${['bakery', 'bridge', 'hill'].includes(node.chapter) ? `<img class="rabbit" src="./characters/usagi-full.webp" alt="兔兔，小熊的朋友" width="240" height="340" />` : ''}
        </div>
        <p class="moment-caption" role="status">${icon('heart')}<span>${moment.caption}</span></p>
        ${inventoryBar()}
      </div>
      ${dialogue}
    </main>
    <footer class="stage-footer"><span>第 ${String(chapterIndex(node.chapter) + 1).padStart(2, '0')} / 05 章</span><span>${icon('save')} 進度會自動保存在這台裝置</span></footer>
    ${sheetOpen ? journalSheet() : ''}
    ${helpOpen ? helpSheet() : ''}
    ${activePuzzle ? puzzleSheet() : ''}
  </div>`;
  bind();
  save();
  requestAnimationFrame(() => {
    if (node.final && !endingIds.includes(state.ending!)) {
      endingIds.push(state.ending!);
      save();
      chime();
    }
  });
}

function journalSheet(): string {
  return `<div class="sheet-backdrop" data-action="close-journal"></div>
  <section class="journal-sheet" role="dialog" aria-modal="true" aria-labelledby="journal-title" tabindex="-1">
    <div class="sheet-head"><div><p class="eyebrow">TODAY'S LITTLE THINGS</p><h2 id="journal-title">今天的小小收藏</h2></div><button type="button" class="icon-button" data-action="close-journal" aria-label="關閉收藏">${icon('close')}</button></div>
    <div class="journal-grid">
      <section aria-labelledby="memories-title"><h3 id="memories-title">回憶 ${state.memories.length} / 5</h3><ul class="memory-list">${Object.entries(memories).map(([id, memory]) => {
        const found = state.memories.includes(id as keyof typeof memories);
        return `<li class="${found ? 'found' : 'locked'}">${icon(found ? memory.icon : 'question')}<span><strong>${found ? memory.name : '還沒遇見'}</strong><small>${found ? memory.description : '繼續往前走，就會慢慢遇見。'}</small></span></li>`;
      }).join('')}</ul></section>
      <section aria-labelledby="endings-title"><h3 id="endings-title">結局 ${endingIds.length} / 4</h3><ul class="ending-list">${Object.entries(endings).map(([id, ending]) => {
        const found = endingIds.includes(id);
        return `<li class="${found ? 'found' : 'locked'}">${icon(found ? ending.icon : 'question')}<span><strong>${found ? ending.title : '？？？'}</strong><small>${found ? ending.subtitle : '換一種心情，也許會走到。'}</small></span></li>`;
      }).join('')}</ul></section>
    </div>
    <div class="sheet-foot"><span>${icon('heart')} 溫柔 ${state.warmth}</span><span>${icon('star')} 勇氣 ${state.courage}</span><button type="button" class="text-button" data-action="restart">重新開始今天</button></div>
  </section>`;
}

function helpSheet(): string {
  return `<div class="sheet-backdrop" data-action="close-journal"></div>
  <section class="journal-sheet help-sheet" role="dialog" aria-modal="true" aria-labelledby="help-title" tabindex="-1">
    <div class="sheet-head"><div><p class="eyebrow">HOW TO WANDER</p><h2 id="help-title">慢慢走就好</h2></div><button type="button" class="icon-button" data-action="close-journal" aria-label="關閉說明">${icon('close')}</button></div>
    <ul class="help-list">
      <li>${icon('letter')}<span><strong>點發亮的小標籤</strong><small>看看場景裡的東西，會撿到小物件或回憶。</small></span></li>
      <li>${icon('heart')}<span><strong>選一個心情</strong><small>選擇會改變溫柔與勇氣，也會影響最後的結局。</small></span></li>
      <li>${icon('star')}<span><strong>完成小任務</strong><small>烤麵包、修踏板、分信件，都可以慢慢試。</small></span></li>
      <li>${icon('heart')}<span><strong>每個點擊都有回應</strong><small>小熊會換一個動作、走到物件旁邊；拿走信或傘之後，場景也會跟著改變。</small></span></li>
      <li>${icon('save')}<span><strong>不用怕走錯</strong><small>進度自動保存；可以隨時從封面繼續，或重新開始。</small></span></li>
    </ul>
    <p class="key-hint">鍵盤：<kbd>Tab</kbd> 移動焦點，<kbd>Enter</kbd> 或 <kbd>空白</kbd> 確認，<kbd>Esc</kbd> 關閉視窗。</p>
  </section>`;
}

function bind(): void {
  if (sheetOpen || helpOpen || activePuzzle) {
    const dialog = document.querySelector<HTMLElement>('[role="dialog"]');
    if (dialog && !dialog.contains(document.activeElement)) dialog.focus();
  }
}

function action(name: string, element: HTMLElement): void {
  const data: Record<string, string | undefined> = { ...element.dataset };
  switch (name) {
    case 'continue':
      if (!canContinue(state)) return;
      state = advance(state);
      tone(392, 0.08);
      break;
    case 'choice': {
      const index = Number(element.dataset.choice);
      state = choose(state, index);
      tone(index === 0 ? 440 : 523, 0.1);
      break;
    }
    case 'inspect': {
      const hotspotId = element.dataset.hotspot!;
      const hotspot = nodes[state.node].explore?.find(item => item.id === hotspotId);
      if (!hotspot) return;
      state = inspect(state, hotspotId);
      tone(660, 0.09);
      toast(hotspot.text);
      break;
    }
    case 'journal':
      focusReturn = '[data-action="journal"]';
      sheetOpen = true;
      break;
    case 'help':
      focusReturn = '[data-action="help"]';
      helpOpen = true;
      break;
    case 'close-journal':
      sheetOpen = false;
      helpOpen = false;
      break;
    case 'sound':
      sound = !sound;
      localStorage.setItem(SOUND_KEY, sound ? 'on' : 'off');
      tone(523, 0.1);
      break;
    case 'item': {
      const item = items[element.dataset.item as keyof typeof items];
      if (item) toast(`${item.name}：${item.description}`);
      break;
    }
    case 'puzzle-open':
      focusReturn = '[data-action="puzzle-open"]';
      activePuzzle = nodes[state.node].puzzle || null;
      break;
    case 'puzzle-close':
      activePuzzle = null;
      break;
    case 'puzzle-reset':
      bakingAnswer = [];
      bridgeAnswer = [];
      sortSelection = null;
      sortedLetters = [];
      break;
    case 'bake-step': {
      const step = element.dataset.step!;
      if (bakingAnswer.includes(step)) return;
      bakingAnswer.push(step);
      if (bakingAnswer.length === 3) {
        if (validPuzzle('baking', bakingAnswer)) {
          state = solve(state, bakingAnswer);
          chime();
        } else {
          data.result = 'retry';
          tone(196, 0.2, 'triangle', 0.02);
        }
      } else tone(523 + bakingAnswer.length * 80, 0.08);
      break;
    }
    case 'bridge-material': {
      const material = element.dataset.material!;
      if (bridgeAnswer.includes(material)) return;
      bridgeAnswer.push(material);
      if (bridgeAnswer.length === 2) {
        if (validPuzzle('bridge', bridgeAnswer)) {
          state = solve(state, bridgeAnswer);
          chime();
        } else {
          data.result = 'retry';
          tone(196, 0.2, 'triangle', 0.02);
        }
      } else tone(523 + bridgeAnswer.length * 80, 0.08);
      break;
    }
    case 'sort-pick':
      sortSelection = element.dataset.letter || null;
      tone(600, 0.07);
      break;
    case 'sort-drop': {
      const box = element.dataset.box!;
      if (!sortSelection) return;
      if (mailDestinations[sortSelection] === box) {
        sortedLetters.push(sortSelection);
        sortSelection = null;
        tone(660, 0.09);
        if (validPuzzle('sorting', sortedLetters.map(letter => `${letter}:${mailDestinations[letter]}`))) {
          state = solve(state, sortedLetters.map(letter => `${letter}:${mailDestinations[letter]}`));
          chime();
        }
      } else {
        data.result = 'retry';
        tone(196, 0.2, 'triangle', 0.02);
        toast('這封信的地址好像不是這裡。再看看信封上的小字。');
        sortSelection = null;
      }
      break;
    }
    case 'ending-journal':
      focusReturn = '[data-action="ending-journal"]';
      sheetOpen = true;
      break;
    case 'restart':
      if (confirm('要重新開始今天嗎？這次的選擇會保留在回憶裡。')) {
        state = newGame();
        sheetOpen = false;
        helpOpen = false;
        activePuzzle = null;
        bakingAnswer = [];
        bridgeAnswer = [];
        sortSelection = null;
        sortedLetters = [];
      } else return;
      break;
    default:
      return;
  }
  moment = clickMoment(state, name, data, moment);
  render();
  if (['close-journal', 'puzzle-close'].includes(name) && focusReturn) {
    document.querySelector<HTMLElement>(focusReturn)?.focus();
  }
}

function trapFocus(event: KeyboardEvent): void {
  const dialog = document.querySelector<HTMLElement>('[role="dialog"]');
  if (!dialog) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    sheetOpen = false;
    helpOpen = false;
    activePuzzle = null;
    moment = storyMoment(state, moment);
    render();
    if (focusReturn) document.querySelector<HTMLElement>(focusReturn)?.focus();
    return;
  }
  if (event.key !== 'Tab') return;
  const focusable = [...dialog.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex="0"]')];
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable.at(-1)!;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

document.addEventListener('keydown', trapFocus);

document.addEventListener('click', event => {
  const element = (event.target as HTMLElement).closest<HTMLElement>('[data-action]');
  if (element) action(element.dataset.action!, element);
});

render();

if (reduceMotion) document.documentElement.classList.add('reduce-motion');
