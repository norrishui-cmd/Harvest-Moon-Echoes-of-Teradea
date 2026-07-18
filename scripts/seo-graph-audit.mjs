import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const site='https://harvestmoonechoesofteradea.wiki';
const urls=JSON.parse(await readFile(path.join(root,'seo/indexable-urls.json'),'utf8'));
const approved=new Set(urls);
const inbound=new Map(urls.map(u=>[u,new Set()]));

for(const source of urls){
  const file=source==='/'?path.join(root,'index.html'):path.join(root,source.slice(1),'index.html');
  const html=await readFile(file,'utf8');
  const base=new URL(source,site);
  for(const match of html.matchAll(/href="([^"]+)"/gi)){
    const href=match[1];
    if(/^(mailto:|tel:|#)/i.test(href)) continue;
    let target;
    try{const resolved=new URL(href,base);if(resolved.origin!==site)continue;target=resolved.pathname.replace(/\/+/g,'/');}catch{continue;}
    if(!target.endsWith('/'))continue;
    if(approved.has(target)&&target!==source)inbound.get(target).add(source);
  }
}

const orphans=urls.filter(u=>u!=='/'&&inbound.get(u).size===0);
if(orphans.length){console.error(`Orphan indexable URLs:\n${orphans.join('\n')}`);process.exit(1);}
const counts=urls.filter(u=>u!=='/').map(u=>inbound.get(u).size);
console.log(`SEO graph audit passed: ${urls.length} indexable URLs, no orphan pages, minimum inbound links ${Math.min(...counts)}.`);
