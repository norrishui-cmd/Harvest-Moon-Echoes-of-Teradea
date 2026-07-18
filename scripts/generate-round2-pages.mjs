import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const site = 'https://harvestmoonechoesofteradea.wiki';
const modified = '2026-07-18';

const pages = [
  {
    slug: 'features/untamed-wilderness',
    title: 'Echoes of Teradea Wild Animals and Item Loss',
    description: 'How wolves, bears and tigers work in the untamed wilderness, including the confirmed penalty for getting caught.',
    eyebrow: 'Exploration Mechanic',
    answer: 'Wolves, bears and tigers are confirmed wilderness threats in Echoes of Teradea. Natsume says players must evade and escape them; getting caught makes the player lose collected items and return to the farm.',
    facts: ['Confirmed threats include wolves, bears and tigers.', 'The intended response is to evade or escape wild animals.', 'Getting caught causes collected-item loss.', 'After being caught, the player returns to the farm.', 'Combat, health values and exact item-loss rules have not been announced.'],
    guidance: 'This is a meaningful exploration penalty, so planning a route back to storage may matter after a long gathering trip. The official announcement does not establish whether every carried item can be lost, whether tools are protected, or whether animal companions can prevent the penalty. Those details must wait for verified gameplay.',
    checks: ['Which inventory categories can be lost', 'Whether the penalty changes by difficulty or region', 'Wild-animal spawn times and locations', 'Escape tools, companion effects and safe zones'],
    links: [['../../locations/forest-of-echoes/', 'Forest of Echoes'], ['../animal-companions/', 'Animal companions'], ['../open-world-exploration/', 'Open-world exploration']]
  },
  {
    slug: 'features/islands-nautical-charts',
    title: 'Echoes of Teradea Islands and Nautical Charts',
    description: 'What nautical charts unlock in Echoes of Teradea and what players can expect to find on remote islands.',
    eyebrow: 'Island Exploration',
    answer: 'Players can obtain nautical charts to locate remote islands in Echoes of Teradea. Natsume confirms that the islands support treasure hunting and contain rare animals not found on the mainland.',
    facts: ['Nautical charts are required to locate remote islands.', 'Remote islands contain treasure-hunting opportunities.', 'Rare animals can be befriended on islands.', 'Some island animals do not appear on the mainland.', 'Chart sources, boat mechanics and island count remain unconfirmed.'],
    guidance: 'The confirmed island loop connects collection, animal companionship and exploration. A launch-quality chart page will need the exact chart source, required progression, destination, island resources and rare animal. Until those fields are known, this overview answers the system-level question without inventing an island directory.',
    checks: ['Where each nautical chart is obtained', 'How the player travels to an island', 'Number and names of remote islands', 'Island-only treasures, resources and animals'],
    links: [['../open-world-exploration/', 'Open-world exploration'], ['../animal-companions/', 'Animal companions'], ['../../locations/', 'Locations hub']]
  },
  {
    slug: 'features/happilia',
    title: 'What Is Happilia in Echoes of Teradea?',
    description: 'The confirmed meaning of Happilia and how helping villagers contributes to the development of Teradea.',
    eyebrow: 'Progression System',
    answer: 'Happilia is a confirmed progression reward tied to helping villagers and contributing to Teradea’s development. Natsume has named the system but has not yet published its complete earning rules, levels or unlock table.',
    facts: ['Happilia is gained by helping villagers.', 'Contributing to Teradea’s development also earns Happilia.', 'The system is connected to the game’s village-revival theme.', 'Exact values, ranks and rewards have not been disclosed.', 'Happilia should not be confused with money or relationship points until gameplay confirms the distinction.'],
    guidance: 'Players searching Happilia are likely trying to understand whether it is currency, reputation or a development score. The safe answer is that it measures or rewards helpful contribution; a more specific classification would be speculation. After release, this page should document every source, milestone, unlock and efficient route.',
    checks: ['Whether Happilia is spent or accumulated', 'Village-specific versus global totals', 'Milestone rewards and unlock thresholds', 'Best repeatable and one-time sources'],
    links: [['../../village-restoration/', 'Village restoration'], ['../../quests/', 'Quest hub'], ['../../locations/', 'Locations hub']]
  },
  {
    slug: 'features/farming-system',
    title: 'Echoes of Teradea Farming, Crops, and Animals',
    description: 'Confirmed farming activities in Echoes of Teradea and the crop, animal and economy data still awaiting gameplay verification.',
    eyebrow: 'Farming Overview',
    answer: 'Echoes of Teradea retains the series’ core farm loop: players tend a farm, raise animals and harvest crops between journeys across Teradea. Exact crops, growth times, animal products and sell prices have not yet been published.',
    facts: ['A player farm is part of the confirmed game loop.', 'Crop growing and harvesting are confirmed.', 'Farm animals can be raised.', 'Farming takes place between exploration and village-helping journeys.', 'No verified crop-profit or animal-product table is available yet.'],
    guidance: 'This overview establishes what the game includes while keeping numerical databases out of search until they contain real answers. The future crop pages must include season, seed source, cost, growth days, regrowth, sell price and profit per day; animal pages need purchase source, care, products and unlocks.',
    checks: ['Full crop and flower list', 'Season rules and growth times', 'Animal species, care and products', 'Farm upgrades, layouts and automation'],
    links: [['../../farming-guide/', 'Farming guide hub'], ['../../money-guide/', 'Money guide'], ['../campsites-travel/', 'Campsites and cooking']]
  },
  {
    slug: 'features/guardian-spirits',
    title: 'Guardian Spirits in Harvest Moon: Echoes of Teradea',
    description: 'What Guardian Spirits do in the confirmed story of Echoes of Teradea and how they connect to reviving the world.',
    eyebrow: 'Story System',
    answer: 'Guardian Spirits are powerful beings the player befriends while working to revive and revitalize Teradea. They are tied to the mysteries affecting the villages, but Natsume has not yet named the full group or published their individual powers.',
    facts: ['Helping Guardian Spirits is part of the main journey.', 'Their revival is connected to restoring Teradea.', 'They are described as powerful allies.', 'The Harvest Goddess and Doc Jr. are also confirmed allies.', 'Individual Guardian Spirit names and abilities remain unannounced.'],
    guidance: 'A future Guardian Spirit database should separate story identity, associated region, unlock quest, ability and reward. Publishing one empty page per presumed spirit now would create thin content, so this verified overview remains the canonical search target until names and roles are officially disclosed.',
    checks: ['Complete Guardian Spirit roster', 'Associated villages and natural disasters', 'Unlock and revival quest chains', 'Abilities, rewards and post-restoration roles'],
    links: [['../../characters/harvest-goddess/', 'Harvest Goddess'], ['../../characters/doc-jr/', 'Doc Jr.'], ['../../village-restoration/', 'Village restoration']]
  },
  {
    slug: 'features/player-movement',
    title: 'Can You Jump and Climb in Echoes of Teradea?',
    description: 'Confirmed jumping, ladder climbing and vine scaling in Echoes of Teradea, including how movement combines with animal abilities.',
    eyebrow: 'Movement Guide',
    answer: 'Yes. Echoes of Teradea lets the player jump, climb ladders and scale vines. These movement abilities combine with animal companions to reach hidden areas, cross terrain and gather resources.',
    facts: ['Player jumping is officially confirmed.', 'Ladders can be climbed.', 'Vines can be scaled to reach higher areas.', 'Movement skills lead to hidden or previously inaccessible locations.', 'Animal companion abilities add more traversal options.'],
    guidance: 'This is a notable change for searches comparing Echoes of Teradea with earlier farming games. The official material confirms the actions but not stamina costs, fall damage, control schemes or upgrade requirements. Those details will be added only after platform listings or hands-on testing supports them.',
    checks: ['Whether movement consumes stamina', 'Control mapping on each platform', 'Fall damage or traversal penalties', 'Movement upgrades and companion combinations'],
    links: [['../animal-companions/', 'Animal companions'], ['../open-world-exploration/', 'Open-world exploration'], ['../power-statues-wisps/', 'Power Statues and abilities']]
  },
  {
    slug: 'characters/harvest-goddess',
    title: 'Harvest Goddess in Echoes of Teradea',
    description: 'The confirmed role of the Harvest Goddess as a guide and ally in Harvest Moon: Echoes of Teradea.',
    eyebrow: 'Character Profile',
    answer: 'The Harvest Goddess is a confirmed ally who guides the player during the effort to restore Teradea. Official material also names a Forest Goddess Statue used to exchange Power Wisp Fruits, but it does not yet clarify whether that statue represents the same character.',
    facts: ['The Harvest Goddess guides the player.', 'She is described as an ally in the Teradea journey.', 'Power Wisp Fruits are traded at the Forest Goddess Statue.', 'The relationship between the Harvest Goddess and Forest Goddess terminology is not yet clarified.', 'Romance status has not been announced.'],
    guidance: 'This profile deliberately avoids assuming that the Harvest Goddess is romanceable or that two goddess terms refer to separate characters. Those are distinct player questions that require official wording or verified scenes. Future updates should add appearance, location, quest role and unlocks with supporting evidence.',
    checks: ['First meeting and location', 'Guardian Spirit connections', 'Statue terminology and identity', 'Quests, gifts or relationship mechanics'],
    links: [['../doc-jr/', 'Doc Jr.'], ['../../features/power-statues-wisps/', 'Power Wisps'], ['../../features/guardian-spirits/', 'Guardian Spirits']]
  },
  {
    slug: 'characters/doc-jr',
    title: 'Doc Jr. in Harvest Moon: Echoes of Teradea',
    description: 'What Natsume has confirmed about ingenious inventor Doc Jr. and his role as an ally in Echoes of Teradea.',
    eyebrow: 'Character Profile',
    answer: 'Doc Jr. is officially confirmed to return in Echoes of Teradea as an ingenious inventor and ally. Natsume has not yet detailed his inventions, home village, shop or quest chain in this game.',
    facts: ['Doc Jr. is a confirmed named character.', 'He is described as an ingenious inventor.', 'He helps the player as an ally.', 'Specific inventions and services have not been announced.', 'Romance status has not been announced.'],
    guidance: 'Doc Jr. has appeared in other Harvest Moon titles, but details from those games must not be copied into this game’s profile as if they are confirmed. This page will add only Echoes of Teradea-specific location, schedule, inventions, requests and rewards when supported.',
    checks: ['Home village and daily schedule', 'Workshop or shop services', 'Inventions and upgrade systems', 'Quest chain and relationship role'],
    links: [['../harvest-goddess/', 'Harvest Goddess'], ['../../features/guardian-spirits/', 'Guardian Spirits'], ['../', 'Characters hub']]
  },
  {
    slug: 'characters/lupo',
    title: 'Who Is Lupo in Echoes of Teradea?',
    description: 'Confirmed information about Lupo, the Bloomfield Guardian and baby wolf plush preorder character.',
    eyebrow: 'Character Profile',
    answer: 'Lupo is identified by Natsume as the Bloomfield Guardian and appears as the baby wolf plush offered with eligible preorders. Official material reviewed so far does not fully explain Lupo’s in-game role, abilities or relationship to the rumored guardian wolf.',
    facts: ['Name: Lupo', 'Official label: the Bloomfield Guardian', 'Represented by the baby wolf preorder plush', 'The plush offer applies while supplies last', 'Exact in-game role and abilities remain undisclosed.'],
    guidance: 'The name and title support a standalone entity page, but it would be speculative to call Lupo a mount, pet, Guardian Spirit or the large guardian wolf mentioned in the story. The page will keep those possibilities separate until official material connects them.',
    checks: ['Lupo’s in-game species and role', 'Connection to the guardian wolf', 'How and when Lupo is encountered', 'Companion, mount or story abilities'],
    links: [['../../preorder/wolf-plush/', 'Lupo plush preorder'], ['../../locations/bloomfield-village/', 'Bloomfield Village'], ['../../features/animal-companions/', 'Animal companions']]
  },
  {
    slug: 'preorder/retailers',
    title: 'Where to Preorder Echoes of Teradea',
    description: 'Confirmed Echoes of Teradea preorder retailers, eligible physical platforms and the Lupo plush store bonus.',
    eyebrow: 'Buying Guide',
    answer: 'Natsume lists Echoes of Teradea preorders at Amazon, the Natsume Store, Target, Walmart, Best Buy and GameStop. Physical Switch, Switch 2 and PS5 editions are confirmed; the Lupo baby wolf plush is specifically tied to the Natsume Store offer while supplies last.',
    facts: ['Confirmed retailers: Amazon, Natsume Store, Target, Walmart, Best Buy and GameStop.', 'Physical platforms named by Natsume: Switch, Switch 2 and PS5.', 'Natsume Store bonus: Lupo baby wolf plush while supplies last.', 'Xbox and Steam are confirmed release platforms but not part of the named physical preorder list.', 'Retail price and stock should be rechecked before purchase.'],
    guidance: 'Retail offers can change, so this page records the official retailer list rather than copying live inventory or implying every store has the same bonus. Players should check platform, region, shipping and cancellation terms on the retailer’s own checkout page.',
    checks: ['Current stock by retailer and platform', 'Regional shipping eligibility', 'Any retailer-exclusive bonuses', 'Digital preorder pages and preload timing'],
    links: [['../wolf-plush/', 'Lupo plush bonus'], ['../', 'Preorder overview'], ['../../platforms/', 'Platform comparison']]
  }
];

const faqs = [
  ['is-echoes-of-teradea-open-world', 'Is Echoes of Teradea Open World?', 'Yes. Natsume describes Echoes of Teradea as a massive open-world experience with villages, wilderness, maze-like caves and remote islands.', ['The world includes multiple named villages.', 'Caves contain ore and gems.', 'Nautical charts lead to remote islands.', 'Animal abilities and expanded movement open hidden routes.'], [['../../features/open-world-exploration/', 'Open-world guide'], ['../../locations/', 'Locations']]],
  ['is-there-multiplayer-or-coop', 'Does Echoes of Teradea Have Multiplayer or Co-op?', 'No multiplayer or co-op mode has been announced. The official Natsume Store listing describes Echoes of Teradea as a one-player game.', ['Official player count: one player.', 'No online multiplayer announcement has been made.', 'No local co-op announcement has been made.', 'The animal companion system is single-player gameplay, not co-op.'], [['../../platforms/', 'Platforms'], ['../../features/animal-companions/', 'Animal companions']]],
  ['how-many-romance-candidates', 'How Many Romance Candidates Are in Echoes of Teradea?', 'Echoes of Teradea has 10 confirmed romance candidates: five bachelors and five bachelorettes.', ['Ten love interests are officially confirmed.', 'The split is five bachelors and five bachelorettes.', 'Relationship events and choosing a partner are confirmed.', 'Complete names, gifts and schedules are not yet published.'], [['../../romance/candidates/', 'Romance candidates'], ['../../characters/', 'Characters']]],
  ['can-you-get-married', 'Can You Get Married in Echoes of Teradea?', 'Yes. Natsume explicitly confirms that players can woo the new love interests and marry the person they choose.', ['Marriage is officially confirmed.', 'There are five bachelors and five bachelorettes.', 'Relationship building and events lead toward partnership.', 'Marriage requirements and post-marriage features remain unconfirmed.'], [['../../romance/candidates/', 'Romance candidates'], ['../../romance/', 'Romance hub']]],
  ['can-you-jump-and-climb', 'Echoes of Teradea Jumping and Climbing FAQ', 'Yes. Players can jump, climb ladders and scale vines to reach hidden locations, higher areas and resources.', ['Jumping is confirmed.', 'Ladder climbing is confirmed.', 'Vine scaling is confirmed.', 'Movement combines with animal abilities.'], [['../../features/player-movement/', 'Movement guide'], ['../../features/open-world-exploration/', 'Exploration']]],
  ['are-there-islands', 'Are There Islands in Echoes of Teradea?', 'Yes. Remote islands are confirmed, and players use nautical charts to locate them for treasure hunting and rare animals.', ['Remote islands are part of Teradea.', 'Nautical charts reveal island locations.', 'Islands contain treasure opportunities.', 'Some rare animals are not found on the mainland.'], [['../../features/islands-nautical-charts/', 'Islands and charts'], ['../../features/animal-companions/', 'Animal companions']]],
  ['what-is-happilia', 'Echoes of Teradea Happilia FAQ: Meaning and Uses', 'Happilia is earned by helping villagers and contributing to the development of Teradea. Its exact levels and rewards have not yet been disclosed.', ['Helping villagers earns Happilia.', 'World development contributes to it.', 'It is part of the restoration progression.', 'Whether it is spent like currency is not confirmed.'], [['../../features/happilia/', 'Happilia guide'], ['../../village-restoration/', 'Village restoration']]],
  ['what-are-power-wisps', 'What Are Power Wisps in Echoes of Teradea?', 'Power Wisps are dormant beings freed by completing Power Statue challenges. The resulting Power Wisp Fruits can be exchanged for stamina and useful abilities.', ['Power Statues contain short challenges or puzzles.', 'Completing them frees Power Wisps.', 'The reward includes Power Wisp Fruits.', 'Fruits are traded at the Forest Goddess Statue.'], [['../../features/power-statues-wisps/', 'Power Wisps guide'], ['../../characters/harvest-goddess/', 'Harvest Goddess']]],
  ['can-animals-break-rocks-and-trees', 'Can Animals Break Rocks and Trees in Echoes of Teradea?', 'Yes. Natsume confirms that animal companions can use special abilities to destroy obstacles such as rocks and fallen trees and reach hidden areas.', ['Animal abilities go beyond companionship.', 'Rocks are a confirmed obstacle type.', 'Fallen trees are a confirmed obstacle type.', 'Different animals are expected to have distinct abilities.'], [['../../features/animal-companions/', 'Animal companions'], ['../../features/open-world-exploration/', 'Exploration']]],
  ['what-happens-if-a-wild-animal-catches-you', 'What Happens If a Wild Animal Catches You?', 'If a wild animal catches the player, Natsume says the player loses collected items and is sent back to the farm.', ['Wolves, bears and tigers are confirmed threats.', 'Players are expected to evade or escape.', 'Collected-item loss is the stated penalty.', 'The player returns to the farm.'], [['../../features/untamed-wilderness/', 'Wild animals and item loss'], ['../../locations/forest-of-echoes/', 'Forest of Echoes']]]
].map(([id, title, answer, facts, links]) => ({ slug: `faq/${id}`, title, description: `${answer} See the confirmed details and the information still awaiting gameplay verification.`, eyebrow: 'Quick Answer', answer, facts, guidance: 'This answer is limited to information published by Natsume. Exact values, triggers and platform behavior will be added only when official store pages or verified gameplay provide evidence.', checks: ['Launch-day gameplay verification', 'Platform-specific differences', 'Any later publisher clarification'], links }));

function esc(value) { return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;'); }
function schema(p, url) {
  const type = p.slug.startsWith('faq/') ? { '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: p.title, acceptedAnswer: { '@type': 'Answer', text: p.answer } }] } : { '@type': 'Article', headline: p.title, description: p.description, dateModified: modified, inLanguage: 'en', mainEntityOfPage: url, about: { '@type': 'VideoGame', name: 'Harvest Moon: Echoes of Teradea' } };
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': [type, { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` }, { '@type': 'ListItem', position: 2, name: p.title, item: url }] }] });
}
function html(p) {
  const depth = p.slug.split('/').length;
  const prefix = '../'.repeat(depth);
  const url = `${site}/${p.slug}/`;
  const parent = p.slug.split('/')[0];
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(p.title)}</title><meta name="description" content="${esc(p.description)}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${url}"><link rel="icon" href="${prefix}assets/site-icon.svg"><link rel="stylesheet" href="${prefix}styles.css"><meta property="og:title" content="${esc(p.title)}"><meta property="og:description" content="${esc(p.description)}"><meta property="og:type" content="article"><meta property="og:url" content="${url}"><meta property="og:image" content="${site}/assets/hero-fan-art.png"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${schema(p, url)}</script></head><body><header class="site-header"><a class="brand" href="${prefix}"><span class="brand-mark">HM</span><span>Echoes Guide</span></a><nav class="nav"><a href="${prefix}release-date/">Release</a><a href="${prefix}characters/">Characters</a><a href="${prefix}features/">Features</a><a href="${prefix}locations/">Locations</a><a href="${prefix}faq/">FAQ</a></nav></header><main><section class="subpage-hero"><div class="breadcrumb"><a href="${prefix}">Home</a><span>/</span><a href="${prefix}${parent}/">${parent[0].toUpperCase()+parent.slice(1)}</a><span>/</span><span>${esc(p.title)}</span></div><p class="eyebrow">${esc(p.eyebrow)}</p><h1>${esc(p.title)}</h1><p>${esc(p.description)}</p></section><section class="section article-layout"><article class="article-main"><h2 id="answer">Quick answer</h2><p class="callout">${esc(p.answer)}</p><h2 id="confirmed">Confirmed facts</h2><ul class="content-list">${p.facts.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><h2 id="meaning">What players should know</h2><p>${esc(p.guidance)}</p><h2 id="verify">Still to verify</h2><ul class="content-list">${p.checks.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><h2 id="source">Source policy</h2><p>Checked July 18, 2026 against Natsume’s March 11 title announcement, June 18 trailer announcement and official store information where relevant. Unknown mechanics are excluded rather than inferred from earlier Harvest Moon games.</p><div class="page-links">${p.links.map(([href,label])=>`<a href="${href}">${esc(label)}</a>`).join('')}</div></article><aside class="toc"><h2>On This Page</h2><a href="#answer">Quick answer</a><a href="#confirmed">Confirmed facts</a><a href="#meaning">Player meaning</a><a href="#verify">Still to verify</a><a href="#source">Source policy</a></aside></section></main><footer class="site-footer"><p>Unofficial fan guide. Updated July 18, 2026.</p><a href="${prefix}">Home</a></footer></body></html>`;
}

for (const p of [...pages, ...faqs]) {
  const out = path.join(root, p.slug, 'index.html');
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, html(p));
}

function hub(slug, title, description, intro, cards) {
  const url = `${site}/${slug}/`;
  const list = cards.map(([href,label,text])=>`<article class="guide-card"><h2><a href="${href}">${esc(label)}</a></h2><p>${esc(text)}</p></article>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${url}"><link rel="icon" href="../assets/site-icon.svg"><link rel="stylesheet" href="../styles.css"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="website"><meta property="og:url" content="${url}"><meta property="og:image" content="${site}/assets/hero-fan-art.png"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'CollectionPage',name:title,description,url})}</script></head><body><header class="site-header"><a class="brand" href="../"><span class="brand-mark">HM</span><span>Echoes Guide</span></a><nav class="nav"><a href="../release-date/">Release</a><a href="../characters/">Characters</a><a href="../features/">Features</a><a href="../locations/">Locations</a><a href="../faq/">FAQ</a></nav></header><main><section class="subpage-hero"><div class="breadcrumb"><a href="../">Home</a><span>/</span><span>${esc(title)}</span></div><p class="eyebrow">Fact-Checked Hub</p><h1>${esc(title)}</h1><p>${esc(description)}</p></section><section class="section"><h2>What is confirmed</h2><p class="callout">${esc(intro)}</p><p>Each linked page gives a direct answer and separates official facts from details that still require launch verification.</p><div class="card-grid">${list}</div></section></main><footer class="site-footer"><p>Unofficial fan guide. Updated July 18, 2026.</p><a href="../">Home</a></footer></body></html>`;
}

const characterCards = pages.filter(p=>p.slug.startsWith('characters/')).map(p=>[`${p.slug.split('/')[1]}/`,p.title,p.answer]);
await writeFile(path.join(root,'characters/index.html'), hub('characters','Echoes of Teradea Characters','Confirmed Echoes of Teradea characters, allies and romance information, with unverified gifts and schedules excluded.','Natsume has named the Harvest Goddess, Doc Jr. and Lupo, and has confirmed 10 romance candidates. Complete resident, gift and schedule data is not yet public.',[...characterCards,['../romance/candidates/','Romance Candidates','Ten love interests are confirmed: five bachelors and five bachelorettes.']]));
const faqCards = faqs.map(p=>[`${p.slug.split('/')[1]}/`,p.title,p.answer]);
await writeFile(path.join(root,'faq/index.html'), hub('faq','Harvest Moon: Echoes of Teradea FAQ','Fact-checked answers about open-world exploration, multiplayer, marriage, movement, islands, Happilia, Power Wisps and animal abilities.','These answers use current official Natsume information and avoid treating unannounced mechanics as facts.',faqCards));
const featureCards = [...['open-world-exploration','animal-companions','campsites-travel','power-statues-wisps'].map(id=>[`${id}/`,id.split('-').map(x=>x[0].toUpperCase()+x.slice(1)).join(' '),'Open the confirmed first-round feature guide.']),...pages.filter(p=>p.slug.startsWith('features/')).map(p=>[`${p.slug.split('/')[1]}/`,p.title,p.answer])];
await writeFile(path.join(root,'features/index.html'), hub('features','Harvest Moon: Echoes of Teradea Features','Confirmed gameplay systems covering farming, open-world exploration, companions, islands, Happilia, wild animals, movement and Guardian Spirits.','Official announcements support a growing feature library without requiring invented crop values, quest steps or item locations.',featureCards));

console.log(`Generated ${pages.length + faqs.length} round-two leaf pages and refreshed 3 hubs.`);
