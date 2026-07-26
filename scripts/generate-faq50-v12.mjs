import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const site = 'https://harvestmoonechoesofteradea.wiki';
const reviewed = '2026-07-26';

const sources = {
  announce: {
    label: 'Natsume title announcement — March 11, 2026',
    url: 'https://www.natsume.com/news/news_pdffiles/pid_379_HM_EOT_TitleAnnouncementF.pdf',
    tier: 'Official publisher announcement'
  },
  preorder: {
    label: 'Natsume preorder announcement — May 12, 2026',
    url: 'https://www.natsume.com/news/news_pdffiles/pid_382_HM_EOT_Pre_OrderAnnouncementF.pdf',
    tier: 'Official publisher announcement'
  },
  trailer: {
    label: 'Natsume first-trailer announcement — June 18, 2026',
    url: 'https://www.natsume.com/news/news_pdffiles/pid_383_HMEOT_TrailerAnnouncementF.pdf',
    tier: 'Official publisher announcement'
  },
  store: {
    label: 'Natsume Store product listing',
    url: 'https://natsumestore.com/products/harvest-moon-echoes-of-teradea-with-free-wolf-plush',
    tier: 'First-party product listing'
  },
  bestbuy: {
    label: 'Best Buy product listing and screenshot gallery',
    url: 'https://www.bestbuy.com/product/harvest-moon-echoes-of-teradea-nintendo-switch/JXT5SL668Y',
    tier: 'Current retailer listing and visual evidence'
  }
};

const hubs = {
  'release-date': { label: 'Release', title: 'Release FAQ' },
  characters: { label: 'Characters', title: 'Character FAQ' },
  features: { label: 'Features', title: 'Feature FAQ' },
  locations: { label: 'Locations', title: 'Location FAQ' },
  faq: { label: 'General', title: 'General FAQ' },
  guides: { label: 'Guides', title: 'Guide FAQ' },
  platforms: { label: 'Platforms', title: 'Platform FAQ' },
  preorder: { label: 'Preorder', title: 'Preorder FAQ' },
  demo: { label: 'Demo', title: 'Demo FAQ' },
  'game-status': { label: 'Current Data', title: 'Current Data FAQ' }
};

const q = (hub, slug, question, answer, facts, boundary, source) => ({
  hub, slug, question, answer, facts, boundary, source: sources[source]
});

const faqs = [
  q('release-date','was-the-release-date-in-the-first-announcement','Was the Release Date Included in the First Announcement?','No. Natsume revealed the game on March 11, 2026 without a launch date; September 24, 2026 was announced with preorders in May.',[
    'The March reveal confirmed the title, platforms and major systems.',
    'The May preorder announcement supplied the September 24 date.',
    'The June trailer announcement repeated that date.'
  ],'This separates the reveal date from the release-date announcement and avoids treating early coverage as a delay report. Exact store unlock hours still require platform data.','preorder'),
  q('release-date','which-announcement-confirmed-september-24','Which Announcement Confirmed the September 24 Release Date?','Natsume’s May 12, 2026 preorder announcement first confirmed that Echoes of Teradea would launch on September 24, 2026.',[
    'The date applies to all five announced platform families.',
    'The first official trailer reconfirmed it on June 18.',
    'The Natsume Store currently displays the same date.'
  ],'Use the publisher announcement as the date source rather than a retailer countdown or an older undated reveal article.','preorder'),
  q('release-date','did-the-first-trailer-change-the-release-date','Did the First Trailer Change the Release Date?','No. The June 18 first-trailer announcement repeated the already announced September 24, 2026 release date.',[
    'The date was first published in May.',
    'The trailer added gameplay and world details.',
    'It did not announce a delay or a staggered platform launch.'
  ],'A new trailer is not automatically a schedule change. Regional digital unlock times and physical delivery dates can still vary.','trailer'),
  q('release-date','is-september-24-a-global-release-date','Is September 24 a Global Release Date?','Natsume presents September 24, 2026 as the shared release date for every announced platform, without publishing separate regional calendar dates.',[
    'Switch 2, Switch, PS5, Xbox Series X|S and Steam share the date.',
    'No region-specific date table appears in the announcements.',
    'Retailer availability can differ by country.'
  ],'The shared calendar date does not establish the exact hour in each time zone or guarantee same-day physical delivery.','trailer'),
  q('release-date','does-release-date-guarantee-preorder-delivery','Does the Release Date Guarantee Preorder Delivery That Day?','No. September 24, 2026 is the game’s release date, while delivery timing is controlled by the selected retailer, shipping service and destination.',[
    'Natsume confirms the launch date.',
    'Multiple retailers sell eligible physical editions.',
    'The publisher announcement does not promise arrival-by-release-day shipping.'
  ],'Check the order page for its own delivery estimate; do not interpret the publisher date as a shipping guarantee.','preorder'),

  q('characters','are-there-five-bachelors-and-five-bachelorettes','Are There Five Bachelors and Five Bachelorettes?','Yes. Natsume confirms ten new love interests, divided into five bachelors and five bachelorettes.',[
    'Relationship events are confirmed.',
    'The player can choose a partner.',
    'Marriage is part of the announced relationship system.'
  ],'The count is official, but Natsume has not yet published a complete candidate roster, gifts, birthdays or event requirements.','trailer'),
  q('characters','are-all-ten-love-interests-new','Are All Ten Love Interests New Characters?','Natsume describes the romance roster as ten new love interests: five bachelors and five bachelorettes.',[
    'The wording appears in the first-trailer announcement.',
    'The announcement separately names returning ally Doc Jr.',
    'Named screenshot characters have not all been classified as candidates.'
  ],'Do not assume Lorelei, Mara, Bryce, Cindy, Amad, Lily or Rick is romanceable until Natsume identifies their roles.','trailer'),
  q('characters','which-character-names-appear-in-screenshots','Which Character Names Appear in Current Screenshots?','Current retailer screenshots visibly name Lorelei, Mara, Bryce, Cindy, Amad, Lily and Rick.',[
    'Lorelei appears in dialogue about mine resources and union rules.',
    'Mara uses captain and ocean language.',
    'Bryce references a Maple Mart jam session with Cindy and Amad.',
    'A quest objective mentions Lily and Rick.'
  ],'These names are visual evidence, not a complete cast list or proof of romance status, occupation, birthday or schedule.','bestbuy'),
  q('characters','is-lorelei-connected-to-the-mine','Is Lorelei Connected to the Mine?','A current screenshot connects Lorelei to mine resources and union rules, but her exact job and home village are not yet stated.',[
    'Lorelei is visibly named in dialogue.',
    'Her line refers to protecting mine resources.',
    'The same line mentions following union rules.'
  ],'The screenshot supports a mine-related context only; it does not prove that Lorelei owns the mine, leads the union or is a romance candidate.','bestbuy'),
  q('characters','are-lily-and-rick-linked-by-a-quest','Are Lily and Rick Linked by a Quest?','Yes. A visible quest objective asks the player to get Lily’s favorite treats that Rick requested.',[
    'Both names appear in the same objective.',
    'The screenshot shows Bloomfield Village and Bloomfield Park labels.',
    'A numerical objective counter is visible.'
  ],'The screenshot does not reveal the treat name, quest title, reward, trigger, deadline or either character’s broader role.','bestbuy'),

  q('features','does-echoes-of-teradea-have-photo-mode','Does Echoes of Teradea Have Photo Mode?','Yes. A current gameplay screenshot shows an “Activate Photo Mode” command in the interface.',[
    'Photo Mode is explicitly named on screen.',
    'The command appears alongside DocPad, song selection and outfit controls.',
    'Natsume’s preorder announcement says its screenshots show new gameplay.'
  ],'Camera controls, filters, poses, hiding the UI and platform sharing options are not yet documented.','bestbuy'),
  q('features','can-you-change-your-outfit','Can You Change Your Outfit?','Yes. A current interface screenshot includes a “Change Outfit” command.',[
    'The function is visible as a mapped command.',
    'It appears in the same utility interface as Photo Mode.',
    'No outfit catalog has been released.'
  ],'This confirms outfit changing, not the number of outfits, purchase locations, gender restrictions or customization depth.','bestbuy'),
  q('features','can-you-select-music','Can You Select Music in the Game?','A current screenshot shows a “Select Song” command, confirming an in-game song-selection function.',[
    'The command is visible in the utility interface.',
    'It is separate from Photo Mode and outfit changing.',
    'No track list or unlock method is shown.'
  ],'The evidence does not establish whether songs play globally, only at camps, through an item, or require progression.','bestbuy'),
  q('features','does-the-interface-track-quest-objectives','Does the Interface Track Quest Objectives?','Yes. Current screenshots show an active objective with an item counter and named destination information.',[
    'The objective names Lily and Rick.',
    'A progress counter is displayed.',
    'Bloomfield Village and Bloomfield Park location text is visible.'
  ],'Quest pinning, multi-quest tracking, map markers, automatic routing and accessibility options remain undocumented.','bestbuy'),
  q('features','does-the-hud-show-date-time-and-weather','Does the HUD Show Date, Time, and Weather?','Yes. Current screenshots display an in-game time, weekday and date, plus weather text.',[
    'Examples show morning and afternoon clock times.',
    'A weekday and numbered day are visible.',
    'A Tornado Island screenshot includes weather text.'
  ],'The screenshots confirm the HUD elements but not day length, pause behavior, forecast range or weather probabilities.','bestbuy'),

  q('locations','is-wolf-hill-a-confirmed-location','Is Wolf Hill a Confirmed Location?','Yes. A current gameplay screenshot shows an objective to investigate the Spirit Tree in Wolf Hill.',[
    'Wolf Hill is named directly in the objective.',
    'The screenshot also displays Bloomfield Village.',
    'A character or companion name, Milky, appears near the objective display.'
  ],'The screenshot does not establish Wolf Hill’s full map, entrance, enemies, rewards or relationship to Lupo.','bestbuy'),
  q('locations','is-tornado-island-a-confirmed-location','Is Tornado Island a Confirmed Location?','Yes. Tornado Island is visibly named in a current retailer gameplay screenshot.',[
    'The location label appears on the HUD.',
    'Weather text and an afternoon time are visible.',
    'Official announcements separately confirm remote islands and powerful storms.'
  ],'The name is confirmed visually, but its access chart, treasure, animals, weather mechanics and quest order remain unknown.','bestbuy'),
  q('locations','is-bloomfield-park-in-the-game','Is Bloomfield Park in the Game?','Yes. Bloomfield Park appears as a named destination in a current quest screenshot.',[
    'The screenshot also identifies Bloomfield Village.',
    'The active objective involves Lily and Rick.',
    'A directional location display is visible.'
  ],'The park’s exact map position, facilities, events, NPC schedule and unlock timing are not yet published.','bestbuy'),
  q('locations','what-is-maple-mart','What Is Maple Mart?','Maple Mart is a named place referenced by Bryce in a screenshot describing a jam session with Cindy and Amad.',[
    'Maple Mart is visible in character dialogue.',
    'The scene connects the location to music.',
    'Cindy and Amad are named as participants in the referenced jam session.'
  ],'The image does not confirm whether Maple Mart is a shop, venue, district or building inside Maplehill.','bestbuy'),
  q('locations','are-there-spirit-trees','Are There Spirit Trees in Echoes of Teradea?','At least one Spirit Tree is confirmed by a visible objective that sends the player to investigate it in Wolf Hill.',[
    'The objective uses the singular phrase “the Spirit Tree.”',
    'Wolf Hill is the named destination.',
    'Guardian Spirits and restoration are separately confirmed by Natsume.'
  ],'The screenshot does not state how many Spirit Trees exist, what they do or whether they are the same as Power Statues.','bestbuy'),

  q('faq','is-echoes-of-teradea-made-by-natsume','Is Echoes of Teradea Made by Natsume?','Yes. Natsume announced Harvest Moon: Echoes of Teradea and identifies itself as the game’s developer and publisher.',[
    'The title was revealed through Natsume’s official press channel.',
    'The Natsume Store carries the physical preorder.',
    'The game belongs to Natsume’s current Harvest Moon line.'
  ],'This is distinct from the separate Story of Seasons series; do not merge characters or mechanics between the two franchises.','announce'),
  q('faq','is-echoes-of-teradea-a-story-of-seasons-game','Is Echoes of Teradea a Story of Seasons Game?','No. Echoes of Teradea is a Natsume-developed and published Harvest Moon game, not a Story of Seasons title.',[
    'Natsume is the named developer and publisher.',
    'The official title uses the Harvest Moon brand.',
    'Story of Seasons is a separate modern series.'
  ],'Similar farming-life themes do not make the games part of the same current franchise or guarantee shared systems.','announce'),
  q('faq','is-this-a-good-entry-point-for-new-players','Is Echoes of Teradea Designed for New Harvest Moon Players?','Natsume describes the game as an adventure for Harvest Moon fans and newcomers alike, so prior series knowledge is not presented as a requirement.',[
    'The story begins with a new protagonist raised in Bloomfield.',
    'The game introduces a new world, villages and love interests.',
    'The publisher explicitly mentions newcomers in its announcement.'
  ],'Difficulty, tutorials and accessibility options are not yet detailed, so this answer concerns story continuity rather than challenge level.','announce'),
  q('faq','is-echoes-of-teradea-single-player','Is Echoes of Teradea Single-Player?','Yes. The Natsume Store currently lists the game as “1 Player.”',[
    'The first-party product page provides the player-count field.',
    'No co-op mode is described in the official announcements.',
    'The published story is framed around one player character.'
  ],'This does not rule on unannounced online sharing or platform services; it confirms the current product classification.','store'),
  q('faq','what-genre-is-echoes-of-teradea','What Genre Is Echoes of Teradea?','Natsume’s store classifies the game as Simulation / Farming, while the announcements also emphasize open-world adventure and relationships.',[
    'Farming and raising animals remain core systems.',
    'Exploration includes caves, islands and towns.',
    'Romance, marriage and village restoration are confirmed.'
  ],'The store genre label should not be expanded into claims about combat, multiplayer or RPG statistics that Natsume has not announced.','store'),

  q('guides','how-do-you-avoid-losing-collected-items','How Do You Avoid Losing Collected Items in the Wilderness?','Natsume says players must evade or escape wolves, bears and tigers; being caught causes collected items to be lost and sends the player back to the farm.',[
    'Wild animals are active threats.',
    'The consequence is item loss plus return to the farm.',
    'Companions and expanded movement support exploration.'
  ],'Exact stealth, sprint, stamina, safe-zone and recovery mechanics need verified gameplay before a step-by-step route can be published.','trailer'),
  q('guides','what-can-animal-companions-help-you-do','What Can Animal Companions Help You Do?','Animal companions can cross terrain, break rocks and fallen trees, reach hidden areas and uncover valuable treasures.',[
    'Different companions have different abilities.',
    'Pets, animals and mounts can join adventures.',
    'Companion utility is part of open-world traversal.'
  ],'The complete animal-to-ability table and unlock conditions have not yet been released.','trailer'),
  q('guides','can-you-cook-and-sleep-from-the-camp-menu','Can You Cook and Sleep from the Camp Interface?','Yes. A current interface screenshot visibly includes both “Cook” and “Sleep” commands, matching Natsume’s campsite description.',[
    'Official text confirms campfire cooking.',
    'Official text confirms resting and stamina recovery.',
    'The screenshot shows mapped Cook and Sleep commands.'
  ],'The image does not reveal time cost, stamina values, recipe requirements or restrictions on sleeping away from the farm.','bestbuy'),
  q('guides','how-do-you-open-photo-mode','How Do You Open Photo Mode?','A current screenshot shows Photo Mode as a directly mapped interface command, although final platform-specific controls have not been documented.',[
    '“Activate Photo Mode” is visible on screen.',
    'The displayed prompt is part of a utility command layout.',
    'Control labels may differ by platform.'
  ],'Use the final in-game control guide for the exact button; the screenshot confirms access, not a universal controller mapping.','bestbuy'),
  q('guides','how-do-you-find-the-spirit-tree-at-wolf-hill','How Do You Find the Spirit Tree at Wolf Hill?','A current screenshot confirms Wolf Hill as the objective destination, but it does not show a complete route or map coordinates.',[
    'The objective is “Investigate the Spirit Tree in Wolf Hill.”',
    'Bloomfield Village is shown as the broader area.',
    'A directional HUD element is visible.'
  ],'A reliable walkthrough must wait for a verified map, entrance, landmarks and quest trigger instead of inventing directions from one screenshot.','bestbuy'),

  q('platforms','are-switch-and-switch-2-separate-versions','Are Nintendo Switch and Switch 2 Separate Versions?','Yes. Natsume lists Nintendo Switch and Nintendo Switch 2 separately and offers distinct physical preorder variants.',[
    'Both systems are named in the platform lineup.',
    'Both have physical preorder editions.',
    'No free or paid upgrade path is described.'
  ],'Separate listings do not by themselves reveal performance differences, cartridge contents or save-transfer rules.','preorder'),
  q('platforms','is-the-pc-version-steam-only','Is Steam the Confirmed PC Storefront?','Yes. Every official platform list reviewed names PC via Steam; no other PC storefront has been announced.',[
    'Steam appears in the March platform reveal.',
    'Steam shares the September 24 release date.',
    'The press releases do not name Epic Games Store, GOG or Microsoft Store for PC.'
  ],'This records the current announced storefront and does not claim other PC versions are permanently ruled out.','announce'),
  q('platforms','is-there-a-physical-xbox-edition','Is There a Physical Xbox Edition?','Natsume confirms Xbox Series X|S as a launch platform, but its physical preorder announcement names only Switch 2, Switch and PS5.',[
    'Xbox Series X|S remains in the September 24 lineup.',
    'The listed physical variants exclude Xbox.',
    'Digital preorder timing is not fully detailed.'
  ],'Treat physical Xbox availability as unannounced, not cancelled; only a later publisher or retailer listing can confirm it.','preorder'),
  q('platforms','is-there-a-physical-pc-edition','Is There a Physical PC Edition?','No physical PC edition is listed in Natsume’s current preorder announcement; the confirmed PC storefront is Steam.',[
    'Steam is the named PC release channel.',
    'Physical preorders cover Switch 2, Switch and PS5.',
    'No boxed PC SKU is announced.'
  ],'This is a current availability answer and should be updated if Natsume announces a boxed collector or retail edition.','preorder'),
  q('platforms','are-switch-2-performance-details-confirmed','Are Switch 2 Performance Details Confirmed?','No technical targets for the Switch 2 version have been published in Natsume’s current announcements.',[
    'Switch 2 is a confirmed launch platform.',
    'A physical Switch 2 version is available to preorder.',
    'No resolution, frame-rate or loading comparison is supplied.'
  ],'A confirmed version is not evidence of 4K, 60 fps, special controls or a performance mode.','preorder'),

  q('preorder','what-is-the-official-store-price','What Is the Natsume Store Preorder Price?','The Natsume Store currently lists the physical game at $49.99 for its available Switch 2, Switch and PS5 variants.',[
    'The product page presents platform variants.',
    'The page promotes the Lupo plush offer.',
    'Taxes and shipping are separate checkout variables.'
  ],'Price, stock and shipping eligibility can change; buyers should verify the live cart before ordering.','store'),
  q('preorder','is-the-lupo-plush-guaranteed','Is the Lupo Plush Guaranteed with Every Natsume Store Order?','No. Natsume states that the Lupo baby wolf plush is available while supplies last.',[
    'The plush is identified as a preorder bonus.',
    'Lupo is called the Bloomfield Guardian.',
    'No remaining-stock counter or restock promise is published.'
  ],'Confirm the bonus appears in the live offer or checkout; the wording does not guarantee availability for every order.','preorder'),
  q('preorder','can-you-preorder-from-best-buy','Can You Preorder Echoes of Teradea from Best Buy?','Yes. Best Buy is one of the retailers named by Natsume, and it currently has product listings for supported physical console versions.',[
    'Best Buy is named in the June announcement.',
    'Its listing shows a September 24 release date.',
    'The retailer gallery contains gameplay screenshots.'
  ],'Stock, pickup, price and bonus terms are retailer-specific; the Natsume Store plush should not be assumed.','trailer'),
  q('preorder','which-retailers-did-natsume-name','Which Retailers Did Natsume Name for Preorders?','Natsume names Amazon, the Natsume Store, Target, Walmart, Best Buy and GameStop.',[
    'Amazon and Natsume Store were named in May.',
    'Target, Walmart, Best Buy and GameStop were added or repeated in June.',
    'Platform selection varies by seller.'
  ],'The list does not guarantee every retailer serves every region or carries every physical version.','trailer'),
  q('preorder','does-the-listed-price-include-shipping-and-tax','Does the Listed Price Include Shipping and Tax?','The displayed product price is not a universal delivered total; taxes, shipping and import costs depend on the retailer and destination.',[
    'Natsume Store shows a base product price.',
    'The publisher announcement does not promise free worldwide shipping.',
    'International availability can differ.'
  ],'Review the final checkout total and cancellation terms before purchase, especially for imports.','store'),

  q('demo','has-a-public-demo-been-announced','Has a Public Echoes of Teradea Demo Been Announced?','No public playable demo appears in Natsume’s March, May or June announcements, and no later demo announcement was found through July 26, 2026.',[
    'The game announcement describes features.',
    'The preorder announcement opens physical orders.',
    'The June release is a trailer, not a playable build.'
  ],'Only Natsume or a verified platform-store download should be treated as a real demo; unofficial “demo key” claims are not evidence.','trailer'),
  q('demo','is-there-a-steam-demo','Is There a Steam Demo?','Steam is a confirmed launch storefront, but Natsume has not announced a downloadable Steam demo or Next Fest build.',[
    'PC via Steam is in the official platform list.',
    'No demo window appears in the announcements.',
    'The September 24 full-game date remains confirmed.'
  ],'A Steam release listing does not automatically include a demo; check the verified store page for any future download button.','announce'),
  q('demo','is-there-a-switch-or-switch-2-demo','Is There a Switch or Switch 2 Demo?','No Nintendo eShop demo has been announced for either Switch generation.',[
    'Switch and Switch 2 full versions are confirmed.',
    'Physical preorders are available for both.',
    'A preorder listing is not a free trial.'
  ],'Demo availability, file size, regions and whether both systems would share a build remain unknown.','preorder'),
  q('demo','is-there-a-ps5-or-xbox-trial','Is There a PS5 or Xbox Trial?','No PS5 or Xbox Series X|S trial, timed demo or subscription preview has been announced.',[
    'Both console families are confirmed launch platforms.',
    'PS5 has a named physical preorder version.',
    'No PlayStation Plus or Game Pass trial is described.'
  ],'Platform release, physical availability, subscription access and demo access are separate statuses.','announce'),
  q('demo','will-demo-progress-carry-over','Will Demo Progress Carry Over to the Full Game?','There are no save-transfer rules because no public demo has been announced.',[
    'No verified demo currently creates transferable progress.',
    'The trailer does not describe a trial-save system.',
    'No preorder reward is tied to demo completion.'
  ],'Farm, character, item and settings carry-over claims are unsupported until Natsume publishes a demo and its rules.','trailer'),

  q('game-status','what-is-the-current-player-count','What Is the Current Official Player Count?','The Natsume Store lists Echoes of Teradea as a one-player game.',[
    'The product metadata states “Players: 1 Player.”',
    'No multiplayer system is described in official announcements.',
    'The current classification applies across the product listing.'
  ],'The listing does not answer every possible online-service question, but it is the strongest current evidence for player count.','store'),
  q('game-status','what-is-the-current-esrb-rating','What Is the Current ESRB Rating?','The Natsume Store and current retailer listing show RP, meaning Rating Pending.',[
    'RP is not a final age category.',
    'No final content descriptors are displayed.',
    'Retail packaging metadata can update before launch.'
  ],'Parents and buyers should recheck the final ESRB listing closer to September 24.','store'),
  q('game-status','what-platforms-are-currently-confirmed','What Platforms Are Currently Confirmed?','The confirmed lineup is Nintendo Switch 2, Nintendo Switch, PlayStation 5, Xbox Series X|S and PC via Steam.',[
    'All five platform families share the September 24 date.',
    'PS4 and Xbox One are not named.',
    'Steam is the only announced PC storefront.'
  ],'This list records announced platforms without treating unannounced systems as cancelled ports.','trailer'),
  q('game-status','what-physical-editions-are-currently-confirmed','What Physical Editions Are Currently Confirmed?','Physical editions are currently confirmed for Nintendo Switch 2, Nintendo Switch and PlayStation 5.',[
    'These variants are named by Natsume.',
    'Xbox Series X|S and Steam are still launch platforms.',
    'No physical Xbox or PC edition is listed.'
  ],'Physical and digital availability should be tracked separately because the platform lineup is broader than the boxed-edition lineup.','preorder'),
  q('game-status','what-named-characters-are-currently-confirmed','Which Named Characters Are Currently Confirmed?','Official text names the Harvest Goddess, Doc Jr. and Lupo; current screenshots also show Lorelei, Mara, Bryce, Cindy, Amad, Lily and Rick.',[
    'The three official-text names have described roles or context.',
    'The seven screenshot names are directly visible in dialogue or objectives.',
    'Ten romance candidates are confirmed but not fully named.'
  ],'The evidence does not classify every screenshot character as a villager, candidate, merchant or quest giver.','bestbuy')
];

if (faqs.length !== 50) throw new Error(`Expected 50 FAQ rows, found ${faqs.length}`);
if (new Set(faqs.map(f => f.slug)).size !== faqs.length) throw new Error('Duplicate V12 FAQ slug');

const esc = value => value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const faqUrl = faq => `${site}/faq/${faq.slug}/`;

function schema(faq) {
  const url = faqUrl(faq);
  return JSON.stringify({'@context':'https://schema.org','@graph':[
    {'@type':'FAQPage',mainEntity:[{'@type':'Question',name:faq.question,acceptedAnswer:{'@type':'Answer',text:faq.answer}}]},
    {'@type':'BreadcrumbList',itemListElement:[
      {'@type':'ListItem',position:1,name:'Home',item:`${site}/`},
      {'@type':'ListItem',position:2,name:'FAQ',item:`${site}/faq/`},
      {'@type':'ListItem',position:3,name:faq.question,item:url}
    ]}
  ]});
}

function render(faq) {
  const url = faqUrl(faq);
  const related = faqs.filter(item => item.hub === faq.hub && item.slug !== faq.slug).slice(0,3);
  const description = `${faq.answer} Source-checked status, evidence boundaries, and related player guidance.`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(faq.question)} | Echoes of Teradea FAQ</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${url}"><link rel="icon" href="../../assets/site-icon.svg"><link rel="stylesheet" href="../../styles.css"><meta property="og:title" content="${esc(faq.question)}"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="article"><meta property="og:url" content="${url}"><meta property="og:image" content="${site}/assets/hero-fan-art.png"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${schema(faq)}</script></head><body><header class="site-header"><a class="brand" href="../../"><span class="brand-mark">HM</span><span class="brand-copy"><span class="brand-title">Harvest Moon: Echoes of Teradea</span><span class="brand-subtitle">Wiki &amp; Guides</span></span></a><nav class="nav"><a href="../../release-date/">Release</a><a href="../../characters/">Characters</a><a href="../../features/">Features</a><a href="../../locations/">Locations</a><a href="../">FAQ</a></nav></header><main><section class="subpage-hero"><div class="breadcrumb"><a href="../../">Home</a><span>/</span><a href="../">FAQ</a><span>/</span><span>${esc(faq.question)}</span></div><p class="eyebrow">${hubs[faq.hub].title} · Checked ${reviewed}</p><h1>${esc(faq.question)}</h1><p>${esc(description)}</p></section><section class="section article-layout"><article class="article-main"><h2 id="answer">Quick answer</h2><p class="callout">${esc(faq.answer)}</p><h2 id="evidence">Evidence checked</h2><ul class="content-list">${faq.facts.map(fact=>`<li>${esc(fact)}</li>`).join('')}</ul><h2 id="boundary">What this does—and does not—confirm</h2><p>${esc(faq.boundary)}</p><p>This answer covers Harvest Moon: Echoes of Teradea only. It does not copy schedules, gifts, values, controls or mechanics from earlier Harvest Moon games.</p><h2 id="source">Evidence source</h2><p><strong>${esc(faq.source.tier)}:</strong> <a href="${faq.source.url}" rel="nofollow noopener">${esc(faq.source.label)}</a>. Independently summarized and checked on ${reviewed}.</p><h2 id="related">Related questions</h2><div class="page-links">${related.map(item=>`<a href="../${item.slug}/">${esc(item.question)}</a>`).join('')}<a href="../">Browse all FAQ</a><a href="../../${faq.hub}/">Open ${hubs[faq.hub].label} hub</a></div></article><aside class="toc"><h2>On This Page</h2><a href="#answer">Quick answer</a><a href="#evidence">Evidence</a><a href="#boundary">Confirmation boundary</a><a href="#source">Source</a><a href="#related">Related FAQ</a></aside></section></main><footer class="site-footer"><p>Unofficial, source-checked fan guide. Updated ${reviewed}.</p><a href="../">FAQ hub</a></footer></body></html>`;
}

const existing = new Set((await readdir(path.join(root,'faq'),{withFileTypes:true}))
  .filter(entry=>entry.isDirectory())
  .map(entry=>entry.name)
  .filter(slug=>!faqs.some(faq=>faq.slug===slug)));
for (const faq of faqs) {
  if (existing.has(faq.slug)) throw new Error(`V12 FAQ duplicates an existing slug: ${faq.slug}`);
  const output = path.join(root,'faq',faq.slug,'index.html');
  await mkdir(path.dirname(output),{recursive:true});
  await writeFile(output,render(faq));
}

const groups = Object.keys(hubs).map(hub => ({ hub, items: faqs.filter(faq => faq.hub === hub) }));
if (groups.some(group => group.items.length !== 5)) throw new Error('Every V12 hub must receive exactly five FAQ pages');

const faqPath = path.join(root,'faq/index.html');
let faqHub = await readFile(faqPath,'utf8');
faqHub = faqHub.replace(/<!-- FAQ50_V12_START -->[\s\S]*?<!-- FAQ50_V12_END -->/g,'');
const directory = `<!-- FAQ50_V12_START --><section class="section faq-directory"><div class="section-heading"><div><p class="eyebrow">50 additional source-checked answers</p><h2>New FAQ research · July 2026</h2></div></div>${groups.map(group=>`<section class="faq-group"><h3>${hubs[group.hub].title}</h3><div class="card-grid">${group.items.map(faq=>`<article class="guide-card"><h4><a href="${faq.slug}/">${esc(faq.question)}</a></h4><p>${esc(faq.answer)}</p></article>`).join('')}</div></section>`).join('')}</section><!-- FAQ50_V12_END -->`;
faqHub = faqHub.replace('<!-- TAB_NEWS_START -->',`${directory}<!-- TAB_NEWS_START -->`);
await writeFile(faqPath,faqHub);

for (const group of groups) {
  const hubPath = path.join(root,group.hub,'index.html');
  let html = await readFile(hubPath,'utf8');
  html = html.replace(/<!-- RELATED_FAQ_V12_START -->[\s\S]*?<!-- RELATED_FAQ_V12_END -->/g,'');
  const module = `<!-- RELATED_FAQ_V12_START --><section class="section related-faq"><div class="section-heading"><div><p class="eyebrow">Newly researched questions</p><h2>More ${hubs[group.hub].title}</h2></div><a class="text-link" href="../faq/">Browse 121 FAQ</a></div><div class="card-grid">${group.items.map(faq=>`<article class="guide-card"><h3><a href="../faq/${faq.slug}/">${esc(faq.question)}</a></h3><p>${esc(faq.answer)}</p></article>`).join('')}</div></section><!-- RELATED_FAQ_V12_END -->`;
  html = html.replace('</main>',`${module}</main>`);
  await writeFile(hubPath,html);
}

const manifestPath = path.join(root,'seo/indexable-urls.json');
const manifest = JSON.parse(await readFile(manifestPath,'utf8'));
for (const faq of faqs) {
  const url = `/faq/${faq.slug}/`;
  if (!manifest.includes(url)) manifest.push(url);
}
await writeFile(manifestPath,`${JSON.stringify(manifest,null,2)}\n`);
await writeFile(path.join(root,'data/faq-v12.json'),`${JSON.stringify(faqs,null,2)}\n`);

console.log('Generated 50 unique V12 FAQ pages and five contextual entries on each of 10 detail hubs.');
