import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const site = 'https://harvestmoonechoesofteradea.wiki';
const reviewed = '2026-07-25';
const sources = {
  announce: {
    date: '2026-03-11',
    label: 'Natsume title announcement',
    url: 'https://www.natsume.com/news/news_pdffiles/pid_379_HM_EOT_TitleAnnouncementF.pdf'
  },
  preorder: {
    date: '2026-05-12',
    label: 'Natsume preorder announcement',
    url: 'https://www.natsume.com/news/news_pdffiles/pid_382_HM_EOT_Pre_OrderAnnouncementF.pdf'
  },
  trailer: {
    date: '2026-06-18',
    label: 'Natsume first-trailer announcement',
    url: 'https://www.natsume.com/news/news_pdffiles/pid_383_HMEOT_TrailerAnnouncementF.pdf'
  },
  store: {
    date: '2026-05-12',
    label: 'Natsume Store product listing',
    url: 'https://natsumestore.com/products/harvest-moon-echoes-of-teradea-with-free-wolf-plush'
  }
};

const categories = {
  demo: { label: 'Demo', title: 'Demo News' },
  'game-status': { label: 'Current Data', title: 'Current Data News' }
};

const rows = [
  ['demo','public-demo-status-july-2026','Echoes of Teradea Public Demo Status: July 2026','trailer',
    'Natsume has announced the game, opened physical preorders, and released its first trailer, but has not announced a public playable demo as of July 25, 2026.',
    ['No public demo is named in Natsume’s March, May, or June announcements.','The June 18 release is explicitly a trailer reveal, not a playable build.','September 24, 2026 remains the confirmed launch date.'],
    'Players should treat any unofficial download or “demo key” claim cautiously unless it links to Natsume or a verified platform store.',
    'A future demo date, supported platforms, regions, time limit, and download size remain unannounced.'],
  ['demo','steam-demo-not-announced','Steam Version Confirmed, but No Steam Demo Announced','announce',
    'Steam is a confirmed launch storefront for Echoes of Teradea, but the publisher has not announced a Steam demo or Steam Next Fest build.',
    ['PC via Steam appears in the official platform list.','The official announcements do not give a demo availability window.','A confirmed Steam release does not automatically mean a demo exists.'],
    'PC players can wishlist or follow verified store updates when a listing becomes available, but should not assume a demo from the launch-platform announcement alone.',
    'Steam page features, system requirements, Steam Deck status, achievements, cloud saves, and demo availability remain unconfirmed.'],
  ['demo','switch-demo-not-announced','No Nintendo Switch or Switch 2 Demo Announced Yet','preorder',
    'Nintendo Switch and Switch 2 versions are confirmed, including physical preorders, but Natsume has not announced an eShop demo for either system.',
    ['Both Nintendo generations launch on September 24.','Physical preorders do not include a playable trial.','No demo button or demo date is described by the publisher announcements.'],
    'Players should distinguish a preorder listing from a free downloadable demo and rely on the official Nintendo eShop or Natsume for any later trial.',
    'Whether both Nintendo versions would share a demo, save data, performance profile, or upgrade path is unknown.'],
  ['demo','ps5-xbox-demo-status','PS5 and Xbox Series X|S Demo Status Explained','announce',
    'PS5 and Xbox Series X|S are confirmed launch platforms, but no console trial, timed demo, or subscription preview has been announced.',
    ['PS5 and Xbox Series X|S are in Natsume’s official platform list.','The physical preorder announcement includes PS5 but not Xbox.','Neither announcement confirms a PlayStation Plus or Game Pass trial.'],
    'Platform availability, physical editions, subscription access, and demos are separate questions; only the launch platforms are confirmed.',
    'Trial length, subscription eligibility, save transfer, achievements, and console demo availability remain unknown.'],
  ['demo','demo-save-transfer-status','Demo Save Transfer and Carry-Over Status','trailer',
    'Because no public demo has been announced, Natsume has not published any demo save-transfer or carry-over rules for the full game.',
    ['There is no verified public demo to create transferable progress.','The first trailer does not describe a trial save system.','No preorder announcement promises demo progress rewards.'],
    'Claims about carrying farms, characters, items, or settings into the retail game are unsupported until a demo and its rules are officially published.',
    'Save compatibility, demo rewards, platform-to-platform transfer, and progress limits remain unannounced.'],

  ['game-status','release-date-status-july-2026','Release Date Remains September 24, 2026','trailer',
    'The latest official launch date remains September 24, 2026 for every announced console and PC platform.',
    ['Natsume first announced the date with preorders in May.','The June trailer announcement repeated the same date.','No later official delay appears in Natsume’s Echoes of Teradea announcements through July 25.'],
    'The date is firm enough for planning, while unlock hours, preload timing, retailer delivery, and time-zone differences still require later store data.',
    'Exact digital unlock times, preload dates, review timing, and launch-patch details remain unknown.'],
  ['game-status','five-platform-families-confirmed','Five Launch Platform Families Are Confirmed','trailer',
    'Echoes of Teradea is confirmed for Switch 2, Switch, PS5, Xbox Series X|S, and PC through Steam.',
    ['Both Nintendo generations are listed separately.','PS5 and Xbox Series X|S are the named PlayStation and Xbox systems.','Steam is the named PC storefront.'],
    'The platform list does not by itself confirm physical editions, cross-save, cross-buy, multiplayer, subscription access, or identical performance.',
    'System requirements, resolution, frame rate, file size, cross-save, and upgrade paths remain unannounced.'],
  ['game-status','one-player-status-confirmed','Official Store Lists Echoes of Teradea as 1 Player','store',
    'The Natsume Store product page lists Harvest Moon: Echoes of Teradea as a one-player game.',
    ['The listing states “Players: 1 Player.”','The genre is listed as Simulation / Farming.','No multiplayer feature is described in the three official announcements.'],
    'The current first-party listing supports a single-player classification; it should not be expanded into claims about online services or local co-op.',
    'Online features, asynchronous sharing, cloud services, and any future multiplayer announcement remain unknown.'],
  ['game-status','esrb-rating-pending-status','ESRB Rating Is Still Listed as Rating Pending','store',
    'The Natsume Store currently labels the ESRB rating as Rating Pending.',
    ['Rating Pending is not a final age rating.','The store page does not list final content descriptors.','Retailer metadata can change when ESRB classification is completed.'],
    'Parents and buyers should check the final ESRB listing or updated packaging closer to launch rather than treating retailer placeholders as final.',
    'Final ESRB category, content descriptors, regional PEGI classification, and parental-control details remain subject to update.'],
  ['game-status','simulation-farming-genre-confirmed','Simulation / Farming Genre Confirmed by Natsume Store','store',
    'Natsume’s product listing categorizes Echoes of Teradea as Simulation / Farming.',
    ['Farming, raising animals, harvesting crops, and village life are official systems.','Open-world exploration and adventure systems expand the farming loop.','The genre label does not make the game an action RPG or multiplayer title.'],
    'The concise official genre label is useful for store and search classification while the feature announcements explain the broader exploration and relationship systems.',
    'Final platform-store tags, accessibility categories, difficulty options, and regional metadata remain unannounced.']
];

const articles = rows.map(([category,slug,title,source,summary,facts,analysis,unknowns]) => ({
  category, slug, title, source: sources[source], summary, facts, analysis, unknowns
}));

const esc = value => value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const urlFor = article => `${site}/news/${article.category}/${article.slug}/`;

function schema(article) {
  const url = urlFor(article);
  return JSON.stringify({'@context':'https://schema.org','@graph':[
    {'@type':'NewsArticle',headline:article.title,description:article.summary,datePublished:article.source.date,dateModified:reviewed,inLanguage:'en',mainEntityOfPage:url,author:{'@type':'Organization',name:'Echoes Guide Editorial Team'},publisher:{'@type':'Organization',name:'Echoes Guide'},about:{'@type':'VideoGame',name:'Harvest Moon: Echoes of Teradea'},citation:article.source.url},
    {'@type':'BreadcrumbList',itemListElement:[
      {'@type':'ListItem',position:1,name:'Home',item:`${site}/`},
      {'@type':'ListItem',position:2,name:'News',item:`${site}/news/`},
      {'@type':'ListItem',position:3,name:categories[article.category].label,item:`${site}/${article.category}/`},
      {'@type':'ListItem',position:4,name:article.title,item:url}
    ]}
  ]});
}

function renderArticle(article) {
  const url = urlFor(article);
  const category = categories[article.category];
  const related = articles.filter(item => item.category === article.category && item.slug !== article.slug).slice(0,3);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(article.title)} | Echoes of Teradea News</title><meta name="description" content="${esc(article.summary)}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${url}"><link rel="icon" href="../../../assets/site-icon.svg"><link rel="stylesheet" href="../../../styles.css"><meta property="og:title" content="${esc(article.title)}"><meta property="og:description" content="${esc(article.summary)}"><meta property="og:type" content="article"><meta property="og:url" content="${url}"><meta property="og:image" content="${site}/assets/hero-fan-art.png"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${schema(article)}</script></head><body><header class="site-header"><a class="brand" href="../../../"><span class="brand-mark">HM</span><span>Echoes Guide</span></a><nav class="nav"><a href="../../../news/">News</a><a href="../../../demo/">Demo</a><a href="../../../game-status/">Current Data</a><a href="../../../guides/">Guides</a><a href="../../../faq/">FAQ</a></nav></header><main><section class="subpage-hero"><div class="breadcrumb"><a href="../../../">Home</a><span>/</span><a href="../../../news/">News</a><span>/</span><a href="../../../${article.category}/">${category.label}</a><span>/</span><span>${esc(article.title)}</span></div><p class="eyebrow">Verified Status Update · ${article.source.date}</p><h1>${esc(article.title)}</h1><p>${esc(article.summary)}</p></section><section class="section article-layout"><article class="article-main"><h2 id="update">Current verified status</h2><p class="callout">${esc(article.summary)}</p><h2 id="facts">Confirmed facts</h2><ul class="content-list">${article.facts.map(fact=>`<li>${esc(fact)}</li>`).join('')}</ul><h2 id="meaning">What it means for players</h2><p>${esc(article.analysis)}</p><p>This status page answers one specific player question using first-party wording and a dated source check. It does not invent a demo, feature, platform service, value, or release condition.</p><h2 id="unknown">What remains unconfirmed</h2><p>${esc(article.unknowns)}</p><h2 id="source">Official source</h2><p>Source: <a href="${article.source.url}" rel="nofollow noopener">${esc(article.source.label)}</a>. This independent fan-site status check was reviewed on ${reviewed}.</p><h2 id="related">More ${category.title}</h2><div class="page-links">${related.map(item=>`<a href="../${item.slug}/">${esc(item.title)}</a>`).join('')}<a href="../../../${article.category}/">Open ${category.label} hub</a></div></article><aside class="toc"><h2>On This Page</h2><a href="#update">Current status</a><a href="#facts">Confirmed facts</a><a href="#meaning">Player impact</a><a href="#unknown">Still unknown</a><a href="#source">Official source</a></aside></section></main><footer class="site-footer"><p>Unofficial source-checked status analysis. Updated ${reviewed}.</p><a href="../../../news/">News hub</a></footer></body></html>`;
}

for (const article of articles) {
  const out = path.join(root,'news',article.category,article.slug,'index.html');
  await mkdir(path.dirname(out),{recursive:true});
  await writeFile(out,renderArticle(article));
}

for (const category of Object.keys(categories)) {
  const items = articles.filter(article => article.category === category);
  const hubPath = path.join(root,category,'index.html');
  let html = await readFile(hubPath,'utf8');
  html = html.replace(/<!-- TAB_NEWS_START -->[\s\S]*?<!-- TAB_NEWS_END -->/g,'');
  const module = `<!-- TAB_NEWS_START --><section class="section tab-news"><div class="section-heading"><div><p class="eyebrow">Latest verified updates</p><h2>${categories[category].title}</h2></div><a class="text-link" href="../news/">All News</a></div><div class="card-grid">${items.map(item=>`<article class="guide-card"><p class="eyebrow">${item.source.date}</p><h3><a href="../news/${category}/${item.slug}/">${esc(item.title)}</a></h3><p>${esc(item.summary)}</p></article>`).join('')}</div></section><!-- TAB_NEWS_END -->`;
  html = html.replace('</main>',`${module}</main>`);
  await writeFile(hubPath,html);
}

const faqPicks = {
  demo: [
    ['is-there-an-official-preload-date','Is There an Official Preload Date?','No preload date has been published in Natsume’s March, May, or June 2026 announcements. The confirmed information is the September 24 release date.'],
    ['are-digital-preorders-open','Are Digital Preorders Open?','Natsume’s announcements focus on physical Switch 2, Switch, and PS5 preorders and do not provide a complete digital preorder schedule.'],
    ['when-was-the-first-trailer-released','When Was the First Echoes of Teradea Trailer Released?','Natsume debuted the first official trailer on June 18, 2026.'],
    ['when-does-echoes-of-teradea-release','When Does Harvest Moon: Echoes of Teradea Release?','Echoes of Teradea releases on September 24, 2026 across all announced launch platforms.'],
    ['what-year-is-echoes-of-teradea-coming-out','What Year Is Echoes of Teradea Coming Out?','Harvest Moon: Echoes of Teradea is scheduled for 2026, with an official launch date of September 24.']
  ],
  'game-status': [
    ['when-does-echoes-of-teradea-release','When Does Harvest Moon: Echoes of Teradea Release?','Echoes of Teradea releases on September 24, 2026 across all announced launch platforms.'],
    ['will-console-and-pc-launch-the-same-day','Will Console and PC Versions Launch the Same Day?','The current official schedule places all announced console versions and Steam on September 24, 2026.'],
    ['is-echoes-of-teradea-on-switch-2','Is Echoes of Teradea on Nintendo Switch 2?','Yes. Nintendo Switch 2 is a confirmed launch platform for September 24, 2026.'],
    ['is-echoes-of-teradea-on-ps5','Is Echoes of Teradea on PlayStation 5?','Yes. PlayStation 5 is a confirmed launch platform and physical preorder version.'],
    ['is-echoes-of-teradea-on-steam','Is Echoes of Teradea on Steam?','Yes. PC is confirmed through Steam as part of the September 24, 2026 launch lineup.']
  ]
};

for (const [category,items] of Object.entries(faqPicks)) {
  const hubPath = path.join(root,category,'index.html');
  let html = await readFile(hubPath,'utf8');
  html = html.replace(/<!-- RELATED_FAQ_START -->[\s\S]*?<!-- RELATED_FAQ_END -->/g,'');
  const module = `<!-- RELATED_FAQ_START --><section class="section related-faq"><div class="section-heading"><div><p class="eyebrow">Player questions</p><h2>Related FAQ</h2></div><a class="text-link" href="../faq/">All FAQ</a></div><div class="card-grid">${items.map(([slug,title,answer])=>`<article class="guide-card"><h3><a href="../faq/${slug}/">${esc(title)}</a></h3><p>${esc(answer)}</p></article>`).join('')}</div></section><!-- RELATED_FAQ_END -->`;
  html = html.replace('<!-- TAB_NEWS_START -->',`${module}<!-- TAB_NEWS_START -->`);
  await writeFile(hubPath,html);
}

let newsHub = await readFile(path.join(root,'news/index.html'),'utf8');
newsHub = newsHub.replace(/<p>Forty focused updates[^<]*<\/p>/,'<p>Fifty focused updates built from verified publisher announcements and current first-party product data, organized around the questions players search for.</p>');
newsHub = newsHub.replace('</main>',`${Object.keys(categories).map(category => {
  const items = articles.filter(article => article.category === category);
  return `<section class="section"><h2><a href="../${category}/">${categories[category].title}</a></h2><div class="card-grid">${items.map(item=>`<article class="guide-card"><p class="eyebrow">${item.source.date}</p><h3><a href="${category}/${item.slug}/">${esc(item.title)}</a></h3><p>${esc(item.summary)}</p></article>`).join('')}</div></section>`;
}).join('')}</main>`);
await writeFile(path.join(root,'news/index.html'),newsHub);

const manifestPath = path.join(root,'seo/indexable-urls.json');
const manifest = JSON.parse(await readFile(manifestPath,'utf8'));
for (const article of articles) {
  const url = `/news/${article.category}/${article.slug}/`;
  if (!manifest.includes(url)) manifest.push(url);
}
await writeFile(manifestPath,`${JSON.stringify(manifest,null,2)}\n`);

console.log('Completed 10-tab coverage: added 10 News URLs plus Demo and Current Data FAQ modules.');
