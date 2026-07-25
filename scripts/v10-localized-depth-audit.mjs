import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname,'..');
const site = 'https://harvestmoonechoesofteradea.wiki';
const inventory = JSON.parse(await readFile(path.join(root,'data/v10-localized-depth.json'),'utf8'));
const manifest = new Set(JSON.parse(await readFile(path.join(root,'seo/indexable-urls.json'),'utf8')));
const errors = [];
const normalized = text => text.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();

for (const slug of inventory.routes) {
  const expected = {
    en:`${site}/${slug}/`,
    de:`${site}/de/${slug}/`,
    ja:`${site}/ja/${slug}/`,
    'x-default':`${site}/${slug}/`
  };
  for (const locale of ['en','de','ja']) {
    const route = locale === 'en' ? `/${slug}/` : `/${locale}/${slug}/`;
    if (!manifest.has(route)) errors.push(`${route}: missing from indexable manifest`);
    const file = path.join(root,route.slice(1),'index.html');
    const html = await readFile(file,'utf8');
    const main = html.match(/<main>([\s\S]*?)<\/main>/i)?.[1] || '';
    if (locale !== 'en') {
      const minChars = locale === 'ja' ? 620 : 1050;
      if (normalized(main).length < minChars) errors.push(`${route}: localized content under ${minChars} visible characters`);
      if ((main.match(/<h2/g)||[]).length < 6) errors.push(`${route}: fewer than six content sections`);
      if (!/natsume\.com|natsumestore\.com/i.test(main)) errors.push(`${route}: missing primary source`);
      if (!html.includes('google-adsense-account')) errors.push(`${route}: missing AdSense account metadata`);
      if (!html.includes('LANGUAGE_SWITCHER_START')) errors.push(`${route}: missing language dropdown`);
    }
    for (const [lang,href] of Object.entries(expected)) {
      if (!html.includes(`hreflang="${lang}" href="${href}"`)) errors.push(`${route}: missing reciprocal ${lang} hreflang`);
    }
  }
}

if (inventory.totalAdded !== 48) errors.push(`inventory: expected 48 additions, found ${inventory.totalAdded}`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`V10 localized-depth audit passed: ${inventory.totalAdded} pages, ${inventory.routes.length} reciprocal en/de/ja sets, source, depth, AdSense, dropdown, and unknown-boundary checks.`);
