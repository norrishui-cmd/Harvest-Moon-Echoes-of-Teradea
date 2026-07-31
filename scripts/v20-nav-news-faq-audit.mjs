import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname,'..');
const hubs = ['release-date','demo','game-status','guides','story','features','locations','platforms','preorder','faq'];
const data = JSON.parse(await readFile(path.join(root,'data/v20-nav-news-faq.json'),'utf8'));
const manifest = JSON.parse(await readFile(path.join(root,'seo/indexable-urls.json'),'utf8'));
const sitemap = await readFile(path.join(root,'sitemap.xml'),'utf8');
const errors = [];
const stop = new Set('the a an and or to of in on for is are was were be been with this that it its as by from at can you your does do did what which how who when where have has game echoes teradea harvest moon official confirmed'.split(' '));
const tokens = value => new Set(value.toLowerCase().replace(/[^a-z0-9]+/g,' ').split(/\s+/).filter(x=>x.length>2&&!stop.has(x)));
const jaccard = (a,b) => { const x=tokens(a),y=tokens(b),n=[...x].filter(v=>y.has(v)).length; return n/(x.size+y.size-n||1); };
async function walk(dir) { const out=[]; for(const e of await readdir(dir,{withFileTypes:true})){const f=path.join(dir,e.name);e.isDirectory()?out.push(...await walk(f)):out.push(f);} return out; }

if (data.length!==50) errors.push(`expected 50 records, found ${data.length}`);
if (new Set(data.map(x=>x.slug)).size!==50) errors.push('duplicate V20 slug');
if (new Set(data.map(x=>x.question)).size!==50) errors.push('duplicate V20 question');
if (new Set(data.map(x=>x.headline)).size!==50) errors.push('duplicate V20 headline');
for (const hub of hubs) {
  const items=data.filter(x=>x.hub===hub);
  if(items.length!==5) errors.push(`${hub}: expected five records`);
  const html=await readFile(path.join(root,hub,'index.html'),'utf8');
  const faq=html.match(/<!-- RELATED_FAQ_V20_START -->([\s\S]*?)<!-- RELATED_FAQ_V20_END -->/)?.[1]||'';
  const news=html.match(/<!-- TAB_NEWS_V20_START -->([\s\S]*?)<!-- TAB_NEWS_V20_END -->/)?.[1]||'';
  if((faq.match(/<article/g)||[]).length!==5) errors.push(`${hub}: V20 FAQ cards != 5`);
  if((news.match(/<article/g)||[]).length!==5) errors.push(`${hub}: V20 News cards != 5`);
}
for (const item of data) {
  const routes=[`/faq/${item.slug}/`,`/news/${item.hub}/${item.slug}-briefing/`];
  for(const route of routes){
    const html=await readFile(path.join(root,route.slice(1),'index.html'),'utf8').catch(()=>null);
    if(!html){errors.push(`missing ${route}`);continue;}
    if(!manifest.includes(route)) errors.push(`manifest missing ${route}`);
    if(!sitemap.includes(`<loc>https://harvestmoonechoesofteradea.wiki${route}</loc>`)) errors.push(`sitemap missing ${route}`);
    if(!html.includes('Harvest Moon: Echoes of Teradea</span><span class="brand-subtitle">Wiki &amp; Guides')) errors.push(`brand ${route}`);
    if(!html.includes('ca-pub-9505220977121599')) errors.push(`adsense ${route}`);
    if(!html.includes('language-switcher')) errors.push(`language switcher ${route}`);
    if(!html.includes('article-layout')||!html.includes('class="toc"')) errors.push(`layout ${route}`);
    const visible=html.replace(/<script[\s\S]*?<\/script>/g,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
    if(visible.split(/\s+/).length<190) errors.push(`thin ${route}`);
  }
}
for(let i=0;i<data.length;i++)for(let j=i+1;j<data.length;j++){const score=jaccard(`${data[i].answer} ${data[i].evidence} ${data[i].boundary}`,`${data[j].answer} ${data[j].evidence} ${data[j].boundary}`);if(score>=0.62)errors.push(`similar ${data[i].slug} / ${data[j].slug}: ${score.toFixed(2)}`);}
const htmlFiles=(await walk(root)).filter(x=>x.endsWith('index.html'));
const faqFiles=(await walk(path.join(root,'faq'))).filter(x=>x.endsWith('index.html')&&path.dirname(x)!==path.join(root,'faq'));
const newsFiles=(await walk(path.join(root,'news'))).filter(x=>x.endsWith('index.html')&&path.dirname(x)!==path.join(root,'news'));
if(htmlFiles.length!==1033) errors.push(`expected 1033 HTML, found ${htmlFiles.length}`);
if(manifest.length!==1021) errors.push(`expected 1021 indexable URLs, found ${manifest.length}`);
if(faqFiles.length!==221) errors.push(`expected 221 FAQ pages, found ${faqFiles.length}`);
if(newsFiles.length!==150) errors.push(`expected 150 News pages, found ${newsFiles.length}`);
if((sitemap.match(/<url>/g)||[]).length!==manifest.length) errors.push('sitemap count mismatch');
if(errors.length){console.error(errors.slice(0,120).join('\n'));process.exit(1);}
console.log('V20 audit passed: 10 hubs × 5 News + 5 FAQ, 50 standalone FAQ URLs, 50 News URLs, 1033 HTML, 1021 indexable URLs.');
