import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const site='https://harvestmoonechoesofteradea.wiki';
const pages=JSON.parse(await readFile(path.join(root,'data','v16-fr-es-depth.json'),'utf8'));
const errors=[];
const href=(lang,route)=>`/${lang==='en'?'':`${lang}/`}${route.split('/').filter(Boolean).join('/')}/`.replaceAll('//','/');

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
    const file=path.join(root,lang,...page.route.split('/').filter(Boolean),'index.html');
    const html=await readFile(file,'utf8');
    for(const marker of ['subpage-hero','class="callout"','class="content-list"','class="mini-grid"','class="toc"','application/ld+json','google-adsense-account']) if(!html.includes(marker)) errors.push(`${lang}${page.route} missing ${marker}`);
    if(/<h[12][^>]*>(Quick Answer|Confirmed Facts|How to use|Evidence boundary|Related pages)/i.test(html)) errors.push(`${lang}${page.route} English heading residue`);
  }
}

const approved=new Set(JSON.parse(await readFile(path.join(root,'seo','indexable-urls.json'),'utf8')));
const sitemap=await readFile(path.join(root,'sitemap.xml'),'utf8');
for(const page of pages) for(const lang of ['fr','es']) {
  const route=href(lang,page.route);
  if(!approved.has(route)) errors.push(`${route} not approved`);
  if(!sitemap.includes(`<loc>${site}${route}</loc>`)) errors.push(`${route} absent sitemap`);
}

if(errors.length) {
  console.error(errors.slice(0,100).join('\n'));
  console.error(`V16 audit failed with ${errors.length} errors.`);
  process.exit(1);
}
console.log(`V16 audit passed: ${pages.length} five-language sets and ${pages.length*2} new localized pages.`);
