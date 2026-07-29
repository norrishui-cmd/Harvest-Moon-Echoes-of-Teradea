import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const site = 'https://harvestmoonechoesofteradea.wiki';
const reviewed = '2026-07-29';

const sources = {
  announce: ['Annonce officielle de Natsume', 'Anuncio oficial de Natsume', 'https://www.natsume.com/news/news_pdffiles/pid_379_HM_EOT_TitleAnnouncementF.pdf'],
  preorder: ['Annonce officielle des précommandes', 'Anuncio oficial de reservas', 'https://www.natsume.com/news/news_pdffiles/pid_382_HM_EOT_Pre_OrderAnnouncementF.pdf'],
  trailer: ['Annonce officielle du premier trailer', 'Anuncio oficial del primer tráiler', 'https://www.natsume.com/news/news_pdffiles/pid_383_HMEOT_TrailerAnnouncementF.pdf'],
  store: ['Page produit officielle de Natsume Store', 'Página oficial de Natsume Store', 'https://natsumestore.com/products/harvest-moon-echoes-of-teradea-with-free-wolf-plush']
};

const p = (route, group, source, fr, es) => ({ route, group, source, fr, es });
const pages = [
  p('/characters/bryce/','Characters','preorder',
    ['Bryce : ce qui est confirmé','Bryce apparaît dans une capture publiée et parle d’une session musicale au Maple Mart avec Amad et Cindy. Son rôle complet n’a pas encore été présenté.','La capture ne confirme ni métier, ni village de résidence, ni anniversaire, ni statut de partenaire romantique.'],
    ['Bryce: datos confirmados','Bryce aparece en una captura publicada y habla de una sesión musical en Maple Mart con Amad y Cindy. Su función completa todavía no ha sido presentada.','La captura no confirma profesión, aldea de residencia, cumpleaños ni condición de pareja romántica.']),
  p('/characters/doc-jr/','Characters','announce',
    ['Doc Jr. : rôle confirmé','Doc Jr. est officiellement décrit comme un inventeur ingénieux et comme l’un des alliés rencontrés pendant l’aventure en Teradea.','Aucune liste d’inventions, boutique, horaire, relation familiale ou quête complète n’a encore été publiée.'],
    ['Doc Jr.: papel confirmado','Doc Jr. está descrito oficialmente como un inventor ingenioso y uno de los aliados que conocerás durante la aventura por Teradea.','Todavía no se han publicado inventos, tienda, horario, relaciones familiares ni una misión completa.']),
  p('/characters/harvest-goddess/','Characters','announce',
    ['Harvest Goddess : rôle dans Teradea','La Harvest Goddess guide le joueur tandis qu’il aide les Guardian Spirits à restaurer Teradea. Sa présence dans l’histoire est officiellement confirmée.','Ses pouvoirs jouables, son emplacement, ses récompenses et son éventuel rôle romantique ne sont pas détaillés.'],
    ['Harvest Goddess: papel en Teradea','La Harvest Goddess guía al jugador mientras ayuda a los Guardian Spirits a restaurar Teradea. Su presencia en la historia está confirmada oficialmente.','No se detallan poderes jugables, ubicación, recompensas ni una posible función romántica.']),
  p('/characters/lorelei/','Characters','preorder',
    ['Lorelei : informations visibles','Lorelei est un nom visible dans les images publiées avant la sortie, mais Natsume n’a pas encore fourni de profil officiel complet.','Un nom ou un portrait ne suffit pas à confirmer métier, cadeaux, anniversaire, horaire ou mariage.'],
    ['Lorelei: información visible','Lorelei es un nombre visible en imágenes publicadas antes del lanzamiento, pero Natsume aún no ha ofrecido un perfil oficial completo.','Un nombre o retrato no basta para confirmar profesión, regalos, cumpleaños, horario o matrimonio.']),
  p('/characters/lupo/','Characters','trailer',
    ['Lupo : le gardien de Bloomfield','Lupo est présenté comme le jeune loup gardien de Bloomfield et donne son apparence au bonus en peluche proposé avec certaines précommandes.','Les annonces ne détaillent pas encore ses compétences, sa progression, son recrutement ni son rôle final dans l’histoire.'],
    ['Lupo: guardián de Bloomfield','Lupo está presentado como el joven lobo guardián de Bloomfield y da su aspecto al peluche de bonus incluido con determinadas reservas.','Los anuncios aún no detallan habilidades, progresión, reclutamiento ni su papel final en la historia.']),
  p('/characters/mara/','Characters','preorder',
    ['Mara : informations confirmées','Mara apparaît dans le matériel promotionnel publié, mais les sources officielles actuelles ne donnent pas encore une biographie complète.','Son village, son travail, son anniversaire, ses cadeaux et son statut romantique restent à vérifier.'],
    ['Mara: información confirmada','Mara aparece en material promocional publicado, pero las fuentes oficiales actuales todavía no ofrecen una biografía completa.','Su aldea, trabajo, cumpleaños, regalos y condición romántica siguen pendientes de verificación.']),

  p('/features/animal-companions/','Features','announce',
    ['Système de compagnons animaux','Les animaux peuvent accompagner le joueur et possèdent des capacités spéciales pour franchir le terrain, détruire des obstacles et révéler des trésors.','La liste complète des animaux, leurs compétences précises et leurs conditions d’obtention ne sont pas encore publiées.'],
    ['Sistema de compañeros animales','Los animales pueden acompañar al jugador y poseen habilidades especiales para superar terreno, destruir obstáculos y revelar tesoros.','La lista completa de animales, habilidades exactas y requisitos de obtención todavía no está publicada.']),
  p('/features/campsites-travel/','Features','store',
    ['Campements et longs voyages','Les campements permettent de se reposer, récupérer de l’endurance et cuisiner pendant les voyages dans le vaste monde de Teradea.','Le placement des camps, leur coût, les recettes disponibles et les règles de sauvegarde restent inconnus.'],
    ['Campamentos y viajes largos','Los campamentos permiten descansar, recuperar resistencia y cocinar durante los viajes por el extenso mundo de Teradea.','Se desconocen ubicación, coste, recetas disponibles y reglas de guardado de los campamentos.']),
  p('/features/farming-system/','Features','announce',
    ['Agriculture et vie à la ferme','Cultiver, récolter et élever des animaux restent des activités centrales entre les voyages et la restauration des villages.','Les cultures, saisons, engrais, niveaux d’outils, prix et calendriers précis ne sont pas encore documentés.'],
    ['Agricultura y vida en la granja','Cultivar, cosechar y criar animales siguen siendo actividades centrales entre viajes y restauración de aldeas.','Todavía no se documentan cultivos, estaciones, fertilizantes, niveles de herramientas, precios ni calendarios exactos.']),
  p('/features/guardian-spirits/','Features','announce',
    ['Guardian Spirits et restauration','L’objectif principal consiste à aider les Guardian Spirits à revivre et à revitaliser Teradea pendant que le mystère de la brume se dévoile.','Le nombre de Spirits, leurs noms, pouvoirs, emplacements et conditions de restauration ne sont pas publiés.'],
    ['Guardian Spirits y restauración','El objetivo principal consiste en ayudar a los Guardian Spirits a revivir y revitalizar Teradea mientras se descubre el misterio de la niebla.','No se han publicado número, nombres, poderes, ubicaciones ni condiciones de restauración.']),
  p('/features/happilia/','Features','announce',
    ['Happilia : fonction confirmée','Le joueur gagne de la Happilia en aidant les habitants et en contribuant au développement de Teradea.','Aucune formule, limite, récompense, palier ni boutique liée à la Happilia n’a encore été révélée.'],
    ['Happilia: función confirmada','El jugador obtiene Happilia ayudando a los habitantes y contribuyendo al desarrollo de Teradea.','Todavía no se han revelado fórmula, límite, recompensas, niveles ni tienda vinculada a Happilia.']),
  p('/features/islands-nautical-charts/','Features','announce',
    ['Îles et cartes nautiques','Les cartes nautiques servent à localiser des îles éloignées où chercher des trésors et apprivoiser des animaux rares absents du continent.','Les noms des cartes, itinéraires, coûts de voyage, météo et listes de récompenses restent inconnus.'],
    ['Islas y cartas náuticas','Las cartas náuticas sirven para localizar islas remotas donde buscar tesoros y hacer amistad con animales raros que no están en tierra firme.','Se desconocen nombres de cartas, rutas, costes de viaje, clima y listas de recompensas.']),
  p('/features/open-world-exploration/','Features','trailer',
    ['Exploration du monde ouvert','Teradea est présenté comme un vaste monde reliant villages, nature sauvage, grottes labyrinthiques et îles éloignées.','La taille de la carte, le chargement des zones, le voyage rapide et les limites exactes ne sont pas confirmés.'],
    ['Exploración de mundo abierto','Teradea se presenta como un mundo extenso que conecta aldeas, naturaleza salvaje, cuevas laberínticas e islas remotas.','No están confirmados tamaño del mapa, carga de zonas, viaje rápido ni límites exactos.']),
  p('/features/player-movement/','Features','announce',
    ['Saut, échelles et lianes','Le déplacement étendu permet de sauter, grimper aux échelles et escalader des lianes pour atteindre ressources et zones cachées.','Les commandes, coûts d’endurance, dégâts de chute et améliorations de mouvement ne sont pas détaillés.'],
    ['Saltos, escaleras y enredaderas','El movimiento ampliado permite saltar, subir escaleras y trepar enredaderas para alcanzar recursos y zonas ocultas.','No se detallan controles, coste de resistencia, daño por caída ni mejoras de movimiento.']),
  p('/features/power-statues-wisps/','Features','trailer',
    ['Power Statues et Power Wisps','Le matériel publié montre des Power Statues et des Power Wisps liés à l’exploration et à la progression, sans expliquer encore tout le système.','Leurs quantités, emplacements, coûts, améliorations et récompenses exactes restent à confirmer.'],
    ['Power Statues y Power Wisps','El material publicado muestra Power Statues y Power Wisps vinculados a exploración y progreso, sin explicar aún todo el sistema.','Siguen por confirmar cantidades, ubicaciones, costes, mejoras y recompensas exactas.']),
  p('/features/untamed-wilderness/','Features','announce',
    ['Dangers de la nature sauvage','Loups, ours et tigres peuvent poursuivre le joueur; être attrapé fait perdre des objets collectés et renvoie à la ferme.','Les zones d’apparition, dégâts, protections, objets perdus et moyens d’évasion ne sont pas encore détaillés.'],
    ['Peligros de la naturaleza salvaje','Lobos, osos y tigres pueden perseguir al jugador; ser atrapado provoca pérdida de objetos recogidos y regreso a la granja.','No se detallan zonas de aparición, daño, protecciones, objetos perdidos ni formas de escapar.']),

  p('/locations/bloomfield-village/','Locations','announce',
    ['Bloomfield Village : point de départ','Bloomfield Village est le lieu paisible où le personnage joueur a grandi avant que la brume et les bêtes sauvages ne déclenchent l’aventure.','La carte, les commerces, habitants, horaires et services complets du village ne sont pas publiés.'],
    ['Bloomfield Village: punto de partida','Bloomfield Village es el lugar tranquilo donde creció el personaje antes de que la niebla y las bestias salvajes iniciaran la aventura.','No se han publicado mapa, comercios, habitantes, horarios ni servicios completos de la aldea.']),
  p('/locations/forest-of-echoes/','Locations','announce',
    ['Forest of Echoes et brume','Une brume mystérieuse venue du Forest of Echoes recouvre Teradea et constitue l’un des grands mystères du récit.','Les accès, sous-zones, ressources, ennemis et conditions permettant de lever la brume restent inconnus.'],
    ['Forest of Echoes y la niebla','Una niebla misteriosa procedente del Forest of Echoes cubre Teradea y constituye uno de los grandes misterios de la historia.','Se desconocen accesos, subzonas, recursos, enemigos y condiciones para disipar la niebla.']),
  p('/locations/maplehill/','Locations','announce',
    ['Maplehill : centre culturel à restaurer','Maplehill est décrit comme une ancienne ville prospère et un centre culturel dont il faut raviver la lumière et la communauté.','Les étapes de restauration, bâtiments, habitants et récompenses ne sont pas encore détaillés.'],
    ['Maplehill: centro cultural por restaurar','Maplehill está descrita como una antigua ciudad próspera y centro cultural cuya luz y comunidad deben recuperarse.','Todavía no se detallan fases de restauración, edificios, habitantes ni recompensas.']),
  p('/locations/quarrytop/','Locations','announce',
    ['Quarrytop : village minier','Quarrytop est le village minier où le joueur enquête sur la cause des tremblements de terre qui frappent la région.','La mine, ses étages, minerais, habitants, quêtes et résolution du désastre restent non publiés.'],
    ['Quarrytop: aldea minera','Quarrytop es la aldea minera donde el jugador investiga la causa de los terremotos que afectan a la región.','No se han publicado mina, plantas, minerales, habitantes, misiones ni resolución del desastre.']),
  p('/locations/tidewind/','Locations','announce',
    ['Tidewind : village portuaire','Tidewind est un village portuaire visité pour découvrir la cause des violentes tempêtes qui le menacent.','Les quais, commerces, habitants, routes maritimes et étapes de restauration ne sont pas détaillés.'],
    ['Tidewind: aldea portuaria','Tidewind es una aldea portuaria visitada para descubrir la causa de las violentas tormentas que la amenazan.','No se detallan muelles, comercios, habitantes, rutas marítimas ni fases de restauración.']),
  p('/locations/tornado-island/','Locations','preorder',
    ['Tornado Island : lieu visible','Tornado Island apparaît comme nom de zone dans les captures publiées avant la sortie, au milieu d’un environnement soumis aux tornades.','Son accès, ses objectifs, ressources, dangers et lien exact avec Tidewind ne sont pas expliqués.'],
    ['Tornado Island: lugar visible','Tornado Island aparece como nombre de zona en capturas previas al lanzamiento, dentro de un entorno afectado por tornados.','No se explican acceso, objetivos, recursos, peligros ni relación exacta con Tidewind.']),

  p('/platforms/nintendo-switch/','Platforms','trailer',
    ['Version Nintendo Switch','Nintendo Switch fait partie des plateformes confirmées pour le 24 septembre 2026 et possède une édition physique proposée en précommande.','Résolution, fréquence d’images, chargements, taille et compatibilité de sauvegarde ne sont pas annoncés.'],
    ['Versión Nintendo Switch','Nintendo Switch es una plataforma confirmada para el 24 de septiembre de 2026 y cuenta con edición física en reserva.','No se han anunciado resolución, fotogramas, cargas, tamaño ni compatibilidad de partidas.']),
  p('/platforms/nintendo-switch-2/','Platforms','trailer',
    ['Version Nintendo Switch 2','Nintendo Switch 2 recevra une version distincte le même jour que les autres plateformes, avec une variante physique au Natsume Store.','Aucune amélioration technique, fonction exclusive ou voie de mise à niveau depuis Switch n’est confirmée.'],
    ['Versión Nintendo Switch 2','Nintendo Switch 2 recibirá una versión separada el mismo día que las demás plataformas, con variante física en Natsume Store.','No se confirman mejoras técnicas, funciones exclusivas ni ruta de actualización desde Switch.']),
  p('/platforms/pc-steam/','Platforms','trailer',
    ['Version PC sur Steam','La version PC annoncée est distribuée via Steam et doit sortir le 24 septembre 2026 avec les versions console.','Configuration requise, Steam Deck, taille, succès, sauvegarde cloud et préchargement ne sont pas publiés.'],
    ['Versión PC en Steam','La versión para PC anunciada se distribuye mediante Steam y debe salir el 24 de septiembre de 2026 junto a consolas.','No se publican requisitos, Steam Deck, tamaño, logros, nube ni precarga.']),
  p('/platforms/ps5/','Platforms','store',
    ['Version PlayStation 5','PS5 est confirmée pour le 24 septembre 2026 et dispose d’une version physique actuellement proposée par le Natsume Store.','Résolution, fréquence d’images, fonctions DualSense, trophées et taille d’installation restent inconnus.'],
    ['Versión PlayStation 5','PS5 está confirmada para el 24 de septiembre de 2026 y tiene versión física ofrecida actualmente por Natsume Store.','Se desconocen resolución, fotogramas, funciones DualSense, trofeos y tamaño de instalación.']),
  p('/platforms/xbox-series-xs/','Platforms','trailer',
    ['Version Xbox Series X|S','Xbox Series X|S est confirmée pour la date mondiale annoncée, mais aucune édition physique Xbox n’apparaît dans l’offre actuelle du Natsume Store.','Disponibilité numérique, performances X/S, succès, taille et préchargement attendent des fiches finales.'],
    ['Versión Xbox Series X|S','Xbox Series X|S está confirmada para la fecha mundial anunciada, pero no aparece edición física Xbox en la oferta actual de Natsume Store.','Disponibilidad digital, rendimiento X/S, logros, tamaño y precarga esperan fichas finales.']),

  p('/system-workflows/animal-obstacle-workflow/','Workflows','announce',
    ['Flux animal et obstacle','Le principe confirmé consiste à choisir un compagnon, atteindre un obstacle adapté, utiliser sa capacité puis accéder à une zone ou un trésor auparavant bloqué.','L’association exacte entre chaque animal et chaque obstacle ne sera fiable qu’après publication de données détaillées.'],
    ['Flujo de animal y obstáculo','El principio confirmado consiste en elegir compañero, llegar a un obstáculo compatible, usar su habilidad y acceder a una zona o tesoro antes bloqueado.','La relación exacta entre cada animal y obstáculo solo será fiable cuando existan datos detallados.']),
  p('/system-workflows/happilia-restoration-loop/','Workflows','announce',
    ['Boucle Happilia et restauration','Aider les habitants et contribuer au développement de Teradea rapporte de la Happilia, ce qui relie les tâches locales au thème de restauration du monde.','Les seuils, dépenses, rangs, récompenses et conditions de déblocage ne sont pas encore connus.'],
    ['Bucle Happilia y restauración','Ayudar a habitantes y contribuir al desarrollo de Teradea otorga Happilia, conectando tareas locales con la restauración del mundo.','Todavía no se conocen umbrales, gastos, rangos, recompensas ni condiciones de desbloqueo.']),
  p('/system-workflows/nautical-chart-island-loop/','Workflows','announce',
    ['Boucle carte nautique et île','Obtenez une carte nautique, localisez une île éloignée, partez chercher trésors et animaux rares, puis rapportez les ressources absentes du continent.','Les cartes individuelles, ports, coûts, horaires, météo et inventaires d’île restent à documenter.'],
    ['Bucle carta náutica e isla','Consigue una carta náutica, localiza una isla remota, busca tesoros y animales raros, y vuelve con recursos ausentes del continente.','Quedan por documentar cartas individuales, puertos, costes, horarios, clima e inventarios de isla.'])
];

const labels = {
  fr: { home:'Accueil', guide:'Guides', choose:'Choisir la langue', eyebrow:'Guide vérifié', quick:'Réponse rapide', facts:'Éléments confirmés', use:'Comment utiliser cette page', boundary:'Limite des informations', source:'Source vérifiée', related:'Pages associées', toc:'Sur cette page', note:'Cette page française reprend la structure visuelle, les modules et la profondeur de la version anglaise.' },
  es: { home:'Inicio', guide:'Guías', choose:'Elegir idioma', eyebrow:'Guía verificada', quick:'Respuesta rápida', facts:'Datos confirmados', use:'Cómo usar esta página', boundary:'Límite de la información', source:'Fuente verificada', related:'Páginas relacionadas', toc:'En esta página', note:'Esta página en español conserva la estructura visual, los módulos y la profundidad de la versión inglesa.' }
};

const groupFacts = {
  Characters:{fr:['Le personnage est cité ou visible dans une source publiée.','Les détails non annoncés restent explicitement séparés des faits.'],es:['El personaje aparece o se menciona en una fuente publicada.','Los detalles no anunciados se separan explícitamente de los hechos.']},
  Features:{fr:['Le système général est décrit par Natsume.','Les valeurs et listes complètes attendent des données vérifiables.'],es:['El sistema general está descrito por Natsume.','Valores y listas completas esperan datos verificables.']},
  Locations:{fr:['Le lieu ou sa fonction narrative apparaît dans les informations publiées.','Les cartes et étapes précises ne sont pas inventées avant la sortie.'],es:['El lugar o su función narrativa aparece en información publicada.','No se inventan mapas ni pasos precisos antes del lanzamiento.']},
  Platforms:{fr:['La plateforme et la date sont confirmées.','Les performances restent inconnues sans fiche technique officielle.'],es:['La plataforma y fecha están confirmadas.','El rendimiento sigue desconocido sin ficha técnica oficial.']},
  Workflows:{fr:['La séquence relie uniquement des mécanismes officiellement décrits.','Elle ne prétend pas fournir des valeurs ou commandes non publiées.'],es:['La secuencia conecta únicamente sistemas descritos oficialmente.','No pretende ofrecer valores ni controles no publicados.']}
};

const esc = s => s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const href = (lang, route) => `/${lang === 'en' ? '' : `${lang}/`}${route.split('/').filter(Boolean).join('/')}/`.replaceAll('//','/');
const alternates = route => ['en','fr','de','es','ja'].map(lang => `<link rel="alternate" hreflang="${lang}" href="${site}${href(lang,route)}">`).join('') + `<link rel="alternate" hreflang="x-default" href="${site}${href('en',route)}">`;
const switcher = (lang, route) => {
  const menu = [['en','English'],['fr','Français'],['de','Deutsch'],['es','Español'],['ja','日本語']];
  const choose = labels[lang]?.choose || (lang === 'de' ? 'Sprache wählen' : lang === 'ja' ? '言語を選択' : 'Choose language');
  return `<!-- LANGUAGE_SWITCHER_START --><details class="language-switcher"><summary aria-label="${choose}"><span aria-hidden="true">🌐</span><span>${menu.find(x=>x[0]===lang)?.[1]}</span><span class="language-chevron" aria-hidden="true">▾</span></summary><ul role="list">${menu.map(([l,name])=>`<li><a href="${href(l,route)}" hreflang="${l}" lang="${l}"${l===lang?' aria-current="page"':''}>${name}</a></li>`).join('')}</ul></details><!-- LANGUAGE_SWITCHER_END -->`;
};

function render(page, lang) {
  const L=labels[lang], [title,answer,boundary]=page[lang];
  const facts=[answer,...groupFacts[page.group][lang]];
  const canonical=`${site}${href(lang,page.route)}`;
  const src=sources[page.source];
  const peers=pages.filter(x=>x.group===page.group&&x.route!==page.route).slice(0,3);
  const schema=JSON.stringify({'@context':'https://schema.org','@graph':[
    {'@type':'Article','headline':title,'description':answer,'dateModified':reviewed,'inLanguage':lang,'mainEntityOfPage':canonical,'about':{'@type':'VideoGame','name':'Harvest Moon: Echoes of Teradea'}},
    {'@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':L.home,'item':`${site}/${lang}/`},{'@type':'ListItem','position':2,'name':L.guide,'item':`${site}/${lang}/guides/`},{'@type':'ListItem','position':3,'name':title,'item':canonical}]}
  ]});
  return `<!doctype html><html lang="${lang}"><head><!-- ADSENSE_START --><meta name="google-adsense-account" content="ca-pub-9505220977121599"><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9505220977121599" crossorigin="anonymous"></script><!-- ADSENSE_END --><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | Harvest Moon: Echoes of Teradea Wiki</title><meta name="description" content="${esc(answer)}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${canonical}">${alternates(page.route)}<link rel="icon" href="/assets/site-icon.svg"><link rel="stylesheet" href="/styles.css"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(answer)}"><meta property="og:type" content="article"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${site}/assets/hero-fan-art.png"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${schema}</script></head><body><header class="site-header"><a class="brand" href="/${lang}/"><span class="brand-mark">HM</span><span class="brand-copy"><span class="brand-title">Harvest Moon: Echoes of Teradea</span><span class="brand-subtitle">Wiki &amp; Guides</span></span></a><nav class="nav"><a href="/${lang}/release-date/">${lang==='fr'?'Sortie':'Lanzamiento'}</a><a href="/${lang}/characters/">${lang==='fr'?'Personnages':'Personajes'}</a><a href="/${lang}/features/">${lang==='fr'?'Fonctionnalités':'Funciones'}</a><a href="/${lang}/locations/">${lang==='fr'?'Lieux':'Lugares'}</a><a href="/${lang}/guides/">${L.guide}</a><a href="/${lang}/faq/">FAQ</a></nav>${switcher(lang,page.route)}</header><main><section class="subpage-hero"><div class="breadcrumb"><a href="/${lang}/">${L.home}</a><span>/</span><a href="/${lang}/guides/">${L.guide}</a><span>/</span><span>${esc(title)}</span></div><p class="eyebrow">${L.eyebrow} · ${reviewed}</p><h1>${esc(title)}</h1><p>${esc(answer)}</p></section><section class="section article-layout"><article class="article-main"><h2 id="answer">${L.quick}</h2><p class="callout">${esc(answer)}</p><h2 id="facts">${L.facts}</h2><ul class="content-list">${facts.map(f=>`<li>${esc(f)}</li>`).join('')}</ul><h2 id="use">${L.use}</h2><div class="mini-grid"><article><strong>1</strong><p>${lang==='fr'?'Commencez par la réponse confirmée.':'Empieza por la respuesta confirmada.'}</p></article><article><strong>2</strong><p>${lang==='fr'?'Séparez les faits des détails encore inconnus.':'Separa los hechos de los detalles aún desconocidos.'}</p></article><article><strong>3</strong><p>${lang==='fr'?'Revérifiez après toute nouvelle annonce officielle.':'Revisa de nuevo tras cada anuncio oficial.'}</p></article></div><h2 id="boundary">${L.boundary}</h2><p>${esc(boundary)}</p><p>${L.note}</p><h2 id="source">${L.source}</h2><p><a href="${src[2]}" rel="nofollow noopener">${esc(src[lang==='fr'?0:1])}</a> · ${reviewed}</p><h2 id="related">${L.related}</h2><div class="page-links">${peers.map(x=>`<a href="${href(lang,x.route)}">${esc(x[lang][0])}</a>`).join('')}<a href="/${lang}/guides/">${L.guide}</a><a href="${href('en',page.route)}">${lang==='fr'?'Version anglaise':'Versión inglesa'}</a></div></article><aside class="toc"><h2>${L.toc}</h2><a href="#answer">${L.quick}</a><a href="#facts">${L.facts}</a><a href="#use">${L.use}</a><a href="#boundary">${L.boundary}</a><a href="#source">${L.source}</a><a href="#related">${L.related}</a></aside></section></main><footer class="site-footer"><p>${lang==='fr'?'Guide de fans non officiel en français.':'Guía no oficial de fans en español.'}</p><a href="/${lang}/guides/">${L.guide}</a><a href="/${lang}/faq/">FAQ</a></footer></body></html>`;
}

for (const page of pages) {
  for (const lang of ['fr','es']) {
    const dir=path.join(root,lang,...page.route.split('/').filter(Boolean));
    await mkdir(dir,{recursive:true});
    await writeFile(path.join(dir,'index.html'),render(page,lang));
  }
  for (const lang of ['en','de','ja']) {
    const file=path.join(root,...(lang==='en'?[]:[lang]),...page.route.split('/').filter(Boolean),'index.html');
    let html=await readFile(file,'utf8');
    html=html.replace(/<link rel="alternate" hreflang="(?:en|fr|de|es|ja|x-default)"[^>]*>/g,'');
    html=html.replace('</head>',`${alternates(page.route)}</head>`);
    html=html.replace(/<!-- LANGUAGE_SWITCHER_START -->[\s\S]*?<!-- LANGUAGE_SWITCHER_END -->/,switcher(lang,page.route));
    await writeFile(file,html);
  }
}

for (const lang of ['fr','es']) {
  const start='<!-- V17_FR_ES_CORE_START -->', end='<!-- V17_FR_ES_CORE_END -->';
  const groups=[...new Set(pages.map(x=>x.group))];
  const block=`${start}<h2 id="v17-core">${lang==='fr'?'30 nouveaux guides essentiels':'30 nuevas guías esenciales'}</h2><p>${labels[lang].note}</p>${groups.map(group=>`<h3>${group}</h3><div class="page-links">${pages.filter(x=>x.group===group).map(x=>`<a href="${href(lang,x.route)}">${esc(x[lang][0])}</a>`).join('')}</div>`).join('')}${end}`;
  const hub=path.join(root,lang,'guides','index.html');
  let html=await readFile(hub,'utf8');
  html=html.replace('</article>',`${block}</article>`);
  await writeFile(hub,html);
}

const approvedPath=path.join(root,'seo','indexable-urls.json');
const approved=new Set(JSON.parse(await readFile(approvedPath,'utf8')));
for(const page of pages) for(const lang of ['fr','es']) approved.add(href(lang,page.route));
await writeFile(approvedPath,`${JSON.stringify([...approved].sort((a,b)=>a.localeCompare(b,'en')),null,2)}\n`);

let sitemap=await readFile(path.join(root,'sitemap.xml'),'utf8');
for(const page of pages) for(const lang of ['fr','es']) {
  const route=href(lang,page.route);
  if(!sitemap.includes(`<loc>${site}${route}</loc>`)) sitemap=sitemap.replace('</urlset>',`  <url>\n    <loc>${site}${route}</loc>\n    <lastmod>${reviewed}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n</urlset>`);
}
await writeFile(path.join(root,'sitemap.xml'),sitemap);
await mkdir(path.join(root,'data'),{recursive:true});
await writeFile(path.join(root,'data','v17-fr-es-core.json'),`${JSON.stringify(pages,null,2)}\n`);
console.log(`Generated ${pages.length*2} French/Spanish core pages.`);
