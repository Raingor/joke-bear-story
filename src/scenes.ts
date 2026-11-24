import type { ChapterId } from './story';

const ink = '#58604f';
const cloud = (x: number, y: number, scale = 1) => `<path d="M${x} ${y}c-23-21-55-8-52 13-29-2-38 34-10 39h120c32-5 23-42-5-40-4-29-39-38-53-12Z" fill="#fffaf0" opacity=".85" transform="translate(${x * (1 - scale)} ${y * (1 - scale)}) scale(${scale})"/>`;
const tree = (x: number, y: number, scale = 1, color = '#8caf94') => `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M0 0-5 122H9L7 0" fill="#be9978"/><path d="M-31 3c-45-12-41-63-13-72-8-42 46-67 69-35 42-7 66 36 44 61 26 39-21 68-45 44-13 28-45 20-55 2Z" fill="${color}" stroke="${ink}" stroke-width="2.5"/><path d="M4 45-11 27m17-9 19-19" stroke="${ink}" stroke-width="2.5" fill="none"/></g>`;
const flowers = (x: number, y: number) => `<g transform="translate(${x} ${y})" stroke="#73937a" stroke-width="2.4" fill="none"><path d="M0 0v-18m12 18v-8m-24 8v-11"/><g fill="#f5d8a5" stroke="none"><circle cy="-20" r="5"/><circle cx="12" cy="-10" r="4"/><circle cx="-12" cy="-13" r="4"/></g></g>`;
const hills = `<path d="M0 304Q148 200 320 302q180-113 330-9 178-112 310 9v228H0Z" fill="#bbd1b2"/><path d="M0 350q177-74 360 8 231-79 600-4v176H0Z" fill="#91b494"/>`;

const scenes: Record<ChapterId, string> = {
  home: `
    <rect width="960" height="530" fill="#dbe7da"/>
    <path d="M0 0h960v380H0Z" fill="url(#wallpaper)"/>
    <path d="M0 385h960v145H0Z" fill="#dfc9a3"/>
    <path d="M0 385h960M0 394h960" stroke="#ab977c" stroke-width="3"/>
    <path d="m120 395-40 135m230-135-15 135m230-135 15 135m230-135 40 135M0 455h960" stroke="#c6ae8d" stroke-width="2"/>
    <rect x="295" y="58" width="245" height="224" rx="108" fill="#a9c8bf" stroke="${ink}" stroke-width="5"/>
    <path d="M315 169q100-28 204 0v91H315Z" fill="#88ac9a"/>
    <path d="M417 60v222m-120-112h242" stroke="#fff6df" stroke-width="9"/>
    <path d="m335 100-8 19m51-31-8 19m87-10-8 19m38 66-8 19m-137-8-8 19m107 8-8 19" stroke="#edf2e4" stroke-width="3" opacity=".8"/>
    <path d="M283 70q-16 93-30 147l46 14 14-152m233-9q15 88 32 147l-46 14-14-152" fill="#edbd9c" stroke="${ink}" stroke-width="3"/>
    <path d="M280 66h269" stroke="${ink}" stroke-width="6" stroke-linecap="round"/>
    <path d="M280 286h274v14H280Z" fill="#f6e9c8" stroke="${ink}" stroke-width="3"/>
    <rect x="68" y="138" width="152" height="135" rx="8" fill="#c7b08a" stroke="${ink}" stroke-width="3"/>
    <path d="M70 207h149" stroke="${ink}" stroke-width="3"/>
    <g stroke="${ink}" stroke-width="2.5"><path d="M85 157h18v50H85Z" fill="#a1bcb0"/><path d="M109 163h17v44h-17Z" fill="#f4db9d"/><path d="m136 159 15-3 10 48-16 3Z" fill="#dca68e"/><path d="M87 224h31v34H87Z" fill="#ece4c9"/><path d="M125 232h67v25h-67Z" fill="#aab3a0"/></g>
    <g class="room-umbrella" transform="translate(162 358)" stroke="${ink}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M-26 0q-7-75 23-79 32 4 27 79Z" fill="#eecb69"/><path d="M-3-79v105q0 13 12 10" fill="none"/><path d="M-5-74-8-4M8-72 14-4" fill="none" opacity=".4"/></g>
    <ellipse cx="450" cy="451" rx="160" ry="46" fill="#c2caa0" stroke="#a3ac88" stroke-width="3"/>
    <ellipse cx="450" cy="451" rx="141" ry="34" fill="none" stroke="#e8e7bd" stroke-width="3" stroke-dasharray="7 6"/>
    <g stroke="${ink}" stroke-width="4" stroke-linejoin="round"><path d="m611 335-12 116m243-116 13 116" fill="none"/><path d="M592 316q122-16 277 0l-3 24H594Z" fill="#c6936d"/><path d="M615 340h225v24H615Z" fill="#dbb88a"/><path d="M699 349h31" stroke-width="3"/></g>
    <g class="room-letter" transform="translate(654 293) rotate(-9)" stroke="${ink}" stroke-width="2"><rect width="75" height="42" rx="3" fill="#fffae8"/><path d="m1 3 36 25L74 3" fill="none"/><path d="m53 7 11 0v11H53Z" fill="#df9a7e"/></g>
    <g class="room-tea" transform="translate(790 305)" stroke="${ink}" stroke-width="2.5"><path d="M-19-7h34v23q-16 19-34 0Z" fill="#f4e6c4"/><path d="M15-3c22-2 22 23 0 19M-11-20q-7-9 0-16m12 16q-7-9 0-16" fill="none"/><ellipse cy="24" rx="28" ry="5" fill="#b6c1a0"/></g>
    <g transform="translate(730 168)" stroke="${ink}" stroke-width="3"><rect x="-39" y="-46" width="78" height="91" rx="3" fill="#f6edcf" transform="rotate(4)"/><path d="m-21 18 22-35 22 35Z" fill="#a1b49a"/><circle cx="17" cy="-24" r="9" fill="#e7b66d" stroke="none"/></g>
    <g transform="translate(872 373)"><path d="M-22 0h47l-6 43h-35Z" fill="#d48f76" stroke="${ink}" stroke-width="3"/><path d="M1 0v-57m0 34c-31-28-31-48-9-29m11 12c27-31 42-22 16-1m-19 20c-26-3-35-19-20-22" fill="#88aa8b" stroke="${ink}" stroke-width="3"/></g>`,
  bakery: `
    <rect width="960" height="530" fill="#dae7dc"/>${cloud(120, 70, .85)}${cloud(790, 90, .9)}
    ${hills}
    <path d="M0 435q470-68 960 0v95H0Z" fill="#e8d7b7"/>
    ${tree(103, 292, 1.3)}${tree(869, 297, 1.2, '#9aaf82')}
    <g stroke="${ink}" stroke-width="4" stroke-linejoin="round"><path d="M278 161h442v250H278Z" fill="#f2d9b9"/><path d="m251 168 248-112 249 112Z" fill="#be826d"/><path d="M287 160h425" stroke="#e7b3a0" stroke-width="6"/>
    <rect x="307" y="224" width="182" height="146" rx="5" fill="#9cae9a"/><path d="M323 240h150v110H323Z" fill="#f6e7c3"/><path d="M398 240v110m-75-46h150" fill="none"/>
    <rect x="538" y="220" width="125" height="191" rx="55" fill="#a1b6a7"/><path d="M554 239h94v110h-94Z" fill="#f3e7c8"/><circle cx="641" cy="370" r="4" fill="${ink}"/>
    <path d="M285 180h425l24 54H262Z" fill="#f5e9cc"/><path d="m310 181-10 52h45l6-52m45 0-1 52h45l-2-52m45 0 5 52h45l-9-52m45 0 13 52h45l-17-52" fill="#dba18a" stroke="none"/>
    <path d="M263 234q24 19 47 0 23 19 47 0 24 19 47 0 24 19 47 0 24 19 47 0 24 19 47 0 24 19 47 0 24 19 47 0 24 19 47 0 24 19 39 0" fill="none"/>
    <rect x="435" y="93" width="128" height="56" rx="17" fill="#f5e8c9"/><path d="M480 117c-18-15 17-29 34-13 18 2 22 17 9 21v12h-47v-12c-9-2-7-8 4-8Z" fill="#d9ae71" stroke-width="2.5"/>
    <path d="M306 365h185v14H306Z" fill="#bd9671"/>
    <path d="M337 284c-21-13 30-33 30-6v14h-31Zm58 0c-18-13 21-31 22-6v14h-27Zm50 0c-19-15 28-31 28-6v14h-32Z" fill="#d6ac72" stroke-width="2"/>
    <rect x="762" y="329" width="78" height="94" rx="4" fill="#789083" transform="rotate(7 800 375)"/><path d="M775 353h48m-43 15h31m-28 17h25" stroke="#f6e8ca" stroke-width="3"/>
    </g>
    <path d="M275 419h447" stroke="#bba684" stroke-width="6" stroke-linecap="round"/>
    ${flowers(156, 438)}${flowers(878, 451)}
    <path d="M100 489q5-9 11 0m51-21q5-9 11 0m584 25q5-9 11 0" fill="none" stroke="#c5b78f" stroke-width="3"/>`,
  bridge: `
    <rect width="960" height="530" fill="#d8e7de"/>${cloud(180, 90, 1.1)}${cloud(785, 80, 1)}
    ${hills}
    <path d="M410 300q160 25 80 97L290 530h530L643 398q-127-80-84-98" fill="#9fc7c3"/>
    <path d="M452 334h73m-39 38h83m-70 50h55m-156 56h120m83-31h53m-25 62h122" stroke="#d1e7d9" stroke-width="4" stroke-linecap="round"/>
    ${tree(132, 280, 1.4)}${tree(825, 262, 1.45, '#9ab287')}
    <path d="M0 432q130-58 293-29l73 127H0Zm960-8q-135-63-275-22l-5 128h280Z" fill="#a8bf8f"/>
    <g stroke="${ink}" stroke-width="4" stroke-linejoin="round"><path d="M273 337q209-79 414-2v30q-208-73-414 2Z" fill="#d8bd90"/>
    <path d="M287 301v70m65-91v68m70-80v66m70-66v64m71-57v70m69-56v73m48-53v68M280 304q210-83 406-1" fill="none"/>
    <path d="m302 328 6 27m43-44 5 28m45-41 4 29m45-34 1 28m46-26-2 27m50-22-4 28m51-18-5 27m52-14-8 28" stroke="#ad906b" stroke-width="2"/>
    <path d="M271 398h75l42 22-71 17Z" fill="#c9a57a"/><path d="m295 398 10 26m25-25 8 23" stroke-width="2"/>
    <g class="river-boat"><path d="m355 445 56-8 22 8-55 25Z" fill="#faf0d0" stroke-width="2"/><path d="m379 441 16-29 17 26m-17-26v30" fill="#e0bf81" stroke-width="2"/></g>
    </g>
    <g transform="translate(735 210)" stroke="${ink}" stroke-width="2.5"><path d="M0 0v71m-21-50h41" fill="none"/><path d="M-14 21q15-28 28 0v13h-28Z" fill="#e6c77e"/><path d="M0 34v31m-6-11 13 8" fill="none"/></g>
    ${flowers(154, 450)}${flowers(788, 438)}
    <path d="m95 490 4-10m7 13 5-8m665 17 2-12m9 11 5-9" stroke="#6e9274" stroke-width="3"/>`,
  post: `
    <rect width="960" height="530" fill="#e0ebdd"/><circle cx="773" cy="95" r="43" fill="#efd391"/>
    ${cloud(150, 60, .85)}${cloud(615, 50, .75)}${hills}
    <path d="M0 441q484-81 960-5v94H0Z" fill="#d9c9a5"/>
    ${tree(155, 273, 1.45, '#9ab58c')}${tree(861, 304, 1.3)}
    <g stroke="${ink}" stroke-width="4" stroke-linejoin="round"><path d="M320 190h393v221H320Z" fill="#e8dbba"/>
    <path d="m292 198 213-119 237 119Z" fill="#bb7d68"/><path d="m318 194 187-104 208 104" stroke="#d3a38a" stroke-width="4" fill="none"/>
    <rect x="352" y="242" width="116" height="169" rx="54" fill="#8eab96"/>
    <path d="M369 262h81v82h-81Z" fill="#c3d3b0"/><circle cx="444" cy="367" r="4" fill="${ink}"/>
    <rect x="503" y="247" width="174" height="102" rx="5" fill="#9ab3a2"/><path d="M515 259h150v78H515Z" fill="#f9edcf"/><path d="M590 259v78" fill="none"/>
    <rect x="459" y="162" width="99" height="54" rx="4" fill="#f9eacb"/><rect x="478" y="177" width="59" height="26" rx="3" fill="#d09a79" stroke-width="2.5"/><path d="m479 179 28 18 29-18" fill="none" stroke-width="2.5"/>
    <path d="M526 310h40v22h-40Zm49-9h29v31h-29Zm34 8h42v23h-42Z" fill="#dfbd8d" stroke-width="2"/>
    <path d="M255 351v80m-34-80h68v-63c0-39-68-39-68 0v63Z" fill="#cb826c"/><path d="M233 300h44" stroke="#f7e8cd" stroke-width="5"/>
    <rect x="745" y="346" width="64" height="70" rx="3" fill="#799382" transform="rotate(6 777 382)"/><path d="m757 365 37 4m-39 12 30 3m-29 10 25 2" stroke="#f2e6c4" stroke-width="3"/>
    <path d="M312 415h407v15H312Z" fill="#b69e7c"/>
    </g>${flowers(90, 450)}${flowers(895, 461)}
    <path d="M484 530q-75-70-69-100h-76q-8 44-99 100" fill="#eee0bc"/>
    <g fill="#f1e4b8"><ellipse cx="53" cy="357" rx="5" ry="12" transform="rotate(-25 53 357)"/><ellipse cx="818" cy="168" rx="5" ry="12" transform="rotate(30 818 168)"/></g>`,
  hill: `
    <rect width="960" height="530" fill="#efd9bf"/><path d="M0 0h960v350H0Z" fill="url(#sunset)"/>
    <circle cx="629" cy="139" r="69" fill="#f8dfaa"/><circle cx="629" cy="139" r="87" fill="#f8dfaa" opacity=".18"/>
    ${cloud(190, 81, 1.2)}${cloud(807, 147, 1)}
    <path d="M0 343q137-119 350-28 148-117 330-10 180-54 280 15v210H0Z" fill="#bec1a0"/>
    <path d="M0 392q223-113 453-17 285-138 507-5v160H0Z" fill="#9daa88"/>
    <path d="M0 446q438-167 960-5v89H0Z" fill="#849c7c"/>
    <path d="M270 530q28-105 173-150h-49q-168 52-212 150" fill="#d4c19c"/>
    ${tree(863, 300, 1.45, '#a5b18a')}
    <g stroke="${ink}" stroke-width="4" stroke-linejoin="round">
    <path d="M628 329h165v18H628Zm0 25h165v18H628Zm-14 25h192v16H614Z" fill="#d4b38a"/>
    <path d="M641 326v101m136-101v101m-149-31-11 29m171-29 11 29" fill="none"/>
    <path d="M207 294v128m-35-128h69v-77c0-41-69-41-69 0v77Z" fill="#cc866e"/><path d="M183 238h47" stroke="#f3e4c8" stroke-width="5"/>
    <path d="M189 269h35v16h-35Z" fill="#e3bd95" stroke-width="2"/>
    <path d="m675 376 31-4 7 18-34 4Z" fill="#f7ebcf" stroke-width="2"/>
    </g>
    ${flowers(107, 450)}${flowers(828, 468)}${flowers(539, 464)}
    <g fill="#f1d799"><circle cx="84" cy="392" r="3"/><circle cx="737" cy="269" r="2"/><circle cx="423" cy="289" r="2"/><circle cx="887" cy="408" r="3"/></g>
    <path d="m398 116 7 5 7-5m335-63 7 5 7-5" stroke="#897e69" stroke-width="2.5" stroke-linecap="round" fill="none"/>`,
};

export function sceneArt(chapter: ChapterId): string {
  return `<svg class="scene-art" viewBox="0 0 960 530" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <pattern id="wallpaper" width="42" height="42" patternUnits="userSpaceOnUse"><path d="M21 18v6m-3-3h6" stroke="#becfbc" stroke-width="1.4" opacity=".5"/></pattern>
      <linearGradient id="sunset" x2="0" y2="1"><stop stop-color="#e9bb9d"/><stop offset="1" stop-color="#f3deb7"/></linearGradient>
    </defs>${scenes[chapter]}
  </svg>`;
}
