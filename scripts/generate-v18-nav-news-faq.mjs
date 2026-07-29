import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const site = 'https://harvestmoonechoesofteradea.wiki';
const reviewed = '2026-07-29';
const adsense = '<!-- ADSENSE_START -->\n<meta name="google-adsense-account" content="ca-pub-9505220977121599">\n<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9505220977121599" crossorigin="anonymous"></script>\n<!-- ADSENSE_END -->';
const brand = '<span class="brand-copy"><span class="brand-title">Harvest Moon: Echoes of Teradea</span><span class="brand-subtitle">Wiki &amp; Guides</span></span>';
const languageSwitcher = '<!-- LANGUAGE_SWITCHER_START --><details class="language-switcher"><summary aria-label="Choose language"><span aria-hidden="true">🌐</span><span>English</span><span class="language-chevron" aria-hidden="true">▾</span></summary><ul role="list"><li><a href="/" hreflang="en" lang="en" aria-current="page">English</a></li><li><a href="/fr/" hreflang="fr" lang="fr">Français</a></li><li><a href="/de/" hreflang="de" lang="de">Deutsch</a></li><li><a href="/es/" hreflang="es" lang="es">Español</a></li><li><a href="/ja/" hreflang="ja" lang="ja">日本語</a></li></ul></details><!-- LANGUAGE_SWITCHER_END -->';

const sources = {
  announce: {
    date: '2026-03-11',
    label: 'Natsume title announcement',
    url: 'https://www.natsume.com/news/news_pdffiles/pid_379_HM_EOT_TitleAnnouncementF.pdf'
  },
  preorder: {
    date: '2026-05-12',
    label: 'Natsume preorder announcement',
    url: 'https://www.natsume.com/news/news_pdffiles/pid_382_HM_EOT_Pre_OrderAnnouncementF.pdf'
  },
  trailer: {
    date: '2026-06-18',
    label: 'Natsume first-trailer announcement',
    url: 'https://www.natsume.com/news/news_pdffiles/pid_383_HMEOT_TrailerAnnouncementF.pdf'
  },
  store: {
    date: '2026-07-29',
    label: 'Natsume Store product listing',
    url: 'https://natsumestore.com/products/harvest-moon-echoes-of-teradea-with-free-wolf-plush'
  },
  news: {
    date: '2026-07-29',
    label: 'Natsume official news index',
    url: 'https://www.natsume.com/news/'
  }
};

const hubs = {
  'release-date': { label: 'Release', newsTitle: 'Release News' },
  demo: { label: 'Demo', newsTitle: 'Demo News' },
  'game-status': { label: 'Current Data', newsTitle: 'Current Data News' },
  guides: { label: 'Guides', newsTitle: 'Guide News' },
  story: { label: 'Story', newsTitle: 'Story News' },
  features: { label: 'Features', newsTitle: 'Feature News' },
  locations: { label: 'Locations', newsTitle: 'Location News' },
  platforms: { label: 'Platforms', newsTitle: 'Platform News' },
  preorder: { label: 'Preorder', newsTitle: 'Preorder News' },
  faq: { label: 'FAQ', newsTitle: 'FAQ Research News' }
};

const rows = [
  // Release
  ['release-date','is-september-24-listed-on-the-official-store','Is September 24 Listed on the Official Natsume Store?','Official Store Still Lists September 24 for Echoes of Teradea','store',
    'Yes. The Natsume Store product page lists September 24, 2026 as the release date for Harvest Moon: Echoes of Teradea.',
    ['The live first-party product page displays “Release Date: September 24, 2026.”','The selectable physical versions are Nintendo Switch, Nintendo Switch 2, and PlayStation 5.','The date matches Natsume’s May preorder announcement and June trailer announcement.'],
    'The store date confirms the planned launch day, but it does not state digital unlock hours, preload timing, review timing, or guaranteed delivery for shipped copies.',
    'Use the first-party date for planning; treat retailer arrival estimates and regional digital unlock clocks as separate operational details.'],
  ['release-date','what-day-of-the-week-is-september-24-2026','What Day of the Week Is the Echoes of Teradea Release Date?','September 24, 2026 Falls on a Thursday','preorder',
    'September 24, 2026 is a Thursday. That is the calendar day attached to Natsume’s confirmed launch date.',
    ['Natsume announced September 24, 2026 in the May 12 preorder release.','The June 18 first-trailer release repeated the same launch date.','Calendar conversion places September 24, 2026 on Thursday.'],
    'The weekday calculation does not reveal the hour that Steam or console stores will unlock the game in each region.',
    'Players can reserve the Thursday for launch while waiting for platform stores to publish exact regional availability.'],
  ['release-date','has-the-release-date-changed-since-preorders-opened','Has the Release Date Changed Since Preorders Opened?','Release Date Remains Consistent Since Preorders Opened','news',
    'No official change has been published. September 24, 2026 remains consistent across the preorder announcement, first trailer announcement, news index, and current store listing.',
    ['Physical preorders opened on May 12 with a September 24 date.','The June 18 trailer announcement repeated September 24.','Natsume’s current product listing still shows the same date on July 29.'],
    'This is a dated status check, not a guarantee against a future schedule change. A delay should only be reported after a publisher or platform notice.',
    'The useful update is continuity: three first-party surfaces still agree, so players do not need to act on unsupported delay rumors.'],
  ['release-date','are-regional-digital-unlock-times-published','Are Regional Digital Unlock Times Published?','Regional Digital Unlock Times Are Still Pending','news',
    'No. Natsume has confirmed the date but has not published a region-by-region Steam, PlayStation, Xbox, or Nintendo unlock timetable.',
    ['The announcements give September 24 without clock times.','The Natsume Store page concerns physical products and does not define digital unlock policy.','No preload or time-zone table appears on the official news index through July 29.'],
    'A worldwide date can still produce different local clock times because each platform controls storefront timing. Do not convert an assumed midnight launch into a factual schedule.',
    'Wait for verified platform listings before publishing countdowns that claim a specific local unlock hour.'],
  ['release-date','is-a-launch-delay-announcement-published','Has Natsume Published a Launch Delay Announcement?','No Echoes of Teradea Delay Notice as of July 29','news',
    'No. Natsume’s official news index contains no Echoes of Teradea delay announcement as of July 29, 2026.',
    ['The latest game-specific press release is the June 18 first-trailer announcement.','That release repeats the September 24 launch date.','The current Natsume Store listing also retains September 24.'],
    'Absence of a delay notice only describes the current public record. It does not predict manufacturing, shipping, review, or digital-store timing.',
    'Rumors should be checked against the publisher news page and live first-party listing before changing a release-date guide.'],

  // Demo
  ['demo','is-the-first-trailer-a-playable-demo','Is the First Trailer a Playable Demo?','The First Trailer Is a Video Reveal, Not a Playable Demo','trailer',
    'No. The June 18 release is explicitly the first trailer; Natsume does not describe it as a downloadable or playable demo.',
    ['The press release uses “Debuts First Trailer” in its headline.','It showcases features and characters through video footage.','No download link, trial duration, demo platform list, or save-transfer rule is supplied.'],
    'Gameplay footage can demonstrate a feature without making a playable build available to the public.',
    'Players should use verified storefront demo buttons—not reposted trailer files or unofficial downloads—to identify a real trial.'],
  ['demo','has-a-demo-download-size-been-published','Has an Echoes of Teradea Demo Download Size Been Published?','No Demo Download Size Has Been Published','news',
    'No. Because Natsume has not announced a public demo, it has not published a demo file size for any platform.',
    ['The official announcements contain no demo specification.','No PC or console demo download page is linked by Natsume.','The full game’s platform-specific file sizes are also not stated in the press releases.'],
    'Any download-size claim should identify the exact verified storefront and build; a trailer file size is not a game-demo size.',
    'This status prevents fabricated storage recommendations while leaving room to add exact numbers when platform listings expose them.'],
  ['demo','is-there-an-age-rating-for-a-demo','Is There an Age Rating for an Echoes of Teradea Demo?','No Separate Demo Rating Is Listed','store',
    'No separate public-demo rating is listed. The official store currently marks the full game itself as ESRB Rating Pending.',
    ['The Natsume Store product metadata says “ESRB Rating: Rating Pending.”','No playable demo is identified in the official announcements.','A demo could receive its own notice or content warning only after one is announced.'],
    'Do not reuse the full product’s pending classification as a final rating for a nonexistent public demo.',
    'Parents should check the verified demo storefront and final ESRB record if a trial is released later.'],
  ['demo','would-a-demo-require-a-preorder','Would an Echoes of Teradea Demo Require a Preorder?','No Demo Access Requirement Has Been Announced','preorder',
    'Natsume has not announced a demo, so there is no verified preorder requirement, code, early-access condition, or trial entitlement.',
    ['The preorder announcement describes physical orders and the Lupo plush.','It does not promise playable early access.','No demo code or trial access is listed as a preorder benefit.'],
    'The physical bonus and any hypothetical demo access are separate offers. Do not infer one from the other.',
    'Buyers should preorder only for the confirmed product and eligible bonus, not for an unannounced playable benefit.'],
  ['demo','does-the-official-product-page-link-to-a-demo','Does the Official Product Page Link to a Demo?','Natsume Store Product Page Has No Demo Link','store',
    'No. The current Natsume Store product page presents physical preorder options and product information, not a public demo download.',
    ['The page offers Switch, Switch 2, and PS5 physical variants.','Its call to action is a preorder purchase.','The description contains no demo platform, time limit, download, or carry-over terms.'],
    'A product purchase page is not evidence of a free trial, even when it includes screenshots or feature descriptions.',
    'Use official platform-store listings to verify any future demo and the Natsume page to verify the physical offer.'],

  // Current data
  ['game-status','does-rating-pending-mean-the-game-is-rated-teen','Does Rating Pending Mean Echoes of Teradea Is Rated Teen?','Rating Pending Does Not Mean Teen','store',
    'No. “Rating Pending” means the final ESRB category and content descriptors have not yet been displayed; it does not mean Teen, Everyone, or any other final rating.',
    ['The live Natsume Store listing shows ESRB Rating Pending.','No final ESRB category is printed in the product details.','Rating Pending is temporary metadata used before classification is finalized.'],
    'Do not convert a placeholder into an age recommendation. The final ESRB record and updated packaging should be checked closer to launch.',
    'The July status remains unresolved, so family-purchase guidance should cite the pending state accurately.'],
  ['game-status','does-one-player-confirm-no-online-features','Does “1 Player” Confirm There Are No Online Features?','One Player Does Not Settle Every Online Feature','store',
    'No. The store confirms a one-player game, but that field alone does not prove whether optional online services, cloud functions, rankings, or sharing features exist.',
    ['Natsume Store lists “Players: 1 Player.”','No co-op or multiplayer mode is described in the official announcements.','The announcements also do not publish a complete online-feature specification.'],
    'The safe conclusion is single-player classification—not a broader claim that the software never connects to a network.',
    'Platform-store feature panels should be checked later for cloud saves, online requirements, and service-specific functions.'],
  ['game-status','has-the-full-game-file-size-been-published','Has the Full Game File Size Been Published?','Echoes of Teradea File Size Is Still Unpublished','news',
    'No official platform-specific file size is published in Natsume’s three announcements or current physical product details.',
    ['Five platform families are confirmed.','The press releases do not list gigabytes or storage requirements.','Physical media availability does not reveal download or patch size.'],
    'Switch, Switch 2, PS5, Xbox, and Steam may show different sizes, and launch updates can change them.',
    'Storage guides should wait for first-party platform metadata instead of copying a guessed size across systems.'],
  ['game-status','have-pc-system-requirements-been-published','Have PC System Requirements Been Published?','Steam PC Requirements Are Still Pending','news',
    'No official minimum or recommended PC specifications have been published in the Natsume announcements reviewed through July 29.',
    ['PC through Steam is a confirmed launch platform.','No CPU, GPU, RAM, operating-system, DirectX, or storage table appears in the press releases.','The current physical store page does not sell or specify a PC build.'],
    'A confirmed Steam release is not evidence that a particular computer will run the game.',
    'PC buyers should wait for the verified Steam system-requirements panel before making hardware decisions.'],
  ['game-status','has-a-review-embargo-date-been-announced','Has a Review Embargo Date Been Announced?','No Review Embargo Timing Has Been Announced','news',
    'No. Natsume’s public announcements do not state when reviews, creator coverage, or scored impressions may go live.',
    ['The first trailer arrived June 18.','The release date is September 24.','No review-code schedule or embargo clock appears on the official news index.'],
    'Review access is an editorial and publisher process separate from the retail release date.',
    'Players comparing versions should wait for independently tested performance coverage rather than treating marketing footage as a benchmark.'],

  // Guides
  ['guides','can-campsites-support-long-exploration-trips','Can Campsites Support Longer Exploration Trips?','Campsites Support Rest, Cooking, and Recovery','announce',
    'Yes. Natsume describes campsites as places to cook, sleep, and recover, making them an official support system for trips away from the farm.',
    ['Campsites are part of the open-world exploration feature set.','Cooking and sleeping are explicitly named campsite activities.','Exact campsite positions, recipe values, and time costs are not yet published.'],
    'The system supports trip planning, but a precise day-by-day route cannot be written until the final map and reproducible gameplay data are available.',
    'A useful prelaunch guide can explain the rest loop without inventing optimal camp locations or stamina numbers.'],
  ['guides','should-you-match-animal-abilities-to-obstacles','Should You Match Animal Abilities to Exploration Obstacles?','Animal Abilities Are Designed for Different Obstacles','announce',
    'Yes. Official descriptions say animals have special abilities that help the player leap across terrain, break obstacles, and uncover treasures.',
    ['Animal companions can assist movement and obstacle clearing.','Different actions are described rather than one universal ability.','No complete animal-to-obstacle compatibility table has been published.'],
    'The planning principle is confirmed; exact best-animal routes remain unknown until each companion and obstacle can be tested.',
    'Players can expect ability-based exploration while avoiding fabricated unlock orders or animal rankings.'],
  ['guides','can-wild-animal-attacks-cost-collected-items','Can Wild Animal Attacks Cost You Collected Items?','Wild Encounters Can Cause Item Loss','announce',
    'Yes. Natsume warns that dangerous wild animals can send the player back and cause some collected items to be lost.',
    ['Wild animals appear in the untamed wilderness.','The consequence includes losing some collected items.','The percentage, protected items, and recovery rules are not stated.'],
    'The confirmed risk supports cautious return trips, but it does not justify a precise loss formula or guaranteed safe inventory category.',
    'Exploration guides should recommend risk management while labeling numerical penalties as launch-day research.'],
  ['guides','do-nautical-charts-support-island-expeditions','Do Nautical Charts Support Island Expeditions?','Nautical Charts Lead Toward Remote Islands','announce',
    'Yes. Official feature text connects nautical charts with reaching remote islands that contain rare collectibles and animals.',
    ['Remote islands are part of the exploration loop.','Nautical charts are the named discovery tool.','The number of charts, islands, and exact acquisition steps are not published.'],
    'The relationship between charts and islands is confirmed, but a walkthrough needs real map locations and tested requirements.',
    'Prelaunch guidance should focus on the expedition loop rather than inventing chart coordinates.'],
  ['guides','are-traveling-merchants-part-of-route-planning','Are Traveling Merchants Part of Route Planning?','Traveling Merchants Move Around Teradea','announce',
    'Yes. Natsume says traveling merchants wander across the map and offer exclusive items, so their movement is relevant to route planning.',
    ['The merchants are not described as fixed to one permanent shop.','Exclusive items are part of their role.','Schedules, inventories, prices, and refresh rules remain unpublished.'],
    'The confirmed concept supports a merchant-tracking guide later, but not a timetable before launch.',
    'Players should distinguish the roaming merchant system from named fixed locations such as Maple Mart.'],

  // Story
  ['story','does-the-player-leave-bloomfield-to-investigate-disasters','Does the Player Leave Bloomfield to Investigate Disasters?','The Story Sends the Player Across Teradea','announce',
    'Yes. The official premise begins in Bloomfield and sends the player across Teradea as mist, wild beasts, and disasters threaten the land.',
    ['The protagonist was raised in Bloomfield Village.','The Forest of Echoes mist and nighttime wolves disrupt the region.','Other villages face earthquakes, violent storms, and additional disasters.'],
    'The broad journey is confirmed, but official sources do not publish the full chapter order, quest list, or ending.',
    'Story guides can map the premise without turning promotional summaries into a fabricated walkthrough.'],
  ['story','is-lupo-confirmed-to-be-the-guardian-wolf','Is Lupo Confirmed to Be the Large Guardian Wolf?','Lupo and the Rumored Guardian Wolf Are Not Explicitly Identical','preorder',
    'No official text explicitly confirms that Lupo is the same large guardian wolf rumored to rule the nighttime wolves.',
    ['The story premise mentions rumors of a large guardian wolf.','The preorder announcement identifies Lupo as the Bloomfield Guardian and shows a baby-wolf plush.','The publisher has not stated that these two references are the same individual.'],
    'A thematic connection is plausible, but the identity should remain unconfirmed until dialogue or a later announcement establishes it.',
    'Keeping the names separate prevents a speculative lore theory from being presented as canon.'],
  ['story','does-the-harvest-goddess-guide-the-player','Does the Harvest Goddess Guide the Player?','The Harvest Goddess Is a Confirmed Ally','announce',
    'Yes. Natsume names the Harvest Goddess among the allies the player meets while investigating Teradea’s mysteries.',
    ['The Harvest Goddess appears in the official character list.','She is placed alongside Doc Jr. and Guardian Spirits in the journey description.','Her complete quest role, schedule, and rewards are not published.'],
    'The ally role is confirmed, but specific cutscenes or progression gates cannot be inferred from earlier games.',
    'Character coverage should cite her announced role and leave event sequencing for verified gameplay.'],
  ['story','is-doc-jr-an-ally-in-teradea','Is Doc Jr. an Ally in Echoes of Teradea?','Doc Jr. Returns as an Inventive Ally','announce',
    'Yes. Natsume describes Doc Jr. as an ingenious inventor and one of the memorable allies encountered in Teradea.',
    ['Doc Jr. is named in first-party product copy.','His inventor identity is explicit.','No complete invention list, upgrade tree, or quest schedule has been released.'],
    'His presence is factual, while assumptions about machines from previous games are not evidence for this title.',
    'A launch guide should document each invention only after it is shown or tested in Echoes of Teradea.'],
  ['story','are-village-disasters-part-of-one-mystery','Are the Village Disasters Part of the Main Mystery?','Disasters and the Looming Darkness Frame the Central Threat','announce',
    'Yes. Official story copy connects earthquakes, violent storms, strange disasters, and a looming darkness to the mysteries the player confronts across Teradea.',
    ['Different villages face distinct environmental threats.','Guardian Spirits are part of the wider journey.','The publisher does not reveal the final cause or resolution.'],
    'The threats belong to the central setup, but their exact causal relationship and final antagonist remain spoiler-sensitive and unconfirmed.',
    'Lore pages should preserve the mystery rather than invent a villain or ending from trailer imagery.'],

  // Features
  ['features','does-the-open-world-include-caves-islands-and-towns','Does the Open World Include Caves, Islands, and Towns?','Teradea Includes Caves, Remote Islands, and Lively Towns','announce',
    'Yes. Natsume explicitly describes a large landscape containing hidden caves, remote islands, lively towns, villages, and wilderness regions.',
    ['Caves contain ore and gems.','Nautical charts lead toward remote islands.','Villages and a bustling city appear in official descriptions and screenshots.'],
    'The variety of environment types is confirmed, but the full map size, loading structure, and region count are not.',
    'The feature briefing supports a world overview without claiming seamless travel or exact square mileage.'],
  ['features','can-animals-help-with-movement-and-breaking-obstacles','Can Animals Help with Both Movement and Breaking Obstacles?','Animal Companions Have Multiple Exploration Roles','announce',
    'Yes. Official text says animal abilities can help the player leap across terrain, break through obstacles, and discover treasures.',
    ['Movement assistance is explicitly named.','Obstacle breaking is explicitly named.','Treasure discovery is also part of the animal-companion feature.'],
    'The roles are confirmed collectively; the publisher has not mapped every action to a named species.',
    'Avoid assigning abilities to specific animals until screenshots, menus, or reproducible gameplay prove the pairing.'],
  ['features','do-power-statue-puzzles-reward-power-wisp-fruit','Do Power Statue Puzzles Reward Power Wisp Fruit?','Power Statue Puzzles Lead to Power Wisp Fruit','announce',
    'Yes. Natsume connects solved Power Statue puzzles with Power Wisp Fruit, which is used to increase maximum stamina.',
    ['Power Statues are found across Teradea.','Their puzzles award Power Wisp Fruit.','The fruit is connected to maximum-stamina growth.'],
    'The upgrade mechanism is confirmed, but statue count, fruit requirements, and stamina increments are not.',
    'A stamina guide should state the loop now and reserve optimization tables for verified values.'],
  ['features','does-farming-share-the-game-with-open-world-adventure','Does Farming Share the Game with Open-World Adventure?','Farming and Open-World Adventure Form One Core Loop','announce',
    'Yes. Natsume presents peaceful farm life and open-world adventure as connected parts of Echoes of Teradea rather than separate game modes.',
    ['Players can build a farm, raise animals, and harvest crops.','The same journey includes caves, islands, villages, obstacles, and dangerous wildlife.','Animal companions and campsites support travel beyond the farm.'],
    'The combined structure is confirmed, but the daily balance between farm chores and exploration remains a player-choice and progression question.',
    'This distinguishes the announced hybrid loop from assumptions that the game is only a farm simulator or only an adventure game.'],
  ['features','does-happilia-contribute-to-teradea-development','Does Happilia Contribute to Teradea’s Development?','Happilia Links Villager Help with Regional Development','announce',
    'Yes. Natsume says helping villagers and contributing to Teradea’s development earns Happilia.',
    ['Happilia is gained through helping villagers.','Development of Teradea is part of the same system.','No exchange rate, level table, or complete reward list is published.'],
    'The progression connection is factual, while exact thresholds and unlocks remain launch-day data.',
    'Feature guides should describe Happilia as a development-linked resource without inventing an economy.'],

  // Locations
  ['locations','is-bloomfield-the-players-home-village','Is Bloomfield the Player’s Home Village?','Bloomfield Is the Protagonist’s Starting Home','announce',
    'Yes. The official premise says the player was raised in the quiet comfort of Bloomfield Village.',
    ['Bloomfield anchors the opening story.','The Forest of Echoes mist reaches the surrounding land.','Lupo is called the Bloomfield Guardian in preorder material.'],
    'The starting role is confirmed, but a full shop list, resident schedule, and map layout are not.',
    'Location coverage can identify Bloomfield as home without inventing every service available there.'],
  ['locations','does-the-forest-of-echoes-produce-the-mist','Does the Mist Come from the Forest of Echoes?','The Mist Spreads from the Forest of Echoes','announce',
    'Yes. Natsume’s story setup says the mist of the Forest of Echoes now covers the land of Teradea.',
    ['The forest is the named origin of the spreading mist.','Wild wolves appear outside Bloomfield at night.','The ultimate cause of the mist is not revealed.'],
    'The direction of spread is confirmed; the lore explanation and resolution remain part of the unreleased story.',
    'A location page should separate geographic facts from theories about the darkness or Guardian Spirits.'],
  ['locations','is-quarrytop-associated-with-mining','Is Quarrytop Associated with Mining?','Quarrytop Is the Mining Village','announce',
    'Yes. Natsume identifies Quarrytop as one of the named villages and associates it with mining in the official world description.',
    ['Quarrytop is one of the three initially named villages outside Bloomfield.','Teradea contains maze-like caves with ore and gems.','Exact mine floors, ore tables, and shop inventories are not public.'],
    'The village theme is confirmed, but detailed resource routes require actual game data.',
    'This supports a location-intent page without publishing placeholder ore values.'],
  ['locations','is-tidewind-a-port-village','Is Tidewind a Port Village?','Tidewind Is the Harbor Community','announce',
    'Yes. Tidewind is the named seaside or harbor village within Teradea’s network of communities.',
    ['Tidewind appears in Natsume’s initial village list.','Nautical charts and remote-island travel are official world systems.','The exact boat service, docks, and resident roster are not published.'],
    'The coastal identity is useful context, but it does not prove where every island expedition starts.',
    'Future route guides should connect Tidewind to sailing only after the final game confirms the travel interface.'],
  ['locations','is-maplehill-a-cultural-center','Is Maplehill a Cultural Center?','Maplehill Is Framed Around Culture and Restoration','announce',
    'Yes. Maplehill is presented as a distinct community whose identity contributes to Teradea’s varied villages and restoration story.',
    ['Maplehill is one of the named villages in the announcement.','Helping villagers and developing Teradea earns Happilia.','Exact facilities, festivals, and restoration tiers are not listed.'],
    'The community role can be described now, but a facility-by-facility guide would be speculative.',
    'The page should be updated with tested services and NPC schedules after release.'],

  // Platforms
  ['platforms','is-cross-save-confirmed-between-platforms','Is Cross-Save Confirmed Between Platforms?','Cross-Save Has Not Been Announced','news',
    'No. Natsume has announced five platform families but has not announced cross-save or save transfer between them.',
    ['Switch 2, Switch, PS5, Xbox Series X|S, and Steam are confirmed.','The press releases do not describe account linking.','No platform-to-platform save migration rule is stated.'],
    'A simultaneous release does not imply shared progression or transferable saves.',
    'Choose a platform on the assumption that saves remain local until first-party store features say otherwise.'],
  ['platforms','is-there-a-switch-to-switch-2-upgrade-path','Is There a Switch-to-Switch 2 Upgrade Path?','No Switch Upgrade Path Has Been Announced','news',
    'No. Nintendo Switch and Nintendo Switch 2 are listed as separate versions, and Natsume has not published an upgrade-pack, entitlement, or save-transfer policy.',
    ['Both Nintendo platforms are named separately.','Both have physical preorder variants on Natsume Store.','No cross-buy or paid-upgrade language appears in the announcements.'],
    'Separate listings do not prove whether a future upgrade option will or will not appear.',
    'Buyers should select the version for the hardware they plan to use rather than assuming an automatic upgrade.'],
  ['platforms','is-a-ps5-disc-preorder-confirmed','Is a PS5 Disc Preorder Confirmed?','PS5 Is Included in Confirmed Physical Preorders','preorder',
    'Yes. Natsume’s preorder announcement and store page include a PlayStation 5 physical version.',
    ['PS5 appears among the three selectable physical variants.','Amazon was also named for PS5 preorders.','The Lupo plush offer is subject to retailer eligibility and stock.'],
    'A confirmed physical version does not reveal disc capacity, install size, day-one patch size, or digital price.',
    'PS5 buyers can verify the edition now while waiting for technical specifications.'],
  ['platforms','has-steam-deck-compatibility-been-announced','Has Steam Deck Compatibility Been Announced?','Steam Deck Status Is Still Unpublished','news',
    'No official Steam Deck verification or compatibility rating has been announced for Echoes of Teradea.',
    ['PC through Steam is confirmed.','No PC requirements are published in Natsume’s releases.','Steam availability alone does not establish Deck performance or control support.'],
    'Do not label the game Verified, Playable, or Unsupported without a live Valve compatibility record.',
    'Portable-PC recommendations should wait for platform metadata and independent testing.'],
  ['platforms','is-xbox-game-pass-availability-confirmed','Is Xbox Game Pass Availability Confirmed?','Game Pass Availability Has Not Been Announced','news',
    'No. Xbox Series X|S is a launch platform, but Natsume has not announced Xbox Game Pass inclusion.',
    ['Xbox Series X|S appears in the official platform list.','The physical preorder announcement focuses on Switch 2, Switch, and PS5.','No subscription-service language appears in the press releases.'],
    'A game launching on Xbox is not automatically part of Game Pass.',
    'Subscription pages should remain unlisted or explicitly negative-status until Microsoft or Natsume publishes an entitlement.'],

  // Preorder
  ['preorder','will-mixed-natsume-store-orders-ship-together','Will Mixed Natsume Store Orders Ship Together?','Mixed Orders Are Held Until All Items Are Available','store',
    'Yes. The current product page warns that orders combining preorder and in-stock items are held until every item is available.',
    ['The notice appears directly above the product description.','Natsume suggests placing separate orders for faster shipment of in-stock goods.','This policy concerns order fulfillment, not the game’s release date.'],
    'A held mixed order can delay other merchandise even if the game itself remains scheduled for September 24.',
    'Buyers who need an in-stock item earlier should follow the store’s separate-order guidance.'],
  ['preorder','is-amazon-an-officially-named-preorder-retailer','Is Amazon an Officially Named Preorder Retailer?','Amazon Was Named in the Preorder Announcement','preorder',
    'Yes. Natsume’s May 12 announcement named Amazon for Nintendo Switch 2, Nintendo Switch, and PlayStation 5 preorders.',
    ['Amazon is named in the first-party press release.','The listed physical platforms are Switch 2, Switch, and PS5.','Retail stock and bonus eligibility can change independently.'],
    'Being named as a retailer does not guarantee that every regional Amazon listing or seller includes the same bonus.',
    'Open the exact product listing and verify seller, platform, region, delivery estimate, and bonus wording before checkout.'],
  ['preorder','does-while-supplies-last-apply-to-lupo','Does “While Supplies Last” Apply to the Lupo Plush?','The Lupo Bonus Is Explicitly Stock-Limited','preorder',
    'Yes. Natsume states that the baby Lupo wolf plush is offered with eligible preorders while supplies last.',
    ['Lupo is described as the Bloomfield Guardian.','The plush is the named physical preorder bonus.','“While supplies last” means the offer can end before the release date.'],
    'The wording does not disclose inventory count, allocation by retailer, or a universal cutoff date.',
    'Buyers should rely on the exact retailer listing and order confirmation rather than assuming all September orders qualify.'],
  ['preorder','are-switch-switch-2-and-ps5-the-store-options','Are Switch, Switch 2, and PS5 the Natsume Store Options?','Natsume Store Lists Three Physical Platform Variants','store',
    'Yes. The live Natsume Store selector lists Nintendo Switch, Nintendo Switch 2, and PlayStation 5.',
    ['The page does not offer an Xbox or PC physical selector.','All three displayed variants share the September 24 product page.','The page advertises the free wolf plush offer.'],
    'The store selector describes that retailer’s current physical inventory, not the full digital launch-platform list.',
    'Use the platform announcement for all launch systems and the store page for physical options sold there.'],
  ['preorder','does-a-preorder-include-early-access','Does an Echoes of Teradea Preorder Include Early Access?','No Early Access Benefit Has Been Announced','preorder',
    'No. Natsume’s announced preorder benefit is the eligible Lupo plush; the press release does not promise early gameplay access.',
    ['The launch date remains September 24.','The named bonus is physical merchandise.','No advance unlock, beta, demo, or head-start period is described.'],
    'Do not interpret an estimated delivery date or retailer processing notice as an official early-access entitlement.',
    'Preorder decisions should be based on edition, platform, retailer terms, and confirmed bonus—not an unannounced play window.'],

  // General FAQ
  ['faq','what-is-the-best-source-for-official-announcements','What Is the Best Source for Official Announcements?','Use Natsume’s News Index and First-Party Product Page','news',
    'Natsume’s official news index is the primary place for dated announcements, while the Natsume Store product page is useful for live physical-product metadata.',
    ['The news index links the March, May, and June press releases.','The store lists current date, genre, player count, rating status, price, and physical variants.','Retailer and community posts should be checked against these first-party records.'],
    'A first-party source can still change, so guides should record the review date and preserve the difference between announcement text and live metadata.',
    'This evidence hierarchy makes corrections faster and reduces rumor-driven pages.'],
  ['faq','is-this-wiki-an-official-natsume-site','Is This Wiki an Official Natsume Site?','No, This Is an Independent Fan Guide','news',
    'No. Harvest Moon: Echoes of Teradea Wiki & Guides is an unofficial fan site and is not operated by Natsume.',
    ['Official claims are linked back to Natsume sources.','Editorial summaries separate confirmed facts from unknown details.','The site does not claim access to unreleased game data.'],
    'Readers should use first-party pages for purchases, support, legal terms, and final product specifications.',
    'The wiki’s role is to organize evidence and player questions, not replace the publisher.'],
  ['faq','can-winds-of-anthos-data-be-used-for-echoes-of-teradea','Can Winds of Anthos Data Be Used for Echoes of Teradea?','Do Not Treat Earlier-Game Data as Teradea Facts','announce',
    'No. Recipes, gifts, item values, controls, NPC schedules, and mechanics from The Winds of Anthos are not evidence for Echoes of Teradea.',
    ['Echoes of Teradea is a new entry with its own world and systems.','Series concepts can return with different values or rules.','Natsume has not published full launch databases for Teradea.'],
    'Earlier games may suggest questions worth testing, but their answers must not be copied into an indexable Teradea guide.',
    'Each database page should wait for direct announcement evidence or reproducible gameplay observation.'],
  ['faq','how-should-retailer-information-be-verified','How Should Retailer Information Be Verified?','Check the Exact Listing, Seller, Platform, Region, and Bonus','preorder',
    'Verify the exact product page rather than relying on a search snippet: confirm the seller, platform, region, edition, delivery estimate, price, and bonus wording.',
    ['Natsume names several retailers but availability changes.','The Lupo offer is stock-limited.','Physical options differ from the complete digital platform list.'],
    'A retailer logo in a press release does not guarantee every marketplace seller or country participates in the same offer.',
    'Record the date checked and link the listing used for any buying claim.'],
  ['faq','when-should-unconfirmed-pages-be-updated','When Should Unconfirmed FAQ Pages Be Updated?','Update After a New First-Party Source or Reproducible Test','news',
    'Update an unconfirmed answer when Natsume, a verified platform store, the final game, or a reproducible player test supplies the missing fact.',
    ['The current official record has three game-specific press releases.','Live store metadata can change before launch.','Post-launch mechanics need repeatable evidence rather than a single unsourced claim.'],
    'Changing “unknown” to “yes” or “no” without new evidence creates misinformation and weakens the sitemap.',
    'A dated evidence log makes it clear why an answer changed and which pages need synchronized corrections.']
];

if (rows.length !== 50) throw new Error(`Expected 50 V18 topic rows, found ${rows.length}`);
for (const [hub] of Object.entries(hubs)) {
  const count = rows.filter(row => row[0] === hub).length;
  if (count !== 5) throw new Error(`${hub} expected five rows, found ${count}`);
}

const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const records = rows.map(([hub,slug,question,headline,source,answer,facts,boundary,takeaway]) => ({
  hub, slug, question, headline, source: sources[source], answer, facts, boundary, takeaway
}));

function faqSchema(item) {
  const url = `${site}/faq/${item.slug}/`;
  return JSON.stringify({'@context':'https://schema.org','@graph':[
    {'@type':'FAQPage',mainEntity:[{'@type':'Question',name:item.question,acceptedAnswer:{'@type':'Answer',text:item.answer}}]},
    {'@type':'BreadcrumbList',itemListElement:[
      {'@type':'ListItem',position:1,name:'Home',item:`${site}/`},
      {'@type':'ListItem',position:2,name:'FAQ',item:`${site}/faq/`},
      {'@type':'ListItem',position:3,name:item.question,item:url}
    ]}
  ]});
}

function renderFaq(item) {
  const url = `${site}/faq/${item.slug}/`;
  const related = records.filter(other => other.hub === item.hub && other.slug !== item.slug).slice(0,3);
  const description = item.answer.length > 155 ? `${item.answer.slice(0,152)}...` : item.answer;
  return `<!doctype html><html lang="en"><head>
${adsense}
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(item.question)} | Echoes of Teradea FAQ</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${url}"><link rel="icon" href="../../assets/site-icon.svg"><link rel="stylesheet" href="../../styles.css"><meta property="og:title" content="${esc(item.question)}"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="article"><meta property="og:url" content="${url}"><meta property="og:image" content="${site}/assets/hero-fan-art.png"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${faqSchema(item)}</script></head><body><header class="site-header"><a class="brand" href="../../"><span class="brand-mark">HM</span>${brand}</a><nav class="nav"><a href="../../release-date/">Release</a><a href="../../guides/">Guides</a><a href="../../features/">Features</a><a href="../../platforms/">Platforms</a><a href="../">FAQ</a></nav>${languageSwitcher}</header><main><section class="subpage-hero"><div class="breadcrumb"><a href="../../">Home</a><span>/</span><a href="../">FAQ</a><span>/</span><span>${esc(item.question)}</span></div><p class="eyebrow">${hubs[item.hub].label} FAQ · Checked ${reviewed}</p><h1>${esc(item.question)}</h1><p>${esc(description)}</p></section><section class="section article-layout"><article class="article-main"><h2 id="answer">Quick answer</h2><p class="callout">${esc(item.answer)}</p><h2 id="evidence">Evidence checked</h2><ul class="content-list">${item.facts.map(fact=>`<li>${esc(fact)}</li>`).join('')}</ul><h2 id="meaning">How to use this answer</h2><p>${esc(item.takeaway)}</p><p>The answer is scoped to Harvest Moon: Echoes of Teradea and the public evidence available on ${reviewed}. It does not import schedules, values, controls, item data, or progression rules from an earlier Harvest Moon game.</p><h2 id="boundary">What remains outside the evidence</h2><p>${esc(item.boundary)}</p><p>If Natsume, a verified platform storefront, or reproducible launch-day testing supplies the missing field, this page should be updated with the exact source and review date rather than silently replacing the earlier status.</p><h2 id="source">Evidence source</h2><p><strong>Primary source:</strong> <a href="${item.source.url}" rel="nofollow noopener">${esc(item.source.label)}</a>. Independently summarized and checked on ${reviewed}.</p><h2 id="related">Related questions</h2><div class="page-links">${related.map(other=>`<a href="../${other.slug}/">${esc(other.question)}</a>`).join('')}<a href="../">Browse all FAQ</a><a href="../../${item.hub}/">Open ${hubs[item.hub].label} hub</a></div></article><aside class="toc"><h2>On This Page</h2><a href="#answer">Quick answer</a><a href="#evidence">Evidence</a><a href="#meaning">How to use it</a><a href="#boundary">Evidence boundary</a><a href="#source">Source</a><a href="#related">Related FAQ</a></aside></section></main><footer class="site-footer"><p>Unofficial, source-checked fan guide. Updated ${reviewed}.</p><a href="../">FAQ hub</a></footer></body></html>`;
}

function newsSchema(item) {
  const url = `${site}/news/${item.hub}/${item.slug}-briefing/`;
  return JSON.stringify({'@context':'https://schema.org','@graph':[
    {'@type':'NewsArticle',headline:item.headline,description:item.answer,datePublished:item.source.date,dateModified:reviewed,inLanguage:'en',mainEntityOfPage:url,author:{'@type':'Organization',name:'Echoes Guide Editorial Team'},publisher:{'@type':'Organization',name:'Echoes Guide'},about:{'@type':'VideoGame',name:'Harvest Moon: Echoes of Teradea'},citation:item.source.url},
    {'@type':'BreadcrumbList',itemListElement:[
      {'@type':'ListItem',position:1,name:'Home',item:`${site}/`},
      {'@type':'ListItem',position:2,name:'News',item:`${site}/news/`},
      {'@type':'ListItem',position:3,name:hubs[item.hub].label,item:`${site}/${item.hub}/`},
      {'@type':'ListItem',position:4,name:item.headline,item:url}
    ]}
  ]});
}

function renderNews(item) {
  const slug = `${item.slug}-briefing`;
  const url = `${site}/news/${item.hub}/${slug}/`;
  const related = records.filter(other => other.hub === item.hub && other.slug !== item.slug).slice(0,3);
  return `<!doctype html><html lang="en"><head>
${adsense}
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(item.headline)} | Echoes of Teradea News</title><meta name="description" content="${esc(item.answer)}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${url}"><link rel="icon" href="../../../assets/site-icon.svg"><link rel="stylesheet" href="../../../styles.css"><meta property="og:title" content="${esc(item.headline)}"><meta property="og:description" content="${esc(item.answer)}"><meta property="og:type" content="article"><meta property="og:url" content="${url}"><meta property="og:image" content="${site}/assets/hero-fan-art.png"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${newsSchema(item)}</script></head><body><header class="site-header"><a class="brand" href="../../../"><span class="brand-mark">HM</span>${brand}</a><nav class="nav"><a href="../../../news/">News</a><a href="../../../${item.hub}/">${hubs[item.hub].label}</a><a href="../../../guides/">Guides</a><a href="../../../features/">Features</a><a href="../../../faq/">FAQ</a></nav>${languageSwitcher}</header><main><section class="subpage-hero"><div class="breadcrumb"><a href="../../../">Home</a><span>/</span><a href="../../../news/">News</a><span>/</span><a href="../../../${item.hub}/">${hubs[item.hub].label}</a><span>/</span><span>${esc(item.headline)}</span></div><p class="eyebrow">Source-led topic briefing · Reviewed ${reviewed}</p><h1>${esc(item.headline)}</h1><p>${esc(item.answer)}</p></section><section class="section article-layout"><article class="article-main"><h2 id="status">The verified update</h2><p class="callout">${esc(item.answer)}</p><p>This briefing isolates one part of the public record so that a player can act on the confirmed detail without mistaking a broad trailer, preorder listing, or product page for a complete specification.</p><h2 id="facts">What the source establishes</h2><ul class="content-list">${item.facts.map(fact=>`<li>${esc(fact)}</li>`).join('')}</ul><h2 id="impact">Why it matters now</h2><p>${esc(item.takeaway)}</p><p>For editorial tracking, this topic should be reviewed again when Natsume publishes another game-specific release, when a verified platform store exposes new metadata, or when launch-day testing can answer the remaining operational question.</p><h2 id="unknown">What this update does not establish</h2><p>${esc(item.boundary)}</p><p>No unannounced feature, value, route, schedule, performance target, item table, or story outcome has been inferred. The distinction is important because the game is still unreleased.</p><h2 id="source">Primary evidence</h2><p><a href="${item.source.url}" rel="nofollow noopener">${esc(item.source.label)}</a> · source date ${item.source.date}; independently reviewed ${reviewed}.</p><h2 id="related">Continue this topic</h2><div class="page-links">${related.map(other=>`<a href="../${other.slug}-briefing/">${esc(other.headline)}</a>`).join('')}<a href="../../../faq/${item.slug}/">${esc(item.question)}</a><a href="../../../${item.hub}/">Open ${hubs[item.hub].label} hub</a></div></article><aside class="toc"><h2>On This Page</h2><a href="#status">Verified update</a><a href="#facts">Source facts</a><a href="#impact">Player impact</a><a href="#unknown">Still outside evidence</a><a href="#source">Primary source</a></aside></section></main><footer class="site-footer"><p>Unofficial source-led news analysis. Updated ${reviewed}.</p><a href="../../../news/">News hub</a></footer></body></html>`;
}

for (const item of records) {
  const faqOut = path.join(root,'faq',item.slug,'index.html');
  const newsOut = path.join(root,'news',item.hub,`${item.slug}-briefing`,'index.html');
  await mkdir(path.dirname(faqOut),{recursive:true});
  await mkdir(path.dirname(newsOut),{recursive:true});
  await writeFile(faqOut,renderFaq(item));
  await writeFile(newsOut,renderNews(item));
}

for (const [hub,meta] of Object.entries(hubs)) {
  const items = records.filter(item => item.hub === hub);
  const hubPath = path.join(root,hub,'index.html');
  let html = await readFile(hubPath,'utf8');
  html = html.replace(/<!-- TAB_NEWS_V18_START -->[\s\S]*?<!-- TAB_NEWS_V18_END -->/g,'');
  html = html.replace(/<!-- RELATED_FAQ_V18_START -->[\s\S]*?<!-- RELATED_FAQ_V18_END -->/g,'');
  const faqModule = `<!-- RELATED_FAQ_V18_START --><section class="section related-faq"><div class="section-heading"><div><p class="eyebrow">Five new source-checked answers</p><h2>More ${meta.label} FAQ</h2></div><a class="text-link" href="../faq/">Browse 171 FAQ</a></div><div class="card-grid">${items.map(item=>`<article class="guide-card"><h3><a href="../faq/${item.slug}/">${esc(item.question)}</a></h3><p>${esc(item.answer)}</p></article>`).join('')}</div></section><!-- RELATED_FAQ_V18_END -->`;
  const newsModule = `<!-- TAB_NEWS_V18_START --><section class="section tab-news"><div class="section-heading"><div><p class="eyebrow">Five additional verified briefings</p><h2>More ${meta.newsTitle}</h2></div><a class="text-link" href="../news/">All News</a></div><div class="card-grid">${items.map(item=>`<article class="guide-card"><p class="eyebrow">Reviewed ${reviewed}</p><h3><a href="../news/${hub}/${item.slug}-briefing/">${esc(item.headline)}</a></h3><p>${esc(item.answer)}</p></article>`).join('')}</div></section><!-- TAB_NEWS_V18_END -->`;
  html = html.replace('</main>',`${faqModule}${newsModule}</main>`);
  await writeFile(hubPath,html);
}

let faqHub = await readFile(path.join(root,'faq/index.html'),'utf8');
faqHub = faqHub.replace(/<!-- FAQ50_V18_START -->[\s\S]*?<!-- FAQ50_V18_END -->/g,'');
const groupedFaq = Object.entries(hubs).map(([hub,meta]) => {
  const items = records.filter(item=>item.hub===hub);
  return `<section class="faq-group"><h3>${meta.label} FAQ</h3><div class="card-grid">${items.map(item=>`<article class="guide-card"><h4><a href="${item.slug}/">${esc(item.question)}</a></h4><p>${esc(item.answer)}</p></article>`).join('')}</div></section>`;
}).join('');
const faqDirectory = `<!-- FAQ50_V18_START --><section class="section faq-directory"><div class="section-heading"><div><p class="eyebrow">50 new evidence-led answers</p><h2>FAQ research expansion · July 29, 2026</h2></div></div>${groupedFaq}</section><!-- FAQ50_V18_END -->`;
faqHub = faqHub.replace('</main>',`${faqDirectory}</main>`);
faqHub = faqHub.replace(/Browse 121 FAQ/g,'Browse 171 FAQ').replace(/121 FAQ/g,'171 FAQ');
await writeFile(path.join(root,'faq/index.html'),faqHub);

let newsHub = await readFile(path.join(root,'news/index.html'),'utf8');
newsHub = newsHub.replace(/<!-- NEWS50_V18_START -->[\s\S]*?<!-- NEWS50_V18_END -->/g,'');
const groupedNews = Object.entries(hubs).map(([hub,meta]) => {
  const items = records.filter(item=>item.hub===hub);
  return `<section class="section"><h2><a href="../${hub}/">${meta.newsTitle}: five new briefings</a></h2><div class="card-grid">${items.map(item=>`<article class="guide-card"><p class="eyebrow">Reviewed ${reviewed}</p><h3><a href="${hub}/${item.slug}-briefing/">${esc(item.headline)}</a></h3><p>${esc(item.answer)}</p></article>`).join('')}</div></section>`;
}).join('');
newsHub = newsHub.replace('</main>',`<!-- NEWS50_V18_START -->${groupedNews}<!-- NEWS50_V18_END --></main>`);
newsHub = newsHub.replace(/Fifty focused updates/g,'One hundred focused updates').replace(/50 focused updates/g,'100 focused updates');
await writeFile(path.join(root,'news/index.html'),newsHub);

const manifestPath = path.join(root,'seo/indexable-urls.json');
const manifest = JSON.parse(await readFile(manifestPath,'utf8'));
const existing = new Set(manifest);
for (const item of records) {
  for (const url of [`/faq/${item.slug}/`,`/news/${item.hub}/${item.slug}-briefing/`]) {
    if (!existing.has(url)) {
      manifest.push(url);
      existing.add(url);
    }
  }
}
await writeFile(manifestPath,`${JSON.stringify(manifest,null,2)}\n`);
await writeFile(path.join(root,'data/v18-nav-news-faq.json'),`${JSON.stringify(records,null,2)}\n`);

console.log('Generated V18: 50 additional News URLs, 50 new FAQ URLs, and ten hubs with five new entries of each type.');
