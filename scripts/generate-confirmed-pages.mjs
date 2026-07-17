import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const site = 'https://harvestmoonechoesofteradea.wiki';
const modified = '2026-07-17';

const pages = [
  {
    slug: 'platforms/nintendo-switch',
    title: 'Harvest Moon: Echoes of Teradea on Nintendo Switch',
    description: 'Confirmed Nintendo Switch release date, physical preorder status, and the platform details still awaiting confirmation for Echoes of Teradea.',
    eyebrow: 'Platform Guide',
    answer: 'Harvest Moon: Echoes of Teradea is officially coming to Nintendo Switch on September 24, 2026. Natsume lists a physical Switch edition for $49.99, while file size, preload timing, performance and supported languages still require official store confirmation.',
    details: ['Release date: September 24, 2026', 'Platform: Nintendo Switch', 'Genre: simulation and farming', 'Players: one', 'Physical preorder: confirmed by the Natsume Store', 'Natsume Store price checked July 17, 2026: $49.99'],
    useful: 'This page answers whether the original Switch is supported and separates confirmed buying information from details that have not been published. Before purchasing, compare the final eShop listing with the Switch 2 version for resolution, frame rate, loading and any upgrade path.',
    verify: ['Nintendo eShop file size and preload date', 'Resolution, frame rate and loading performance', 'Supported languages and cloud-save support', 'Whether a Switch 2 upgrade option is offered'],
    related: [['../nintendo-switch-2/', 'Switch 2 version'], ['../../release-date/', 'Release date'], ['../../preorder/', 'Preorder guide']]
  },
  {
    slug: 'platforms/nintendo-switch-2',
    title: 'Harvest Moon: Echoes of Teradea on Nintendo Switch 2',
    description: 'Confirmed Switch 2 release date and preorder information, plus the performance and upgrade details players still need before buying.',
    eyebrow: 'Platform Guide',
    answer: 'Harvest Moon: Echoes of Teradea launches on Nintendo Switch 2 on September 24, 2026. Natsume has confirmed the platform and a physical preorder, but has not yet published a complete technical comparison with the original Switch version.',
    details: ['Release date: September 24, 2026', 'Platform: Nintendo Switch 2', 'Physical preorder: confirmed', 'Genre: simulation and farming', 'Players: one', 'Technical enhancements: not yet detailed by Natsume'],
    useful: 'The important purchase question is not merely whether Switch 2 is supported, but what the version improves. This tracker will only label higher resolution, frame rate, loading, mouse controls or other enhancements as confirmed after Natsume or Nintendo publishes them.',
    verify: ['Native Switch 2 features and display modes', 'Physical cartridge and storage requirements', 'Upgrade path from the Switch edition', 'Save compatibility between Switch editions'],
    related: [['../nintendo-switch/', 'Nintendo Switch version'], ['../../release-date/', 'Release date'], ['../../preorder/', 'Preorder guide']]
  },
  {
    slug: 'platforms/ps5',
    title: 'Harvest Moon: Echoes of Teradea on PS5',
    description: 'PS5 release date, physical preorder and confirmed facts for Harvest Moon: Echoes of Teradea, with unannounced features clearly labeled.',
    eyebrow: 'Platform Guide',
    answer: 'Harvest Moon: Echoes of Teradea is officially scheduled for PlayStation 5 on September 24, 2026. A physical PS5 edition is available to preorder from Natsume; trophies, file size, performance modes and PlayStation Store timing have not yet been fully detailed.',
    details: ['Release date: September 24, 2026', 'Platform: PlayStation 5', 'Physical preorder: confirmed', 'Natsume Store price checked July 17, 2026: $49.99', 'Players: one', 'PS4 version: not announced'],
    useful: 'This page is the direct answer for PS5 owners and avoids implying that a PS4 version exists. Technical and storefront fields remain on the verification list until a first-party listing supplies them.',
    verify: ['PlayStation Store page and digital price', 'Download size and preload timing', 'Trophy list and DualSense features', 'Resolution and performance options'],
    related: [['../xbox-series-xs/', 'Xbox version'], ['../../release-date/', 'Release date'], ['../../preorder/', 'Preorder guide']]
  },
  {
    slug: 'platforms/xbox-series-xs',
    title: 'Harvest Moon: Echoes of Teradea on Xbox Series X|S',
    description: 'Confirmed Xbox Series X|S release status and date for Echoes of Teradea, including what is not yet known about Game Pass and Xbox features.',
    eyebrow: 'Platform Guide',
    answer: 'Natsume has confirmed Harvest Moon: Echoes of Teradea for Xbox Series X|S on September 24, 2026. No Xbox One edition or Game Pass launch has been announced in the official material reviewed on July 17, 2026.',
    details: ['Release date: September 24, 2026', 'Platform: Xbox Series X|S', 'PC version: separately confirmed for Steam', 'Xbox One version: not announced', 'Game Pass: not announced', 'Players: one'],
    useful: 'Xbox searches often mix platform availability with Game Pass intent. The confirmed answer is that Series X|S is supported; subscription availability, preload, achievements and technical modes must remain unconfirmed until Microsoft or Natsume lists them.',
    verify: ['Microsoft Store listing and download size', 'Game Pass availability', 'Xbox Play Anywhere and cloud-save support', 'Series X and Series S performance differences'],
    related: [['../pc-steam/', 'PC and Steam'], ['../ps5/', 'PS5 version'], ['../../release-date/', 'Release date']]
  },
  {
    slug: 'platforms/pc-steam',
    title: 'Harvest Moon: Echoes of Teradea on PC and Steam',
    description: 'Confirmed Steam release date for Echoes of Teradea and a clear checklist for system requirements, Steam Deck support and PC features.',
    eyebrow: 'Platform Guide',
    answer: 'Harvest Moon: Echoes of Teradea is officially coming to PC through Steam on September 24, 2026. Final system requirements, Steam Deck verification, pricing and preload details were not included in the official announcements reviewed on July 17, 2026.',
    details: ['Release date: September 24, 2026', 'PC storefront: Steam', 'Genre: simulation and farming', 'Players: one', 'System requirements: awaiting Steam listing details', 'Steam Deck status: not announced'],
    useful: 'PC players need compatibility information more than a generic platform confirmation. This page will track minimum and recommended hardware, controller support, ultrawide options, cloud saves and Steam Deck results when primary listings or verified testing become available.',
    verify: ['Minimum and recommended system requirements', 'Steam price, preload and unlock time', 'Steam Deck compatibility', 'Controller, ultrawide and graphics settings'],
    related: [['../xbox-series-xs/', 'Xbox version'], ['../../release-date/', 'Release date'], ['../../updates/', 'Updates']]
  },
  {
    slug: 'features/open-world-exploration',
    title: 'Echoes of Teradea Open World and Exploration',
    description: 'What Natsume has confirmed about the open world, caves, islands, movement and exploration in Harvest Moon: Echoes of Teradea.',
    eyebrow: 'Confirmed Feature',
    answer: 'Echoes of Teradea has a large open world with villages, wilderness, maze-like caves, remote islands, ore, gems, collectibles and animals. Official material also confirms jumping, ladders and climbable vines as ways to reach new areas.',
    details: ['Large connected world across Teradea', 'Maze-like caves containing ore and gems', 'Nautical charts used to reach remote islands', 'Jumping, ladder climbing and vine climbing', 'Animal abilities used to cross terrain and break obstacles', 'Rare collectibles and animals in remote areas'],
    useful: 'These are confirmed systems, not a completed map. Exact routes, cave layouts, chart locations and collectible coordinates should only be published after verified gameplay. The future map database will connect every region page to resources, obstacles, companion requirements and nearby quests.',
    verify: ['Full region and cave names', 'Fast-travel rules and campsite locations', 'Nautical chart sources and island routes', 'Collectible totals and exact coordinates'],
    related: [['../animal-companions/', 'Animal companions'], ['../campsites-travel/', 'Campsites and travel'], ['../../locations/', 'Locations hub']]
  },
  {
    slug: 'features/animal-companions',
    title: 'Echoes of Teradea Animal Companions and Abilities',
    description: 'Confirmed animal companion abilities in Echoes of Teradea, including terrain traversal, obstacle breaking and treasure exploration.',
    eyebrow: 'Confirmed Feature',
    answer: 'Animal companions in Echoes of Teradea do more than follow the player. Natsume says different animals provide special abilities for crossing terrain, breaking rocks or fallen trees, reaching hidden areas and finding treasure.',
    details: ['Animals can travel alongside the player', 'Different companions have distinct abilities', 'Some abilities help cross difficult terrain', 'Companions can destroy rocks or fallen trees', 'Animal skills can reveal hidden areas and treasures', 'A guardian wolf is part of the announced story setup'],
    useful: 'The official description establishes the role of companions but does not provide a complete animal list or unlock guide. Each future animal page should name the location, taming or unlock requirement, traversal ability, bond effects and the exact obstacles it can handle.',
    verify: ['Complete companion list', 'Taming and bonding requirements', 'Ability strength and obstacle types', 'Whether companions help with farming or combat'],
    related: [['../../mounts-pets/', 'Mounts and pets hub'], ['../open-world-exploration/', 'Open-world guide'], ['../../locations/forest-of-echoes/', 'Forest of Echoes']]
  },
  {
    slug: 'features/campsites-travel',
    title: 'Echoes of Teradea Campsites, Cooking, and Travel',
    description: 'How the confirmed campsite and travel system works in Harvest Moon: Echoes of Teradea, plus the details awaiting gameplay verification.',
    eyebrow: 'Confirmed Feature',
    answer: 'Campsites let players rest, recover stamina and cook meals while exploring Teradea. Natsume also confirms traveling merchants at campsites who sell exclusive items not found elsewhere.',
    details: ['Campsites support long-distance exploration', 'Resting restores stamina', 'Meals can be cooked by the fire', 'Traveling merchants appear at campsites', 'Some merchant items are exclusive', 'Exact campsite positions are not yet published'],
    useful: 'The campsite system links exploration, stamina, cooking and shopping intent. After launch, this guide should become a verified directory of campsite locations, nearby resources, rest effects, merchant inventories and the best routes between villages.',
    verify: ['All campsite coordinates', 'Rest duration and stamina recovery values', 'Campfire recipe requirements', 'Merchant schedules and exclusive inventories'],
    related: [['../open-world-exploration/', 'Open-world guide'], ['../../items-recipes-materials/', 'Items and recipes'], ['../../locations/', 'Locations hub']]
  },
  {
    slug: 'features/power-statues-wisps',
    title: 'Echoes of Teradea Power Statues and Power Wisps',
    description: 'Confirmed Power Statue challenges, Power Wisp Fruits and Forest Goddess Statue upgrades in Harvest Moon: Echoes of Teradea.',
    eyebrow: 'Confirmed Feature',
    answer: 'Glowing Power Statues contain short challenges or puzzles. Completing them frees dormant Power Wisps and awards Power Wisp Fruits, which can be traded at the Forest Goddess Statue for stamina boosts and useful abilities.',
    details: ['Power Statues are hidden across the world', 'Each statue offers a challenge or puzzle', 'Completing challenges frees Power Wisps', 'Rewards include Power Wisp Fruits', 'Fruits are traded at the Forest Goddess Statue', 'Upgrades include stamina and useful abilities'],
    useful: 'This system is likely to generate high-intent searches for statue locations and upgrade order. Those leaf pages should not be created until each statue has a verified location, access requirement, puzzle solution and reward.',
    verify: ['Total number of statues and Wisps', 'Exact statue locations', 'Puzzle solutions and companion requirements', 'Upgrade costs, caps and recommended order'],
    related: [['../open-world-exploration/', 'Exploration guide'], ['../../map-exploration/', 'Map hub'], ['../../beginner-guide/', 'Beginner guide']]
  },
  {
    slug: 'locations/bloomfield-village',
    title: 'Bloomfield Village in Harvest Moon: Echoes of Teradea',
    description: 'Confirmed story role of Bloomfield Village, the player character’s home village in Echoes of Teradea.',
    eyebrow: 'Location Profile',
    answer: 'Bloomfield Village is the quiet village where the player character was raised. The journey begins as mist spreads from the nearby Forest of Echoes and wild wolves appear at night.',
    details: ['Player character’s home village', 'Located near the Forest of Echoes', 'Connected to the opening wolf and mist storyline', 'A best friend joins the early mission', 'Full shops, residents and facilities are not yet confirmed', 'Launch guide will map every service and schedule'],
    useful: 'Bloomfield is a confirmed named location, but the available official material does not yet establish its full map, businesses or residents. Future additions must be based on screenshots, official previews or direct gameplay rather than assumptions from earlier Harvest Moon games.',
    verify: ['Village map and exits', 'Resident and romance-candidate schedules', 'Shop inventories and opening hours', 'Farm location and early quest triggers'],
    related: [['../forest-of-echoes/', 'Forest of Echoes'], ['../../features/animal-companions/', 'Animal companions'], ['../../quests/', 'Quest hub']]
  },
  {
    slug: 'locations/forest-of-echoes',
    title: 'Forest of Echoes Guide for Echoes of Teradea',
    description: 'Confirmed Forest of Echoes story facts, wolves, mist and exploration context for Harvest Moon: Echoes of Teradea.',
    eyebrow: 'Location Profile',
    answer: 'The Forest of Echoes is the source of the mysterious mist covering Teradea. Wild wolves roam outside Bloomfield Village at night, and official story material mentions a large guardian wolf connected to the opening mission.',
    details: ['Source of the mist affecting Teradea', 'Near Bloomfield Village', 'Wild wolves appear at night', 'A guardian wolf is part of the story premise', 'The player sets out to tame the wolves', 'Exact map and encounter mechanics remain unconfirmed'],
    useful: 'This page provides the verified story answer without inventing a wolf-taming walkthrough. After hands-on access, it should add safe routes, resources, creature spawns, time-of-day conditions, companion gates and every quest step tied to the forest.',
    verify: ['Forest map and entrances', 'Wolf locations and taming steps', 'Nighttime spawn rules', 'Resources, secrets and quest objectives'],
    related: [['../bloomfield-village/', 'Bloomfield Village'], ['../../features/animal-companions/', 'Animal companions'], ['../../map-exploration/', 'Map hub']]
  },
  {
    slug: 'locations/tidewind',
    title: 'Tidewind Village in Harvest Moon: Echoes of Teradea',
    description: 'What is confirmed about Tidewind, the port village affected by storms in Harvest Moon: Echoes of Teradea.',
    eyebrow: 'Location Profile',
    answer: 'Tidewind is a port village in Teradea where the player investigates the cause of destructive storms. Natsume has confirmed the village and its story problem, but not the full restoration requirements or resident list.',
    details: ['Settlement type: port village', 'Main confirmed threat: storms', 'Player objective: uncover the cause', 'Part of the broader Guardian Spirit journey', 'Shops and residents: not yet fully detailed', 'Restoration steps: awaiting verified gameplay'],
    useful: 'A useful Tidewind guide will eventually connect the village map, restoration chain, fishing or port systems, shops, residents and nearby islands. None of those specifics should be inferred solely from the village being a port.',
    verify: ['Unlock route and arrival requirement', 'Storm quest chain and rewards', 'Village restoration materials', 'Residents, shops and nearby resources'],
    related: [['../quarrytop/', 'Quarrytop'], ['../maplehill/', 'Maplehill'], ['../../village-restoration/', 'Restoration hub']]
  },
  {
    slug: 'locations/quarrytop',
    title: 'Quarrytop Village in Harvest Moon: Echoes of Teradea',
    description: 'Confirmed Quarrytop mining-village story, earthquake mystery and the launch data still needed for a complete guide.',
    eyebrow: 'Location Profile',
    answer: 'Quarrytop is a mining village troubled by earthquakes. The player travels there to investigate their cause as part of the wider effort to revive Teradea.',
    details: ['Settlement type: mining village', 'Main confirmed threat: earthquakes', 'Player objective: investigate the cause', 'Mining is central to the village identity', 'Mine floors and ores: not yet confirmed', 'Restoration requirements: awaiting gameplay'],
    useful: 'The word “mining” signals future search demand, but it does not justify inventing ore tables or mine depth. The launch version should document the exact mine entrance, floor structure, hazards, tool requirements, ore nodes and village restoration chain.',
    verify: ['Mine entrance and floor progression', 'Ore and gem availability', 'Earthquake quest steps', 'Village shops, residents and restoration rewards'],
    related: [['../tidewind/', 'Tidewind'], ['../maplehill/', 'Maplehill'], ['../../tools-upgrades/', 'Tools and upgrades']]
  },
  {
    slug: 'locations/maplehill',
    title: 'Maplehill in Harvest Moon: Echoes of Teradea',
    description: 'Confirmed role of Maplehill, a faded cultural center the player helps revive in Harvest Moon: Echoes of Teradea.',
    eyebrow: 'Location Profile',
    answer: 'Maplehill is described by Natsume as a once-thriving town and cultural center. The player stays there and helps revive its fading light and community.',
    details: ['Settlement type: town and cultural center', 'Current state: no longer thriving', 'Player role: help revive the community', 'Part of the Teradea restoration journey', 'Specific culture and facilities: not yet detailed', 'Restoration chain: awaiting verified gameplay'],
    useful: 'The official premise supports a location profile, not a complete walkthrough. After release, this page should explain when Maplehill unlocks, where each resident and facility is located, what resources its restoration needs and which systems become available.',
    verify: ['Unlock condition and travel route', 'Restoration stages and material costs', 'Residents, cultural events and facilities', 'Rewards and connected quests'],
    related: [['../tidewind/', 'Tidewind'], ['../quarrytop/', 'Quarrytop'], ['../../village-restoration/', 'Restoration hub']]
  },
  {
    slug: 'romance/candidates',
    title: 'Echoes of Teradea Romance Candidates: What Is Confirmed',
    description: 'Confirmed romance-candidate count and relationship features in Harvest Moon: Echoes of Teradea without invented names, gifts or schedules.',
    eyebrow: 'Romance Guide',
    answer: 'Harvest Moon: Echoes of Teradea has 10 romance options: five bachelors and five bachelorettes. Natsume confirms relationship building, character events and choosing a partner, but the full verified candidate guide is still being assembled from official information.',
    details: ['Total romance options: 10', 'Bachelors: five', 'Bachelorettes: five', 'Relationship events: confirmed', 'Marriage or life-partner outcome: confirmed in official description', 'Gift preferences and schedules: not yet verified'],
    useful: 'Candidate names, birthdays, loved gifts and heart-event triggers are high-value launch queries, but incorrect tables would harm players and search trust. Each candidate URL should activate only after its identity, schedule, gifts and event requirements pass the content quality gate.',
    verify: ['All candidate names and home locations', 'Daily and seasonal schedules', 'Loved, liked and disliked gifts', 'Event triggers and partnership requirements'],
    related: [['../', 'Romance hub'], ['../../characters/', 'Characters hub'], ['../../festivals-events/', 'Festivals and events']]
  },
  {
    slug: 'preorder/wolf-plush',
    title: 'Echoes of Teradea Lupo Wolf Plush Preorder Bonus',
    description: 'Confirmed Lupo baby wolf plush preorder offer, eligible physical platforms, price and availability conditions from the Natsume Store.',
    eyebrow: 'Preorder Bonus',
    answer: 'The Natsume Store offers a free Lupo baby wolf plush with eligible physical preorders of Echoes of Teradea for Switch, Switch 2 or PS5 while supplies last. The store listed each edition at $49.99 when checked July 17, 2026.',
    details: ['Bonus: Lupo baby wolf plush', 'Retailer: Natsume Store', 'Eligible platforms: Switch, Switch 2 and PS5', 'Offer condition: while supplies last', 'Listed price checked July 17, 2026: $49.99', 'Release date: September 24, 2026'],
    useful: 'The plush is a retailer-specific physical bonus, so players should verify stock and order terms before paying. The official store notes that orders combining preorder and in-stock products are held until all items are available.',
    verify: ['Current stock availability', 'Shipping eligibility by country', 'Whether other retailers offer different bonuses', 'Final order and cancellation terms'],
    related: [['../', 'Preorder guide'], ['../../platforms/nintendo-switch/', 'Switch version'], ['../../platforms/ps5/', 'PS5 version']]
  }
];

const hubs = [
  {
    slug: 'features', title: 'Harvest Moon: Echoes of Teradea Features', description: 'Confirmed gameplay features including open-world exploration, companions, campsites, movement, Power Statues, romance and village restoration.',
    answer: 'Official announcements confirm a massive open world, animal companion abilities, campsites, expanded movement, Power Statue challenges, farming, relationships and a multi-village restoration story.',
    links: pages.filter(p => p.slug.startsWith('features/')).map(p => [`${p.slug.split('/')[1]}/`, p.title])
  },
  {
    slug: 'locations', title: 'Harvest Moon: Echoes of Teradea Locations', description: 'Confirmed Teradea villages and regions, including Bloomfield, Forest of Echoes, Tidewind, Quarrytop and Maplehill.',
    answer: 'Five named places are confirmed in official material: Bloomfield Village, the Forest of Echoes, Tidewind, Quarrytop and Maplehill. Each has a distinct role in the mist and village-revival story.',
    links: pages.filter(p => p.slug.startsWith('locations/')).map(p => [`${p.slug.split('/')[1]}/`, p.title])
  }
];

function escape(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function schema(page, url) {
  return JSON.stringify({
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'Article', headline: page.title, description: page.description, dateModified: modified, inLanguage: 'en', mainEntityOfPage: url, about: { '@type': 'VideoGame', name: 'Harvest Moon: Echoes of Teradea', datePublished: '2026-09-24', gamePlatform: ['Nintendo Switch', 'Nintendo Switch 2', 'PlayStation 5', 'Xbox Series X|S', 'PC (Steam)'] } },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` }, { '@type': 'ListItem', position: 2, name: page.title, item: url }] }
    ]
  });
}

function pageHtml(page) {
  const depth = page.slug.split('/').length;
  const prefix = '../'.repeat(depth);
  const url = `${site}/${page.slug}/`;
  const parent = page.slug.split('/')[0];
  const rows = page.details.map(x => `<li>${escape(x)}</li>`).join('');
  const checks = page.verify.map(x => `<li>${escape(x)}</li>`).join('');
  const links = page.related.map(([href, label]) => `<a href="${href}">${escape(label)}</a>`).join('');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(page.title)}</title><meta name="description" content="${escape(page.description)}"><meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${url}"><link rel="icon" type="image/svg+xml" href="${prefix}assets/site-icon.svg"><link rel="stylesheet" href="${prefix}styles.css">
<meta property="og:title" content="${escape(page.title)}"><meta property="og:description" content="${escape(page.description)}"><meta property="og:type" content="article"><meta property="og:url" content="${url}"><meta property="og:image" content="${site}/assets/hero-fan-art.png"><meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${schema(page, url)}</script></head><body>
<header class="site-header"><a class="brand" href="${prefix}"><span class="brand-mark">HM</span><span>Echoes Guide</span></a><nav class="nav" aria-label="Primary navigation"><a href="${prefix}release-date/">Release</a><a href="${prefix}platforms/">Platforms</a><a href="${prefix}features/">Features</a><a href="${prefix}locations/">Locations</a><a href="${prefix}faq/">FAQ</a></nav></header>
<main><section class="subpage-hero"><div class="breadcrumb"><a href="${prefix}">Home</a><span>/</span><a href="${prefix}${parent}/">${parent[0].toUpperCase() + parent.slice(1)}</a><span>/</span><span>${escape(page.title)}</span></div><p class="eyebrow">${escape(page.eyebrow)}</p><h1>${escape(page.title)}</h1><p>${escape(page.description)}</p></section>
<section class="section article-layout"><article class="article-main"><h2 id="answer">Quick answer</h2><p class="callout">${escape(page.answer)}</p><h2 id="confirmed">Confirmed details</h2><ul class="content-list">${rows}</ul><h2 id="meaning">What this means for players</h2><p>${escape(page.useful)}</p><h2 id="verify">Still to verify</h2><ul class="content-list">${checks}</ul><h2 id="sources">Source and update policy</h2><p>This page was checked on July 17, 2026 against Natsume’s March 11 and June 18 official announcements and, where relevant, the Natsume Store preorder listing. Unknown gameplay values are deliberately excluded until a primary listing or verified hands-on play supports them.</p><div class="page-links">${links}</div></article><aside class="toc"><h2>On This Page</h2><a href="#answer">Quick answer</a><a href="#confirmed">Confirmed details</a><a href="#meaning">Player impact</a><a href="#verify">Still to verify</a><a href="#sources">Sources</a></aside></section></main>
<footer class="site-footer"><p>Unofficial fan guide. Not affiliated with Natsume or platform holders. Updated July 17, 2026.</p><a href="${prefix}">Home</a></footer><script src="${prefix}script.js"></script></body></html>`;
}

function hubHtml(hub) {
  const url = `${site}/${hub.slug}/`;
  const cards = hub.links.map(([href, label]) => `<article class="guide-card"><h2><a href="${href}">${escape(label)}</a></h2><p>Open the fact-checked guide and see which details are confirmed and which still require launch verification.</p></article>`).join('');
  const page = { ...hub, eyebrow: 'Guide Hub' };
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(hub.title)}</title><meta name="description" content="${escape(hub.description)}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${url}"><link rel="icon" href="../assets/site-icon.svg"><link rel="stylesheet" href="../styles.css"><meta property="og:title" content="${escape(hub.title)}"><meta property="og:description" content="${escape(hub.description)}"><meta property="og:type" content="website"><meta property="og:url" content="${url}"><meta property="og:image" content="${site}/assets/hero-fan-art.png"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${schema(page, url)}</script></head><body><header class="site-header"><a class="brand" href="../"><span class="brand-mark">HM</span><span>Echoes Guide</span></a><nav class="nav"><a href="../release-date/">Release</a><a href="../platforms/">Platforms</a><a href="../features/">Features</a><a href="../locations/">Locations</a><a href="../faq/">FAQ</a></nav></header><main><section class="subpage-hero"><div class="breadcrumb"><a href="../">Home</a><span>/</span><span>${escape(hub.title)}</span></div><p class="eyebrow">Confirmed Information Hub</p><h1>${escape(hub.title)}</h1><p>${escape(hub.description)}</p></section><section class="section"><h2>What is confirmed</h2><p class="callout">${escape(hub.answer)}</p><p>These pages are intentionally limited to facts supported by official announcements. Exact maps, item values, schedules and walkthrough steps will be added only after they can be verified.</p><div class="card-grid">${cards}</div></section></main><footer class="site-footer"><p>Unofficial fan guide. Updated July 17, 2026.</p><a href="../">Home</a></footer></body></html>`;
}

for (const page of pages) {
  const out = path.join(root, page.slug, 'index.html');
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, pageHtml(page));
}
for (const hub of hubs) {
  const out = path.join(root, hub.slug, 'index.html');
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, hubHtml(hub));
}

console.log(`Generated ${pages.length + hubs.length} confirmed-information pages.`);
