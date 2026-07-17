import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { existsSync } from 'node:fs';

const root = path.resolve(import.meta.dirname, '..');
const approved = new Set(JSON.parse(await readFile(path.join(root, 'seo/indexable-urls.json'), 'utf8')));
const errors = [];
const seenTitles = new Map();
const seenCanonicals = new Map();

async function walk(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    if (['.git', 'node_modules'].includes(name)) continue;
    const full = path.join(dir, name);
    (await stat(full)).isDirectory() ? out.push(...await walk(full)) : out.push(full);
  }
  return out;
}

const files = (await walk(root)).filter(x => x.endsWith('index.html'));
for (const file of files) {
  const html = await readFile(file, 'utf8');
  const rel = path.relative(root, file).replaceAll(path.sep, '/');
  const url = rel === 'index.html' ? '/' : `/${rel.replace(/index\.html$/, '')}`;
  const indexable = approved.has(url);
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1];
  const desc = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"[^>]*>/i)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  const h1s = html.match(/<h1(?:\s[^>]*)?>/gi) || [];
  if (!title) errors.push(`${url}: missing title`);
  if (!desc) errors.push(`${url}: missing meta description`);
  if (!canonical) errors.push(`${url}: missing canonical`);
  if (h1s.length !== 1) errors.push(`${url}: expected one H1, found ${h1s.length}`);
  if (indexable && /noindex/i.test(html)) errors.push(`${url}: approved URL is noindex`);
  if (!indexable && !/noindex/i.test(html)) errors.push(`${url}: unapproved URL is indexable`);
  if (indexable && !/application\/ld\+json/i.test(html)) errors.push(`${url}: missing JSON-LD`);
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(match[1]); } catch { errors.push(`${url}: invalid JSON-LD`); }
  }
  for (const match of html.matchAll(/href="([^"]+)"/gi)) {
    const href = match[1];
    if (/^(https?:|mailto:|tel:|#)/i.test(href)) continue;
    const clean = href.split(/[?#]/)[0];
    if (!clean) continue;
    let target = clean.startsWith('/') ? path.join(root, clean) : path.resolve(path.dirname(file), clean);
    if (target.endsWith(path.sep) || !path.extname(target)) target = path.join(target, 'index.html');
    if (!existsSync(target)) errors.push(`${url}: broken internal link ${href}`);
  }
  if (title) seenTitles.has(title) ? errors.push(`${url}: duplicate title with ${seenTitles.get(title)}`) : seenTitles.set(title, url);
  if (canonical) seenCanonicals.has(canonical) ? errors.push(`${url}: duplicate canonical with ${seenCanonicals.get(canonical)}`) : seenCanonicals.set(canonical, url);
}

const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
for (const url of approved) {
  if (!sitemap.includes(`<loc>https://harvestmoonechoesofteradea.wiki${url}</loc>`)) errors.push(`${url}: missing from sitemap`);
}
const sitemapCount = (sitemap.match(/<url>/g) || []).length;
if (sitemapCount !== approved.size) errors.push(`sitemap: expected ${approved.size} URLs, found ${sitemapCount}`);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`SEO audit passed: ${files.length} HTML pages, ${approved.size} indexable URLs, unique titles/canonicals, valid sitemap policy.`);
