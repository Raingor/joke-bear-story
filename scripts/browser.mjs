import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const base = process.env.GAME_URL || 'http://127.0.0.1:4182/';
const out = fileURLToPath(new URL('../artifacts/', import.meta.url));
const errors = [];
const checks = [];
const poseMismatches = [];
let failure;

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const check = (name, value) => {
  assert.ok(value, name);
  checks.push(name);
  console.log('PASS', name);
};

async function open(width, height, touch) {
  const context = await browser.newContext({ viewport: { width, height }, isMobile: touch, hasTouch: touch, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(`${width} pageerror ${error.message}`));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(`${width} console ${msg.text()}`); });
  page.on('requestfailed', request => errors.push(`${width} requestfailed ${request.url()} ${request.failure()?.errorText}`));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${width} HTTP ${response.status()} ${response.url()}`); });
  await page.goto(base, { waitUntil: 'networkidle' });
  return { context, page };
}

const poseSnapshot = async page => {
  const puzzle = page.locator('.puzzle-bear').first();
  const bear = (await puzzle.count() && await puzzle.isVisible()) ? puzzle : page.locator('.bear').first();
  if (!await bear.count()) return null;
  return bear.evaluate(el => `${el.dataset.pose}:${el.dataset.variant}`);
};

const tap = async (page, selector, touch) => {
  const before = await poseSnapshot(page);
  const element = page.locator(selector).first();
  if (touch) await element.tap(); else await element.click();
  const after = await poseSnapshot(page);
  if (before && after && before === after) poseMismatches.push(selector);
};

const feedback = page => page.locator('.puzzle-feedback').textContent();

async function solvePuzzle(page, touch) {
  if (await page.locator('[data-step]').count()) {
    for (const step of ['knead', 'rest', 'bake']) await tap(page, `[data-step="${step}"]`, touch);
  } else if (await page.locator('[data-material]').count()) {
    for (const material of ['wood', 'rope']) await tap(page, `[data-material="${material}"]`, touch);
  } else {
    for (const [letter, box] of [['flower', 'bakery'], ['fish', 'brook'], ['moon', 'hill']]) {
      await tap(page, `[data-letter="${letter}"]`, touch);
      await tap(page, `[data-box="${box}"]`, touch);
    }
  }
}

async function playThrough(page, touch, { rejectFirstPuzzle = false } = {}) {
  let rejected = !rejectFirstPuzzle;
  for (let step = 0; step < 80; step++) {
    if (await page.locator('.ending-card').isVisible()) return;
    if (await page.locator('.puzzle-card').isVisible()) {
      const text = await feedback(page);
      if (/出爐|接回來|找到家/.test(text)) {
        await tap(page, '[data-action="puzzle-close"]', touch);
        continue;
      }
      if (!rejected) {
        rejected = true;
        for (const material of ['bake', 'rest', 'knead']) await tap(page, `[data-step="${material}"]`, touch);
        if (!/怪怪的/.test(await feedback(page))) throw new Error('wrong baking order was not rejected');
        await tap(page, '[data-action="puzzle-reset"]', touch);
      }
      await solvePuzzle(page, touch);
      continue;
    }
    const choices = page.locator('[data-choice]');
    if (await choices.count()) {
      await tap(page, '[data-choice="0"]', touch);
      continue;
    }
    const hotspots = page.locator('.hotspot:not(.done)');
    if (await hotspots.count()) {
      await hotspots.first().click({ force: true });
      continue;
    }
    const next = page.locator('[data-action="continue"]');
    if (await next.count() && !await next.isDisabled()) {
      await tap(page, '[data-action="continue"]', touch);
      continue;
    }
    const puzzleOpen = page.locator('[data-action="puzzle-open"]');
    if (await puzzleOpen.count()) {
      await tap(page, '[data-action="puzzle-open"]', touch);
      continue;
    }
    throw new Error(`stuck at: ${(await page.locator('.dialogue-text').textContent()).slice(0, 60)}`);
  }
  throw new Error('story did not finish within 80 steps');
}

const noOverflow = page => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);

try {
  await mkdir(out, { recursive: true });

  for (const [width, height, touch] of [[1440, 960, false], [390, 844, true], [360, 780, true]]) {
    const label = `${width}${touch ? '-touch' : '-desktop'}`;
    const { context, page } = await open(width, height, touch);
    check(`${label}: bear atlas loads and the sprite is visible`, await page.evaluate(async () => {
      const image = new Image();
      image.src = './characters/bear-story-poses.png';
      await image.decode().catch(() => {});
      const sprite = document.querySelector('.bear');
      return image.naturalWidth === 1536 && !!sprite && sprite.getBoundingClientRect().width > 60;
    }));
    check(`${label}: first chapter and dialogue visible`, (await page.locator('.rail-dot').first().textContent()).includes('01') && await page.locator('.dialogue-text').isVisible());
    check(`${label}: no horizontal overflow`, await noOverflow(page));
    await page.screenshot({ path: `${out}/${label}-start.png`, fullPage: true, animations: 'disabled' });

    await tap(page, '[data-action="continue"]', touch);
    await tap(page, '[data-action="continue"]', touch);
    check(`${label}: three room hotspots are offered`, await page.locator('.hotspot').count() === 3);
    check(`${label}: continue is blocked before exploring`, await page.locator('[data-action="continue"]').isDisabled());
    await page.locator('[data-hotspot="desk"]').click({ force: true });
    await page.locator('[data-hotspot="umbrella"]').click({ force: true });
    check(`${label}: collecting adds inventory chips and unlocks continue`, await page.locator('.item-chip').count() === 2 && !await page.locator('[data-action="continue"]').isDisabled());
    check(`${label}: toast shows the hotspot story`, await page.locator('#toast').isVisible());
    check(`${label}: taking the letter removes it from the desk`, await page.locator('.scene-frame').getAttribute('data-letter-taken') === 'true');
    check(`${label}: umbrella leaves the room once carried`, await page.locator('.scene-frame').getAttribute('data-umbrella-taken') === 'true');
    await page.screenshot({ path: `${out}/${label}-room.png`, fullPage: true, animations: 'disabled' });

    await playThrough(page, touch, { rejectFirstPuzzle: true });
    check(`${label}: every click changed the bear pose`, poseMismatches.length === 0);
    check(`${label}: letter ending reached`, await page.locator('#ending-title').textContent().then(text => text.includes('寄給明天')));
    check(`${label}: five memories collected`, await page.locator('.memory-token').count() === 5);
    check(`${label}: letter shows the chosen line and stamp`, await page.locator('.letter-sheet').textContent().then(text => text.includes('好好收下') && text.includes('山丘郵票')));
    check(`${label}: ending has no horizontal overflow`, await noOverflow(page));
    await page.screenshot({ path: `${out}/${label}-ending.png`, fullPage: true, animations: 'disabled' });

    await page.reload({ waitUntil: 'networkidle' });
    check(`${label}: reload restores the ending`, await page.locator('.ending-card').isVisible() && await page.locator('#ending-title').textContent().then(text => text.includes('寄給明天')));

    await tap(page, '[data-action="ending-journal"]', touch);
    check(`${label}: journal opens with four ending slots`, await page.locator('.ending-list li').count() === 4);
    check(`${label}: collected ending is unlocked`, await page.locator('.ending-list li.found').count() >= 1);
    await page.screenshot({ path: `${out}/${label}-journal.png`, fullPage: true, animations: 'disabled' });
    await page.keyboard.press('Escape');
    check(`${label}: Escape closes the journal`, await page.locator('.journal-sheet').count() === 0);
    check(`${label}: bear atlas sprite points at a real cell`, await page.locator('.bear').evaluate(el => el.getAttribute('viewBox').split(' ').length === 4 && Number(el.dataset.frame) >= 0 && Number(el.dataset.frame) < 24));
    await context.close();
  }

  const { context, page } = await open(1440, 960, false);
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  check('desktop: first Tab lands on the brand link with visible focus', await page.evaluate(() => document.activeElement?.classList.contains('brand') && getComputedStyle(document.activeElement).outlineStyle !== 'none'));
  await page.locator('[data-action="help"]').focus();
  await page.keyboard.press('Enter');
  const helpOpen = await page.locator('.help-sheet').isVisible();
  await page.keyboard.press('Escape');
  check('desktop: help dialog opens and closes with Escape', helpOpen && await page.locator('.help-sheet').count() === 0);
  await context.close();

  const reduced = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const reducedPage = await reduced.newPage();
  await reducedPage.goto(base, { waitUntil: 'networkidle' });
  check('reduced motion: bear motion is effectively stopped', await reducedPage.evaluate(() => parseFloat(getComputedStyle(document.querySelector('.bear')).animationDuration) < 0.01 && getComputedStyle(document.documentElement).scrollBehavior === 'auto'));
  await reduced.close();

  check('no page, console, resource or failed-request errors', errors.length === 0);
} catch (error) {
  failure = error;
  console.error(error);
} finally {
  await writeFile(`${out}/browser-results.json`, JSON.stringify({ base, checks: checks.length, passed: checks, errors, failure: failure?.message || null }, null, 2));
  await browser.close();
}
if (failure) throw failure;
console.log(`Completed ${checks.length} checks.`);
