import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const site = 'https://harvestmoonechoesofteradea.wiki';
const approved = new Set(JSON.parse(await readFile(path.join(root,'seo/indexable-urls.json'),'utf8')));
const slugs = [
  'when-does-echoes-of-teradea-release','is-september-24-a-global-release-date','will-console-and-pc-launch-the-same-day','which-announcement-confirmed-september-24','when-was-echoes-of-teradea-announced',
  'are-there-five-bachelors-and-five-bachelorettes','are-all-ten-love-interests-new','which-character-names-appear-in-screenshots','is-lorelei-connected-to-the-mine','are-lily-and-rick-linked-by-a-quest',
  'does-echoes-of-teradea-have-photo-mode','can-you-change-your-outfit','can-you-select-music','does-the-interface-track-quest-objectives','does-the-hud-show-date-time-and-weather',
  'is-wolf-hill-a-confirmed-location','is-tornado-island-a-confirmed-location','is-bloomfield-park-in-the-game','what-is-maple-mart','are-there-spirit-trees',
  'are-switch-and-switch-2-separate-versions','is-the-pc-version-steam-only','is-there-a-physical-xbox-edition','is-there-a-physical-pc-edition','are-switch-2-performance-details-confirmed',
  'what-is-the-official-store-price','is-the-lupo-plush-guaranteed','can-you-preorder-from-best-buy','which-retailers-did-natsume-name','does-the-listed-price-include-shipping-and-tax'
];
const errors = [];
const expectedBrand = '<span class="brand-copy"><span class="brand-title">Harvest Moon: Echoes of Teradea</span><span class="brand-subtitle">Wiki &amp; Guides</span></span>';

for (const slug of slugs) {
  const expected = {
    en:`${site}/faq/${slug}/`,
    de:`${site}/de/faq/${slug}/`,
    ja:`${site}/ja/faq/${slug}/`,
    'x-default':`${site}/faq/${slug}/`
  };
  for (const locale of ['en','de','ja']) {
    const file = locale === 'en' ? path.join(root,'faq',slug,'index.html') : path.join(root,locale,'faq',slug,'index.html');
    const html = await readFile(file,'utf8');
    const route = locale === 'en' ? `/faq/${slug}/` : `/${locale}/faq/${slug}/`;
    if (!approved.has(route)) errors.push(`${route}: missing from approved URL set`);
    if (!html.includes(`<html lang="${locale}">`)) errors.push(`${route}: wrong html lang`);
    if (!html.includes(`<link rel="canonical" href="${expected[locale]}">`)) errors.push(`${route}: wrong canonical`);
    for (const [lang,href] of Object.entries(expected)) if (!html.includes(`hreflang="${lang}" href="${href}"`)) errors.push(`${route}: missing ${lang} alternate`);
    if (!html.includes(expectedBrand)) errors.push(`${route}: two-line full brand missing`);
    if (!html.includes('FAQPage') || !html.includes('BreadcrumbList')) errors.push(`${route}: schema incomplete`);
    if ((html.match(/<li>/g)||[]).length < 6) errors.push(`${route}: evidence or navigation depth too low`);
    if (!html.includes('class="toc"') || !html.includes('class="callout"')) errors.push(`${route}: English layout parity missing`);
    if (locale === 'de' && !html.includes('Inoffizieller, quellengeprüfter deutschsprachiger Fan-Guide.')) errors.push(`${route}: German disclosure missing`);
    if (locale === 'ja' && !html.includes('出典を確認した非公式の日本語ファンガイドです。')) errors.push(`${route}: Japanese disclosure missing`);
  }
}

for (const locale of ['de','ja']) {
  const hub = await readFile(path.join(root,locale,'faq','index.html'),'utf8');
  const count = slugs.filter(slug=>hub.includes(`/${locale}/faq/${slug}/`)).length;
  if (count !== slugs.length) errors.push(`/${locale}/faq/: expected ${slugs.length} localized links, found ${count}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`V13 localized FAQ audit passed: ${slugs.length * 2} new pages, ${slugs.length} reciprocal hreflang sets, full English-layout parity.`);
