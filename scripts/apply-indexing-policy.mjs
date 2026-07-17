import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const approved = new Set(JSON.parse(await readFile(path.join(root, 'seo/indexable-urls.json'), 'utf8')));
const legacy = [
  'beginner-guide', 'calendar', 'characters', 'faq', 'farming-guide',
  'festivals-events', 'items-recipes-materials', 'map-exploration', 'money-guide',
  'mounts-pets', 'quests', 'romance', 'tools-upgrades', 'updates', 'village-restoration'
];

for (const slug of legacy) {
  const file = path.join(root, slug, 'index.html');
  let html = await readFile(file, 'utf8');
  html = html.replace(/\s*<meta name="robots"[^>]*>/, '');
  html = html.replace('</title>', '</title>\n    <meta name="robots" content="noindex, follow" />');
  await writeFile(file, html);
}

const urls = [...approved].map(url => {
  const loc = `https://harvestmoonechoesofteradea.wiki${url}`;
  const priority = url === '/' ? '1.0' : url.split('/').filter(Boolean).length === 1 ? '0.8' : '0.7';
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>2026-07-17</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}).join('\n');
await writeFile(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);

console.log(`Sitemap contains ${approved.size} quality-approved URLs; ${legacy.length} speculative hubs set to noindex, follow.`);
