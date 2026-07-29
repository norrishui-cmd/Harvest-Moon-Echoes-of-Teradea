import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const site='https://harvestmoonechoesofteradea.wiki';
const pages=JSON.parse(await readFile(path.join(root,'data','v17-fr-es-core.json'),'utf8'));
const errors=[];
const href=(lang,route)=>`/${lang==='en'?'':`${lang}/`}${route.split('/').filter(Boolean).join('/')}/`.replaceAll('//','/');

if(pages.length!==30) errors.push(`Expected 30 topics, found ${pages.length}`);
for(const page of pages) {
  for(const lang of ['en','fr','de','es','ja']) {
    const file=path.join(root,...(lang==='en'?[]:[lang]),...page.route.split('/').filter(Boolean),'index.html');
    let html='';
    try { html=await readFile(file,'utf8'); } catch { errors.push(`${lang}${page.route} missing`); continue; }
    for(const peer of ['en','fr','de','es','ja']) {
      if(!html.includes(`<link rel="alternate" hreflang="${peer}" href="${site}${href(peer,page.route)}">`)) errors.push(`${lang}${page.route} missing ${peer} hreflang`);
      if(!html.includes(`href="${href(peer,page.route)}" hreflang="${peer}" lang="${peer}"`)) errors.push(`${lang}${page.route} missing exact ${peer} switch`);
    }
    if(!html.includes('<span class="brand-title">Harvest Moon: Echoes of Teradea</span><span class="brand-subtitle">Wiki &amp; Guides</span>')) errors.push(`${lang}${page.route} brand mismatch`);
  }
  for(const lang of ['fr','es']) {
    const html=await readFile(path.join(root,lang,...page.route.split('/').filter(Boolean),'index.html'),'utf8');
    for(const marker of ['subpage-hero','class="callout"','class="content-list"','class="mini-grid"','class="toc"','application/ld+json','google-adsense-account']) if(!html.includes(marker)) errors.push(`${lang}${page.route} missing ${marker}`);
    if(/<h[12][^>]*>(Quick Answer|Confirmed Facts|How to use|Evidence boundary|Related pages)/i.test(html)) errors.push(`${lang}${page.route} English heading residue`);
    if(html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().length<900) errors.push(`${lang}${page.route} too little localized text`);
  }
}

const approved=new Set(JSON.parse(await readFile(path.join(root,'seo','indexable-urls.json'),'utf8')));
const sitemap=await readFile(path.join(root,'sitemap.xml'),'utf8');
for(const page of pages) for(const lang of ['fr','es']) {
  const route=href(lang,page.route);
  if(!approved.has(route)) errors.push(`${route} not approved`);
  if(!sitemap.includes(`<loc>${site}${route}</loc>`)) errors.push(`${route} absent sitemap`);
}
for(const lang of ['fr','es']) {
  const hub=await readFile(path.join(root,lang,'guides','index.html'),'utf8');
  if(!hub.includes('V17_FR_ES_CORE_START')) errors.push(`${lang} hub missing V17 links`);
}
if(errors.length) {
  console.error(errors.slice(0,120).join('\n'));
  console.error(`V17 audit failed with ${errors.length} errors.`);
  process.exit(1);
}
console.log(`V17 audit passed: ${pages.length} five-language sets and ${pages.length*2} new localized pages.`);
