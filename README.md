# 小熊與未寄出的信

Joke Bear 劇情向互動遊戲。五章、四種結局，約 8–12 分鐘一輪；支援手機、鍵盤、自動存檔與回憶收藏。

## 在線入口

- 遊戲網址：**https://raingor.github.io/joke-bear-story/**
- 原始碼：https://github.com/Raingor/joke-bear-story
- 站台入口：https://raingor.github.io/game-hub/（CC乐园「剧情」分类）

## 玩什麼

雨天早上，小熊發現一封寫給「明天的我」卻沒有郵票的信。玩家陪牠走過房間、麵包店、小橋、郵局與山丘，透過探索、選擇與三個小任務，決定最後留給明天的那句話。

- 五個場景章節，每章有可探索的小標籤
- 24 格角色姿態圖集：每次點擊都會換動作，並走到信件、茶杯、岸邊或長椅旁
- 三個小任務：烤雲朵麵包、修取船踏板、分揀三封信
- 溫柔與勇氣兩項數值，影響四種結局
- 回憶收藏（5 個）與結局圖鑑（4 個），保存在 `localStorage`
- 重新整理會回到目前進度；可從收藏面板重新開始

## 開發

```bash
npm ci --legacy-peer-deps
npm run dev        # http://localhost:5182
npm run build
npm run preview    # http://localhost:4182
```

Node >= 22.12。原生 TypeScript + DOM + CSS，Vite 建置，`base: './'`，沒有執行時期的兄弟目錄依賴。

## 測試

```bash
npm test           # 10 項劇情引擎測試：結局、謎題、存檔驗證
npm run test:browser  # 需先 npm run preview；Chrome 桌面與手機尺寸實測
```

瀏覽器測試會實際走完一輪到「寄給明天」結局，檢查錯誤順序被拒絕、道具與回憶、重新載入續玩、收藏面板、Esc 關閉、減少動態效果與水平溢出。

## 結構

- `src/story.ts`：章節、節點、選項、探索點、謎題與結局文字
- `src/engine.ts`：純函式狀態機、結局判定、謎題驗證、存檔解析與防竄改
- `src/main.ts`：畫面渲染、事件、音效、焦點管理
- `src/performances.ts`：24 種姿態、每個節點與點擊的動作對應、場景站位
- `src/scenes.ts`：五個場景的原生 SVG
- `src/style.css`：版式、動效與響應式樣式
- `scripts/browser.mjs`：Playwright 走查
- `public/characters/`：Joke Bear 與兔兔素材（沿用 `game-hub` 的 2D 版本）

`public/characters/bear-story-poses.png` 是 1536×1024 的 6×4 姿態圖集（每格 256×256），由 imagegen 以 `classic-full.webp` 為角色參考生成；`src/performances.ts` 用 SVG `viewBox` 逐格裁切，不另外切檔。

## 素材與界線

Joke Bear（自分ツッコミくま）角色版權屬於 nagano。本作為個人練習性質的粉絲向互動小品，不使用官方名義、不含商業廣告；若要公開發布或商用，請先確認授權。場景與 UI 圖示皆為本專案手繪的 inline SVG，沒有外部圖庫依賴。
