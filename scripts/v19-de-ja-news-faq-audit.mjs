import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const site = 'https://harvestmoonechoesofteradea.wiki';
const records = JSON.parse(await readFile(path.join(root, 'data/v19-de-ja-news-faq.json'), 'utf8'));
const manifest = JSON.parse(await readFile(path.join(root, 'seo/indexable-urls.json'), 'utf8'));
const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
const failures = [];

async function exists(file) {
  try { return (await stat(file)).isFile(); } catch { return false; }
}

for (const item of records) {
  const routes = [
    `/faq/${item.slug}/`,
    `/news/${item.hub}/${item.slug}-briefing/`
  ];
  for (const route of routes) {
    const pages = {};
    for (const locale of ['en', 'de', 'ja']) {
      const localRoute = locale === 'en' ? route : `/${locale}${route}`;
      const file = path.join(root, ...localRoute.split('/').filter(Boolean), 'index.html');
      if (!(await exists(file))) { failures.push(`missing ${localRoute}`); continue; }
      const html = await readFile(file, 'utf8');
      pages[locale] = html;
      if (!manifest.includes(localRoute)) failures.push(`manifest missing ${localRoute}`);
      if (!sitemap.includes(`<loc>${site}${localRoute}</loc>`)) failures.push(`sitemap missing ${localRoute}`);
      if (!html.includes('brand-title">Harvest Moon: Echoes of Teradea</span><span class="brand-subtitle">Wiki &amp; Guides')) failures.push(`brand layout ${localRoute}`);
      if (!html.includes('ADSENSE_START')) failures.push(`adsense ${localRoute}`);
      if (!html.includes('application/ld+json')) failures.push(`schema ${localRoute}`);
      if (!html.includes('article-layout') || !html.includes('subpage-hero') || !html.includes('class="toc"')) failures.push(`layout ${localRoute}`);
      for (const lang of ['en', 'de', 'ja']) {
        const expected = lang === 'en' ? `${site}${route}` : `${site}/${lang}${route}`;
        if (!html.includes(`hreflang="${lang}" href="${expected}"`)) failures.push(`hreflang ${lang} on ${localRoute}`);
      }
      const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
      if (canonical !== `${site}${localRoute}`) failures.push(`canonical ${localRoute}`);
      if (locale === 'de' && !/[äöüÄÖÜß]/.test(html)) failures.push(`weak German localization ${localRoute}`);
      if (locale === 'ja' && !/[\u3040-\u30ff\u4e00-\u9faf]/.test(html)) failures.push(`weak Japanese localization ${localRoute}`);
    }
  }
}

for (const locale of ['de', 'ja']) {
  const route = `/${locale}/news/`;
  const file = path.join(root, locale, 'news', 'index.html');
  if (!(await exists(file))) failures.push(`missing ${route}`);
  if (!manifest.includes(route)) failures.push(`manifest missing ${route}`);
  if (!sitemap.includes(`<loc>${site}${route}</loc>`)) failures.push(`sitemap missing ${route}`);
}

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else if (entry.name === 'index.html') out.push(full);
  }
  return out;
}

const htmlFiles = await walk(root);
const canonicals = new Map();
const titles = new Map();
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1];
  if (canonical) {
    if (canonicals.has(canonical)) failures.push(`duplicate canonical ${canonical}`);
    canonicals.set(canonical, file);
  }
  if (title) {
    if (titles.has(title)) failures.push(`duplicate title ${title}`);
    titles.set(title, file);
  }
}

const sitemapUrls = [...sitemap.matchAll(/<loc>[^<]+<\/loc>/g)].map(x => x[0]);
if (manifest.length < 921) failures.push(`expected at least 921 indexable URLs, found ${manifest.length}`);
if (sitemapUrls.length !== manifest.length) failures.push(`sitemap ${sitemapUrls.length} != manifest ${manifest.length}`);
if (htmlFiles.length < 933) failures.push(`expected at least 933 HTML files, found ${htmlFiles.length}`);

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`V19 audit passed: ${htmlFiles.length} HTML, ${manifest.length} indexable URLs, 20 topics × FAQ/News × de/ja plus 2 News hubs.`);
