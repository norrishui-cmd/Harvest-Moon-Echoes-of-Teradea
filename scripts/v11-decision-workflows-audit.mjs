import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname,'..');
const data = JSON.parse(await readFile(path.join(root,'data/v11-decision-workflows.json'),'utf8'));
const manifest = new Set(JSON.parse(await readFile(path.join(root,'seo/indexable-urls.json'),'utf8')));
const prefixes = ['/platform-choice/','/system-workflows/','/world-connections/','/preorder-decisions/'];
const errors = [];
const docs = [];
const stop = new Set('this that with from into have will page guide harvest moon echoes teradea confirmed official source sources player players'.split(' '));

async function walk(dir) {
  const out=[];
  for (const name of await readdir(dir)) {
    const full=path.join(dir,name);
    (await stat(full)).isDirectory()?out.push(...await walk(full)):out.push(full);
  }
  return out;
}
const tokens = html => new Set(html.toLowerCase().replace(/<script[\s\S]*?<\/script>/g,' ').replace(/<[^>]+>/g,' ').replace(/[^a-z0-9]+/g,' ').split(/\s+/).filter(x=>x.length>4&&!stop.has(x)));
const sim = (a,b) => {
  let shared=0;
  for (const x of a) if (b.has(x)) shared++;
  return shared/Math.max(1,Math.min(a.size,b.size));
};

for (const file of (await walk(root)).filter(f=>f.endsWith('index.html'))) {
  const rel=path.relative(root,file).replaceAll(path.sep,'/');
  const route=rel==='index.html'?'/':`/${rel.replace(/index\.html$/,'')}`;
  if (!prefixes.some(p=>route.startsWith(p)) || route.split('/').filter(Boolean).length!==2) continue;
  const html=await readFile(file,'utf8');
  const main=html.match(/<main>([\s\S]*?)<\/main>/i)?.[1]||'';
  const words=main.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().split(/\s+/).length;
  if (words<175) errors.push(`${route}: only ${words} visible words`);
  if (!/Direct answer/.test(main)) errors.push(`${route}: missing direct answer`);
  if (!/Evidence boundary/.test(main)) errors.push(`${route}: missing evidence boundary`);
  if (!/https:\/\/(?:www\.)?natsume/i.test(main)) errors.push(`${route}: missing first-party source`);
  if (!manifest.has(route)) errors.push(`${route}: missing from indexable manifest`);
  docs.push([route,tokens(main)]);
}
for (let i=0;i<docs.length;i++) for (let j=i+1;j<docs.length;j++) {
  const score=sim(docs[i][1],docs[j][1]);
  if (score>0.84) errors.push(`${docs[i][0]} vs ${docs[j][0]} similarity ${score.toFixed(2)}`);
}
const translated = [
  'platform-choice/switch-vs-switch-2','platform-choice/steam-vs-console',
  'platform-choice/physical-vs-digital','system-workflows/animal-obstacle-workflow',
  'system-workflows/nautical-chart-island-loop','system-workflows/power-wisp-progression-loop',
  'system-workflows/happilia-restoration-loop','world-connections/four-village-disaster-map',
  'world-connections/guardian-wolf-vs-lupo','preorder-decisions/lupo-bonus-verification'
];
for (const slug of translated) {
  const variants = {
    en: await readFile(path.join(root,slug,'index.html'),'utf8'),
    de: await readFile(path.join(root,'de',slug,'index.html'),'utf8'),
    ja: await readFile(path.join(root,'ja',slug,'index.html'),'utf8')
  };
  for (const [locale,html] of Object.entries(variants)) {
    for (const alt of ['en','de','ja','x-default']) {
      if (!new RegExp(`hreflang="${alt}"`).test(html)) errors.push(`/${locale}/${slug}: missing ${alt} hreflang`);
    }
  }
  if (!/[äöüß]/i.test(variants.de)) errors.push(`/de/${slug}: German localization signal missing`);
  if (!/[\u3040-\u30ff\u4e00-\u9faf]/.test(variants.ja)) errors.push(`/ja/${slug}: Japanese localization signal missing`);
}
if (docs.length!==data.englishLeaves) errors.push(`expected ${data.englishLeaves} English leaves, found ${docs.length}`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`V11 content audit passed: ${docs.length} English leaves have direct answers, source boundaries, depth, and differentiated text.`);
