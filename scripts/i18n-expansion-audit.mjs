import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname,'..');
const site = 'https://harvestmoonechoesofteradea.wiki';
const slugs = ['demo','game-status','media/first-trailer','items-recipes-materials','items/ore-and-gems','items/rare-collectibles','items/power-wisp-fruits','items/nautical-charts','items/traveling-merchant-exclusives','gameplay/campsite-day-trip-loop','gameplay/village-restoration-happilia-loop','gameplay/exploration-ability-combinations','characters/harvest-goddess','characters/doc-jr','characters/lupo'];
const errors=[];
async function walk(dir){const out=[];for(const name of await readdir(dir)){if(['.git','node_modules'].includes(name))continue;const full=path.join(dir,name);(await stat(full)).isDirectory()?out.push(...await walk(full)):out.push(full);}return out;}
for(const slug of slugs){
  const expected={en:`${site}/${slug}/`,de:`${site}/de/${slug}/`,ja:`${site}/ja/${slug}/`,'x-default':`${site}/${slug}/`};
  for(const locale of ['en','de','ja']){
    const file=locale==='en'?path.join(root,slug,'index.html'):path.join(root,locale,slug,'index.html');
    const html=await readFile(file,'utf8');
    const canonical=html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
    if(canonical!==expected[locale])errors.push(`${locale}/${slug}: wrong canonical`);
    for(const [lang,href] of Object.entries(expected))if(!html.includes(`hreflang="${lang}" href="${href}"`))errors.push(`${locale}/${slug}: missing ${lang}`);
  }
}
const files=(await walk(root)).filter(x=>x.endsWith('index.html'));
for(const file of files){const html=await readFile(file,'utf8');const count=(html.match(/class="language-switcher"/g)||[]).length;if(count!==1)errors.push(`${path.relative(root,file)}: expected one dropdown, found ${count}`);for(const lang of ['en','de','ja'])if(!html.includes(`hreflang="${lang}"`))errors.push(`${path.relative(root,file)}: dropdown missing ${lang}`);}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`I18n expansion audit passed: ${slugs.length} new reciprocal route sets and ${files.length} navigation dropdowns.`);
