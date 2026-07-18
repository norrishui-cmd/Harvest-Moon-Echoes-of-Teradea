import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const site='https://harvestmoonechoesofteradea.wiki';
const paths=['','release-date','platforms','preorder','features','features/open-world-exploration','features/animal-companions','features/campsites-travel','features/power-statues-wisps','features/happilia','locations','characters','romance/candidates','guides','story','faq'];
const errors=[];
const route=p=>p?`${p}/`:'';

for(const p of paths){
  const expected={en:`${site}/${route(p)}`,de:`${site}/de/${route(p)}`,ja:`${site}/ja/${route(p)}`,'x-default':`${site}/${route(p)}`};
  for(const locale of ['en','de','ja']){
    const file=locale==='en'?(p?path.join(root,p,'index.html'):path.join(root,'index.html')):path.join(root,locale,p,'index.html');
    const html=await readFile(file,'utf8');
    const lang=html.match(/<html lang="([^"]+)"/i)?.[1];
    const canonical=html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
    if(lang!==locale)errors.push(`${locale}/${p}: html lang is ${lang||'missing'}`);
    if(canonical!==expected[locale])errors.push(`${locale}/${p}: wrong self-canonical ${canonical||'missing'}`);
    for(const [hreflang,href] of Object.entries(expected))if(!html.includes(`hreflang="${hreflang}" href="${href}"`))errors.push(`${locale}/${p}: missing ${hreflang} alternate`);
    if(locale!=='en'&&!html.includes(locale==='de'?'Inoffizieller deutschsprachiger Fan-Guide':'非公式の日本語ファンガイド'))errors.push(`${locale}/${p}: missing unofficial-language disclosure`);
  }
}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`I18n audit passed: ${paths.length} reciprocal English/German/Japanese hreflang sets, self-canonicals and language disclosures.`);
