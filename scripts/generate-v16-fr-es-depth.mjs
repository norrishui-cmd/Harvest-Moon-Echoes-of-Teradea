import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const site = 'https://harvestmoonechoesofteradea.wiki';
const reviewed = '2026-07-26';

const sources = {
  announce: ['Annonce officielle de Natsume', 'Anuncio oficial de Natsume', 'https://www.natsume.com/news/news_pdffiles/pid_379_HM_EOT_TitleAnnouncementF.pdf'],
  preorder: ['Annonce officielle des précommandes', 'Anuncio oficial de reservas', 'https://www.natsume.com/news/news_pdffiles/pid_382_HM_EOT_Pre_OrderAnnouncementF.pdf'],
  trailer: ['Annonce officielle du premier trailer', 'Anuncio oficial del primer tráiler', 'https://www.natsume.com/news/news_pdffiles/pid_383_HMEOT_TrailerAnnouncementF.pdf'],
  store: ['Page produit officielle de Natsume Store', 'Página oficial de Natsume Store', 'https://natsumestore.com/products/harvest-moon-echoes-of-teradea-with-free-wolf-plush'],
  bestbuy: ['Galerie produit actuellement publiée', 'Galería de producto publicada', 'https://www.bestbuy.com/product/harvest-moon-echoes-of-teradea-nintendo-switch/JXT5SL668Y']
};

const p = (route, group, source, fr, es) => ({ route, group, source, fr, es });
const pages = [
  p('/buying-guide/international-region-and-import-checklist/','Buying','store',
    ['Checklist importation et région','Avant d’importer, vérifiez la version de plateforme, la zone livrée, le coût total, les droits éventuels et l’affichage du bonus. Une offre américaine ne garantit pas une livraison mondiale.','La langue du support, la garantie locale et la compatibilité régionale doivent être vérifiées auprès du vendeur.'],
    ['Lista de importación y región','Antes de importar, comprueba versión, países de envío, coste total, posibles aranceles y presencia del bonus. Una oferta estadounidense no garantiza envío mundial.','El idioma del soporte, la garantía local y la compatibilidad regional deben confirmarse con la tienda.']),
  p('/buying-guide/natsume-store-price-and-variants/','Buying','store',
    ['Prix et versions du Natsume Store','Le Natsume Store affiche actuellement un prix de base de 49,99 $ et des variantes physiques distinctes pour Switch, Switch 2 et PS5.','Le montant final varie avec la variante, les taxes, la livraison et la région; la page en direct doit être revérifiée avant paiement.'],
    ['Precio y versiones de Natsume Store','Natsume Store muestra actualmente un precio base de 49,99 $ y variantes físicas separadas para Switch, Switch 2 y PS5.','El total cambia según variante, impuestos, envío y región; conviene revisar la página justo antes de pagar.']),
  p('/buying-guide/natsume-store-shipping-and-cancellation/','Buying','store',
    ['Livraison et annulation chez Natsume Store','Le vendeur indique qu’une précommande ne peut plus être annulée après trois jours ouvrés et que la livraison le jour de sortie n’est pas garantie.','Ces règles appartiennent au Natsume Store; les délais, frais et garanties d’autres vendeurs peuvent différer.'],
    ['Envío y cancelación en Natsume Store','La tienda indica que una reserva no puede cancelarse después de tres días laborables y que no garantiza entrega el día de lanzamiento.','Estas reglas son propias de Natsume Store; otros comercios pueden aplicar plazos, costes y garantías distintos.']),
  p('/characters/amad/','Characters','bestbuy',
    ['Amad : profil confirmé','Le nom d’Amad apparaît dans une capture publiée au sujet d’une session musicale au Maple Mart, mais son rôle précis n’a pas encore été présenté officiellement.','La capture ne confirme ni métier, ni anniversaire, ni cadeaux favoris, ni statut de partenaire romantique.'],
    ['Amad: perfil confirmado','El nombre de Amad aparece en una captura publicada sobre una sesión musical en Maple Mart, pero su función exacta aún no ha sido presentada oficialmente.','La captura no confirma profesión, cumpleaños, regalos favoritos ni condición de pareja romántica.']),
  p('/characters/cindy/','Characters','bestbuy',
    ['Cindy : profil confirmé','Cindy est citée avec Amad dans le dialogue de Bryce à propos d’une session musicale au Maple Mart; aucune autre fiche officielle détaillée n’est publiée.','Un nom visible dans un dialogue ne permet pas de déduire village, métier, famille ou possibilité de mariage.'],
    ['Cindy: perfil confirmado','Cindy es mencionada junto a Amad en el diálogo de Bryce sobre una sesión musical en Maple Mart; no existe todavía una ficha oficial detallada.','Un nombre visible en un diálogo no permite deducir aldea, profesión, familia o posibilidad de matrimonio.']),
  p('/characters/lily/','Characters','bestbuy',
    ['Lily : profil confirmé','Lily apparaît dans un objectif demandant de récupérer ses en-cas préférés, avec Rick comme demandeur visible et un compteur de progression.','La capture ne révèle pas les objets exacts, la récompense, l’anniversaire, l’emploi du temps ni le statut romantique de Lily.'],
    ['Lily: perfil confirmado','Lily aparece en un objetivo que pide reunir sus aperitivos favoritos, con Rick como solicitante visible y un contador de progreso.','La captura no revela objetos exactos, recompensa, cumpleaños, horario ni condición romántica de Lily.']),
  p('/characters/rick/','Characters','bestbuy',
    ['Rick : profil confirmé','Rick est nommé comme demandeur d’un objectif de collecte lié aux en-cas préférés de Lily dans la zone de Bloomfield.','Le titre, le déclencheur, la récompense et la limite de temps de cette quête ne sont pas encore documentés.'],
    ['Rick: perfil confirmado','Rick figura como solicitante de un objetivo de recolección relacionado con los aperitivos favoritos de Lily en la zona de Bloomfield.','El título, activación, recompensa y límite temporal de esa misión todavía no están documentados.']),
  p('/exploration/animal-companion-obstacle-planning/','Exploration','announce',
    ['Animaux et obstacles d’exploration','Les compagnons animaux servent à franchir certains terrains, briser des rochers ou arbres tombés et découvrir des trésors cachés.','L’animal précis requis pour chaque obstacle, les conditions et les éventuels délais de réutilisation ne sont pas publiés.'],
    ['Animales y obstáculos de exploración','Los compañeros animales ayudan a superar terrenos, romper rocas o árboles caídos y descubrir tesoros ocultos.','Aún no se ha publicado qué animal resuelve cada obstáculo, sus requisitos ni posibles tiempos de reutilización.']),
  p('/exploration/maze-cave-mining-expedition/','Exploration','store',
    ['Expédition dans les grottes minières','Des grottes en forme de labyrinthe contenant minerais et gemmes sont confirmées; prévoyez endurance, campement et place d’inventaire.','Le nombre d’étages, les listes de minerais, les niveaux d’outils et les emplacements exacts restent inconnus.'],
    ['Expedición por cuevas mineras','Se confirman cuevas laberínticas con minerales y gemas; conviene reservar resistencia, campamento y espacio de inventario.','El número de plantas, minerales, niveles de herramientas y ubicaciones exactas siguen sin publicarse.']),
  p('/exploration/remote-island-expedition-loop/','Exploration','store',
    ['Boucle d’expédition vers les îles','Les cartes nautiques donnent accès à des îles éloignées où vivent des animaux rares et où se trouvent des ressources absentes du continent.','Les noms de cartes, points de départ, limites météo, nombre d’îles et récompenses complètes ne sont pas connus.'],
    ['Ruta de expedición a islas remotas','Las cartas náuticas permiten llegar a islas remotas con animales raros y recursos que no aparecen en tierra firme.','No se conocen nombres de cartas, puntos de salida, límites climáticos, número de islas ni recompensas completas.']),
  p('/exploration/wild-animal-risk-and-item-loss/','Exploration','announce',
    ['Animaux sauvages et perte d’objets','Les loups nocturnes et d’autres animaux sauvages constituent un danger confirmé; se faire attraper peut faire perdre des objets collectés.','La formule de perte, les protections, la récupération des objets et les zones sûres exactes ne sont pas documentées.'],
    ['Animales salvajes y pérdida de objetos','Los lobos nocturnos y otros animales salvajes son un peligro confirmado; ser atrapado puede provocar la pérdida de objetos recogidos.','No se han documentado la fórmula de pérdida, protecciones, recuperación de objetos ni zonas seguras exactas.']),
  p('/interface/change-outfit/','Interface','bestbuy',
    ['Changer de tenue','Une capture affiche la commande « Change Outfit », confirmant un changement de vêtements directement accessible dans l’interface.','Le nombre de tenues, leurs sources, restrictions, emplacements de sauvegarde et conditions de déblocage restent inconnus.'],
    ['Cambiar de atuendo','Una captura muestra el comando « Change Outfit », confirmando un cambio de ropa accesible directamente desde la interfaz.','Siguen sin conocerse número de atuendos, fuentes, restricciones, espacios guardados y condiciones de desbloqueo.']),
  p('/interface/clock-calendar-and-weather/','Interface','bestbuy',
    ['Horloge, calendrier et météo','Le HUD montre l’heure, le jour de la semaine, le numéro du jour et la météo, fournissant une base visible pour planifier routine et voyage.','La durée d’une journée, les règles de pause, les prévisions et probabilités météo ne sont pas expliquées.'],
    ['Reloj, calendario y clima','El HUD muestra hora, día de la semana, número de día y clima, ofreciendo una base visible para planificar rutinas y viajes.','No se explican duración del día, reglas de pausa, previsión ni probabilidades meteorológicas.']),
  p('/interface/map-and-area-labels/','Interface','bestbuy',
    ['Carte et noms de zones','Les captures montrent des noms précis comme Bloomfield Village, Bloomfield Park et Tornado Island, ainsi que des indications de direction.','La carte complète, les filtres, le voyage rapide, le zoom et les coordonnées ne sont pas encore publiés.'],
    ['Mapa y nombres de zonas','Las capturas muestran nombres concretos como Bloomfield Village, Bloomfield Park y Tornado Island, además de indicaciones de dirección.','Todavía no se han publicado mapa completo, filtros, viaje rápido, zoom ni coordenadas.']),
  p('/interface/quest-objective-tracker/','Interface','bestbuy',
    ['Suivi des objectifs de quête','Un objectif visible combine texte de tâche, personnages nommés, zone et compteur numérique de progression.','L’épinglage multiple, le guidage automatique, les délais, le tri et les options d’accessibilité ne sont pas confirmés.'],
    ['Seguimiento de objetivos','Un objetivo visible combina texto de tarea, personajes con nombre, zona y contador numérico de progreso.','No se han confirmado fijación múltiple, ruta automática, plazos, ordenación ni opciones de accesibilidad.']),
  p('/interface/song-selection/','Interface','bestbuy',
    ['Sélection de musique','La commande « Select Song » confirme une fonction de choix musical, sans révéler le nombre de morceaux ni son contexte d’utilisation.','On ignore encore si elle fonctionne partout, seulement au campement, avec un appareil ou après une progression donnée.'],
    ['Selección de música','El comando « Select Song » confirma una función para elegir música, sin revelar número de temas ni contexto de uso.','Aún no se sabe si funciona en todas partes, solo en campamentos, mediante un dispositivo o tras cierto progreso.']),
  p('/platform-choice/','Platforms','trailer',
    ['Centre de choix de plateforme','Les cinq familles de plateformes annoncées partagent la date du 24 septembre 2026; le choix repose aujourd’hui surtout sur l’écosystème et l’offre physique.','Résolution, fréquence d’images, chargements, sauvegarde croisée et succès ne sont pas encore comparés officiellement.'],
    ['Centro de elección de plataforma','Las cinco familias de plataformas anunciadas comparten el 24 de septiembre de 2026; hoy la elección depende sobre todo del ecosistema y la oferta física.','Resolución, fotogramas, cargas, guardado cruzado y logros todavía no tienen comparación oficial.']),
  p('/platform-choice/platform-facts-vs-assumptions/','Platforms','trailer',
    ['Faits et suppositions par plateforme','Les plateformes et la date commune sont confirmées, mais aucune annonce ne garantit encore performances, fonctions en ligne, sauvegarde croisée ou compatibilité Steam Deck.','Ne transformez pas les habitudes d’autres jeux Harvest Moon en caractéristiques acquises pour Echoes of Teradea.'],
    ['Datos y suposiciones por plataforma','Las plataformas y la fecha común están confirmadas, pero ningún anuncio garantiza rendimiento, funciones en línea, guardado cruzado o Steam Deck.','No conviertas hábitos de otros Harvest Moon en características confirmadas para Echoes of Teradea.']),
  p('/platform-choice/ps5-vs-xbox-series-xs/','Platforms','trailer',
    ['PS5 ou Xbox Series X|S','PS5 et Xbox Series X|S sont confirmées pour la même date; la seule différence commerciale actuellement visible est l’offre physique PS5 du Natsume Store.','Sans données techniques, il n’est pas possible de déclarer une version plus performante ou plus complète.'],
    ['PS5 o Xbox Series X|S','PS5 y Xbox Series X|S están confirmadas para la misma fecha; la diferencia comercial visible es la oferta física de PS5 en Natsume Store.','Sin datos técnicos no puede afirmarse que una versión rinda mejor o incluya más funciones.']),
  p('/platform-choice/same-day-platform-launch/','Platforms','preorder',
    ['Sortie simultanée sur les plateformes','Natsume annonce le 24 septembre 2026 pour Switch, Switch 2, PS5, Xbox Series X|S et Steam.','Une date commune ne garantit pas la même heure de déblocage numérique ni une livraison physique le même jour.'],
    ['Lanzamiento simultáneo en plataformas','Natsume anuncia el 24 de septiembre de 2026 para Switch, Switch 2, PS5, Xbox Series X|S y Steam.','Una fecha común no garantiza la misma hora digital ni entrega física el mismo día.']),
  p('/platform-choice/single-player-platform-choice/','Platforms','store',
    ['Choisir sa plateforme en solo','Le jeu est présenté comme une expérience solo; choisissez donc selon appareil, préférence physique ou numérique, confort et conditions du vendeur.','Les différences de commandes, performances, sauvegardes cloud et fonctions propres aux plateformes restent non publiées.'],
    ['Elegir plataforma para un jugador','El juego se presenta como experiencia para un jugador; elige según dispositivo, formato físico o digital, comodidad y condiciones de compra.','No se han publicado diferencias de controles, rendimiento, nube o funciones propias de cada plataforma.']),
  p('/platform-choice/switch-2-vs-ps5/','Platforms','store',
    ['Switch 2 ou PS5','Switch 2 et PS5 ont la même date et disposent de variantes physiques visibles au Natsume Store; aucune comparaison technique officielle complète n’est publiée.','Portabilité, résolution, fréquence d’images, chargements et contenu identique doivent être vérifiés sur les fiches finales.'],
    ['Switch 2 o PS5','Switch 2 y PS5 comparten fecha y tienen variantes físicas visibles en Natsume Store; no existe una comparación técnica oficial completa.','Portabilidad, resolución, fotogramas, cargas y contenido equivalente deben revisarse en las fichas finales.']),
  p('/pre-release/','Verification','announce',
    ['Centre de vérification avant sortie','Ce centre sépare les faits officiels, les informations de vendeur visibles et les éléments encore inconnus avant le 24 septembre 2026.','Il ne transforme pas les captures, traditions de série ou absences d’annonce en détails de gameplay confirmés.'],
    ['Centro de verificación previa','Este centro separa datos oficiales, información visible de comercios y elementos aún desconocidos antes del 24 de septiembre de 2026.','No convierte capturas, tradiciones de la saga o ausencia de anuncio en detalles confirmados.']),
  p('/pre-release/how-to-verify-echoes-of-teradea-news/','Verification','trailer',
    ['Comment vérifier les actualités','Commencez par les actualités et PDF datés de Natsume, puis consultez la page produit officielle actuelle; utilisez les images de vendeur uniquement pour ce qui y est visible.','Un texte ou une capture peut confirmer un nom ou une interface sans prouver un rôle, une mécanique complète ou une promesse future.'],
    ['Cómo verificar las noticias','Empieza por noticias y PDF fechados de Natsume, después consulta la página oficial actual; usa imágenes de tiendas solo para lo que se ve directamente.','Un texto o captura puede confirmar un nombre o interfaz sin demostrar un papel, sistema completo o promesa futura.']),
  p('/pre-release/launch-day-information-still-missing/','Verification','trailer',
    ['Informations encore absentes avant sortie','Malgré la date confirmée, les heures régionales, le préchargement, la taille, les profils de performance et les données complètes du jeu restent à publier.','Ces inconnues sont suivies dans une liste centrale plutôt que transformées en pages d’actualité sans réponse.'],
    ['Información aún ausente antes del estreno','Aunque la fecha está confirmada, faltan horarios regionales, precarga, tamaño, perfiles de rendimiento y datos completos del juego.','Estas incógnitas se siguen en una lista central en vez de convertirse en páginas sin respuesta.']),
  p('/pre-release/official-source-map/','Verification','announce',
    ['Carte des sources officielles','Utilisez l’annonce initiale pour le concept et les plateformes, l’annonce de mai pour date et précommandes, celle de juin pour le trailer et la page produit pour les conditions en direct.','Une déclaration officielle plus récente remplace l’ancienne lorsqu’elle précise le même sujet.'],
    ['Mapa de fuentes oficiales','Usa el anuncio inicial para concepto y plataformas, el de mayo para fecha y reservas, el de junio para tráiler y la página de producto para condiciones actuales.','Una declaración oficial posterior sustituye a la anterior cuando concreta el mismo punto.']),
  p('/preorder-decisions/','Buying','store',
    ['Centre de décision de précommande','Décidez dans l’ordre: plateforme, physique ou numérique, vendeur, bonus, prix final et risque de livraison. Une seule fiche ne répond pas aux six points.','Revérifiez les conditions juste avant paiement et distinguez toujours bonus de précommande, contenu d’édition et disponibilité régionale.'],
    ['Centro de decisión de reserva','Decide en este orden: plataforma, físico o digital, tienda, bonus, precio final y riesgo de entrega. Una sola ficha no responde a todo.','Revisa condiciones justo antes de pagar y separa bonus de reserva, contenido de edición y disponibilidad regional.'])
];

const labels = {
  fr: { home:'Accueil', guide:'Guides', current:'Français', choose:'Choisir la langue', eyebrow:'Guide vérifié', quick:'Réponse rapide', facts:'Éléments confirmés', use:'Comment utiliser cette page', boundary:'Limite des informations', source:'Source vérifiée', related:'Pages associées', toc:'Sur cette page', note:'Cette page française utilise la même structure visuelle et la même profondeur que la version anglaise.' },
  es: { home:'Inicio', guide:'Guías', current:'Español', choose:'Elegir idioma', eyebrow:'Guía verificada', quick:'Respuesta rápida', facts:'Datos confirmados', use:'Cómo usar esta página', boundary:'Límite de la información', source:'Fuente verificada', related:'Páginas relacionadas', toc:'En esta página', note:'Esta página en español usa la misma estructura visual y profundidad que la versión inglesa.' }
};
const groupFacts = {
  Buying: {
    fr:['La date et les plateformes viennent des annonces de Natsume.','Prix, stock, taxes et livraison sont des conditions variables du vendeur.'],
    es:['La fecha y las plataformas proceden de anuncios de Natsume.','Precio, existencias, impuestos y envío son condiciones variables de la tienda.']
  },
  Characters: {
    fr:['Le nom est visible dans une image actuellement publiée.','La capture confirme seulement le texte et le contexte affichés.'],
    es:['El nombre es visible en una imagen actualmente publicada.','La captura confirma únicamente el texto y contexto mostrados.']
  },
  Exploration: {
    fr:['Le principe général est décrit dans les informations officielles.','Les valeurs, cartes et itinéraires exacts attendent des données de jeu vérifiables.'],
    es:['El principio general aparece en información oficial.','Valores, mapas y rutas exactas esperan datos de juego verificables.']
  },
  Interface: {
    fr:['La fonction est visible dans une capture de l’interface.','La présence d’une commande ne révèle pas toutes ses options.'],
    es:['La función es visible en una captura de la interfaz.','La presencia de un comando no revela todas sus opciones.']
  },
  Platforms: {
    fr:['Les cinq plateformes et la date commune sont confirmées.','Les différences techniques doivent attendre des fiches ou tests fiables.'],
    es:['Las cinco plataformas y la fecha común están confirmadas.','Las diferencias técnicas deben esperar fichas o pruebas fiables.']
  },
  Verification: {
    fr:['Les annonces datées sont prioritaires sur les textes non sourcés.','Chaque inconnue reste signalée jusqu’à publication d’une source primaire.'],
    es:['Los anuncios fechados tienen prioridad sobre textos sin fuente.','Cada incógnita se mantiene señalada hasta que exista fuente primaria.']
  }
};

const esc = s => s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const href = (lang, route) => `/${lang === 'en' ? '' : `${lang}/`}${route.split('/').filter(Boolean).join('/')}${route === '/' ? '' : '/'}`.replaceAll('//','/');
const alternates = route => ['en','fr','de','es','ja'].map(lang => `<link rel="alternate" hreflang="${lang}" href="${site}${href(lang,route)}">`).join('') + `<link rel="alternate" hreflang="x-default" href="${site}${href('en',route)}">`;
const switcher = (lang, route) => {
  const menu = [['en','English'],['fr','Français'],['de','Deutsch'],['es','Español'],['ja','日本語']];
  return `<!-- LANGUAGE_SWITCHER_START --><details class="language-switcher"><summary aria-label="${labels[lang]?.choose || 'Choose language'}"><span aria-hidden="true">🌐</span><span>${menu.find(x=>x[0]===lang)?.[1]}</span><span class="language-chevron" aria-hidden="true">▾</span></summary><ul role="list">${menu.map(([l,name])=>`<li><a href="${href(l,route)}" hreflang="${l}" lang="${l}"${l===lang?' aria-current="page"':''}>${name}</a></li>`).join('')}</ul></details><!-- LANGUAGE_SWITCHER_END -->`;
};

function render(page, lang) {
  const L = labels[lang], [title,answer,boundary] = page[lang];
  const facts = [answer, ...groupFacts[page.group][lang]];
  const canonical = `${site}${href(lang,page.route)}`;
  const src = sources[page.source];
  const peers = pages.filter(x=>x.group===page.group && x.route!==page.route).slice(0,3);
  const schema = JSON.stringify({'@context':'https://schema.org','@graph':[
    {'@type':'Article','headline':title,'description':answer,'dateModified':reviewed,'inLanguage':lang,'mainEntityOfPage':canonical,'about':{'@type':'VideoGame','name':'Harvest Moon: Echoes of Teradea'}},
    {'@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':L.home,'item':`${site}/${lang}/`},{'@type':'ListItem','position':2,'name':L.guide,'item':`${site}/${lang}/guides/`},{'@type':'ListItem','position':3,'name':title,'item':canonical}]}
  ]});
  return `<!doctype html><html lang="${lang}"><head><!-- ADSENSE_START --><meta name="google-adsense-account" content="ca-pub-9505220977121599"><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9505220977121599" crossorigin="anonymous"></script><!-- ADSENSE_END --><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | Harvest Moon: Echoes of Teradea Wiki</title><meta name="description" content="${esc(answer)}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${canonical}">${alternates(page.route)}<link rel="icon" href="/assets/site-icon.svg"><link rel="stylesheet" href="/styles.css"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(answer)}"><meta property="og:type" content="article"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${site}/assets/hero-fan-art.png"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${schema}</script></head><body><header class="site-header"><a class="brand" href="/${lang}/"><span class="brand-mark">HM</span><span class="brand-copy"><span class="brand-title">Harvest Moon: Echoes of Teradea</span><span class="brand-subtitle">Wiki &amp; Guides</span></span></a><nav class="nav"><a href="/${lang}/release-date/">${lang==='fr'?'Sortie':'Lanzamiento'}</a><a href="/${lang}/characters/">${lang==='fr'?'Personnages':'Personajes'}</a><a href="/${lang}/features/">${lang==='fr'?'Fonctionnalités':'Funciones'}</a><a href="/${lang}/locations/">${lang==='fr'?'Lieux':'Lugares'}</a><a href="/${lang}/guides/">${L.guide}</a><a href="/${lang}/faq/">FAQ</a></nav>${switcher(lang,page.route)}</header><main><section class="subpage-hero"><div class="breadcrumb"><a href="/${lang}/">${L.home}</a><span>/</span><a href="/${lang}/guides/">${L.guide}</a><span>/</span><span>${esc(title)}</span></div><p class="eyebrow">${L.eyebrow} · ${reviewed}</p><h1>${esc(title)}</h1><p>${esc(answer)}</p></section><section class="section article-layout"><article class="article-main"><h2 id="answer">${L.quick}</h2><p class="callout">${esc(answer)}</p><h2 id="facts">${L.facts}</h2><ul class="content-list">${facts.map(f=>`<li>${esc(f)}</li>`).join('')}</ul><h2 id="use">${L.use}</h2><div class="mini-grid"><article><strong>1</strong><p>${lang==='fr'?'Commencez par la réponse confirmée.':'Empieza por la respuesta confirmada.'}</p></article><article><strong>2</strong><p>${lang==='fr'?'Vérifiez séparément plateforme, vendeur ou système.':'Comprueba por separado plataforma, tienda o sistema.'}</p></article><article><strong>3</strong><p>${lang==='fr'?'Revenez après toute nouvelle annonce officielle.':'Vuelve tras cada nuevo anuncio oficial.'}</p></article></div><h2 id="boundary">${L.boundary}</h2><p>${esc(boundary)}</p><p>${L.note}</p><h2 id="source">${L.source}</h2><p><a href="${src[2]}" rel="nofollow noopener">${esc(src[lang==='fr'?0:1])}</a> · ${reviewed}</p><h2 id="related">${L.related}</h2><div class="page-links">${peers.map(x=>`<a href="${href(lang,x.route)}">${esc(x[lang][0])}</a>`).join('')}<a href="/${lang}/guides/">${L.guide}</a><a href="${href('en',page.route)}">${lang==='fr'?'Version anglaise':'Versión inglesa'}</a></div></article><aside class="toc"><h2>${L.toc}</h2><a href="#answer">${L.quick}</a><a href="#facts">${L.facts}</a><a href="#use">${L.use}</a><a href="#boundary">${L.boundary}</a><a href="#source">${L.source}</a><a href="#related">${L.related}</a></aside></section></main><footer class="site-footer"><p>${lang==='fr'?'Guide de fans non officiel en français.':'Guía no oficial de fans en español.'}</p><a href="/${lang}/guides/">${L.guide}</a><a href="/${lang}/faq/">FAQ</a></footer></body></html>`;
}

for (const page of pages) {
  for (const lang of ['fr','es']) {
    const dir = path.join(root, lang, ...page.route.split('/').filter(Boolean));
    await mkdir(dir,{recursive:true});
    await writeFile(path.join(dir,'index.html'),render(page,lang));
  }
  for (const lang of ['en','de','ja']) {
    const file = path.join(root, ...(lang==='en'?[]:[lang]), ...page.route.split('/').filter(Boolean),'index.html');
    let html = await readFile(file,'utf8');
    html = html.replace(/<link rel="alternate" hreflang="(?:en|fr|de|es|ja|x-default)"[^>]*>/g,'');
    html = html.replace('</head>',`${alternates(page.route)}</head>`);
    html = html.replace(/<!-- LANGUAGE_SWITCHER_START -->[\s\S]*?<!-- LANGUAGE_SWITCHER_END -->/,switcher(lang,page.route));
    await writeFile(file,html);
  }
}

for (const lang of ['fr','es']) {
  const L = labels[lang];
  const markerStart='<!-- V16_FR_ES_DEPTH_START -->', markerEnd='<!-- V16_FR_ES_DEPTH_END -->';
  const groups=[...new Set(pages.map(x=>x.group))];
  const block=`${markerStart}<h2 id="v16-depth">${lang==='fr'?'27 guides approfondis en français':'27 guías completas en español'}</h2><p>${L.note}</p>${groups.map(group=>`<h3>${group}</h3><div class="page-links">${pages.filter(x=>x.group===group).map(x=>`<a href="${href(lang,x.route)}">${esc(x[lang][0])}</a>`).join('')}</div>`).join('')}${markerEnd}`;
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
await writeFile(path.join(root,'data','v16-fr-es-depth.json'),`${JSON.stringify(pages,null,2)}\n`);
console.log(`Generated ${pages.length*2} French/Spanish depth pages.`);
