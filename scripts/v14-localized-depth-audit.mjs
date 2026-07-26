import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname,'..');
const site = 'https://harvestmoonechoesofteradea.wiki';
const pages = JSON.parse(await readFile(path.join(root,'data','v14-localized-depth.json'),'utf8'));
const approved = new Set(JSON.parse(await readFile(path.join(root,'seo','indexable-urls.json'),'utf8')));
const errors = [];
const titles = new Set();
const localizedBodies = { de:[], ja:[] };
const expectedBrand = '<span class="brand-copy"><span class="brand-title">Harvest Moon: Echoes of Teradea</span><span class="brand-subtitle">Wiki &amp; Guides</span></span>';
const plainText = html => html
  .replace(/<script[\s\S]*?<\/script>/g,' ')
  .replace(/<style[\s\S]*?<\/style>/g,' ')
  .replace(/<[^>]+>/g,' ')
  .replace(/&[^;]+;/g,' ')
  .toLowerCase()
  .replace(/[^\p{L}\p{N}]+/gu,' ')
  .trim();
const tokens = text => new Set(text.split(/\s+/).filter(Boolean));
const similarity = (a,b) => {
  let overlap = 0;
  for (const token of a) if (b.has(token)) overlap++;
  return overlap / (a.size + b.size - overlap);
};

for (const page of pages) {
  const expected = { en:`${site}${page.route}`, de:`${site}/de${page.route}`, ja:`${site}/ja${page.route}`, 'x-default':`${site}${page.route}` };
  for (const locale of ['en','de','ja']) {
    const route = locale === 'en' ? page.route : `/${locale}${page.route}`;
    const file = path.join(root,...route.split('/').filter(Boolean),'index.html');
    const html = await readFile(file,'utf8');
    if (!approved.has(route)) errors.push(`${route}: missing approved URL`);
    if (!html.includes(`<html lang="${locale}">`)) errors.push(`${route}: wrong language`);
    if (!html.includes(`<link rel="canonical" href="${expected[locale]}">`)) errors.push(`${route}: wrong canonical`);
    for (const [lang,href] of Object.entries(expected)) if (!html.includes(`hreflang="${lang}" href="${href}"`)) errors.push(`${route}: missing ${lang} alternate`);
    if (!html.includes(expectedBrand)) errors.push(`${route}: full two-line brand missing`);
    if (locale !== 'en' && (!html.includes('class="subpage-hero"') || !html.includes('article-layout') || !html.includes('class="toc"'))) errors.push(`${route}: English visual hierarchy missing`);
    if (locale !== 'en' && (!html.includes('class="callout"') || !html.includes('class="content-list"') || !html.includes('class="mini-grid"'))) errors.push(`${route}: content modules incomplete`);
    if (locale !== 'en' && (!html.includes('Article') || !html.includes('BreadcrumbList'))) errors.push(`${route}: schema incomplete`);
    if (!html.includes('ca-pub-9505220977121599')) errors.push(`${route}: AdSense missing`);
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    if (!title) errors.push(`${route}: title missing`);
    else if (titles.has(`${locale}:${title}`)) errors.push(`${route}: duplicate title ${title}`);
    else titles.add(`${locale}:${title}`);
    if (locale === 'de' && !html.includes('Inoffizieller, quellengeprüfter deutschsprachiger Fan-Guide.')) errors.push(`${route}: German localization incomplete`);
    if (locale === 'ja' && !html.includes('出典を確認した非公式の日本語ファンガイドです。')) errors.push(`${route}: Japanese localization incomplete`);
    if (locale !== 'en') {
      const body = plainText(html);
      if (body.length < 650) errors.push(`${route}: localized body too shallow`);
      if (html.includes('<h2 id="answer">Quick answer</h2>') || html.includes('<h2 id="evidence">Confirmed')) errors.push(`${route}: untranslated English module heading`);
      localizedBodies[locale].push({ route, tokens:tokens(body) });
    }
  }
}

for (const locale of ['de','ja']) {
  const bodies = localizedBodies[locale];
  for (let i=0;i<bodies.length;i++) for (let j=i+1;j<bodies.length;j++) {
    const score = similarity(bodies[i].tokens,bodies[j].tokens);
    if (score >= 0.76) errors.push(`${locale}: excessive content similarity ${score.toFixed(3)} between ${bodies[i].route} and ${bodies[j].route}`);
  }
}

for (const locale of ['de','ja']) {
  const hub = await readFile(path.join(root,locale,'guides','index.html'),'utf8');
  const count = pages.filter(page=>hub.includes(`/${locale}${page.route}`)).length;
  if (count !== pages.length) errors.push(`/${locale}/guides/: expected ${pages.length} links, found ${count}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`V14 localized depth audit passed: ${pages.length * 2} pages, ${pages.length} reciprocal hreflang sets, full English-style module parity.`);
