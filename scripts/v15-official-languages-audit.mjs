import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const site = 'https://harvestmoonechoesofteradea.wiki';
const locales = ['en','fr','de','es','ja'];
const routes = ['', 'release-date','platforms','preorder','features','locations','characters','guides','faq','demo','game-status','buying-guide','exploration','interface','languages'];
const errors = [];

async function walk(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    if (['.git','node_modules'].includes(name)) continue;
    const full = path.join(dir,name);
    (await stat(full)).isDirectory() ? out.push(...await walk(full)) : out.push(full);
  }
  return out;
}

const pagePath = (lang, route) => path.join(root, lang === 'en' ? '' : lang, route, 'index.html');
const url = (lang, route) => `/${lang === 'en' ? '' : `${lang}/`}${route ? `${route}/` : ''}`;

for (const route of routes) {
  for (const lang of locales) {
    let html;
    try { html = await readFile(pagePath(lang,route),'utf8'); }
    catch { errors.push(`${url(lang,route)} missing exact language page`); continue; }
    for (const peer of locales) {
      const expected = `<link rel="alternate" hreflang="${peer}" href="${site}${url(peer,route)}">`;
      if (!html.includes(expected)) errors.push(`${url(lang,route)} missing ${peer} hreflang`);
    }
    if (!html.includes('<span class="brand-title">Harvest Moon: Echoes of Teradea</span><span class="brand-subtitle">Wiki &amp; Guides</span>')) {
      errors.push(`${url(lang,route)} missing full two-line brand`);
    }
  }
}

for (const lang of ['fr','es']) {
  for (const route of routes) {
    const html = await readFile(pagePath(lang,route),'utf8');
    for (const marker of ['class="subpage-hero"','article-layout','class="callout"','class="content-list"','class="toc"','application/ld+json','google-adsense-account']) {
      if (!html.includes(marker)) errors.push(`${url(lang,route)} missing English-parity module ${marker}`);
    }
    if (lang === 'fr' && /<h[12][^>]*>(Quick answer|Confirmed|Evidence boundary|Related)/i.test(html)) errors.push(`${url(lang,route)} contains English section heading`);
    if (lang === 'es' && /<h[12][^>]*>(Quick answer|Confirmed|Evidence boundary|Related)/i.test(html)) errors.push(`${url(lang,route)} contains English section heading`);
  }
}

const allHtml = (await walk(root)).filter(f=>f.endsWith('index.html'));
for (const file of allHtml) {
  const html = await readFile(file,'utf8');
  for (const [lang,label] of [['fr','Français'],['es','Español']]) {
    if (!html.includes(`hreflang="${lang}" lang="${lang}"`) || !html.includes(`>${label}</a>`)) {
      errors.push(`${path.relative(root,file)} missing ${label} dropdown option`);
    }
  }
}

if (errors.length) {
  console.error(errors.slice(0,100).join('\n'));
  console.error(`V15 language audit failed with ${errors.length} errors.`);
  process.exit(1);
}
console.log(`V15 language audit passed: ${routes.length} exact five-language sets and ${allHtml.length} complete language dropdowns.`);
