import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname,'..');
const data = JSON.parse(await readFile(path.join(root,'data/faq-v12.json'),'utf8'));
const errors = [];
const stop = new Set('the a an and or to of in on for is are was were be been with this that it its as by from at can you your does do did what which how who when where have has game echoes teradea harvest moon current confirmed'.split(' '));
const tokens = value => new Set(value.toLowerCase().replace(/<[^>]+>/g,' ').replace(/[^a-z0-9]+/g,' ').split(/\s+/).filter(word=>word.length>2&&!stop.has(word)));
const jaccard = (a,b) => {
  const left=tokens(a), right=tokens(b);
  const intersection=[...left].filter(word=>right.has(word)).length;
  return intersection/(left.size+right.size-intersection);
};

async function walk(dir) {
  const files = [];
  for (const name of await readdir(dir)) {
    const full = path.join(dir,name);
    (await stat(full)).isDirectory() ? files.push(...await walk(full)) : files.push(full);
  }
  return files;
}

if (data.length !== 50) errors.push(`Expected 50 V12 FAQ records, found ${data.length}`);
if (new Set(data.map(item=>item.slug)).size !== 50) errors.push('Duplicate V12 FAQ slug');
if (new Set(data.map(item=>item.question)).size !== 50) errors.push('Duplicate V12 FAQ question');

for (const faq of data) {
  const file = path.join(root,'faq',faq.slug,'index.html');
  const html = await readFile(file,'utf8');
  if (!html.includes('"@type":"FAQPage"')) errors.push(`${faq.slug}: missing FAQPage schema`);
  if (!html.includes('<h2 id="answer">Quick answer</h2>')) errors.push(`${faq.slug}: missing direct answer`);
  if (!html.includes('Evidence source')) errors.push(`${faq.slug}: missing evidence source`);
  if (!html.includes('What this does—and does not—confirm')) errors.push(`${faq.slug}: missing evidence boundary`);
  if (!html.includes('Harvest Moon: Echoes of Teradea</span><span class="brand-subtitle">Wiki &amp; Guides')) errors.push(`${faq.slug}: missing full two-line brand`);
  const visible = html.replace(/<script[\s\S]*?<\/script>/g,' ').replace(/<style[\s\S]*?<\/style>/g,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
  if (visible.length < 900) errors.push(`${faq.slug}: thin visible content`);
}

for (let left=0; left<data.length; left++) {
  for (let right=left+1; right<data.length; right++) {
    const similarity=jaccard(`${data[left].answer} ${data[left].facts.join(' ')} ${data[left].boundary}`,`${data[right].answer} ${data[right].facts.join(' ')} ${data[right].boundary}`);
    if (similarity>=0.58) errors.push(`${data[left].slug} and ${data[right].slug}: excessive semantic overlap ${similarity.toFixed(2)}`);
  }
}

const hubs = [...new Set(data.map(item=>item.hub))];
if (hubs.length !== 10) errors.push(`Expected 10 hubs, found ${hubs.length}`);
for (const hub of hubs) {
  const html = await readFile(path.join(root,hub,'index.html'),'utf8');
  const block = html.match(/<!-- RELATED_FAQ_V12_START -->([\s\S]*?)<!-- RELATED_FAQ_V12_END -->/)?.[1] || '';
  const links = [...block.matchAll(/href="\.\.\/faq\/([^"/]+)\/"/g)].map(match=>match[1]);
  if (links.length !== 5) errors.push(`/${hub}/ expected 5 V12 FAQ links, found ${links.length}`);
  if (new Set(links).size !== 5) errors.push(`/${hub}/ contains duplicate V12 FAQ links`);
}

const allFaqFiles = (await walk(path.join(root,'faq'))).filter(file=>file.endsWith('index.html') && path.dirname(file) !== path.join(root,'faq'));
if (allFaqFiles.length !== 171) errors.push(`Expected 171 total FAQ pages after V18, found ${allFaqFiles.length}`);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('V12 FAQ audit passed inside V18: its 50-page batch remains intact within 171 total FAQ pages.');
