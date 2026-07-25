import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname,'..');
const categories = ['release-date','demo','game-status','guides','story','features','locations','platforms','preorder','faq'];
const errors = [];
const newsUrls = new Set();

for (const category of categories) {
  const hub = await readFile(path.join(root,category,'index.html'),'utf8');
  const newsBlock = hub.match(/<!-- TAB_NEWS_START -->([\s\S]*?)<!-- TAB_NEWS_END -->/)?.[1] || '';
  const newsLinks = [...newsBlock.matchAll(/href="\.\.\/news\/([^"#?]+)\/"/g)].map(match=>match[1]);
  if (newsLinks.length !== 5) errors.push(`/${category}/ expected 5 News links, found ${newsLinks.length}`);
  if (new Set(newsLinks).size !== 5) errors.push(`/${category}/ contains duplicate News links`);
  for (const link of newsLinks) {
    newsUrls.add(link);
    try { await access(path.join(root,'news',link,'index.html')); }
    catch { errors.push(`/news/${link}/ is missing`); }
  }

  const faqBlock = hub.match(/<!-- RELATED_FAQ_START -->([\s\S]*?)<!-- RELATED_FAQ_END -->/)?.[1] || '';
  const faqLinks = [...faqBlock.matchAll(/href="\.\.\/faq\/([^"#?]+)\/"/g)].map(match=>match[1]);
  if (faqLinks.length !== 5) errors.push(`/${category}/ expected 5 related FAQ links, found ${faqLinks.length}`);
  if (new Set(faqLinks).size !== 5) errors.push(`/${category}/ contains duplicate related FAQ links`);
  for (const slug of faqLinks) {
    try { await access(path.join(root,'faq',slug,'index.html')); }
    catch { errors.push(`/faq/${slug}/ is missing`); }
  }
}

if (newsUrls.size !== 50) errors.push(`Expected 50 unique Tab News URLs, found ${newsUrls.size}`);

const faqHub = await readFile(path.join(root,'faq/index.html'),'utf8');
const faqDirectory = faqHub.match(/<!-- FAQ50_START -->([\s\S]*?)<!-- FAQ50_END -->/)?.[1] || '';
const faq50 = [...faqDirectory.matchAll(/href="([^"#?]+)\/"/g)].map(match=>match[1]);
if (faq50.length !== 50 || new Set(faq50).size !== 50) errors.push(`Expected 50 unique newly generated FAQ URLs, found ${new Set(faq50).size}`);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Navigation tab audit passed: 10 hubs × 5 News, 10 hubs × 5 FAQ entries, and 50 unique new FAQ URLs.');
