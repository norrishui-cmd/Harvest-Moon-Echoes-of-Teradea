import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const site = 'https://harvestmoonechoesofteradea.wiki';
const reviewed = '2026-07-26';
const languageSource = 'https://www.shop-justforgames.eu/products/harvest-moon-echoes-of-teradea-switch-2';
const official = [
  ['en', 'English'], ['fr', 'Français'], ['de', 'Deutsch'], ['es', 'Español']
];
const menu = [
  ['en', 'English'], ['fr', 'Français'], ['de', 'Deutsch'], ['es', 'Español'], ['ja', '日本語']
];

const locale = {
  fr: {
    choose: 'Choisir la langue', home: 'Accueil', answer: 'Réponse rapide',
    facts: 'Informations confirmées', boundary: 'Limites des informations',
    source: 'Source vérifiée', related: 'Pages associées', toc: 'Sur cette page',
    disclosure: 'Guide de fans non officiel en français, vérifié à partir des sources publiées.',
    nav: [['release-date','Sortie'],['platforms','Plateformes'],['features','Fonctionnalités'],['locations','Lieux'],['faq','FAQ']],
  },
  es: {
    choose: 'Elegir idioma', home: 'Inicio', answer: 'Respuesta rápida',
    facts: 'Datos confirmados', boundary: 'Límites de la información',
    source: 'Fuente verificada', related: 'Páginas relacionadas', toc: 'En esta página',
    disclosure: 'Guía no oficial en español, revisada a partir de fuentes publicadas.',
    nav: [['release-date','Lanzamiento'],['platforms','Plataformas'],['features','Funciones'],['locations','Lugares'],['faq','Preguntas']],
  }
};

const P = (route, fr, es) => ({ route, fr, es });
const pages = [
  P('', ['Wiki et guides en français','Cette section rassemble les informations confirmées sur Harvest Moon: Echoes of Teradea, avec des guides de sortie, de plateformes, de personnages et d’exploration.',['Le jeu est annoncé pour le 24 septembre 2026.','Les versions Switch, Switch 2, PS5, Xbox Series X|S et Steam sont confirmées.','Le français figure dans la liste de langues publiée pour l’édition européenne.'],'Les données de récoltes, cadeaux, recettes et quêtes détaillées ne sont ajoutées qu’après vérification.'],
        ['Wiki y guías en español','Esta sección reúne la información confirmada de Harvest Moon: Echoes of Teradea, con guías de lanzamiento, plataformas, personajes y exploración.',['El lanzamiento está anunciado para el 24 de septiembre de 2026.','Están confirmadas las versiones de Switch, Switch 2, PS5, Xbox Series X|S y Steam.','El español aparece en la lista de idiomas publicada para la edición europea.'],'Los datos de cultivos, regalos, recetas y misiones detalladas solo se añaden después de verificarlos.']),
  P('release-date', ['Date de sortie','Harvest Moon: Echoes of Teradea sortira le 24 septembre 2026 sur les cinq plateformes annoncées.',['La date a été confirmée par Natsume.','Le lancement concerne Switch, Switch 2, PS5, Xbox Series X|S et Steam.','Une livraison physique le jour même n’est pas garantie par tous les vendeurs.'],'Les heures exactes de déblocage numérique et de préchargement restent non publiées.'],
        ['Fecha de lanzamiento','Harvest Moon: Echoes of Teradea se lanzará el 24 de septiembre de 2026 en las cinco plataformas anunciadas.',['Natsume confirmó la fecha.','El lanzamiento incluye Switch, Switch 2, PS5, Xbox Series X|S y Steam.','Los comercios no garantizan siempre la entrega física el mismo día.'],'Aún no se han publicado las horas exactas de desbloqueo digital ni la precarga.']),
  P('platforms', ['Plateformes confirmées','Le jeu est confirmé sur Nintendo Switch, Nintendo Switch 2, PlayStation 5, Xbox Series X|S et PC via Steam.',['Les cinq plateformes partagent la date du 24 septembre 2026.','Des précommandes physiques sont visibles pour Switch, Switch 2 et PS5.','Les caractéristiques techniques propres à chaque console ne sont pas encore détaillées.'],'Ne supposez pas de version PS4, Xbox One ou de compatibilité Steam Deck sans annonce distincte.'],
        ['Plataformas confirmadas','El juego está confirmado para Nintendo Switch, Nintendo Switch 2, PlayStation 5, Xbox Series X|S y PC mediante Steam.',['Las cinco plataformas comparten la fecha del 24 de septiembre de 2026.','Hay reservas físicas visibles para Switch, Switch 2 y PS5.','Todavía no se detallan las características técnicas de cada consola.'],'No se debe asumir una versión de PS4, Xbox One o compatibilidad con Steam Deck sin un anuncio específico.']),
  P('preorder', ['Guide de précommande','Vérifiez la plateforme, le vendeur, le prix final et l’affichage du bonus Lupo avant de valider une précommande.',['Natsume cite plusieurs vendeurs nord-américains.','La peluche Lupo est annoncée dans la limite des stocks.','Taxes, livraison et disponibilité régionale varient selon le vendeur.'],'Une annonce de bonus ne garantit pas que chaque boutique ou chaque pays l’inclut.'],
        ['Guía de reserva','Comprueba la plataforma, la tienda, el precio final y la presencia del bonus de Lupo antes de completar una reserva.',['Natsume menciona varias tiendas norteamericanas.','El peluche de Lupo se ofrece hasta agotar existencias.','Impuestos, envío y disponibilidad regional dependen del comercio.'],'El anuncio de un bonus no garantiza que todas las tiendas o países lo incluyan.']),
  P('features', ['Fonctionnalités','Le jeu combine agriculture, élevage, relations, exploration ouverte, compagnons animaux, campements et restauration de villages.',['Il est possible de sauter, grimper et explorer des grottes et des îles.','Dix partenaires romantiques et le mariage sont annoncés.','Les compagnons disposent de capacités utiles à l’exploration.'],'Les valeurs, calendriers, listes d’objets et conditions précises restent à confirmer par le jeu final.'],
        ['Funciones','El juego combina agricultura, animales, relaciones, exploración abierta, compañeros, campamentos y restauración de aldeas.',['Se puede saltar, escalar y explorar cuevas e islas.','Se anuncian diez parejas románticas y matrimonio.','Los animales compañeros tienen habilidades útiles para explorar.'],'Los valores, calendarios, listas de objetos y requisitos exactos deben confirmarse con el juego final.']),
  P('locations', ['Lieux confirmés','Bloomfield, Tidewind, Quarrytop, Maplehill, la Forêt des Échos et plusieurs îles figurent parmi les lieux publiés.',['Bloomfield est le village d’origine du protagoniste.','Chaque village est lié à une difficulté différente.','Les cartes nautiques servent à atteindre des îles éloignées.'],'Aucune carte complète ni liste exhaustive des points d’intérêt n’a encore été publiée.'],
        ['Lugares confirmados','Bloomfield, Tidewind, Quarrytop, Maplehill, el Bosque de los Ecos y varias islas están entre los lugares publicados.',['Bloomfield es la aldea de origen del protagonista.','Cada aldea está vinculada a un problema diferente.','Las cartas náuticas permiten llegar a islas remotas.'],'Todavía no se ha publicado un mapa completo ni una lista exhaustiva de puntos de interés.']),
  P('characters', ['Personnages','Les informations disponibles confirment notamment Doc Jr., la Déesse des récoltes, Lupo et plusieurs noms visibles dans les captures publiées.',['Le jeu annonce cinq célibataires hommes et cinq femmes.','Lorelei, Bryce, Mara, Cindy, Amad, Lily et Rick apparaissent dans des visuels actuels.','Un nom visible ne confirme pas automatiquement un statut romantique.'],'Anniversaires, cadeaux préférés, horaires et événements relationnels restent non confirmés.'],
        ['Personajes','La información disponible confirma a Doc Jr., la Diosa de la Cosecha, Lupo y varios nombres visibles en capturas publicadas.',['El juego anuncia cinco solteros y cinco solteras.','Lorelei, Bryce, Mara, Cindy, Amad, Lily y Rick aparecen en imágenes actuales.','Un nombre visible no confirma automáticamente que sea una pareja romántica.'],'Cumpleaños, regalos favoritos, horarios y eventos de relación siguen sin confirmarse.']),
  P('guides', ['Centre des guides','Utilisez ce centre pour préparer les voyages, l’endurance, les campements, les grottes, les marchands et les animaux rares sans inventer de données.',['Les campements permettent de cuisiner, dormir et récupérer.','Les grottes contiennent des minerais et des gemmes.','Les animaux aident à franchir ou détruire certains obstacles.'],'Les itinéraires exacts seront complétés lorsque des observations de jeu reproductibles seront disponibles.'],
        ['Centro de guías','Usa este centro para preparar viajes, resistencia, campamentos, cuevas, comerciantes y animales raros sin inventar datos.',['Los campamentos permiten cocinar, dormir y recuperarse.','Las cuevas contienen minerales y gemas.','Los animales ayudan a superar o destruir ciertos obstáculos.'],'Las rutas exactas se completarán cuando existan observaciones reproducibles del juego.']),
  P('faq', ['Questions fréquentes','La FAQ répond aux questions de sortie, plateformes, fonctionnalités, personnages, lieux, démo et précommandes avec une séparation claire entre faits et inconnues.',['Chaque réponse renvoie à une source publiée.','Les informations non annoncées sont signalées comme telles.','Les questions proches sont reliées à leurs guides thématiques.'],'Une page ne remplace pas une annonce future ni une vérification après la sortie.'],
        ['Preguntas frecuentes','Las preguntas frecuentes cubren lanzamiento, plataformas, funciones, personajes, lugares, demo y reservas, separando datos e incógnitas.',['Cada respuesta enlaza una fuente publicada.','La información no anunciada se marca de forma explícita.','Las preguntas relacionadas enlazan sus guías temáticas.'],'Una página no sustituye un anuncio futuro ni una comprobación posterior al lanzamiento.']),
  P('demo', ['État de la démo','Aucune démo publique de Harvest Moon: Echoes of Teradea n’est actuellement annoncée par Natsume.',['Aucune démo Steam n’est confirmée.','Aucune démo Switch ou Switch 2 n’est confirmée.','Aucun transfert de sauvegarde de démo n’est donc annoncé.'],'Méfiez-vous des pages qui transforment une absence d’information en promesse de future démo.'],
        ['Estado de la demo','Natsume no ha anunciado actualmente una demo pública de Harvest Moon: Echoes of Teradea.',['No hay una demo confirmada en Steam.','No hay una demo confirmada en Switch o Switch 2.','Por tanto, tampoco se ha anunciado transferencia de partida.'],'No conviertas la ausencia de información en una promesa de una futura demo.']),
  P('game-status', ['État actuel du jeu','Cette page suit la date, les plateformes, les annonces, les précommandes et les principales informations encore manquantes avant la sortie.',['La sortie est fixée au 24 septembre 2026.','Le premier trailer officiel a été annoncé le 18 juin 2026.','Les données détaillées de gameplay restent limitées avant la sortie.'],'Les informations variables sont datées et doivent être revérifiées après toute nouvelle annonce.'],
        ['Estado actual del juego','Esta página sigue la fecha, plataformas, anuncios, reservas y principales incógnitas antes del lanzamiento.',['El lanzamiento está fijado para el 24 de septiembre de 2026.','El primer tráiler oficial se anunció el 18 de junio de 2026.','Los datos detallados de juego siguen siendo limitados antes del estreno.'],'La información variable incluye fecha de revisión y debe comprobarse tras cada anuncio.']),
  P('buying-guide', ['Guide d’achat','Comparez plateforme, format physique ou numérique, conditions du vendeur, région et bonus avant l’achat.',['Le prix de base affiché par le Natsume Store est de 49,99 dollars pour certaines versions physiques.','Le choix physique visible concerne Switch, Switch 2 et PS5.','La disponibilité Xbox et Steam est annoncée, mais pas sous les mêmes formes physiques.'],'Le prix final, la langue sur le disque ou la cartouche, les taxes et la garantie doivent être vérifiés par région.'],
        ['Guía de compra','Compara plataforma, formato físico o digital, condiciones de la tienda, región y bonus antes de comprar.',['El precio base mostrado por Natsume Store es de 49,99 dólares para algunas versiones físicas.','La selección física visible incluye Switch, Switch 2 y PS5.','Xbox y Steam están anunciados, pero no en las mismas opciones físicas.'],'El precio final, idioma del disco o cartucho, impuestos y garantía deben comprobarse por región.']),
  P('exploration', ['Guide d’exploration','L’exploration réunit mouvement vertical, grottes, îles, cartes nautiques, campements et capacités animales.',['Le joueur peut sauter et grimper.','Les campements soutiennent les longs trajets.','Les animaux peuvent révéler des secrets ou retirer des obstacles.'],'Les cartes, points de départ, conditions météo et récompenses exactes restent non publiés.'],
        ['Guía de exploración','La exploración combina movimiento vertical, cuevas, islas, cartas náuticas, campamentos y habilidades animales.',['El jugador puede saltar y escalar.','Los campamentos ayudan en trayectos largos.','Los animales pueden revelar secretos o retirar obstáculos.'],'Los mapas, puntos de partida, condiciones climáticas y recompensas exactas no se han publicado.']),
  P('interface', ['Interface et commandes','Les captures actuelles montrent le DocPad, le mode photo, le changement de tenue, la sélection musicale, le suivi des quêtes, l’heure, la date et la météo.',['Les objectifs peuvent afficher une progression numérique.','Les noms de zones apparaissent dans l’interface.','Les commandes de camp incluent cuisiner et dormir.'],'Les touches exactes, options d’accessibilité et différences entre plateformes ne sont pas encore documentées.'],
        ['Interfaz y controles','Las capturas actuales muestran DocPad, modo foto, cambio de atuendo, selección de música, seguimiento de misiones, hora, fecha y clima.',['Los objetivos pueden mostrar progreso numérico.','Los nombres de zona aparecen en la interfaz.','Los comandos de campamento incluyen cocinar y dormir.'],'Los botones exactos, opciones de accesibilidad y diferencias entre plataformas aún no están documentados.']),
  P('languages', ['Langues officielles','Les informations européennes publiées indiquent l’anglais, le français, l’allemand et l’espagnol pour le jeu.',['Le français et l’espagnol manquaient dans la navigation du wiki.','L’allemand était déjà couvert.','Le japonais du wiki reste une localisation éditoriale supplémentaire, pas une preuve de prise en charge du jeu.'],'La page de Natsume ne publie pas encore un tableau mondial complet; vérifiez la fiche de votre plateforme et région avant l’achat.'],
        ['Idiomas oficiales','La información europea publicada indica inglés, francés, alemán y español para el juego.',['El francés y el español faltaban en la navegación del wiki.','El alemán ya estaba cubierto.','El japonés del wiki es una localización editorial adicional, no prueba de compatibilidad del juego.'],'Natsume aún no publica una tabla mundial completa; comprueba la ficha de tu plataforma y región antes de comprar.'])
];

const esc = s => s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const localized = new Set(pages.map(p => p.route));
const href = (lang, route) => `/${lang === 'en' ? '' : `${lang}/`}${route ? `${route}/` : ''}`;
const alternates = route => [...official, ['ja','日本語']].map(([lang]) =>
  `<link rel="alternate" hreflang="${lang}" href="${site}${href(lang, route)}">`
).join('') + `<link rel="alternate" hreflang="x-default" href="${site}${href('en', route)}">`;
const switcher = (current, route) => {
  const exact = localized.has(route);
  return `<!-- LANGUAGE_SWITCHER_START --><details class="language-switcher"><summary aria-label="${locale[current]?.choose || 'Choose language'}"><span aria-hidden="true">🌐</span><span>${menu.find(x=>x[0]===current)?.[1] || 'English'}</span><span class="language-chevron" aria-hidden="true">▾</span></summary><ul role="list">${menu.map(([lang,label])=>`<li><a href="${href(lang, exact ? route : '')}" hreflang="${lang}" lang="${lang}"${lang===current?' aria-current="page"':''}>${label}</a></li>`).join('')}</ul></details><!-- LANGUAGE_SWITCHER_END -->`;
};

function render(entry, lang) {
  const L = locale[lang], [title, answer, facts, boundary] = entry[lang];
  const route = entry.route;
  const canonical = `${site}${href(lang, route)}`;
  const schema = JSON.stringify({'@context':'https://schema.org','@graph':[
    {'@type':'Article','headline':title,'description':answer,'dateModified':reviewed,'inLanguage':lang,'mainEntityOfPage':canonical,'about':{'@type':'VideoGame','name':'Harvest Moon: Echoes of Teradea'}},
    {'@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':L.home,'item':`${site}/${lang}/`},{'@type':'ListItem','position':2,'name':title,'item':canonical}]}
  ]});
  const nav = L.nav.map(([r,label])=>`<a href="/${lang}/${r}/">${label}</a>`).join('');
  const related = pages.filter(p=>p.route!==route && ['release-date','platforms','features','guides','faq','languages'].includes(p.route)).slice(0,4);
  return `<!doctype html><html lang="${lang}"><head><!-- ADSENSE_START --><meta name="google-adsense-account" content="ca-pub-9505220977121599"><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9505220977121599" crossorigin="anonymous"></script><!-- ADSENSE_END --><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | Harvest Moon: Echoes of Teradea Wiki</title><meta name="description" content="${esc(answer)}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${canonical}">${alternates(route)}<link rel="icon" href="/assets/site-icon.svg"><link rel="stylesheet" href="/styles.css"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(answer)}"><meta property="og:type" content="article"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${site}/assets/hero-fan-art.png"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${schema}</script></head><body><header class="site-header"><a class="brand" href="/${lang}/"><span class="brand-mark">HM</span><span class="brand-copy"><span class="brand-title">Harvest Moon: Echoes of Teradea</span><span class="brand-subtitle">Wiki &amp; Guides</span></span></a><nav class="nav">${nav}</nav>${switcher(lang, route)}</header><main><section class="subpage-hero"><div class="breadcrumb"><a href="/${lang}/">${L.home}</a><span>/</span><span>${esc(title)}</span></div><p class="eyebrow">${lang==='fr'?'Guide vérifié':'Guía verificada'} · ${reviewed}</p><h1>${esc(title)}</h1><p>${esc(answer)}</p></section><section class="section article-layout"><article class="article-main"><h2 id="answer">${L.answer}</h2><p class="callout">${esc(answer)}</p><h2 id="facts">${L.facts}</h2><ul class="content-list">${facts.map(f=>`<li>${esc(f)}</li>`).join('')}</ul><h2 id="boundary">${L.boundary}</h2><p>${esc(boundary)}</p><p>${L.disclosure}</p><h2 id="source">${L.source}</h2><p><a href="${route==='languages'?languageSource:'https://www.natsume.com/news/'}" rel="nofollow noopener">${route==='languages'?(lang==='fr'?'Fiche produit européenne publiée':'Ficha europea publicada'):'Natsume — actualités et annonces officielles'}</a> · ${reviewed}</p><h2 id="related">${L.related}</h2><div class="page-links">${related.map(p=>`<a href="${href(lang,p.route)}">${esc(p[lang][0])}</a>`).join('')}</div></article><aside class="toc"><h2>${L.toc}</h2><a href="#answer">${L.answer}</a><a href="#facts">${L.facts}</a><a href="#boundary">${L.boundary}</a><a href="#source">${L.source}</a><a href="#related">${L.related}</a></aside></section></main><footer class="site-footer"><p>${L.disclosure}</p></footer></body></html>`;
}

async function walk(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    if (['.git','node_modules'].includes(name)) continue;
    const full = path.join(dir,name);
    (await stat(full)).isDirectory() ? out.push(...await walk(full)) : out.push(full);
  }
  return out;
}

for (const entry of pages) {
  for (const lang of ['fr','es']) {
    const dir = path.join(root, lang, entry.route);
    await mkdir(dir, {recursive:true});
    await writeFile(path.join(dir,'index.html'), render(entry,lang));
  }
}

const languageText = {
  en: ['Official languages','Published European product information lists English, French, German and Spanish. Japanese pages on this wiki are an additional editorial localization and do not prove that the game supports Japanese.'],
  de: ['Offizielle Sprachen','Veröffentlichte europäische Produktinformationen nennen Englisch, Französisch, Deutsch und Spanisch. Die japanischen Seiten dieses Wikis sind eine zusätzliche redaktionelle Lokalisierung und kein Beleg für japanische Spielunterstützung.'],
  ja: ['公式発表済み言語','公開中の欧州向け商品情報には英語、フランス語、ドイツ語、スペイン語が記載されています。このWikiの日本語ページは独自の編集翻訳であり、ゲーム本体の日本語対応を示すものではありません。']
};
for (const lang of ['en','de','ja']) {
  const [title, answer] = languageText[lang];
  const canonical = `${site}${href(lang,'languages')}`;
  const dir = path.join(root, lang==='en'?'':lang, 'languages');
  await mkdir(dir,{recursive:true});
  const facts = official.map(([code,label])=>`<li><strong>${label}</strong> <code>${code}</code></li>`).join('');
  const schema = JSON.stringify({'@context':'https://schema.org','@graph':[
    {'@type':'Article','headline':title,'description':answer,'dateModified':reviewed,'inLanguage':lang,'mainEntityOfPage':canonical,'about':{'@type':'VideoGame','name':'Harvest Moon: Echoes of Teradea'}},
    {'@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'Home','item':`${site}${href(lang,'')}`},{'@type':'ListItem','position':2,'name':title,'item':canonical}]}
  ]});
  await writeFile(path.join(dir,'index.html'), `<!doctype html><html lang="${lang}"><head><!-- ADSENSE_START --><meta name="google-adsense-account" content="ca-pub-9505220977121599"><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9505220977121599" crossorigin="anonymous"></script><!-- ADSENSE_END --><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | Harvest Moon: Echoes of Teradea Wiki</title><meta name="description" content="${answer}"><meta name="robots" content="index, follow"><link rel="canonical" href="${canonical}">${alternates('languages')}<link rel="icon" href="/assets/site-icon.svg"><link rel="stylesheet" href="/styles.css"><script type="application/ld+json">${schema}</script></head><body><header class="site-header"><a class="brand" href="${href(lang,'')}"><span class="brand-mark">HM</span><span class="brand-copy"><span class="brand-title">Harvest Moon: Echoes of Teradea</span><span class="brand-subtitle">Wiki &amp; Guides</span></span></a>${switcher(lang,'languages')}</header><main><section class="subpage-hero"><h1>${title}</h1><p>${answer}</p></section><section class="section article-layout"><article class="article-main"><h2>Published language list</h2><ul class="content-list">${facts}</ul><h2>Evidence boundary</h2><p>${answer}</p><h2>Source</h2><p><a href="${languageSource}" rel="nofollow noopener">Published European product listing</a>, checked ${reviewed}.</p></article></section></main><footer class="site-footer"><p>Unofficial, source-checked fan guide.</p></footer></body></html>`);
}

const files = (await walk(root)).filter(f=>f.endsWith('index.html'));
for (const file of files) {
  let html = await readFile(file,'utf8');
  const rel = path.relative(root,file).replaceAll(path.sep,'/').replace(/index\.html$/,'').replace(/\/$/,'');
  const parts = rel ? rel.split('/') : [];
  const current = ['de','ja','fr','es'].includes(parts[0]) ? parts.shift() : 'en';
  const route = parts.join('/');
  html = html.replace(/<!-- LANGUAGE_SWITCHER_START -->[\s\S]*?<!-- LANGUAGE_SWITCHER_END -->/g, switcher(current,route));
  if (localized.has(route)) {
    html = html.replace(/\s*<link rel="alternate" hreflang="(?:en|de|ja|fr|es|x-default)" href="[^"]+">/g,'');
    html = html.replace('</head>',`${alternates(route)}</head>`);
  }
  await writeFile(file,html);
}

const approvedPath = path.join(root,'seo','indexable-urls.json');
const approved = new Set(JSON.parse(await readFile(approvedPath,'utf8')));
for (const entry of pages) for (const lang of ['fr','es']) approved.add(href(lang,entry.route));
for (const lang of ['en','de','ja']) approved.add(href(lang,'languages'));
await writeFile(approvedPath,`${JSON.stringify([...approved].sort(),null,2)}\n`);

let sitemap = await readFile(path.join(root,'sitemap.xml'),'utf8');
for (const url of approved) {
  if (!sitemap.includes(`<loc>${site}${url}</loc>`)) sitemap = sitemap.replace('</urlset>',`  <url>\n    <loc>${site}${url}</loc>\n    <lastmod>${reviewed}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n</urlset>`);
}
await writeFile(path.join(root,'sitemap.xml'),sitemap);
await writeFile(path.join(root,'data','official-languages-v15.json'),`${JSON.stringify({reviewed,official:official.map(([code,name])=>({code,name})),editorial_extra:[{code:'ja',name:'Japanese'}],source:languageSource},null,2)}\n`);
console.log(`Generated ${pages.length*2+3} pages and updated ${files.length} language menus.`);
