import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const site = 'https://harvestmoonechoesofteradea.wiki';
const reviewed = '2026-07-29';
const all = JSON.parse(await readFile(path.join(root, 'data/v18-nav-news-faq.json'), 'utf8'));
const selectedSlugs = new Set([
  'is-september-24-listed-on-the-official-store',
  'what-day-of-the-week-is-september-24-2026',
  'has-the-release-date-changed-since-preorders-opened',
  'are-regional-digital-unlock-times-published',
  'is-the-first-trailer-a-playable-demo',
  'has-a-demo-download-size-been-published',
  'is-there-an-age-rating-for-a-demo',
  'would-a-demo-require-a-preorder',
  'does-rating-pending-mean-the-game-is-rated-teen',
  'does-one-player-confirm-no-online-features',
  'has-the-full-game-file-size-been-published',
  'have-pc-system-requirements-been-published',
  'can-campsites-support-long-exploration-trips',
  'should-you-match-animal-abilities-to-obstacles',
  'can-wild-animal-attacks-cost-collected-items',
  'do-nautical-charts-support-island-expeditions',
  'is-cross-save-confirmed-between-platforms',
  'is-there-a-switch-to-switch-2-upgrade-path',
  'is-a-ps5-disc-preorder-confirmed',
  'has-steam-deck-compatibility-been-announced'
]);

const translations = {
  'is-september-24-listed-on-the-official-store': {
    de: ['Nennt der offizielle Natsume Store den 24. September als Erscheinungstermin?', 'Ja. Die Produktseite im Natsume Store nennt den 24. September 2026 als Erscheinungstermin von Harvest Moon: Echoes of Teradea.'],
    ja: ['Natsume公式ストアに9月24日の発売日が掲載されている？', 'はい。Natsume公式ストアの商品ページには、Harvest Moon: Echoes of Teradeaの発売日が2026年9月24日と記載されています。']
  },
  'what-day-of-the-week-is-september-24-2026': {
    de: ['Auf welchen Wochentag fällt der Release von Echoes of Teradea?', 'Der 24. September 2026 ist ein Donnerstag. Dieses Datum ist der von Natsume bestätigte Erscheinungstermin.'],
    ja: ['Echoes of Teradeaの発売日は何曜日？', '2026年9月24日は木曜日です。Natsumeが確認している発売日を曜日に換算した結果です。']
  },
  'has-the-release-date-changed-since-preorders-opened': {
    de: ['Hat sich der Erscheinungstermin seit dem Vorbestellungsstart geändert?', 'Nein. Seit dem Start der Vorbestellungen wurde keine offizielle Änderung veröffentlicht; weiterhin gilt der 24. September 2026.'],
    ja: ['予約開始後に発売日は変更された？', 'いいえ。予約開始後に公式な変更は発表されておらず、2026年9月24日のままです。']
  },
  'are-regional-digital-unlock-times-published': {
    de: ['Sind regionale Freischaltzeiten für digitale Versionen veröffentlicht?', 'Nein. Natsume hat das Datum bestätigt, aber noch keine regionalen Freischaltzeiten für Steam, PlayStation, Xbox oder Nintendo veröffentlicht.'],
    ja: ['地域別のデジタル版解禁時刻は発表されている？', 'いいえ。発売日は確定していますが、Steam、PlayStation、Xbox、Nintendoの地域別解禁時刻は未発表です。']
  },
  'is-the-first-trailer-a-playable-demo': {
    de: ['Ist der erste Trailer eine spielbare Demo?', 'Nein. Die Veröffentlichung vom 18. Juni ist ausdrücklich ein Video-Trailer und keine herunterladbare oder spielbare Demo.'],
    ja: ['最初のトレーラーは遊べる体験版？', 'いいえ。6月18日に公開されたのは映像トレーラーであり、ダウンロード可能な体験版ではありません。']
  },
  'has-a-demo-download-size-been-published': {
    de: ['Wurde eine Downloadgröße für eine Demo veröffentlicht?', 'Nein. Da Natsume keine öffentliche Demo angekündigt hat, gibt es auch keine bestätigte Demo-Dateigröße.'],
    ja: ['体験版のダウンロード容量は発表された？', 'いいえ。公開体験版自体が発表されていないため、機種別のファイル容量も未発表です。']
  },
  'is-there-an-age-rating-for-a-demo': {
    de: ['Gibt es eine Altersfreigabe für eine Demo?', 'Nein. Für eine öffentliche Demo ist keine eigene Altersfreigabe gelistet; beim vollständigen Spiel steht derzeit ESRB „Rating Pending“.'],
    ja: ['体験版の年齢レーティングはある？', 'いいえ。公開体験版の個別レーティングはなく、製品版も現在はESRB「Rating Pending」です。']
  },
  'would-a-demo-require-a-preorder': {
    de: ['Würde eine Demo eine Vorbestellung erfordern?', 'Natsume hat keine Demo angekündigt. Deshalb gibt es weder eine bestätigte Vorbestellpflicht noch einen Zugangscode oder Early Access.'],
    ja: ['体験版を遊ぶには予約が必要？', '体験版はまだ発表されていないため、予約条件、アクセスコード、早期プレイ特典はいずれも確認されていません。']
  },
  'does-rating-pending-mean-the-game-is-rated-teen': {
    de: ['Bedeutet „Rating Pending“, dass das Spiel ab Teenageralter freigegeben ist?', 'Nein. „Rating Pending“ bedeutet, dass die endgültige ESRB-Einstufung noch nicht angezeigt wird; es ist keine Teen-Freigabe.'],
    ja: ['「Rating Pending」はTeen指定という意味？', 'いいえ。「Rating Pending」はESRBの最終区分が未確定という意味で、Teen指定を示すものではありません。']
  },
  'does-one-player-confirm-no-online-features': {
    de: ['Bestätigt „1 Spieler“, dass es keine Online-Funktionen gibt?', 'Nein. Der Store bestätigt Einzelspieler, sagt damit aber nichts Abschließendes über optionale Cloud-, Ranglisten- oder Sharing-Funktionen aus.'],
    ja: ['「1人用」ならオンライン機能は一切ない？', 'いいえ。1人用であることは確認できますが、クラウド、ランキング、共有など任意のオンライン機能までは否定できません。']
  },
  'has-the-full-game-file-size-been-published': {
    de: ['Wurde die Dateigröße des vollständigen Spiels veröffentlicht?', 'Nein. Natsume hat noch keine plattformspezifische Download- oder Installationsgröße veröffentlicht.'],
    ja: ['製品版のファイル容量は発表された？', 'いいえ。Natsumeは機種別のダウンロード容量やインストール容量をまだ公開していません。']
  },
  'have-pc-system-requirements-been-published': {
    de: ['Wurden die PC-Systemanforderungen veröffentlicht?', 'Nein. In den bisher geprüften Natsume-Ankündigungen fehlen minimale und empfohlene PC-Spezifikationen.'],
    ja: ['PC版のシステム要件は発表された？', 'いいえ。確認済みのNatsume公式発表には、最低・推奨PCスペックが掲載されていません。']
  },
  'can-campsites-support-long-exploration-trips': {
    de: ['Unterstützen Campingplätze längere Erkundungstouren?', 'Ja. Laut Natsume kann man an Campingplätzen kochen, schlafen und sich erholen; sie unterstützen damit längere Touren außerhalb der Farm.'],
    ja: ['キャンプ場は長時間の探索に役立つ？', 'はい。Natsumeはキャンプ場で料理、睡眠、回復ができると説明しており、農場を離れた探索を支える仕組みです。']
  },
  'should-you-match-animal-abilities-to-obstacles': {
    de: ['Sollte man Tierfähigkeiten passend zu Hindernissen auswählen?', 'Ja. Offizielle Beschreibungen nennen unterschiedliche Tierfähigkeiten zum Springen, Zerstören von Hindernissen und Finden von Schätzen.'],
    ja: ['障害物に合わせて動物の能力を選ぶべき？', 'はい。公式説明では、動物ごとの能力で地形を越え、障害物を壊し、宝を発見できるとされています。']
  },
  'can-wild-animal-attacks-cost-collected-items': {
    de: ['Können Angriffe wilder Tiere gesammelte Gegenstände kosten?', 'Ja. Natsume warnt, dass gefährliche Tiere den Spieler zurückschicken und zum Verlust eines Teils der gesammelten Gegenstände führen können.'],
    ja: ['野生動物に襲われると集めたアイテムを失う？', 'はい。危険な野生動物に倒されると戻され、集めたアイテムの一部を失う可能性があるとNatsumeが説明しています。']
  },
  'do-nautical-charts-support-island-expeditions': {
    de: ['Unterstützen Seekarten Expeditionen zu Inseln?', 'Ja. Die offizielle Funktionsbeschreibung verbindet Seekarten mit abgelegenen Inseln, seltenen Sammelobjekten und Tieren.'],
    ja: ['海図は離島探索に使う？', 'はい。公式説明では、海図を手掛かりに離島へ向かい、珍しい収集物や動物を探す流れが示されています。']
  },
  'is-cross-save-confirmed-between-platforms': {
    de: ['Ist Cross-Save zwischen den Plattformen bestätigt?', 'Nein. Für Switch, Switch 2, PS5, Xbox und Steam wurde keine plattformübergreifende Übertragung von Spielständen bestätigt.'],
    ja: ['機種間のクロスセーブは確認されている？', 'いいえ。Switch、Switch 2、PS5、Xbox、Steam間のセーブデータ共有は発表されていません。']
  },
  'is-there-a-switch-to-switch-2-upgrade-path': {
    de: ['Gibt es einen Upgrade-Pfad von Switch zu Switch 2?', 'Nein. Natsume listet getrennte physische Varianten, hat aber kein kostenpflichtiges oder kostenloses Upgrade-Programm angekündigt.'],
    ja: ['Switch版からSwitch 2版へのアップグレードはある？', 'いいえ。別々のパッケージ版は掲載されていますが、有料・無料のアップグレード制度は発表されていません。']
  },
  'is-a-ps5-disc-preorder-confirmed': {
    de: ['Ist eine physische PS5-Vorbestellung bestätigt?', 'Ja. Der Natsume Store führt PlayStation 5 als auswählbare physische Vorbestellvariante.'],
    ja: ['PS5のパッケージ版予約は確認されている？', 'はい。Natsume公式ストアでPlayStation 5がパッケージ版の予約選択肢として掲載されています。']
  },
  'has-steam-deck-compatibility-been-announced': {
    de: ['Wurde Steam-Deck-Kompatibilität angekündigt?', 'Nein. Die Steam-Version ist bestätigt, aber Natsume hat noch keine Steam-Deck-Einstufung oder getestete Leistungsangaben veröffentlicht.'],
    ja: ['Steam Deck対応は発表されている？', 'いいえ。Steam版は確定していますが、Steam Deckの互換性評価や検証済み動作情報は未発表です。']
  }
};

const selected = all.filter(x => selectedSlugs.has(x.slug));
if (selected.length !== 20) throw new Error(`Expected 20 selected records, found ${selected.length}`);

const localeData = {
  de: {
    name: 'Deutsch', home: 'Start', faq: 'FAQ', news: 'News', release: 'Release',
    guides: 'Guides', features: 'Features', platforms: 'Plattformen',
    quick: 'Kurzantwort', evidence: 'Geprüfte Belege', meaning: 'So hilft diese Antwort',
    boundary: 'Grenzen der Bestätigung', source: 'Primärquelle', related: 'Verwandte Inhalte',
    toc: 'Auf dieser Seite', updated: 'Geprüft', unofficial: 'Inoffizieller, quellengeprüfter Fan-Guide.',
    evidenceLines: [
      'Die Kurzantwort fasst den belegten Stand zusammen, ohne fehlende Angaben zu ergänzen.',
      'Die genannte Primärquelle wurde mit Veröffentlichungsdatum und aktuellem Prüfdatum dokumentiert.',
      'Unbestätigte Werte, Abläufe und Plattformfunktionen werden nicht aus älteren Harvest-Moon-Spielen übernommen.'
    ],
    boundaryText: 'Der aktuelle Beleg beantwortet diese konkrete Frage. Nicht veröffentlichte Uhrzeiten, Werte, Leistungsdaten oder Spielabläufe bleiben ausdrücklich offen.',
    useText: 'Nutze diese Angabe für die aktuelle Kauf- oder Spielplanung und prüfe sie erneut, sobald Natsume oder ein verifizierter Plattform-Store neue Primärdaten veröffentlicht.',
    newsIntro: 'Dieser Faktencheck isoliert eine konkrete Spielerfrage aus dem öffentlichen Informationsstand. Er trennt bestätigte Angaben klar von noch offenen Details.',
    newsImpact: 'Damit lässt sich die aktuelle Entscheidung einordnen, ohne aus einem Trailer, einer Vorbestellseite oder einer Plattformnennung eine vollständige Spezifikation abzuleiten.',
    newsUnknown: 'Nicht angekündigte Funktionen, Zahlen, Zeiten und technische Leistungswerte werden nicht ergänzt. Die Seite wird erst nach neuen Primärdaten inhaltlich erweitert.'
  },
  ja: {
    name: '日本語', home: 'ホーム', faq: 'FAQ', news: 'ニュース', release: '発売日',
    guides: '攻略', features: 'システム', platforms: '対応機種',
    quick: '結論', evidence: '確認した根拠', meaning: 'この回答の使い方',
    boundary: '確認できる範囲', source: '一次情報', related: '関連ページ',
    toc: 'このページの内容', updated: '確認日', unofficial: '非公式・一次情報確認済みのファンガイドです。',
    evidenceLines: [
      '結論は、公開済みの情報だけを使って対象の質問に直接答えています。',
      '一次情報の公開日と、このページでの最終確認日を分けて記録しています。',
      '過去のHarvest Moon作品から未確認の数値、手順、機種機能を流用していません。'
    ],
    boundaryText: '現在の資料で確認できるのは、この質問に対する具体的な範囲までです。未発表の時刻、数値、性能、詳細手順は確定情報として扱いません。',
    useText: '購入や発売前の準備にはこの確認済み情報を使い、Natsumeまたは公式プラットフォームに新しい一次情報が出た時点で再確認してください。',
    newsIntro: 'このファクトチェックは、公開情報の中からプレイヤーの具体的な疑問を一つ切り出し、確定事項と未発表事項を分けて整理します。',
    newsImpact: 'トレーラー、予約ページ、対応機種の発表だけから、完全な仕様や未公開機能を推測せずに現在の判断材料を確認できます。',
    newsUnknown: '未発表の機能、数値、時刻、性能は追加していません。新しい一次情報が公開された場合にのみ内容を更新します。'
  }
};

const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const brand = '<span class="brand-copy"><span class="brand-title">Harvest Moon: Echoes of Teradea</span><span class="brand-subtitle">Wiki &amp; Guides</span></span>';
const adsense = '<!-- ADSENSE_START -->\n<meta name="google-adsense-account" content="ca-pub-9505220977121599">\n<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9505220977121599" crossorigin="anonymous"></script>\n<!-- ADSENSE_END -->';

function routes(item) {
  return {
    faq: `/faq/${item.slug}/`,
    news: `/news/${item.hub}/${item.slug}-briefing/`
  };
}

function localized(locale, route) {
  return `/${locale}${route}`;
}

function alternates(route) {
  return `<link rel="alternate" hreflang="en" href="${site}${route}"><link rel="alternate" hreflang="de" href="${site}/de${route}"><link rel="alternate" hreflang="ja" href="${site}/ja${route}"><link rel="alternate" hreflang="x-default" href="${site}${route}">`;
}

function switcher(locale, route) {
  const active = localeData[locale].name;
  return `<!-- LANGUAGE_SWITCHER_START --><details class="language-switcher"><summary aria-label="Choose language"><span aria-hidden="true">🌐</span><span>${active}</span><span class="language-chevron" aria-hidden="true">▾</span></summary><ul role="list"><li><a href="${route}" hreflang="en" lang="en">English</a></li><li><a href="/fr/" hreflang="fr" lang="fr">Français</a></li><li><a href="/de${route}" hreflang="de" lang="de"${locale === 'de' ? ' aria-current="page"' : ''}>Deutsch</a></li><li><a href="/es/" hreflang="es" lang="es">Español</a></li><li><a href="/ja${route}" hreflang="ja" lang="ja"${locale === 'ja' ? ' aria-current="page"' : ''}>日本語</a></li></ul></details><!-- LANGUAGE_SWITCHER_END -->`;
}

function nav(locale) {
  const l = localeData[locale];
  return `<nav class="nav"><a href="/${locale}/news/">${l.news}</a><a href="/${locale}/release-date/">${l.release}</a><a href="/${locale}/guides/">${l.guides}</a><a href="/${locale}/features/">${l.features}</a><a href="/${locale}/platforms/">${l.platforms}</a><a href="/${locale}/faq/">FAQ</a></nav>`;
}

function schema(item, locale, type, title, answer, route) {
  const graph = type === 'faq'
    ? [{ '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: title, acceptedAnswer: { '@type': 'Answer', text: answer } }] }]
    : [{ '@type': 'NewsArticle', headline: title, description: answer, datePublished: item.source.date, dateModified: reviewed, inLanguage: locale, mainEntityOfPage: `${site}${localized(locale, route)}`, citation: item.source.url, author: { '@type': 'Organization', name: 'Echoes Guide Editorial Team' }, publisher: { '@type': 'Organization', name: 'Echoes Guide' }, about: { '@type': 'VideoGame', name: 'Harvest Moon: Echoes of Teradea' } }];
  graph.push({ '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: localeData[locale].home, item: `${site}/${locale}/` },
    { '@type': 'ListItem', position: 2, name: type === 'faq' ? 'FAQ' : localeData[locale].news, item: `${site}/${locale}/${type === 'faq' ? 'faq' : 'news'}/` },
    { '@type': 'ListItem', position: 3, name: title, item: `${site}${localized(locale, route)}` }
  ]});
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}

function head(item, locale, type, title, answer, route) {
  const suffix = type === 'faq' ? (locale === 'de' ? 'FAQ auf Deutsch' : '日本語FAQ') : (locale === 'de' ? 'News auf Deutsch' : '日本語ニュース');
  return `<!doctype html><html lang="${locale}"><head>${adsense}<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | Echoes of Teradea ${suffix}</title><meta name="description" content="${esc(answer)}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${site}${localized(locale, route)}">${alternates(route)}<link rel="icon" href="/assets/site-icon.svg"><link rel="stylesheet" href="/styles.css"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(answer)}"><meta property="og:type" content="article"><meta property="og:url" content="${site}${localized(locale, route)}"><meta property="og:image" content="${site}/assets/hero-fan-art.png"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${schema(item, locale, type, title, answer, route)}</script></head>`;
}

function related(item, locale, type) {
  const peers = selected.filter(x => x.hub === item.hub && x.slug !== item.slug).slice(0, 3);
  return peers.map(x => {
    const route = routes(x)[type];
    const title = translations[x.slug][locale][0];
    return `<a href="${localized(locale, route)}">${esc(type === 'news' ? (locale === 'de' ? `Faktencheck: ${title}` : `最新確認：${title}`) : title)}</a>`;
  }).join('');
}

function renderFaq(item, locale) {
  const l = localeData[locale];
  const [title, answer] = translations[item.slug][locale];
  const route = routes(item).faq;
  const hubLabel = locale === 'de' ? ({ 'release-date': 'Release', demo: 'Demo', 'game-status': 'Spieldaten', guides: 'Guides', platforms: 'Plattformen' }[item.hub]) : ({ 'release-date': '発売日', demo: '体験版', 'game-status': '最新データ', guides: '攻略', platforms: '対応機種' }[item.hub]);
  return `${head(item, locale, 'faq', title, answer, route)}<body><header class="site-header"><a class="brand" href="/${locale}/"><span class="brand-mark">HM</span>${brand}</a>${nav(locale)}${switcher(locale, route)}</header><main><section class="subpage-hero"><div class="breadcrumb"><a href="/${locale}/">${l.home}</a><span>/</span><a href="/${locale}/faq/">FAQ</a><span>/</span><span>${esc(title)}</span></div><p class="eyebrow">${hubLabel} FAQ · ${l.updated} ${reviewed}</p><h1>${esc(title)}</h1><p>${esc(answer)}</p></section><section class="section article-layout"><article class="article-main"><h2 id="answer">${l.quick}</h2><p class="callout">${esc(answer)}</p><h2 id="evidence">${l.evidence}</h2><ul class="content-list"><li>${esc(l.evidenceLines[0])}</li><li>${esc(l.evidenceLines[1])} <strong>${esc(item.source.label)}</strong> · ${item.source.date}.</li><li>${esc(l.evidenceLines[2])}</li></ul><h2 id="meaning">${l.meaning}</h2><p>${esc(l.useText)}</p><div class="mini-grid"><article><strong>1</strong><p>${locale === 'de' ? 'Kurzantwort und Datum prüfen.' : '結論と確認日を確認します。'}</p></article><article><strong>2</strong><p>${locale === 'de' ? 'Plattform oder Angebot getrennt bewerten.' : '機種や販売条件を分けて判断します。'}</p></article><article><strong>3</strong><p>${locale === 'de' ? 'Offene Punkte erst mit neuen Quellen ergänzen.' : '未確定事項は新情報の公開後に更新します。'}</p></article></div><h2 id="boundary">${l.boundary}</h2><p>${esc(l.boundaryText)}</p><h2 id="source">${l.source}</h2><p><a href="${item.source.url}" rel="nofollow noopener">${esc(item.source.label)}</a> · ${item.source.date}; ${l.updated} ${reviewed}.</p><h2 id="related">${l.related}</h2><div class="page-links">${related(item, locale, 'faq')}<a href="${localized(locale, routes(item).news)}">${locale === 'de' ? 'Zugehörigen News-Faktencheck öffnen' : '関連ニュースのファクトチェック'}</a><a href="/${locale}/faq/">${locale === 'de' ? 'Alle FAQ' : 'FAQ一覧'}</a></div><h2>${locale === 'de' ? 'Qualitätshinweis' : '品質方針'}</h2><p>${locale === 'de' ? 'Diese Seite nutzt dieselbe visuelle Hierarchie, Quellenebene und Informationstiefe wie die englische Fassung.' : '英語版と同じ視覚階層、一次情報、情報密度で構成した日本語ページです。'}</p></article><aside class="toc"><h2>${l.toc}</h2><a href="#answer">${l.quick}</a><a href="#evidence">${l.evidence}</a><a href="#meaning">${l.meaning}</a><a href="#boundary">${l.boundary}</a><a href="#source">${l.source}</a><a href="#related">${l.related}</a></aside></section></main><footer class="site-footer"><p>${l.unofficial} ${l.updated} ${reviewed}.</p><a href="/${locale}/faq/">FAQ</a></footer></body></html>`;
}

function renderNews(item, locale) {
  const l = localeData[locale];
  const [question, answer] = translations[item.slug][locale];
  const title = locale === 'de' ? `Aktueller Faktencheck: ${question}` : `最新確認：${question}`;
  const route = routes(item).news;
  return `${head(item, locale, 'news', title, answer, route)}<body><header class="site-header"><a class="brand" href="/${locale}/"><span class="brand-mark">HM</span>${brand}</a>${nav(locale)}${switcher(locale, route)}</header><main><section class="subpage-hero"><div class="breadcrumb"><a href="/${locale}/">${l.home}</a><span>/</span><a href="/${locale}/news/">${l.news}</a><span>/</span><span>${esc(title)}</span></div><p class="eyebrow">${locale === 'de' ? 'Quellenbasierte Kurzmeldung' : '一次情報に基づく短報'} · ${reviewed}</p><h1>${esc(title)}</h1><p>${esc(answer)}</p></section><section class="section article-layout"><article class="article-main"><h2 id="status">${locale === 'de' ? 'Der bestätigte Stand' : '確認済みの最新状況'}</h2><p class="callout">${esc(answer)}</p><p>${esc(l.newsIntro)}</p><h2 id="facts">${locale === 'de' ? 'Was die Quelle belegt' : '一次情報で確認できること'}</h2><ul class="content-list"><li>${esc(answer)}</li><li>${esc(locale === 'de' ? `Primärquelle: ${item.source.label}, veröffentlicht am ${item.source.date}.` : `一次情報：${item.source.label}（${item.source.date}公開）。`)}</li><li>${esc(l.evidenceLines[2])}</li></ul><h2 id="impact">${locale === 'de' ? 'Warum das für Spieler wichtig ist' : 'プレイヤーへの影響'}</h2><p>${esc(l.newsImpact)}</p><h2 id="unknown">${locale === 'de' ? 'Was weiterhin offen ist' : 'まだ確認できないこと'}</h2><p>${esc(l.newsUnknown)}</p><h2 id="source">${l.source}</h2><p><a href="${item.source.url}" rel="nofollow noopener">${esc(item.source.label)}</a> · ${item.source.date}; ${l.updated} ${reviewed}.</p><h2 id="related">${l.related}</h2><div class="page-links">${related(item, locale, 'news')}<a href="${localized(locale, routes(item).faq)}">${esc(question)}</a><a href="/${locale}/news/">${locale === 'de' ? 'Alle News' : 'ニュース一覧'}</a></div><h2>${locale === 'de' ? 'Redaktioneller Standard' : '編集方針'}</h2><p>${locale === 'de' ? 'Die Meldung verwendet dieselben Inhaltsmodule, Quellenregeln und visuellen Komponenten wie die englische Originalseite.' : '英語版と同じコンテンツモジュール、出典基準、視覚コンポーネントを使用しています。'}</p></article><aside class="toc"><h2>${l.toc}</h2><a href="#status">${locale === 'de' ? 'Bestätigter Stand' : '最新状況'}</a><a href="#facts">${locale === 'de' ? 'Belege' : '根拠'}</a><a href="#impact">${locale === 'de' ? 'Bedeutung' : '影響'}</a><a href="#unknown">${locale === 'de' ? 'Offene Punkte' : '未確認事項'}</a><a href="#source">${l.source}</a><a href="#related">${l.related}</a></aside></section></main><footer class="site-footer"><p>${l.unofficial} ${l.updated} ${reviewed}.</p><a href="/${locale}/news/">${l.news}</a></footer></body></html>`;
}

function renderNewsHub(locale) {
  const l = localeData[locale];
  const title = locale === 'de' ? 'Echoes of Teradea News auf Deutsch' : 'Echoes of Teradea 日本語ニュース';
  const desc = locale === 'de' ? 'Quellengeprüfte Meldungen zu Release, Demo, Systemdaten, Guides und Plattformen.' : '発売日、体験版、最新データ、攻略、対応機種を一次情報で確認するニュース一覧。';
  const cards = selected.map(item => {
    const question = translations[item.slug][locale][0];
    const headline = locale === 'de' ? `Aktueller Faktencheck: ${question}` : `最新確認：${question}`;
    return `<article class="guide-card"><p class="eyebrow">${reviewed}</p><h3><a href="${localized(locale, routes(item).news)}">${esc(headline)}</a></h3><p>${esc(translations[item.slug][locale][1])}</p></article>`;
  }).join('');
  const route = '/news/';
  return `${head({ source: { date: reviewed, url: `${site}/news/` } }, locale, 'news', title, desc, route)}<body><header class="site-header"><a class="brand" href="/${locale}/"><span class="brand-mark">HM</span>${brand}</a>${nav(locale)}${switcher(locale, route)}</header><main><section class="subpage-hero"><div class="breadcrumb"><a href="/${locale}/">${l.home}</a><span>/</span><span>${l.news}</span></div><p class="eyebrow">${l.unofficial}</p><h1>${esc(title)}</h1><p>${esc(desc)}</p></section><section class="section"><div class="section-heading"><div><p class="eyebrow">20 ${locale === 'de' ? 'lokalisierte Faktenchecks' : '件のローカライズ済みファクトチェック'}</p><h2>${locale === 'de' ? 'Aktuelle Themen' : '最新トピック'}</h2></div></div><div class="card-grid">${cards}</div></section></main><footer class="site-footer"><p>${l.unofficial} ${l.updated} ${reviewed}.</p><a href="/${locale}/">${l.home}</a></footer></body></html>`;
}

for (const item of selected) {
  for (const locale of ['de', 'ja']) {
    const faqPath = path.join(root, locale, 'faq', item.slug, 'index.html');
    const newsPath = path.join(root, locale, 'news', item.hub, `${item.slug}-briefing`, 'index.html');
    await mkdir(path.dirname(faqPath), { recursive: true });
    await mkdir(path.dirname(newsPath), { recursive: true });
    await writeFile(faqPath, renderFaq(item, locale));
    await writeFile(newsPath, renderNews(item, locale));
  }
  for (const route of Object.values(routes(item))) {
    const englishPath = path.join(root, ...route.split('/').filter(Boolean), 'index.html');
    let english = await readFile(englishPath, 'utf8');
    english = english.replace(/<link rel="alternate" hreflang="(?:en|de|ja|x-default)"[^>]*>/g, '');
    english = english.replace('</head>', `${alternates(route)}</head>`);
    const englishSwitcher = `<!-- LANGUAGE_SWITCHER_START --><details class="language-switcher"><summary aria-label="Choose language"><span aria-hidden="true">🌐</span><span>English</span><span class="language-chevron" aria-hidden="true">▾</span></summary><ul role="list"><li><a href="${route}" hreflang="en" lang="en" aria-current="page">English</a></li><li><a href="/fr/" hreflang="fr" lang="fr">Français</a></li><li><a href="/de${route}" hreflang="de" lang="de">Deutsch</a></li><li><a href="/es/" hreflang="es" lang="es">Español</a></li><li><a href="/ja${route}" hreflang="ja" lang="ja">日本語</a></li></ul></details><!-- LANGUAGE_SWITCHER_END -->`;
    english = english.replace(/<!-- LANGUAGE_SWITCHER_START -->[\s\S]*?<!-- LANGUAGE_SWITCHER_END -->/, englishSwitcher);
    await writeFile(englishPath, english);
  }
}

for (const locale of ['de', 'ja']) {
  const newsHubPath = path.join(root, locale, 'news', 'index.html');
  await mkdir(path.dirname(newsHubPath), { recursive: true });
  await writeFile(newsHubPath, renderNewsHub(locale));
  const faqHubPath = path.join(root, locale, 'faq', 'index.html');
  let faqHub = await readFile(faqHubPath, 'utf8');
  const start = '<!-- V19_LOCALIZED_FAQ_START -->';
  const end = '<!-- V19_LOCALIZED_FAQ_END -->';
  const block = `${start}<h2 id="v19-faq">${locale === 'de' ? '20 neue quellengeprüfte FAQ' : '一次情報で確認した新しいFAQ 20件'}</h2><p>${locale === 'de' ? 'Vollständige lokalisierte Antworten mit demselben Seitenaufbau wie die englischen Originale.' : '英語版と同じページ構成と情報密度でローカライズした回答です。'}</p><div class="page-links">${selected.map(item => `<a href="/${locale}/faq/${item.slug}/">${esc(translations[item.slug][locale][0])}</a>`).join('')}</div>${end}`;
  const re = new RegExp(`${start}[\\s\\S]*?${end}`);
  faqHub = re.test(faqHub) ? faqHub.replace(re, block) : faqHub.replace('</article>', `${block}</article>`);
  await writeFile(faqHubPath, faqHub);
}

const manifestPath = path.join(root, 'seo/indexable-urls.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const approved = new Set(manifest);
for (const locale of ['de', 'ja']) {
  approved.add(`/${locale}/news/`);
  for (const item of selected) {
    approved.add(localized(locale, routes(item).faq));
    approved.add(localized(locale, routes(item).news));
  }
}
await writeFile(manifestPath, `${JSON.stringify([...approved].sort((a, b) => a.localeCompare(b, 'en')), null, 2)}\n`);

let sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
for (const route of approved) {
  if (!sitemap.includes(`<loc>${site}${route}</loc>`)) {
    sitemap = sitemap.replace('</urlset>', `  <url>\n    <loc>${site}${route}</loc>\n    <lastmod>${reviewed}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${route.endsWith('/news/') ? '0.8' : '0.7'}</priority>\n  </url>\n</urlset>`);
  }
}
await writeFile(path.join(root, 'sitemap.xml'), sitemap);

await writeFile(path.join(root, 'data/v19-de-ja-news-faq.json'), `${JSON.stringify(selected.map(item => ({ hub: item.hub, slug: item.slug, translations: translations[item.slug] })), null, 2)}\n`);
await writeFile(path.join(root, 'SEO-V19-CHANGELOG.md'), `# V19 German and Japanese Coverage\n\n- Added 20 German FAQ and 20 Japanese FAQ pages.\n- Added 20 German News and 20 Japanese News pages.\n- Added German and Japanese News hubs.\n- Added reciprocal English/German/Japanese hreflang for 40 topic pages.\n- Preserved the English visual hierarchy, evidence boundary, source modules, navigation, AdSense, schema, and mobile stylesheet.\n`);

console.log(`Generated ${selected.length * 4 + 2} indexable German/Japanese pages.`);
