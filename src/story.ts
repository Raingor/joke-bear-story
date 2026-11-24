export type ChapterId = 'home' | 'bakery' | 'bridge' | 'post' | 'hill';
export type ItemId = 'letter' | 'umbrella' | 'bread' | 'stamp';
export type MemoryId = 'tea' | 'bread' | 'boat' | 'stamp' | 'sunset';
export type EndingId = 'tomorrow' | 'together' | 'brave' | 'rest';
export type PuzzleId = 'baking' | 'bridge' | 'sorting';

export interface Effect {
  warmth?: number;
  courage?: number;
  memory?: MemoryId;
  item?: ItemId;
  flag?: string;
}

export interface Choice {
  text: string;
  note: string;
  next: string;
  effect?: Effect;
}

export interface Hotspot {
  id: string;
  label: string;
  icon: string;
  x: number;
  y: number;
  text: string;
  effect?: Effect;
}

export interface StoryNode {
  id: string;
  chapter: ChapterId;
  speaker: string;
  text: string;
  next?: string;
  choices?: readonly Choice[];
  explore?: readonly Hotspot[];
  required?: readonly string[];
  puzzle?: PuzzleId;
  final?: boolean;
}

export const chapters: readonly { id: ChapterId; title: string; time: string; note: string; weather: string }[] = [
  { id: 'home', title: '一封沒有郵票的信', time: '上午 10:08', note: '小熊的房間', weather: 'cloud' },
  { id: 'bakery', title: '剛剛好的不完美', time: '中午 12:16', note: '轉角麵包店', weather: 'cloud' },
  { id: 'bridge', title: '在小橋上停一下', time: '下午 2:32', note: '風鈴小橋', weather: 'umbrella' },
  { id: 'post', title: '把心意放對地方', time: '下午 4:05', note: '森林小郵局', weather: 'sun' },
  { id: 'hill', title: '日落會等一等你', time: '傍晚 5:47', note: '小鎮後的山丘', weather: 'sun' },
];

export const items: Record<ItemId, { name: string; icon: string; description: string }> = {
  letter: { name: '未寄出的信', icon: 'letter', description: '收件人是「明天的我」。信紙背面有一行小字：記得去看看日落。' },
  umbrella: { name: '小黃傘', icon: 'umbrella', description: '有一點歪，但還是能替兩個朋友遮雨。' },
  bread: { name: '雲朵麵包', icon: 'bread', description: '親手烤的，形狀不太圓。香氣倒是一點也沒少。' },
  stamp: { name: '山丘郵票', icon: 'stamp', description: '郵戳上寫著：慢慢來，也會到。' },
};

export const memories: Record<MemoryId, { name: string; icon: string; description: string }> = {
  tea: { name: '出門前的熱茶', icon: 'tea', description: '茶沒有催我。今天也不用急著變得很厲害。' },
  bread: { name: '一朵歪歪的雲', icon: 'bread', description: '麵包有一角烤焦了。朋友說，那一角最香。' },
  boat: { name: '接住的小紙船', icon: 'boat', description: '停下來的幾分鐘，原來也可以是今天最重要的事。' },
  stamp: { name: '慢慢來郵戳', icon: 'stamp', description: '把別人的心意送到，也替自己找到了一枚郵票。' },
  sunset: { name: '橘子汽水色的天空', icon: 'sun', description: '什麼大事都沒發生。但我會記得這個傍晚。' },
};

export const endings: Record<EndingId, { title: string; subtitle: string; icon: string; text: string; hint: string }> = {
  tomorrow: {
    title: '把普通日子，寄給明天', subtitle: '一封終於寄出的信', icon: 'letter',
    text: '小熊把今天的小事一件件寫進信裡：熱茶、歪麵包、接住的紙船，還有陪自己看日落的人。\n「原來，這樣就已經是很好的一天了。」\n郵筒輕輕響了一聲。明天的自己，會收到這份心意。',
    hint: '留意沿途的小事、幫助朋友，最後把今天的溫柔寫下來。',
  },
  together: {
    title: '有人等你，慢慢來', subtitle: '兩個人的日落', icon: 'heart',
    text: '兔兔把最後一小塊麵包放在小熊手心。\n「你今天一直替別人停下來。現在，換我陪你。」\n信還沒寫完也沒有關係。小熊第一次發現，有人坐在旁邊的時候，連安靜都暖暖的。',
    hint: '在麵包店或小橋上，多替朋友留一點位置。',
  },
  brave: {
    title: '第一次，也能自己出發', subtitle: '一個人的小小遠行', icon: 'star',
    text: '小熊在信上寫：「今天的我，有一點害怕，還是出門了。」\n原來勇敢不用走得很遠。走出房門、問一句話、試一次沒做過的事，都可以算。\n小熊把信投進郵筒，輕輕替自己拍了兩下手。',
    hint: '多試試主動出發、親手嘗試，再把那份勇氣寫給明天。',
  },
  rest: {
    title: '今天先休息，也沒關係', subtitle: '留給自己的空白頁', icon: 'moon',
    text: '小熊想了很久，最後只寫了一句：「今天辛苦了。」\n沒有完整的計畫，沒有漂亮的字，也沒有一定要完成的事。\n小熊把信收回包裡。等想寫的時候再寫吧。今天能好好休息，也很了不起。',
    hint: '聽聽自己想休息的聲音，信可以留到準備好的時候。',
  },
};

export const story: readonly StoryNode[] = [
  { id: 'wake', chapter: 'home', speaker: '旁白', text: '雨滴答、滴答。小熊今天原本的計畫是——\n嗯，再想五分鐘。', next: 'letter-notice' },
  { id: 'letter-notice', chapter: 'home', speaker: '小熊', text: '「咦？桌上怎麼有封信？」\n封面是自己的字跡。收件人那一欄，寫著「明天的我」。', next: 'home-search' },
  {
    id: 'home-search', chapter: 'home', speaker: '旁白', text: '先把信收好，再帶把傘吧。\n房間裡似乎還藏著一點出發的勇氣。點點看發亮的小標籤。',
    next: 'read-letter', required: ['desk', 'umbrella'],
    explore: [
      { id: 'desk', label: '桌上的信', icon: 'letter', x: 69, y: 41, text: '「給明天的我：如果又覺得自己什麼都沒做好，記得去山丘看看日落。」\n下面還空著好大一片。這封信，原來還沒寫完。', effect: { item: 'letter' } },
      { id: 'umbrella', label: '帶上小黃傘', icon: 'umbrella', x: 14, y: 50, text: '小黃傘有一根傘骨歪了。小熊認真看了看：「嗯……跟我很配。」', effect: { item: 'umbrella' } },
      { id: 'tea', label: '還溫著的茶', icon: 'tea', x: 87, y: 45, text: '喝一小口。呼——\n不急著做出決定，也是一個不錯的決定。', effect: { memory: 'tea' } },
    ],
  },
  { id: 'read-letter', chapter: 'home', speaker: '小熊', text: '「山丘啊……要經過麵包店、小橋，還有郵局。」\n小熊看著還沒寫完的信。也許今天，可以替空白的地方找點內容。', next: 'leave-choice' },
  {
    id: 'leave-choice', chapter: 'home', speaker: '旁白', text: '把門打開一條縫。雨比剛才小了一點。\n今天，想帶著什麼心情出發？',
    choices: [
      { text: '有點害怕，還是去看看', note: '給自己一點小小勇氣', next: 'leave-brave', effect: { courage: 1 } },
      { text: '順路買點好吃的吧', note: '讓胃先替心情打氣', next: 'leave-soft' },
    ],
  },
  { id: 'leave-brave', chapter: 'home', speaker: '小熊', text: '「只是看看天空。應該……不需要很擅長吧？」\n小熊深呼吸，跨過了門檻。這一步，已經算數了。', next: 'bakery-arrive' },
  { id: 'leave-soft', chapter: 'home', speaker: '小熊', text: '「如果走不動了，至少還有麵包。」\n這個理由聽起來很可靠。小熊立刻放心了一點。', next: 'bakery-arrive' },
  { id: 'bakery-arrive', chapter: 'bakery', speaker: '旁白', text: '轉角飄來奶油香。兔兔正隔著櫥窗，認真研究最後一個雲朵麵包。\n小熊的肚子先開口了。', next: 'bakery-talk' },
  { id: 'bakery-talk', chapter: 'bakery', speaker: '兔兔', text: '「最後一個，被我盯到賣掉了……」\n店主探出頭：「還有麵糰喔。要不要自己烤一個？形狀隨便，都會香。」', next: 'bake-choice' },
  {
    id: 'bake-choice', chapter: 'bakery', speaker: '小熊', text: '自己烤麵包？小熊看了看圓滾滾的手。\n好像……也不是完全不行。',
    choices: [
      { text: '讓我試一次！', note: '做得歪歪的也可以', next: 'bake-puzzle', effect: { courage: 1 } },
      { text: '兔兔，我們一起做', note: '兩個人一起手忙腳亂', next: 'bake-puzzle', effect: { warmth: 1 } },
    ],
  },
  { id: 'bake-puzzle', chapter: 'bakery', speaker: '店主', text: '「小配方：先揉麵，把空氣揉進去；再發酵，給它一點時間；最後烘烤。」\n把三張步驟卡，照順序放進配方裡吧。', puzzle: 'baking', next: 'bread-done' },
  { id: 'bread-done', chapter: 'bakery', speaker: '小熊', text: '叮——！\n麵包出爐了。有一角比較黑，另一角看起來像耳朵。\n「是……很有個性的雲。」', next: 'bread-choice' },
  {
    id: 'bread-choice', chapter: 'bakery', speaker: '旁白', text: '兔兔的鼻子動了一下，假裝在看窗外。\n要怎麼收好這份剛出爐的快樂？',
    choices: [
      { text: '分一半給兔兔', note: '把最香的那一角留下來', next: 'bread-share', effect: { warmth: 1, flag: 'shared' } },
      { text: '包起來，留到日落時吃', note: '給自己準備一份小野餐', next: 'bread-pack' },
    ],
  },
  { id: 'bread-share', chapter: 'bakery', speaker: '兔兔', text: '「這一角才不是烤焦，是多一點點香。」\n兔兔咬了一口。小熊忽然覺得，這可能是自己做過最成功的東西。', next: 'bridge-arrive' },
  { id: 'bread-pack', chapter: 'bakery', speaker: '小熊', text: '小熊把麵包小心包好，在紙袋上畫了一顆星。\n「現在就開始期待傍晚了。」兔兔說：「真好，我也想看看那片天空。」', next: 'bridge-arrive' },
  { id: 'bridge-arrive', chapter: 'bridge', speaker: '旁白', text: '小橋邊的風鈴輕輕響。兔兔追上來時，一隻紙船正卡在低低的岸邊。\n「糟了！那是我折了一整個早上的船。」', next: 'bridge-choice' },
  {
    id: 'bridge-choice', chapter: 'bridge', speaker: '小熊', text: '只是旁邊的取船小踏板鬆了，小橋本身很穩。\n小熊看看天空，距離日落還有一段時間。',
    choices: [
      { text: '停一下，一起把船接回來', note: '幫兔兔修好岸邊的小踏板', next: 'bridge-puzzle', effect: { warmth: 1, flag: 'helped' } },
      { text: '替兔兔撐傘，陪牠等船漂回來', note: '有些時候，陪著就很好', next: 'bridge-wait', effect: { warmth: 1, flag: 'waited' } },
      { text: '相信兔兔，先到郵局問路', note: '各走一段，山丘再見', next: 'bridge-alone', effect: { courage: 1 } },
    ],
  },
  { id: 'bridge-puzzle', chapter: 'bridge', speaker: '兔兔', text: '「不用下水喔！只要修好岸上的小踏板就碰得到船。」\n挑兩樣能固定踏板的材料。長木板跨過缺口，再用繩子綁緊。', puzzle: 'bridge', next: 'bridge-fixed' },
  { id: 'bridge-fixed', chapter: 'bridge', speaker: '旁白', text: '木板搭好了，繩結也繫緊了。兔兔站在乾乾的踏板上，伸手接回紙船。\n船裡竟然還坐著一片小葉子。「乘客沒有淋濕，太好了。」', next: 'post-arrive' },
  { id: 'bridge-wait', chapter: 'bridge', speaker: '旁白', text: '兩個朋友擠在小黃傘下。歪掉的傘骨剛好替兔兔留了一個位置。\n風輕輕一轉，紙船自己靠了岸。\n原來，等一等也有等一等的方法。', next: 'post-arrive' },
  { id: 'bridge-alone', chapter: 'bridge', speaker: '兔兔', text: '「你先去吧！我有辦法。山丘上見！」\n小熊點點頭。這次沒有反覆確認自己會不會走錯，只是慢慢往前走。', next: 'post-arrive' },
  { id: 'post-arrive', chapter: 'post', speaker: '旁白', text: '郵局的紅屋頂從樹葉間冒出來。門口的黑板寫著：\n「沒有說出口的話，也歡迎投遞。」', next: 'post-talk' },
  { id: 'post-talk', chapter: 'post', speaker: '郵局伯伯', text: '「寄給明天的自己？好收件人呀。」\n伯伯翻了翻抽屜：「幫我把三封信分好，我就送你一枚山丘郵票。」', next: 'sort-puzzle' },
  { id: 'sort-puzzle', chapter: 'post', speaker: '旁白', text: '每封信都有一條地址線索。先選一封信，再點它要去的信箱。\n不用猜，仔細讀讀信封上的小字。', puzzle: 'sorting', next: 'post-stamp' },
  { id: 'post-stamp', chapter: 'post', speaker: '郵局伯伯', text: '「都送對了。你看，讀懂心意，比認得路還重要。」\n郵票上畫著一座小山。郵戳是五個字：「慢慢來，也會到。」', next: 'post-choice' },
  {
    id: 'post-choice', chapter: 'post', speaker: '郵局伯伯', text: '「對了，你的信還有好多空白呢。想好要寫什麼了嗎？」',
    choices: [
      { text: '好像，有一點想寫的事了', note: '把沿路的小事放在心上', next: 'post-heart', effect: { warmth: 1 } },
      { text: '先到山丘，再慢慢想', note: '留白也可以一起帶著走', next: 'post-blank' },
    ],
  },
  { id: 'post-heart', chapter: 'post', speaker: '小熊', text: '小熊數了數口袋裡的小東西，忽然有點驚訝。\n「我今天，原來沒有什麼都沒做。」', next: 'hill-arrive' },
  { id: 'post-blank', chapter: 'post', speaker: '郵局伯伯', text: '「很好啊。信不是考卷，沒有交卷時間。」\n伯伯把筆也借給小熊。「要是只畫一片雲，也很不錯。」', next: 'hill-arrive' },
  { id: 'hill-arrive', chapter: 'hill', speaker: '旁白', text: '最後一段小坡，比想像中短。雨停了。\n天空像一瓶慢慢打開的橘子汽水，雲是浮在上面的泡泡。', next: 'hill-search' },
  {
    id: 'hill-search', chapter: 'hill', speaker: '小熊', text: '「真的……到了。」\n先把腳步放下來吧。看看天空，也看看長椅旁有什麼。',
    next: 'hill-talk', required: ['sunset'],
    explore: [
      { id: 'sunset', label: '收好這片日落', icon: 'sun', x: 65, y: 26, text: '雲邊透著金色的光。小熊沒有急著拿出信。\n先好好看一會兒。眼前這一刻，不需要被完成。', effect: { memory: 'sunset' } },
      { id: 'bench', label: '坐一小會兒', icon: 'heart', x: 70, y: 68, text: '長椅上放著一張小紙條：\n「我去拿熱可可。位子幫你留著。——兔兔」\n小熊的心，忽然也有了一個可以坐下來的地方。', effect: { flag: 'bench' } },
      { id: 'mailbox', label: '山丘上的郵筒', icon: 'letter', x: 22, y: 50, text: '「下一次收信：明天。」\n今天還沒有寫完也不會錯過什麼。明天，還會來。', effect: { flag: 'mailbox' } },
    ],
  },
  { id: 'hill-talk', chapter: 'hill', speaker: '兔兔', text: '「我來了！可可還燙著。」\n兔兔在小熊旁邊坐下。「所以，今天是怎樣的一天？」', next: 'last-choice' },
  {
    id: 'last-choice', chapter: 'hill', speaker: '旁白', text: '小熊攤開信紙。這次，空白看起來不再那麼大了。\n想把哪一句話，留給明天的自己？',
    choices: [
      { text: '今天的小事，我都有好好收下', note: '把平凡的溫柔寄出去', next: 'finish', effect: { flag: 'write-warm' } },
      { text: '我有點害怕，還是走到了這裡', note: '替今天勇敢的自己蓋個章', next: 'finish', effect: { courage: 1, flag: 'write-brave' } },
      { text: '今天辛苦了，其他的明天再說', note: '把這一頁，溫柔地留白', next: 'finish', effect: { flag: 'write-rest' } },
    ],
  },
  { id: 'finish', chapter: 'hill', speaker: '旁白', text: '', final: true },
];

export const nodes = Object.fromEntries(story.map(node => [node.id, node])) as Record<string, StoryNode>;

export const puzzleRewards: Record<PuzzleId, Effect[]> = {
  baking: [{ item: 'bread' }, { memory: 'bread' }],
  bridge: [{ memory: 'boat' }],
  sorting: [{ item: 'stamp' }, { memory: 'stamp' }],
};
