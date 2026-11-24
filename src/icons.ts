const paths: Record<string, string> = {
  letter: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>',
  heart: '<path d="M12 20S3 15 3 8.5C3 3 10 2 12 7c2-5 9-4 9 1.5C21 15 12 20 12 20Z"/>',
  star: '<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/>',
  bag: '<rect x="5" y="7" width="14" height="14" rx="4"/><path d="M9 7V5a3 3 0 0 1 6 0v2M5 12h14M9 16h6"/>',
  book: '<path d="M12 6C8 3 4 4 3 5v15c3-2 6-1 9 1 3-2 6-3 9-1V5c-1-1-5-2-9 1Zm0 0v15"/>',
  music: '<path d="M10 17V5l10-2v12M10 9l10-2"/><ellipse cx="7" cy="18" rx="3" ry="2.5"/><ellipse cx="17" cy="16" rx="3" ry="2.5"/>',
  muted: '<path d="M10 17V5l10-2M10 9l4-.8M3 3l18 18"/><ellipse cx="7" cy="18" rx="3" ry="2.5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  cloud: '<path d="M6 18a5 5 0 1 1 .7-10A6 6 0 0 1 18 8a5 5 0 1 1 0 10Zm2 3v1m4-1v1m4-1v1"/>',
  umbrella: '<path d="M3 12a9 9 0 0 1 18 0H3Zm9-9v16a2 2 0 0 0 4 0M7 12c0-5 2-9 5-9s5 4 5 9"/>',
  bread: '<path d="M6 11C0 8 4 3 12 3s12 5 6 8v9H6Z"/><path d="m9 6-1 3m5-3-1 3"/>',
  leaf: '<path d="M20 3C8 2 2 8 5 15s15 3 15-12ZM4 21 16 8"/>',
  stamp: '<path d="M4 3h4l1 2 2-2h2l2 2 1-2h4v4l-2 1 2 2v4l-2 1 2 2v4h-4l-1-2-2 2h-2l-2-2-1 2H4v-4l2-2-2-1v-4l2-2-2-1Z"/><path d="m8 14 4-6 4 6Zm0 3h8"/>',
  tea: '<path d="M4 8h13v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Zm13 1h2a3 3 0 0 1 0 6h-2M8 3v2m5-2v2M2 22h18"/>',
  boat: '<path d="m2 15 10-4 10 4-5 6H7Zm10-4V2l7 9M12 2 5 11h7"/>',
  flower: '<path d="M12 21v-8m0 5 5-2M12 6c-5-8-10 2-4 4-8 4 0 10 4 4 4 6 12 0 4-4 6-2 1-12-4-4Z"/>',
  moon: '<path d="M20 15A9 9 0 0 1 9 3 9 9 0 1 0 20 15Z"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  save: '<path d="M5 3h12l4 4v14H3V3Zm2 0v7h10V3M7 21v-7h10v7"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 5 2.2c-1.5.7-2 1.3-2 2.8m0 3v.1"/>',
  home: '<path d="m3 11 9-8 9 8M5 10v11h14V10M10 21v-7h4v7"/>',
  thread: '<path d="M4 18c1-10 5-11 8-4 3 7 8 3 8-5M3 6l3-3 3 3M6 3v12"/>',
  fish: '<path d="M3 12c6-8 10-8 15-2l4-4v12l-4-4C13 20 9 20 3 12Z"/><circle cx="8" cy="11" r=".7"/>',
  wood: '<rect x="2" y="7" width="20" height="10" rx="2" transform="rotate(-10 12 12)"/><path d="m5 11 9-2m-6 6 10-2"/>',
  stone: '<path d="m3 16 3-9 8-3 7 7-1 8H7Z"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
};

export function icon(name: string, className = ''): string {
  return `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.star}</svg>`;
}
