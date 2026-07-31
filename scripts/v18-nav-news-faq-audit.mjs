import { access, readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname,'..');
const hubs = ['release-date','demo','game-status','guides','story','features','locations','platforms','preorder','faq'];
const data = JSON.parse(await readFile(path.join(root,'data/v18-nav-news-faq.json'),'utf8'));
const errors = [];
const faqSlugs = new Set();
const newsUrls = new Set();

const stop = new Set('the a an and or to of in on for is are was were be been with this that it its as by from at can you your does do did what which how who when where have has game echoes teradea harvest moon official confirmed published announcement'.split(' '));
const tokens = value => new Set(value.toLowerCase().replace(/<[^>]+>/g,' ').replace(/[^a-z0-9]+/g,' ').split(/\s+/).filter(word=>word.length>2&&!stop.has(word)));
const jaccard = (a,b) => {
  const left=tokens(a), right=tokens(b);
  const intersection=[...left].filter(word=>right.has(word)).length;
  return intersection/(left.size+right.size-intersection || 1);
};

async function walk(dir) {
  const files=[];
  for (const name of await readdir(dir)) {
    const full=path.join(dir,name);
    (await stat(full)).isDirectory()?files.push(...await walk(full)):files.push(full);
  }
  return files;
}

if (data.length !== 50) errors.push(`Expected 50 V18 records, found ${data.length}`);
if (new Set(data.map(item=>item.slug)).size !== 50) errors.push('Duplicate V18 FAQ slug');
if (new Set(data.map(item=>item.question)).size !== 50) errors.push('Duplicate V18 FAQ question');
if (new Set(data.map(item=>item.headline)).size !== 50) errors.push('Duplicate V18 news headline');

for (const hub of hubs) {
  const items=data.filter(item=>item.hub===hub);
  if (items.length!==5) errors.push(`${hub}: expected five data records, found ${items.length}`);
  const html=await readFile(path.join(root,hub,'index.html'),'utf8');
  const faqBlock=html.match(/<!-- RELATED_FAQ_V18_START -->([\s\S]*?)<!-- RELATED_FAQ_V18_END -->/)?.[1]||'';
  const newsBlock=html.match(/<!-- TAB_NEWS_V18_START -->([\s\S]*?)<!-- TAB_NEWS_V18_END -->/)?.[1]||'';
  const faqLinks=[...faqBlock.matchAll(/href="\.\.\/faq\/([^"/]+)\/"/g)].map(match=>match[1]);
  const newsLinks=[...newsBlock.matchAll(/href="\.\.\/news\/([^"]+)\/"/g)].map(match=>match[1]);
  if (faqLinks.length!==5||new Set(faqLinks).size!==5) errors.push(`${hub}: V18 FAQ module does not contain five unique links`);
  if (newsLinks.length!==5||new Set(newsLinks).size!==5) errors.push(`${hub}: V18 News module does not contain five unique links`);
  faqLinks.forEach(slug=>faqSlugs.add(slug));
  newsLinks.forEach(url=>newsUrls.add(url));
}

if (faqSlugs.size!==50) errors.push(`Expected 50 unique hub FAQ links, found ${faqSlugs.size}`);
if (newsUrls.size!==50) errors.push(`Expected 50 unique hub News links, found ${newsUrls.size}`);

for (const item of data) {
  const faqFile=path.join(root,'faq',item.slug,'index.html');
  const newsFile=path.join(root,'news',item.hub,`${item.slug}-briefing`,'index.html');
  await access(faqFile).catch(()=>errors.push(`${item.slug}: FAQ file missing`));
  await access(newsFile).catch(()=>errors.push(`${item.slug}: News file missing`));
  const faq=await readFile(faqFile,'utf8');
  const news=await readFile(newsFile,'utf8');
  for (const [kind,html] of [['FAQ',faq],['News',news]]) {
    if (!html.includes('Harvest Moon: Echoes of Teradea</span><span class="brand-subtitle">Wiki &amp; Guides')) errors.push(`${item.slug}: ${kind} missing full two-line brand`);
    if (!html.includes('ca-pub-9505220977121599')) errors.push(`${item.slug}: ${kind} missing AdSense`);
    if (!html.includes('language-switcher')) errors.push(`${item.slug}: ${kind} missing language dropdown`);
    const visible=html.replace(/<script[\s\S]*?<\/script>/g,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
    if (visible.length<1200) errors.push(`${item.slug}: ${kind} visible content is thin (${visible.length})`);
  }
  if (!faq.includes('"@type":"FAQPage"')) errors.push(`${item.slug}: missing FAQPage schema`);
  if (!news.includes('"@type":"NewsArticle"')) errors.push(`${item.slug}: missing NewsArticle schema`);
}

for (let left=0;left<data.length;left++) {
  for (let right=left+1;right<data.length;right++) {
    const similarity=jaccard(`${data[left].answer} ${data[left].facts.join(' ')} ${data[left].boundary} ${data[left].takeaway}`,`${data[right].answer} ${data[right].facts.join(' ')} ${data[right].boundary} ${data[right].takeaway}`);
    if (similarity>=0.56) errors.push(`${data[left].slug} and ${data[right].slug}: excessive topic overlap ${similarity.toFixed(2)}`);
  }
}

const allFaq=(await walk(path.join(root,'faq'))).filter(file=>file.endsWith('index.html')&&path.dirname(file)!==path.join(root,'faq'));
const allNews=(await walk(path.join(root,'news'))).filter(file=>file.endsWith('index.html')&&path.dirname(file)!==path.join(root,'news'));
if (allFaq.length<171) errors.push(`Expected at least 171 total FAQ pages, found ${allFaq.length}`);
if (allNews.length<100) errors.push(`Expected at least 100 total News pages, found ${allNews.length}`);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`V18 batch audit passed inside the current site: its 50 News and 50 FAQ records remain intact; current totals are ${allNews.length} News and ${allFaq.length} FAQ pages.`);
