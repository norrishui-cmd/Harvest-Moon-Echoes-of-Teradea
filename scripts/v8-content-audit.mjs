import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname,'..');
const site = 'https://harvestmoonechoesofteradea.wiki';
const manifest = new Set(JSON.parse(await readFile(path.join(root,'seo/indexable-urls.json'),'utf8')));
const inventory = JSON.parse(await readFile(path.join(root,'data/v8-screenshot-intelligence.json'),'utf8'));
const prefixes = ['/characters/','/locations/','/interface/'];
const errors = [];
const docs = [];
const stop = new Set('the a an and or to of in on for with is are be as by from this that it its what how guide page official harvest moon echoes teradea'.split(' '));
const tokens = text => new Set(text.toLowerCase().replace(/<script[\s\S]*?<\/script>/g,' ').replace(/<[^>]+>/g,' ').replace(/[^a-z0-9]+/g,' ').split(/\s+/).filter(word=>word.length>3&&!stop.has(word)));
const overlap = (a,b) => {
  let shared=0;
  for(const word of a) if(b.has(word)) shared++;
  return shared/Math.max(1,Math.min(a.size,b.size));
};

const expectedEnglish = [
  '/interface/',
  '/characters/lorelei/','/characters/bryce/','/characters/mara/','/characters/cindy/','/characters/amad/','/characters/lily/','/characters/rick/',
  '/locations/wolf-hill/','/locations/bloomfield-park/','/locations/maple-mart/','/locations/tornado-island/',
  '/interface/docpad/','/interface/photo-mode/','/interface/change-outfit/','/interface/song-selection/','/interface/quest-objective-tracker/','/interface/clock-calendar-and-weather/','/interface/map-and-area-labels/'
];
const reciprocal = [
  'characters/lorelei','characters/bryce','characters/mara',
  'locations/tornado-island','interface/docpad','interface/photo-mode'
];
for(const url of expectedEnglish) if(!manifest.has(url)) errors.push(`${url}: not approved`);
for(const url of expectedEnglish.filter(url=>url!=='/interface/')){
  const html = await readFile(path.join(root,url.slice(1),'index.html'),'utf8');
  const main = html.match(/<main>([\s\S]*?)<\/main>/i)?.[1] || '';
  const visible = main.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
  if(visible.split(/\s+/).length<235) errors.push(`${url}: fewer than 235 visible words`);
  if((main.match(/<h2/g)||[]).length<6) errors.push(`${url}: fewer than six sections`);
  if(!main.includes('natsume.com')) errors.push(`${url}: missing first-party context source`);
  if(!main.includes('bestbuy.com')) errors.push(`${url}: missing screenshot evidence source`);
  if(!/What is not confirmed/.test(main)) errors.push(`${url}: missing evidence boundary`);
  docs.push([url,tokens(main)]);
}
for(const slug of reciprocal){
  const expected = {
    en:`${site}/${slug}/`,
    de:`${site}/de/${slug}/`,
    ja:`${site}/ja/${slug}/`,
    'x-default':`${site}/${slug}/`
  };
  for(const locale of ['en','de','ja']){
    const file = locale==='en' ? path.join(root,slug,'index.html') : path.join(root,locale,slug,'index.html');
    const html = await readFile(file,'utf8');
    for(const [lang,href] of Object.entries(expected)){
      if(!html.includes(`hreflang="${lang}" href="${href}"`)) errors.push(`${locale}/${slug}: missing reciprocal ${lang}`);
    }
  }
}
for(let i=0;i<docs.length;i++) for(let j=i+1;j<docs.length;j++){
  const score=overlap(docs[i][1],docs[j][1]);
  if(score>0.82) errors.push(`${docs[i][0]} and ${docs[j][0]}: excessive overlap ${score.toFixed(2)}`);
}
if(inventory.addedEnglishPages!==18) errors.push('inventory: expected 18 English evidence pages');
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`V8 content audit passed: ${expectedEnglish.length} new English URLs, ${reciprocal.length} reciprocal language sets, distinct evidence, depth, sources, and explicit unknown boundaries.`);
