import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const site = 'https://harvestmoonechoesofteradea.wiki';
const reviewed = '2026-07-25';
const sources = {
  trailer: {
    label: 'Natsume first-trailer announcement (June 18, 2026)',
    url: 'https://www.natsume.com/news/news_pdffiles/pid_383_HMEOT_TrailerAnnouncementF.pdf'
  },
  store: {
    label: 'Natsume Store product page',
    url: 'https://natsumestore.com/products/harvest-moon-echoes-of-teradea-with-free-wolf-plush'
  },
  retailer: {
    label: 'Best Buy Nintendo Switch product listing and screenshot gallery',
    url: 'https://www.bestbuy.com/product/harvest-moon-echoes-of-teradea-nintendo-switch/JXT5SL668Y'
  }
};

const sections = {
  characters: {
    hub: 'characters',
    label: 'Character evidence',
    title: 'Newly Named Characters',
    intro: 'These profiles record only the names and context visible in the current retailer gallery. Romance status, schedules, gifts, birthdays, jobs, and complete biographies remain open until Natsume publishes them or the game can be verified.'
  },
  places: {
    hub: 'locations',
    label: 'Place evidence',
    title: 'Newly Visible Places',
    intro: 'These location records distinguish a visible place label from a completed map guide. Each page preserves the screenshot context while withholding routes, resources, opening hours, and unlock requirements that are not yet known.'
  },
  interface: {
    hub: 'interface',
    label: 'Interface evidence',
    title: 'Interface & Control Evidence',
    intro: 'The retailer gallery exposes several interface labels and contextual controls. These pages explain what the labels demonstrate without assuming platform-wide button parity, final menus, or launch-version behavior.'
  }
};

const pages = [
  {
    section:'characters', slug:'lorelei', title:'Lorelei Character Profile',
    description:'What the Echoes of Teradea screenshot reveals about Lorelei, the mine, and union rules—and what is still unknown.',
    direct:'Lorelei is a named Echoes of Teradea character shown discussing protection of mine resources and rules set by a union.',
    evidence:['The retailer gallery attributes a dialogue line directly to Lorelei.','Her visible line connects her to mine-resource protection and a union with rules.','The broader game description separately confirms mining villages, maze-like caves, ore, and gems.'],
    meaning:'Lorelei is now a valid character entity rather than an unnamed trailer figure. Her dialogue suggests a useful future connection among character, mine, union, resource, and Quarrytop guides, but it does not yet establish her residence or romance eligibility.',
    boundary:'No official source currently gives Lorelei’s surname, birthday, daily schedule, favorite gifts, exact occupation, home, relationship status, or quest chain.'
  },
  {
    section:'characters', slug:'bryce', title:'Bryce Character Profile',
    description:'Verified screenshot context for Bryce, including his reference to a Maple Mart jam session with Cindy and Amad.',
    direct:'Bryce is a named character whose screenshot dialogue recalls hearing a jam session at Maple Mart with Cindy and Amad.',
    evidence:['The name Bryce appears in the retailer screenshot caption.','The same line names Maple Mart, Cindy, and Amad in one social context.','The line is evidence of a remembered event, not proof of a repeatable festival or scheduled performance.'],
    meaning:'Bryce links the character graph to Maple Mart and two additional named people. That makes the profile useful for future relationship-event and location updates without inventing his role in the town.',
    boundary:'Bryce’s romance status, profession, residence, schedule, gifts, music skill, and involvement in the jam session remain unconfirmed.'
  },
  {
    section:'characters', slug:'mara', title:'Mara Character Profile',
    description:'What is currently visible about Mara, captain language, the ocean, and possible seafaring context.',
    direct:'Mara is a named character shown reacting positively to being called “Captain” and promising to show the player how fun the ocean can be.',
    evidence:['The retailer gallery names Mara in a dialogue screenshot.','Her line explicitly uses the words Captain and ocean.','The wider game description confirms nautical charts and expeditions to remote islands.'],
    meaning:'Mara is the strongest currently visible character connection to the ocean-exploration cluster. The wording supports a seafaring theme, while the exact boat, route, job, and unlock relationship still need direct confirmation.',
    boundary:'The screenshot does not prove that Mara owns a boat, lives in Tidewind, is a romance candidate, or personally unlocks island travel.'
  },
  {
    section:'characters', slug:'cindy', title:'Cindy Character Profile',
    description:'The confirmed name and social context currently available for Cindy in Echoes of Teradea.',
    direct:'Cindy is a named character referenced by Bryce as one of the people associated with a jam session at Maple Mart.',
    evidence:['Cindy’s name appears inside Bryce’s visible dialogue.','Her current evidence is a third-person mention rather than a dedicated portrait or biography.','The same line places Cindy in a shared social scene with Bryce and Amad.'],
    meaning:'The mention is enough to reserve a stable character URL and connect Cindy to Maple Mart. It is not enough to label her as a musician, merchant, romance option, or Maplehill resident.',
    boundary:'Appearance, pronouns, job, residence, romance status, schedule, gifts, and the exact nature of the jam session are not confirmed.'
  },
  {
    section:'characters', slug:'amad', title:'Amad Character Profile',
    description:'The confirmed name and Maple Mart jam-session context currently available for Amad.',
    direct:'Amad is a named character referenced alongside Cindy in Bryce’s line about a jam session at Maple Mart.',
    evidence:['The retailer screenshot caption preserves the spelling Amad.','Amad is connected to a specific remembered social context at Maple Mart.','No separate character description is currently published in the cited materials.'],
    meaning:'Amad can now be included in the verified character roster and internal relationship graph. Launch data can later add appearance, dialogue, location, events, and gift information to this same URL.',
    boundary:'The available line does not prove that Amad performed music, works at Maple Mart, lives nearby, or belongs to the ten romance candidates.'
  },
  {
    section:'characters', slug:'lily', title:'Lily Character Profile',
    description:'What a visible quest objective confirms about Lily, favorite treats, Rick, and Bloomfield Park.',
    direct:'Lily is a named character in a visible objective asking the player to obtain her favorite treats after a request from Rick.',
    evidence:['The screenshot text names Lily and Rick in one request.','The wording establishes that Lily has favorite treats, but it does not identify the item.','Bloomfield Park is visible in the same interface context.'],
    meaning:'Lily’s page has a concrete relationship-and-quest anchor that can later support gift and request data. Until the item, quantity, trigger, and reward are verified, it remains an evidence profile rather than a walkthrough.',
    boundary:'Lily’s favorite treat, her relationship to Rick, quest giver, objective quantity, reward, schedule, residence, and romance status are not yet confirmed.',
    focus:'Lily’s future data model should prioritize preference evidence: exact treat name, item category, quality requirement, accepted alternatives, reaction text, heart or friendship effect, repeatability, and whether the preference applies outside this request. None of those fields can be filled from the screenshot alone.'
  },
  {
    section:'characters', slug:'rick', title:'Rick Character Profile',
    description:'Current evidence for Rick and the request involving Lily’s favorite treats.',
    direct:'Rick is a named character connected to an objective in which the player is asked to get Lily’s favorite treats.',
    evidence:['Rick’s name appears in the objective wording shown by the retailer gallery.','The visible text connects Rick and Lily but does not identify who directly speaks to the player.','The objective is displayed while the player is in the Bloomfield Village and Bloomfield Park area context.'],
    meaning:'Rick becomes a verified character entity with a quest relationship to Lily. The page can later absorb the precise trigger, dialogue, required item, completion location, and reward.',
    boundary:'Rick’s occupation, home, relationship to Lily, romance status, schedule, gifts, and role in the main story are not published.',
    focus:'Rick’s future record should prioritize request-chain evidence: who starts the task, whether Rick supplies instructions or only motivates another speaker, prerequisite events, active-objective wording, hand-in recipient, completion dialogue, expiry rules, and reward. The current image does not settle any of these workflow fields.'
  },
  {
    section:'places', slug:'wolf-hill', title:'Wolf Hill Location Guide',
    description:'What the visible Spirit Tree objective confirms about Wolf Hill before launch.',
    direct:'Wolf Hill is a named Echoes of Teradea place connected to an objective to investigate the Spirit Tree.',
    evidence:['The retailer gallery shows the objective text “Investigate the Spirit Tree in Wolf Hill.”','The interface also displays Bloomfield Village, which may be the broader current region rather than proof that Wolf Hill is inside it.','The main story separately centers on mist, guardian spirits, and threatened land.'],
    meaning:'Wolf Hill should be tracked as a specific sub-location with a Spirit Tree story connection. A launch guide will need the entrance, map boundary, prerequisites, hazards, objective steps, and rewards.',
    boundary:'Its exact region hierarchy, travel route, map coordinates, resident characters, resources, enemies, and quest completion steps remain unknown.'
  },
  {
    section:'places', slug:'bloomfield-park', title:'Bloomfield Park Location Guide',
    description:'Screenshot evidence for Bloomfield Park and its connection to a request involving Lily and Rick.',
    direct:'Bloomfield Park is a named place shown in the Bloomfield Village interface during an objective involving Lily’s favorite treats and Rick.',
    evidence:['Bloomfield Park appears as a specific location label.','Bloomfield Village is shown as the broader place context in the same screenshot.','The request text provides a character connection but not a confirmed objective destination.'],
    meaning:'The park is now a valid child location for the Bloomfield cluster. It may become useful for NPC schedules, events, gathering, and quest steps once those details can be observed.',
    boundary:'The screenshot does not establish opening hours, facilities, collectibles, exact NPC presence, quest hand-in point, or map coordinates.'
  },
  {
    section:'places', slug:'maple-mart', title:'Maple Mart Location Guide',
    description:'What Bryce’s dialogue establishes about Maple Mart, Cindy, Amad, and a jam session.',
    direct:'Maple Mart is a named location connected by Bryce’s dialogue to a jam session involving Cindy and Amad.',
    evidence:['The place name appears directly in visible dialogue.','The word Mart suggests a commercial venue, but the screenshot does not list inventory or opening hours.','The social-event reference links the location to at least three named characters.'],
    meaning:'Maple Mart now has a stronger purpose than a generic shop placeholder: it is both a possible commerce location and a social-scene setting. Exact functions must wait for gameplay evidence.',
    boundary:'Ownership, town placement, stock, prices, hours, whether the jam session repeats, and whether Maple Mart is in Maplehill are all unconfirmed.'
  },
  {
    section:'places', slug:'tornado-island', title:'Tornado Island Location Guide',
    description:'What a current gameplay screenshot reveals about Tornado Island, weather labels, and time display.',
    direct:'Tornado Island is a named Echoes of Teradea location visible in the retailer screenshot gallery.',
    evidence:['The screenshot caption includes the location name Tornado Island.','The same interface shows a breezy and hot condition plus an afternoon clock and weekday/date display.','Official descriptions separately confirm remote islands reached through nautical charts.'],
    meaning:'Tornado Island is the first specifically named island available to the site’s location database. It should connect to nautical-chart, island-expedition, weather, and rare-animal guides as details emerge.',
    boundary:'The chart source, departure point, route, hazards, tornado mechanic, resources, rare animals, access season, and return conditions remain unconfirmed.'
  },
  {
    section:'interface', slug:'docpad', title:'DocPad Interface Guide',
    description:'Visible DocPad contextual controls for song selection, Photo Mode, outfit changes, cooking, and sleeping.',
    direct:'The current retailer gallery shows a DocPad interface with contextual options for Select Song, Activate Photo Mode, Change Outfit, Cook, and Sleep.',
    evidence:['The label DocPad is visible in the interface caption.','Five actions are named in the same control overlay.','The shown button prompts belong to one captured platform context and may differ on other hardware.'],
    meaning:'DocPad appears to function as a compact interaction or control interface connecting leisure, customization, cooking, rest, and photography. This page gives those features one shared navigation point.',
    boundary:'Menu hierarchy, unlock timing, portable use, controller remapping, platform-specific buttons, save behavior, and whether every action is always available are unknown.'
  },
  {
    section:'interface', slug:'photo-mode', title:'Photo Mode in Echoes of Teradea',
    description:'What the visible Activate Photo Mode prompt confirms, with controls and capabilities still separated from evidence.',
    direct:'Photo Mode is visibly named as an activatable action in an Echoes of Teradea DocPad screenshot.',
    evidence:['The action text says Activate Photo Mode.','The prompt appears beside other contextual DocPad actions.','The screenshot confirms the feature name but does not expose its editing tools.'],
    meaning:'Players can reasonably expect an in-game photo feature, making a stable page useful before launch. A complete guide should later document camera movement, filters, poses, UI hiding, storage, sharing, and platform restrictions.',
    boundary:'Filters, focal controls, character poses, free-camera range, screenshot resolution, export behavior, and whether Photo Mode pauses time are not confirmed.'
  },
  {
    section:'interface', slug:'change-outfit', title:'Change Outfit Control and Customization',
    description:'Evidence for the Change Outfit action and the limits of what it proves about character customization.',
    direct:'A visible DocPad control names Change Outfit, confirming an outfit-change action in the captured build.',
    evidence:['Change Outfit appears as a distinct contextual command.','The prompt demonstrates clothing changes, not necessarily full character creation.','No clothing catalog or equipment-stat system is shown.'],
    meaning:'The action supports a focused customization guide without claiming hairstyles, body editing, dyes, transmog, or clothing bonuses. Launch verification can add access points and wardrobe rules.',
    boundary:'Available outfits, purchase or crafting methods, gender restrictions, stat effects, storage, dyeing, and where the command can be used remain unknown.'
  },
  {
    section:'interface', slug:'song-selection', title:'Select Song Control',
    description:'What the DocPad Select Song prompt confirms about music interaction before launch.',
    direct:'The DocPad screenshot includes a Select Song action, indicating that players can choose music in at least one captured context.',
    evidence:['Select Song appears as an explicit control label.','It is displayed alongside cooking, sleeping, outfit, and Photo Mode actions.','The prompt does not name a track, playlist, instrument, or unlock condition.'],
    meaning:'This may support a music-selection or ambient-control feature, but the responsible interpretation is limited to the visible action. A later guide can add track lists and exact use conditions.',
    boundary:'Soundtrack titles, number of songs, acquisition, playback area, looping, streaming restrictions, and whether the command is tied to a campsite or home are not confirmed.'
  },
  {
    section:'interface', slug:'quest-objective-tracker', title:'Quest Objective Tracker',
    description:'How visible Spirit Tree and favorite-treat objectives demonstrate the quest-tracking interface.',
    direct:'Current screenshots show named objectives in the interface, including investigating the Spirit Tree and obtaining Lily’s favorite treats at Rick’s request.',
    evidence:['Objective wording is displayed directly on screen.','The interface pairs objectives with place labels, time, weekday, and date context.','The screenshots show examples, not complete quest names, rewards, or step sequences.'],
    meaning:'The evidence supports a quest-tracker guide and future troubleshooting fields such as current objective, target area, trigger, hand-in character, and progress state.',
    boundary:'Pinning rules, number of tracked quests, map markers, automatic switching, quest failure, time limits, rewards, and exact walkthrough steps remain unknown.'
  },
  {
    section:'interface', slug:'clock-calendar-and-weather', title:'Clock, Calendar, and Weather Interface',
    description:'Visible time, weekday, date, temperature, and weather labels in Echoes of Teradea screenshots.',
    direct:'Retailer screenshots display an in-game clock plus day-of-month and weekday labels, while the Tornado Island image also exposes weather and heat wording.',
    evidence:['Morning and afternoon times are visible across several screenshot captions.','Ordinal dates and weekday abbreviations appear beside the clock.','Tornado Island is shown with breezy and hot status text.'],
    meaning:'The interface confirms that daily planning can involve clock time, calendar position, and environmental conditions. It does not yet establish season length or mechanical penalties.',
    boundary:'Day length, pause rules, curfew, seasons, forecast access, temperature effects, storm damage, crop impact, and festival timing are not confirmed.'
  },
  {
    section:'interface', slug:'map-and-area-labels', title:'Map and Area Label Interface',
    description:'How Bloomfield Village, Bloomfield Park, Wolf Hill, and Tornado Island labels appear in current screenshots.',
    direct:'The captured interface surfaces both broader region names and more specific area labels, including Bloomfield Village, Bloomfield Park, Wolf Hill, and Tornado Island.',
    evidence:['Multiple screenshots display location names next to objective or time information.','Bloomfield Village and Bloomfield Park appear together in one captured state.','A location label alone does not reveal fast travel, map boundaries, or hierarchy.'],
    meaning:'The labels justify a nested location database rather than one flat list. Post-launch mapping can assign parent region, entrance, coordinates, services, hazards, and connected routes.',
    boundary:'World-map design, minimap availability, fast-travel points, discovered-area rules, pins, coordinates, and exact parent-child relationships remain unknown.'
  }
];

const localized = {
  de: [
    ['characters','lorelei','Lorelei – Charakterprofil','Lorelei wird in einem Screenshot namentlich gezeigt und spricht über den Schutz von Minenressourcen sowie Regeln einer Gewerkschaft.'],
    ['characters','bryce','Bryce – Charakterprofil','Bryce erwähnt eine Jam-Session im Maple Mart mit Cindy und Amad; Beruf, Wohnort und Romanzenstatus sind noch nicht bestätigt.'],
    ['characters','mara','Mara – Charakterprofil','Mara reagiert auf die Anrede „Captain“ und spricht über das Meer. Eine konkrete Rolle bei Schiffsreisen ist damit noch nicht bewiesen.'],
    ['locations','tornado-island','Tornado Island – Ortsprofil','Tornado Island ist als Inselname in einem Spiel-Screenshot sichtbar; Route, Seekarte, Ressourcen und Gefahren sind noch unbekannt.'],
    ['interface','docpad','DocPad – Bedienoberfläche','Der sichtbare DocPad-Hinweis nennt Songauswahl, Fotomodus, Outfitwechsel, Kochen und Schlafen als Aktionen.'],
    ['interface','photo-mode','Fotomodus in Echoes of Teradea','Ein Screenshot bestätigt die Aktion „Activate Photo Mode“; Filter, Kamerasteuerung und Exportfunktionen sind noch nicht veröffentlicht.']
  ],
  ja: [
    ['characters','lorelei','ローレライ キャラクター情報','ローレライはスクリーンショットで名前が確認でき、鉱山資源の保護と組合の規則について話しています。'],
    ['characters','bryce','ブライス キャラクター情報','ブライスはMaple Martでシンディとアマドが関わるジャムセッションを聞いたと話しています。'],
    ['characters','mara','マーラ キャラクター情報','マーラは「Captain」と呼ばれることや海の楽しさに触れていますが、船や航海の役割はまだ確定していません。'],
    ['locations','tornado-island','トルネード島 ロケーション情報','Tornado Islandはゲーム画面で確認できる島名です。海図、航路、資源、危険要素はまだ不明です。'],
    ['interface','docpad','DocPad 操作ガイド','画面上のDocPadには曲選択、フォトモード、衣装変更、料理、睡眠の操作が表示されています。'],
    ['interface','photo-mode','フォトモード情報','画面の「Activate Photo Mode」表示からフォトモードの存在を確認できますが、フィルターやカメラ機能は未公開です。']
  ]
};

const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const prefixFor = route => '../'.repeat(route.split('/').filter(Boolean).length);
const sourceList = () => Object.values(sources).map(source => `<li><a href="${source.url}" rel="nofollow noopener">${esc(source.label)}</a></li>`).join('');
const schema = (page, url, language='en') => JSON.stringify({'@context':'https://schema.org','@graph':[
  {'@type':'Article',headline:page.title,name:page.title,description:page.description || page.direct,dateModified:reviewed,inLanguage:language,mainEntityOfPage:url,author:{'@type':'Organization',name:'Echoes Guide Editorial Team'},about:{'@type':'VideoGame',name:'Harvest Moon: Echoes of Teradea'}},
  {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:`${site}/`},{'@type':'ListItem',position:2,name:page.title,item:url}]}
]});
const header = prefix => `<header class="site-header"><a class="brand" href="${prefix}"><span class="brand-mark">HM</span><span>Echoes Guide</span></a><nav class="nav"><a href="${prefix}guides/">Guides</a><a href="${prefix}characters/">Characters</a><a href="${prefix}locations/">Locations</a><a href="${prefix}interface/">Interface</a><a href="${prefix}faq/">FAQ</a></nav></header>`;

function renderPage(page) {
  const route = `${page.section === 'places' ? 'locations' : page.section}/${page.slug}`;
  const prefix = prefixFor(route);
  const url = `${site}/${route}/`;
  const section = sections[page.section];
  const related = pages.filter(item => item.section === page.section && item.slug !== page.slug).slice(0,3);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(page.title)} | Echoes Guide</title><meta name="description" content="${esc(page.description)}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${url}"><link rel="icon" href="${prefix}assets/site-icon.svg"><link rel="stylesheet" href="${prefix}styles.css"><meta property="og:title" content="${esc(page.title)}"><meta property="og:description" content="${esc(page.description)}"><meta property="og:type" content="article"><meta property="og:url" content="${url}"><meta property="og:image" content="${site}/assets/hero-fan-art.png"><script type="application/ld+json">${schema(page,url)}</script></head><body>${header(prefix)}<main><section class="subpage-hero"><div class="breadcrumb"><a href="${prefix}">Home</a><span>/</span><a href="../">${esc(section.title)}</a><span>/</span><span>${esc(page.title)}</span></div><p class="eyebrow">${esc(section.label)} · Reviewed ${reviewed}</p><h1>${esc(page.title)}</h1><p>${esc(page.description)}</p></section><section class="section article-layout"><article class="article-main"><h2>Quick answer</h2><p class="callout">${esc(page.direct)}</p><h2>What the published evidence shows</h2><div class="fact-panels">${page.evidence.map((fact,index)=>`<article class="fact-panel"><span>0${index+1}</span><p>${esc(fact)}</p></article>`).join('')}</div><h2>How this connects to the game</h2><p>${esc(page.meaning)}</p>${page.focus?`<h2>Subject-specific data plan</h2><p>${esc(page.focus)}</p>`:''}<p>The page uses the latest publisher description for the game-wide context and a current retailer gallery for the visible name, label, dialogue, objective, or control. Retailer images can change, so the evidence date is retained and launch-version behavior will be checked again.</p><div class="boundary-box"><h2>What is not confirmed</h2><p>${esc(page.boundary)}</p></div><h2>Launch-day upgrade plan</h2><p>This URL will keep one stable intent. After release, it can be upgraded with verified schedules, locations, triggers, controls, rewards, maps, screenshots, or troubleshooting details that belong to this exact subject. Unsupported series precedent and placeholder values will not be added.</p><h2>Sources and evidence level</h2><ul class="source-list">${sourceList()}</ul><p class="small-copy">Evidence level: the general game systems come from Natsume; the specific on-screen name or label is transcribed from the current retailer gallery.</p><h2>Related records</h2><div class="page-links">${related.map(item=>`<a href="../${item.slug}/">${esc(item.title)}</a>`).join('')}<a href="../">Open ${esc(section.title)}</a></div></article><aside class="toc"><h2>Evidence note</h2><p class="small-copy">Reviewed ${reviewed}. A visible label is not treated as a complete walkthrough or biography.</p></aside></section></main><footer class="site-footer"><p>Independent, source-checked fan guide. Last reviewed ${reviewed}.</p><a href="${prefix}game-status/">Current game data</a></footer></body></html>`;
}

function renderInterfaceHub() {
  const children = pages.filter(page => page.section === 'interface');
  const data = sections.interface;
  const url = `${site}/interface/`;
  const page = {title:data.title,description:'A source-checked index of DocPad, Photo Mode, outfit, music, quest, clock, weather, map, and area-label evidence shown before release.'};
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(data.title)} | Echoes Guide</title><meta name="description" content="${esc(page.description)}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${url}"><link rel="icon" href="../assets/site-icon.svg"><link rel="stylesheet" href="../styles.css"><script type="application/ld+json">${schema(page,url)}</script></head><body>${header('../')}<main><section class="subpage-hero"><div class="breadcrumb"><a href="../">Home</a><span>/</span><span>${esc(data.title)}</span></div><p class="eyebrow">Screenshot-led system index</p><h1>${esc(data.title)}</h1><p>${esc(page.description)}</p></section><section class="section"><div class="hub-intro"><h2>What this hub verifies</h2><p>${esc(data.intro)}</p></div><div class="mixed-guide-grid">${children.map((item,index)=>`<article class="guide-card guide-card-${(index%3)+1}"><p class="eyebrow">Interface record</p><h2><a href="${item.slug}/">${esc(item.title)}</a></h2><p>${esc(item.description)}</p><a class="text-link" href="${item.slug}/">Open evidence page</a></article>`).join('')}</div></section><section class="section"><h2>Evidence policy</h2><div class="fact-panels"><article class="fact-panel"><span>01</span><p>Visible labels are transcribed without extending them into undocumented mechanics.</p></article><article class="fact-panel"><span>02</span><p>Captured button prompts are not assumed to match every launch platform.</p></article><article class="fact-panel"><span>03</span><p>Each page has a defined post-launch data upgrade path.</p></article></div></section></main><footer class="site-footer"><p>Independent screenshot and interface index.</p><a href="../game-status/">Current game data</a></footer></body></html>`;
}

function renderLocalized(locale, baseSection, slug, title, direct) {
  const section = baseSection === 'locations' ? 'locations' : baseSection;
  const route = `${locale}/${section}/${slug}`;
  const prefix = prefixFor(route);
  const url = `${site}/${route}/`;
  const isJa = locale === 'ja';
  const description = direct;
  const page = {title,description};
  const evidence = isJa
    ? ['ゲーム全体の仕様はNatsumeの公式発表で確認しています。','固有名詞や画面表示は現在の販売店ギャラリーで確認しています。','発売前に不明な人物情報、数値、手順、場所は推測していません。']
    : ['Die allgemeinen Spielsysteme werden mit Natsumes Mitteilungen abgeglichen.','Der konkrete Name oder Bildschirmtext stammt aus der aktuellen Händlergalerie.','Nicht veröffentlichte Biografien, Werte, Schritte und Orte werden nicht ergänzt.'];
  const meaning = isJa
    ? 'このページは一つの固有名詞または機能に限定した発売前資料です。発売後は同じURLに、実機で確認した場所、条件、操作、イベント、報酬などを追加します。'
    : 'Diese Seite bleibt auf einen Namen oder eine Funktion begrenzt. Nach Veröffentlichung werden nur im Spiel bestätigte Orte, Bedingungen, Steuerungen, Ereignisse oder Belohnungen ergänzt.';
  const boundary = isJa
    ? 'この日本語ページは非公式ガイドです。ゲーム本体の日本語対応、人物の恋愛対象、詳細な操作や攻略手順を保証するものではありません。'
    : 'Diese deutsche Seite ist ein inoffizieller Guide. Sie bestätigt weder deutsche Spieltexte noch Romanzenstatus, vollständige Steuerung oder Lösungsschritte.';
  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | Echoes Guide</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${url}"><link rel="icon" href="${prefix}assets/site-icon.svg"><link rel="stylesheet" href="${prefix}styles.css"><script type="application/ld+json">${schema(page,url,locale)}</script></head><body>${header(prefix)}<main><section class="subpage-hero"><div class="breadcrumb"><a href="${prefix}${locale}/">${isJa?'日本語':'Deutsch'}</a><span>/</span><span>${esc(title)}</span></div><p class="eyebrow">${isJa?'日本語':'Deutsch'} · ${reviewed}</p><h1>${esc(title)}</h1><p>${esc(direct)}</p></section><section class="section article-layout"><article class="article-main"><h2>${isJa?'要点':'Kurzantwort'}</h2><p class="callout">${esc(direct)}</p><h2>${isJa?'確認できる根拠':'Bestätigte Grundlage'}</h2><div class="fact-panels">${evidence.map((fact,index)=>`<article class="fact-panel"><span>0${index+1}</span><p>${esc(fact)}</p></article>`).join('')}</div><h2>${isJa?'ページの役割':'Nutzen der Seite'}</h2><p>${esc(meaning)}</p><div class="boundary-box"><h2>${isJa?'未確認の範囲':'Nicht bestätigt'}</h2><p>${esc(boundary)}</p></div><h2>${isJa?'参照元':'Quellen'}</h2><ul class="source-list">${sourceList()}</ul><div class="page-links"><a href="${prefix}${locale}/">${isJa?'日本語トップ':'Deutsche Startseite'}</a></div></article></section></main><footer class="site-footer"><p>${esc(boundary)}</p><a href="${prefix}${locale}/">${isJa?'日本語':'Deutsch'}</a></footer></body></html>`;
}

await mkdir(path.join(root,'interface'),{recursive:true});
await writeFile(path.join(root,'interface/index.html'),renderInterfaceHub());
for (const page of pages) {
  const base = page.section === 'places' ? 'locations' : page.section;
  const dir = path.join(root,base,page.slug);
  await mkdir(dir,{recursive:true});
  await writeFile(path.join(dir,'index.html'),renderPage(page));
}
for (const [locale,items] of Object.entries(localized)) {
  for (const [section,slug,title,direct] of items) {
    const dir = path.join(root,locale,section,slug);
    await mkdir(dir,{recursive:true});
    await writeFile(path.join(dir,'index.html'),renderLocalized(locale,section,slug,title,direct));
  }
}

const additions = [
  '/interface/',
  ...pages.map(page=>`/${page.section === 'places' ? 'locations' : page.section}/${page.slug}/`),
  ...Object.entries(localized).flatMap(([locale,items])=>items.map(([section,slug])=>`/${locale}/${section}/${slug}/`))
];
const manifestPath = path.join(root,'seo/indexable-urls.json');
const manifest = JSON.parse(await readFile(manifestPath,'utf8'));
for (const url of additions) if (!manifest.includes(url)) manifest.push(url);
await writeFile(manifestPath,`${JSON.stringify(manifest,null,2)}\n`);

const moduleFor = sectionName => {
  const data = sections[sectionName];
  const items = pages.filter(page=>page.section===sectionName);
  const base = sectionName === 'places' ? 'locations' : sectionName;
  return `<!-- V8_EVIDENCE_START --><section class="section"><div class="section-heading"><div><p class="eyebrow">${esc(data.label)}</p><h2>${esc(data.title)}</h2></div>${sectionName==='interface'?'':'<a class="text-link" href="/interface/">Interface evidence</a>'}</div><p>${esc(data.intro)}</p><div class="mixed-guide-grid">${items.map(item=>`<article class="guide-card"><h3><a href="/${base}/${item.slug}/">${esc(item.title)}</a></h3><p>${esc(item.description)}</p></article>`).join('')}</div></section><!-- V8_EVIDENCE_END -->`;
};
for (const [file,sectionName] of [['characters/index.html','characters'],['locations/index.html','places']]) {
  const full = path.join(root,file);
  let html = await readFile(full,'utf8');
  html = html.replace(/<!-- V8_EVIDENCE_START -->[\s\S]*?<!-- V8_EVIDENCE_END -->/g,'');
  html = html.replace('</main>',`${moduleFor(sectionName)}</main>`);
  await writeFile(full,html);
}
for (const file of ['index.html','guides/index.html']) {
  const full = path.join(root,file);
  let html = await readFile(full,'utf8');
  const promo = `<!-- V8_PROMO_START --><section class="section"><div class="section-heading"><div><p class="eyebrow">New verified records</p><h2>Characters, places, and interface evidence</h2></div><a class="text-link" href="/interface/">Open interface hub</a></div><div class="page-links"><a href="/characters/lorelei/">Lorelei</a><a href="/characters/bryce/">Bryce</a><a href="/characters/mara/">Mara</a><a href="/locations/tornado-island/">Tornado Island</a><a href="/interface/docpad/">DocPad</a><a href="/interface/photo-mode/">Photo Mode</a></div></section><!-- V8_PROMO_END -->`;
  html = html.replace(/<!-- V8_PROMO_START -->[\s\S]*?<!-- V8_PROMO_END -->/g,'').replace('</main>',`${promo}</main>`);
  await writeFile(full,html);
}

await writeFile(path.join(root,'data/v8-screenshot-intelligence.json'),`${JSON.stringify({
  reviewed,
  baselineHtml:298,
  baselineIndexable:286,
  addedEnglishHub:1,
  addedEnglishPages:pages.length,
  addedLocalized:{de:localized.de.length,ja:localized.ja.length},
  evidencePolicy:'A visible name, place, objective, or control may become a page only when it has a distinct future data path and an explicit unknown boundary.',
  sourceUrls:Object.values(sources).map(source=>source.url)
},null,2)}\n`);
console.log(`V8 generated 1 English hub, ${pages.length} English evidence pages, and ${localized.de.length + localized.ja.length} localized pages.`);
