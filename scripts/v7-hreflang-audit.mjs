import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname,'..');
const site = 'https://harvestmoonechoesofteradea.wiki';
const routes = [
  'pre-release/official-announcement-timeline',
  'pre-release/confirmed-facts-before-launch',
  'pre-release/confirmed-vs-unconfirmed-feature-tracker',
  'buying-guide/physical-editions-by-platform',
  'buying-guide/retailer-availability-guide',
  'buying-guide/lupo-wolf-plush-eligibility',
  'exploration/expedition-planning-before-you-leave',
  'exploration/campsite-rest-recovery-cooking'
];
const errors=[];
for (const route of routes) {
  const variants={en:`/${route}/`,de:`/de/${route}/`,ja:`/ja/${route}/`};
  for (const [locale,url] of Object.entries(variants)) {
    const html=await readFile(path.join(root,url.slice(1),'index.html'),'utf8');
    for (const [lang,target] of Object.entries(variants)) {
      if (!html.includes(`hreflang="${lang}" href="${site}${target}"`)) errors.push(`${url}: missing ${lang} alternate`);
    }
    if (!html.includes(`hreflang="x-default" href="${site}${variants.en}"`)) errors.push(`${url}: missing x-default`);
    if (!html.includes(`<html lang="${locale}">`)) errors.push(`${url}: wrong html lang`);
  }
}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`V7 hreflang audit passed: ${routes.length} reciprocal en/de/ja route sets.`);
