import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname,'..');
const categories = ['release-date','guides','story','features','locations','platforms','preorder','faq'];
const errors = [];
const titles = new Set();
let total = 0;

for (const category of categories) {
  const hub = await readFile(path.join(root,category,'index.html'),'utf8');
  const marker = hub.match(/<!-- TAB_NEWS_START -->([\s\S]*?)<!-- TAB_NEWS_END -->/)?.[1] || '';
  const links = [...marker.matchAll(/href="\.\.\/news\/([^"#?]+)\/"/g)].map(match=>match[1]);
  if (links.length !== 5) errors.push(`/${category}/: expected 5 news cards, found ${links.length}`);
  if (new Set(links).size !== 5) errors.push(`/${category}/: duplicate news card URLs`);
  for (const link of links) {
    const file = path.join(root,'news',link,'index.html');
    const html = await readFile(file,'utf8');
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    if (!title) errors.push(`/news/${link}/: missing title`);
    else if (titles.has(title)) errors.push(`/news/${link}/: duplicate title`);
    else titles.add(title);
    if (!/"@type":"NewsArticle"/.test(html)) errors.push(`/news/${link}/: missing NewsArticle schema`);
    if (!/Official source/.test(html)) errors.push(`/news/${link}/: missing visible source section`);
    if (!/What remains unconfirmed/.test(html)) errors.push(`/news/${link}/: missing uncertainty section`);
    total++;
  }
}

if (total !== 40) errors.push(`Expected 40 audited article links, found ${total}`);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Tab news audit passed: ${categories.length} hubs × 5 unique articles = ${total} independent News URLs.`);
