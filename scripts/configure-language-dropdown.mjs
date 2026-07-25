import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const site = 'https://harvestmoonechoesofteradea.wiki';
const core = ['', 'release-date','platforms','preorder','features','features/open-world-exploration','features/animal-companions','features/campsites-travel','features/power-statues-wisps','features/happilia','locations','characters','romance/candidates','guides','story','faq'];
const expansion = ['demo','game-status','media/first-trailer','items-recipes-materials','items/ore-and-gems','items/rare-collectibles','items/power-wisp-fruits','items/nautical-charts','items/traveling-merchant-exclusives','gameplay/campsite-day-trip-loop','gameplay/village-restoration-happilia-loop','gameplay/exploration-ability-combinations','characters/harvest-goddess','characters/doc-jr','characters/lupo'];
const v7Translated = [
  'pre-release/official-announcement-timeline',
  'pre-release/confirmed-facts-before-launch',
  'pre-release/confirmed-vs-unconfirmed-feature-tracker',
  'buying-guide/physical-editions-by-platform',
  'buying-guide/retailer-availability-guide',
  'buying-guide/lupo-wolf-plush-eligibility',
  'exploration/expedition-planning-before-you-leave',
  'exploration/campsite-rest-recovery-cooking'
];
const v8Translated = [
  'characters/lorelei',
  'characters/bryce',
  'characters/mara',
  'locations/tornado-island',
  'interface/docpad',
  'interface/photo-mode'
];
const translated = new Set([...core, ...expansion, ...v7Translated, ...v8Translated]);

async function walk(dir) {
  const output = [];
  for (const name of await readdir(dir)) {
    if (['.git','node_modules'].includes(name)) continue;
    const full = path.join(dir,name);
    (await stat(full)).isDirectory() ? output.push(...await walk(full)) : output.push(full);
  }
  return output;
}

const files = (await walk(root)).filter(file => file.endsWith('index.html'));
for (const file of files) {
  let html = await readFile(file, 'utf8');
  const rel = path.relative(root,file).replaceAll(path.sep,'/').replace(/index\.html$/,'').replace(/\/$/,'');
  const segments = rel ? rel.split('/') : [];
  const locale = ['de','ja'].includes(segments[0]) ? segments.shift() : 'en';
  const baseSlug = segments.join('/');
  const exact = translated.has(baseSlug);
  const hrefs = {
    en: exact ? `/${baseSlug ? `${baseSlug}/` : ''}` : '/',
    de: exact ? `/de/${baseSlug ? `${baseSlug}/` : ''}` : '/de/',
    ja: exact ? `/ja/${baseSlug ? `${baseSlug}/` : ''}` : '/ja/'
  };
  const labels = locale === 'de' ? {menu:'Sprache wählen',current:'Deutsch'} : locale === 'ja' ? {menu:'言語を選択',current:'日本語'} : {menu:'Choose language',current:'English'};
  const switcher = `<!-- LANGUAGE_SWITCHER_START --><details class="language-switcher"><summary aria-label="${labels.menu}"><span aria-hidden="true">🌐</span><span>${labels.current}</span><span class="language-chevron" aria-hidden="true">▾</span></summary><ul role="list"><li><a href="${hrefs.en}" hreflang="en" lang="en"${locale==='en'?' aria-current="page"':''}>English</a></li><li><a href="${hrefs.de}" hreflang="de" lang="de"${locale==='de'?' aria-current="page"':''}>Deutsch</a></li><li><a href="${hrefs.ja}" hreflang="ja" lang="ja"${locale==='ja'?' aria-current="page"':''}>日本語</a></li></ul></details><!-- LANGUAGE_SWITCHER_END -->`;
  if (exact) {
    html = html.replace(/\s*<link rel="alternate" hreflang="(?:en|de|ja|x-default)" href="[^"]+">/g,'');
    const alternates = `<link rel="alternate" hreflang="en" href="${site}${hrefs.en}"><link rel="alternate" hreflang="de" href="${site}${hrefs.de}"><link rel="alternate" hreflang="ja" href="${site}${hrefs.ja}"><link rel="alternate" hreflang="x-default" href="${site}${hrefs.en}">`;
    html = html.replace('</head>',`${alternates}</head>`);
  }
  html = html.replace(/<!-- LANGUAGE_SWITCHER_START -->[\s\S]*?<!-- LANGUAGE_SWITCHER_END -->/g,'');
  html = html.replace(/<nav class="nav" aria-label="Language">[\s\S]*?<\/nav>/g,'');
  html = html.replace('</header>', `${switcher}</header>`);
  await writeFile(file,html);
}
console.log(`Configured navigation language dropdown on ${files.length} pages.`);
