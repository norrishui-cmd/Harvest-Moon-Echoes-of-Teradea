import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname,'..');
const urls = JSON.parse(await readFile(path.join(root,'seo/indexable-urls.json'),'utf8'));
const targetPrefixes = ['/pre-release/','/buying-guide/','/exploration/','/world/'];
const errors = [];
const docs = [];
const stop = new Set('the a an and or to of in on for with is are be as by from this that it its what how guide page official harvest moon echoes teradea'.split(' '));
const tokens = text => new Set(text.toLowerCase().replace(/<script[\s\S]*?<\/script>/g,' ').replace(/<style[\s\S]*?<\/style>/g,' ').replace(/<[^>]+>/g,' ').replace(/[^a-z0-9äöüß]+/g,' ').split(/\s+/).filter(word=>word.length>3&&!stop.has(word)));
const similarity = (a,b) => {
  let shared=0;
  for (const word of a) if (b.has(word)) shared++;
  return shared/Math.max(1,Math.min(a.size,b.size));
};

for (const url of urls.filter(item=>targetPrefixes.some(prefix=>item.startsWith(prefix))&&item.split('/').filter(Boolean).length===2)) {
  const html = await readFile(path.join(root,url.slice(1),'index.html'),'utf8');
  const main = html.match(/<main>([\s\S]*?)<\/main>/i)?.[1] || '';
  const plain = main.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
  if (plain.split(/\s+/).length < 190) errors.push(`${url}: fewer than 190 visible words`);
  if ((main.match(/<h2/g)||[]).length < 4) errors.push(`${url}: fewer than four content sections`);
  if ((main.match(/https:\/\/(?:www\.)?natsume/gi)||[]).length < 1) errors.push(`${url}: no first-party source`);
  docs.push([url,tokens(main)]);
}
for (let i=0;i<docs.length;i++) {
  for (let j=i+1;j<docs.length;j++) {
    const score=similarity(docs[i][1],docs[j][1]);
    if (score>0.82) errors.push(`${docs[i][0]} and ${docs[j][0]}: excessive token overlap ${score.toFixed(2)}`);
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Content similarity audit passed: ${docs.length} new English URLs have sufficient depth, sourcing, and differentiation.`);
