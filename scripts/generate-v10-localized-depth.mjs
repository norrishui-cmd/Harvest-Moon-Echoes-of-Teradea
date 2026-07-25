import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const site = 'https://harvestmoonechoesofteradea.wiki';
const reviewed = '2026-07-25';

const sources = {
  announcement: ['Natsume – offizielle Ankündigung vom 11. März 2026', 'Natsume公式発表（2026年3月11日）', 'https://www.natsume.com/news/news_pdffiles/pid_379_HM_EOT_TitleAnnouncementF.pdf'],
  preorder: ['Natsume – Vorbestellungsmitteilung vom 12. Mai 2026', 'Natsume予約開始発表（2026年5月12日）', 'https://www.natsume.com/news/news_pdffiles/pid_382_HM_EOT_Pre_OrderAnnouncementF.pdf'],
  trailer: ['Natsume – Mitteilung zum ersten Trailer vom 18. Juni 2026', 'Natsume第1弾トレーラー発表（2026年6月18日）', 'https://www.natsume.com/news/news_pdffiles/pid_383_HMEOT_TrailerAnnouncementF.pdf'],
  store: ['Natsume Store – aktuelle Produktseite', 'Natsume Store商品ページ', 'https://natsumestore.com/products/harvest-moon-echoes-of-teradea-with-free-wolf-plush']
};

const records = [
  {
    slug:'platforms/nintendo-switch', source:'trailer',
    de:['Nintendo-Switch-Version','Harvest Moon: Echoes of Teradea erscheint am 24. September 2026 für Nintendo Switch. Eine physische Vorbestellung ist bestätigt.','Die normale Switch gehört zur zeitgleichen Startaufstellung. Die offizielle Mitteilung nennt sie getrennt von Switch 2; damit sind es eigenständige Produktversionen.','Die Seite hilft beim Prüfen von Plattform, Termin und physischer Verfügbarkeit, ohne technische Unterschiede zu erfinden.','Auflösung, Bildrate, Ladezeiten, Dateigröße, Touchscreen-Funktionen und Upgrade-Pfad wurden noch nicht veröffentlicht.'],
    ja:['Nintendo Switch版','『Harvest Moon: Echoes of Teradea』のNintendo Switch版は2026年9月24日発売予定で、パッケージ版の予約が確認されています。','通常のSwitchは同日発売予定の対応機種です。公式発表ではSwitch 2と別機種として記載されており、商品版も分かれています。','対応機種、発売日、パッケージ版の有無を確認するためのページで、未公開の性能差は推測しません。','解像度、フレームレート、ロード時間、容量、タッチ操作、アップグレード方法は未発表です。']
  },
  {
    slug:'platforms/nintendo-switch-2', source:'trailer',
    de:['Nintendo-Switch-2-Version','Echoes of Teradea erscheint am 24. September 2026 für Nintendo Switch 2; Natsume führt dafür eine eigene physische Version.','Switch 2 wird in allen drei offiziellen Spielmitteilungen als Zielplattform genannt. Vorbestellungslinks unterscheiden diese Fassung von der normalen Switch-Version.','Diese Seite trennt bestätigte Produktdaten von noch fehlenden Leistungs- und Upgrade-Angaben.','Exklusive Funktionen, Auflösung, Bildrate, Maussteuerung, Game-Key-Card-Format und Upgrade von Switch wurden nicht bestätigt.'],
    ja:['Nintendo Switch 2版','『Echoes of Teradea』は2026年9月24日にNintendo Switch 2向けにも発売予定で、専用パッケージ版が案内されています。','Switch 2は公式発表で一貫して対応機種に含まれ、通常Switch版とは別の商品として予約されています。','確定している商品情報と、まだ公表されていない性能・アップグレード情報を分けて整理します。','専用機能、解像度、フレームレート、マウス操作、カード形式、Switch版からのアップグレードは未確認です。']
  },
  {
    slug:'platforms/ps5', source:'trailer',
    de:['PlayStation-5-Version','Die PlayStation-5-Version von Echoes of Teradea startet am 24. September 2026; eine physische Fassung kann vorbestellt werden.','PS5 ist eine offiziell bestätigte Plattform. Natsume nennt Amazon, den eigenen Store und weitere Händler für die physische Veröffentlichung.','Der Eintrag bündelt Termin und Kaufstatus, lässt aber unbestätigte Controller- oder Leistungsmerkmale offen.','DualSense-Funktionen, Grafikmodi, Trophäen, Speichergröße, PS5-Pro-Optimierung und digitale Vorbestellung sind noch nicht beschrieben.'],
    ja:['PlayStation 5版','PlayStation 5版『Echoes of Teradea』は2026年9月24日発売予定で、パッケージ版の予約が確認されています。','PS5は公式対応機種です。Natsumeは自社ストア、Amazon、その他小売店でのパッケージ販売を案内しています。','発売日と購入状況を整理し、コントローラー機能や性能を未確認のまま断定しません。','DualSense機能、画質モード、トロフィー、必要容量、PS5 Pro最適化、DL版予約は未発表です。']
  },
  {
    slug:'platforms/xbox-series-xs', source:'trailer',
    de:['Xbox-Series-X|S-Version','Xbox Series X|S gehört zum bestätigten Start am 24. September 2026, doch Natsume bewirbt bislang keine physische Xbox-Vorbestellung.','Die Plattform steht in den offiziellen Ankündigungen. Die veröffentlichten Vorbestellungslisten für physische Exemplare nennen dagegen Switch 2, Switch und PS5.','Damit beantwortet die Seite Plattformverfügbarkeit und trennt sie sauber von der noch offenen Vertriebsform.','Store-Seite, Preis, Downloadgröße, Series-S-Leistung, Play Anywhere, Erfolge und physische Disc wurden nicht bestätigt.'],
    ja:['Xbox Series X|S版','Xbox Series X|S版は2026年9月24日の発売対象ですが、現時点でNatsumeはXboxパッケージ版の予約を案内していません。','公式発表にはXbox Series X|Sが含まれます。一方、確認済みパッケージ予約はSwitch 2、Switch、PS5のみです。','対応機種である事実と、販売形態が未発表である点を分けて確認できます。','ストアページ、価格、容量、Series S性能、Play Anywhere、実績、ディスク版は未確認です。']
  },
  {
    slug:'platforms/pc-steam', source:'trailer',
    de:['PC- und Steam-Version','Echoes of Teradea erscheint laut Natsume am 24. September 2026 auf PC via Steam.','Steam wird als PC-Vertriebskanal genannt, während die aktuelle Vorbestellungswerbung hauptsächlich physische Konsolenversionen betrifft.','Die Seite bestätigt Plattform und Termin, ohne eine noch nicht veröffentlichte Store-Seite oder Systemanforderungen vorzutäuschen.','Steam-Produktseite, Preis, Mindestanforderungen, Steam Deck, Erfolge, Cloud-Saves, Workshop und Vorbestellungsbonus sind offen.'],
    ja:['PC・Steam版','Natsumeの発表によると、PC版はSteamで2026年9月24日に発売予定です。','PCの配信先としてSteamが明記されていますが、現在の予約告知は主に家庭用パッケージ版を対象にしています。','対応プラットフォームと日付のみを確定し、未公開のストア情報や動作環境は推測しません。','Steam商品ページ、価格、動作環境、Steam Deck、実績、クラウドセーブ、Workshop、予約特典は未発表です。']
  },
  {
    slug:'features/untamed-wilderness', source:'announcement',
    de:['Ungezähmte Wildnis','Teradeas Wildnis enthält seltene Tiere und nächtliche Gefahren; wird die Spielfigur von einem wilden Tier erwischt, können getragene Gegenstände verloren gehen.','Natsume beschreibt Erkundung außerhalb der Dörfer, wilde Bestien nach Einbruch der Nacht und seltene Tiere auf abgelegenen Inseln.','Die bestätigte Risiko-Regel macht Reisevorbereitung sinnvoll, ohne Fundorte oder Verlustformeln zu erfinden.','Welche Tiere angreifen, wie viele Gegenstände verloren gehen, ob Schutzgegenstände existieren und wie Flucht funktioniert, ist unbekannt.'],
    ja:['未開の自然と危険','テラディアの野外には珍しい動物と夜の危険があり、野生動物に捕まると所持品を失う可能性があります。','Natsumeは村外の探索、夜に現れる野獣、離島に生息する珍しい動物を説明しています。','確認済みのリスクを基に遠征準備の考え方を整理し、出現場所や損失計算は作りません。','攻撃する動物、失う品数、防具や回避手段、逃走方法はまだ不明です。']
  },
  {
    slug:'features/islands-nautical-charts', source:'announcement',
    de:['Inseln und Seekarten','Seekarten führen in Echoes of Teradea zu abgelegenen Inseln, auf denen seltene Tiere entdeckt und angefreundet werden können.','Die Inselreisen sind ein bestätigter Teil der offenen Erkundung. Natsume verbindet Seekarten ausdrücklich mit entfernten Zielen und seltenen Tieren.','Die Seite erklärt den veröffentlichten Zusammenhang zwischen Karte, Expedition und Tierfund, nicht die noch unbekannten Routen.','Fundorte der Karten, Abfahrtspunkte, Inselzahl, Reisekosten, Wettergrenzen und Tierlisten sind noch nicht veröffentlicht.'],
    ja:['離島と海図','『Echoes of Teradea』では海図を使って離島へ向かい、珍しい動物を見つけて仲良くできます。','島への遠征は公式に確認された探索要素で、Natsumeは海図、遠隔地、珍しい動物を明確に結び付けています。','海図から遠征、動物発見へつながる確定情報を説明し、未判明の航路は作成しません。','海図の入手場所、出航地点、島数、費用、天候条件、動物一覧は未公開です。']
  },
  {
    slug:'features/farming-system', source:'announcement',
    de:['Landwirtschaftssystem','Die Spielfigur baut eine Farm auf, zieht Tiere groß und verbindet das ruhige Farmleben mit der Wiederherstellung Teradeas.','Natsumes Beschreibung bestätigt Landwirtschaft und Tierhaltung als Kernaktivitäten neben Dorfaufbau und Erkundung.','Der Eintrag ordnet die Farm in den gesamten Spielkreislauf ein, ohne noch unbekannte Feldgrößen oder Ertragswerte zu behaupten.','Saatgutliste, Pflanzenzeiten, Jahreszeiten, Bewässerung, Tierarten, Produktpreise und Automatisierung sind nicht veröffentlicht.'],
    ja:['農業システム','プレイヤーは農場を築いて動物を育て、穏やかな農業生活とテラディア復興を並行して進めます。','Natsumeの説明では、農業と動物飼育が村づくり・探索と並ぶ中心要素として確認されています。','農場が全体のゲームループで担う役割を整理し、畑面積や収穫量を推測しません。','種一覧、成長日数、季節、水やり、家畜種類、販売価格、自動化機能は未公開です。']
  },
  {
    slug:'features/guardian-spirits', source:'announcement',
    de:['Wächtergeister','Wächtergeister schützen die Dörfer Teradeas; ihre Rückkehr gehört zur Wiederherstellung der durch Katastrophen geschädigten Regionen.','Die vier benannten Dörfer besitzen einen Wiederaufbau-Kontext, und die Geschichte verbindet den Nebel, die Waldgöttin und schützende Geister.','Diese Seite erklärt die bestätigte Storyfunktion, ohne Geistnamen, Bosskämpfe oder Freischaltreihenfolge zu erfinden.','Anzahl, Namen, Aussehen, Prüfungen, Belohnungen, Reihenfolge und spielbare Fähigkeiten der Geister sind unbekannt.'],
    ja:['守護精霊','守護精霊はテラディアの村々を守る存在で、災害で傷ついた地域の復興と結び付いています。','4つの村には復興の背景があり、物語は霧、森の女神、土地を守る精霊を関連付けています。','確認済みの物語上の役割だけを説明し、精霊名、ボス戦、解放順は創作しません。','精霊の数、名前、姿、試練、報酬、順序、能力は未発表です。']
  },
  {
    slug:'features/player-movement', source:'trailer',
    de:['Springen, Klettern und Bewegung','Die Erkundung umfasst Springen sowie das Klettern an Leitern und Ranken, wodurch Höhenunterschiede und versteckte Bereiche erreichbar werden.','Natsume nennt diese Bewegungsformen zusammen mit Tierfähigkeiten, Höhlen und einer großen offenen Welt.','Die Seite trennt die bestätigten Aktionen von unbestätigten Steuerungsdetails oder Ausdauerwerten.','Tastenbelegung, Sprunghöhe, Kletterausdauer, Fallschaden, Schwimmen und Plattformunterschiede sind nicht bekannt.'],
    ja:['ジャンプ・はしご・ツタ登り','探索ではジャンプ、はしご登り、ツタ登りが可能で、高低差や隠れた場所へ進む手段になります。','Natsumeはこれらの移動と、動物能力、洞窟、広大なオープンワールドを同じ特徴として紹介しています。','確認済みアクションと、未公開の操作・スタミナ仕様を明確に分けます。','ボタン配置、ジャンプ高度、登りのスタミナ、落下ダメージ、泳ぎ、機種差は不明です。']
  },
  {
    slug:'locations/bloomfield-village', source:'announcement',
    de:['Bloomfield Village','Bloomfield Village ist das Heimatdorf, in dem die Spielfigur aufgewachsen ist und von dem die Reise zur Rettung Teradeas ausgeht.','Die Geschichte beginnt, als Nebel aus dem Forest of Echoes Katastrophen auslöst und wilde Tiere nachts gefährlich werden.','Der Ortsartikel bündelt bestätigte Storyfunktion und Ausgangslage, nicht erfundene Läden oder Bewohnerpläne.','Vollständige Karte, Gebäude, Einwohner, Öffnungszeiten, Farmposition und Schnellreisepunkte sind noch nicht bekannt.'],
    ja:['ブルームフィールド村','ブルームフィールド村は主人公が育った故郷で、テラディアを救う旅の出発点です。','物語は「Forest of Echoes」から霧が発生し、災害と夜の野獣が現れたことから始まります。','確定した物語上の役割と開始状況を整理し、店や住民スケジュールは捏造しません。','完全な地図、建物、住民、営業時間、農場位置、ファストトラベル地点は未判明です。']
  },
  {
    slug:'locations/forest-of-echoes', source:'announcement',
    de:['Forest of Echoes – Ortsdossier','Der Forest of Echoes ist die Quelle des geheimnisvollen Nebels, der Bloomfield und weitere Teile Teradeas in Gefahr bringt.','Der Wald ist direkt mit dem Auslöser der Hauptgeschichte und der Waldgöttin verbunden.','Die Seite dient als Story- und Ortsdossier, ohne Eingang, Kartenkoordinaten oder Dungeon-Schritte vorwegzunehmen.','Zugang, Größe, Ebenen, Gegner, Ressourcen, Rätsel, Abschlussbelohnung und Zeitpunkt der Erkundung sind unbekannt.'],
    ja:['Forest of Echoes 場所ガイド','「Forest of Echoes」は謎の霧が発生し、ブルームフィールドとテラディア各地を危険にさらした場所です。','この森はメインストーリーの発端と森の女神に直接関係しています。','物語と場所の確定情報をまとめ、入口、座標、ダンジョン手順は先取りしません。','入場条件、広さ、階層、敵、資源、謎解き、報酬、探索時期は不明です。']
  },
  {
    slug:'locations/tidewind', source:'announcement',
    de:['Tidewind','Tidewind ist eines der vier bestätigten Dörfer Teradeas und wurde im Storykontext von einem Sturm getroffen.','Die offizielle Ankündigung nennt Tidewind neben Bloomfield, Quarrytop und Maplehill als wiederherzustellende Siedlung.','Das Dossier hält Dorfname und Katastrophenbezug fest, ohne Küstenlage, Bewohner oder Funktionen zu erfinden.','Exakte Position, Klima, Gebäude, Händler, Figuren, Wächtergeist, Aufgaben und Wiederaufbauschritte sind nicht veröffentlicht.'],
    ja:['タイドウィンド','タイドウィンドは確認済み4村の一つで、物語上は嵐の被害を受けた地域です。','公式発表ではブルームフィールド、クォリートップ、メープルヒルと共に復興対象として挙げられています。','村名と災害との関係を記録し、海辺の位置、住民、施設は推測しません。','正確な場所、気候、建物、商人、人物、守護精霊、依頼、復興手順は未公開です。']
  },
  {
    slug:'locations/quarrytop', source:'announcement',
    de:['Quarrytop','Quarrytop ist ein bestätigtes Dorf, dessen Region im Katastrophenbericht mit einem Erdbeben verbunden wird.','Der Name passt zum veröffentlichten Bergbau- und Höhlenkontext, doch eine direkte Lagezuweisung der Minen ist noch nicht vollständig belegt.','Die Seite trennt den sicheren Dorf- und Erdbebenbefund von naheliegenden, aber unbestätigten Bergbauannahmen.','Karte, Mineneingänge, Bewohner, Union, Geschäfte, Wächtergeist und Wiederaufbauziele sind unbekannt.'],
    ja:['クォリートップ','クォリートップは確認済みの村で、物語上は地震被害と結び付けられています。','名称は採掘・洞窟の公式説明と関連しそうですが、鉱山の正確な所属地域までは確定していません。地震という確認済み情報は、村の復興テーマを理解する手掛かりになります。','確実な村名・地震情報と、自然だが未確認の採掘推測を分離します。発売後は入口、施設、住民、復興段階を同じURLに追加します。','地図、鉱山入口、住民、組合、店、守護精霊、復興目標は不明です。']
  },
  {
    slug:'locations/maplehill', source:'announcement',
    de:['Maplehill','Maplehill ist eines der vier Dörfer, die im Verlauf der Reise wiederaufgebaut und mit Happilia belebt werden.','Natsume beschreibt die Wiederherstellung zerstörter Dörfer als zentrales Ziel; Maplehill gehört zur bestätigten Ortsliste.','Der Artikel bleibt beim veröffentlichten Wiederaufbaukontext und übernimmt keine unbestätigten Shop- oder Figurenangaben.','Katastrophenart, Position, Bewohner, Maple Mart-Zugehörigkeit, Projekte, Kosten und Wächtergeist sind noch offen.'],
    ja:['メープルヒル','メープルヒルは、旅の中で再建しHappiliaを取り戻す4つの村の一つです。','Natsumeは災害で傷ついた村の復興を中心目標として説明し、メープルヒルを正式な地名に含めています。','公開済みの復興背景に限定し、店や人物の所属は未確認のまま扱います。','災害の種類、位置、住民、Maple Martとの関係、事業、費用、守護精霊は未発表です。']
  },
  {
    slug:'guides/treasure-hunting', source:'announcement',
    de:['Schatzsuche – bestätigte Grundlagen','Schatzsuche gehört zur Erkundung: In Höhlen, auf Inseln und in der Wildnis können wertvolle Gegenstände und seltene Sammlerstücke entdeckt werden.','Natsume bestätigt Schätze, seltene Sammlerstücke, Höhlen und abgelegene Inseln, veröffentlicht aber noch keine Fundlisten.','Die Seite hilft bei der Vorbereitung und zeigt, welche Daten nach Veröffentlichung für echte Fundanleitungen benötigt werden.','Schatzkarten, Koordinaten, Truhen, Respawn, Werkzeuge, Belohnungen und vollständige Sammellisten sind unbekannt.'],
    ja:['宝探しの確認情報','洞窟、離島、野外を探索して、価値ある品や珍しい収集物を見つける宝探し要素が確認されています。','Natsumeは宝、珍しい収集物、洞窟、離島を紹介していますが、具体的な入手一覧は未公開です。','遠征準備に使える確定事項と、発売後に実地確認すべき攻略データを示します。','宝の地図、座標、宝箱、再出現、必要道具、報酬、完全リストは不明です。']
  },
  {
    slug:'guides/mining-caves', source:'announcement',
    de:['Bergbau und labyrinthartige Höhlen','Labyrinthartige Höhlen enthalten Erze, Edelsteine, Schätze und Hindernisse; Tierfähigkeiten können bei der Erkundung helfen.','Die offiziellen Beschreibungen verbinden Höhlen mit wertvollen Materialien und Risiken wie herabfallenden Steinen.','Der Guide erklärt die bestätigte Vorbereitung, ohne Etagenkarten, Erzquoten oder Werkzeugstufen zu erfinden.','Minenzahl, Ebenen, Erzpositionen, Ausdauerverbrauch, Werkzeugupgrades, Rückkehrpunkte und Reset-Regeln sind unbekannt.'],
    ja:['採掘と迷路状の洞窟','迷路のような洞窟には鉱石、宝石、宝、障害物があり、動物の能力が探索に役立ちます。','公式説明では洞窟と貴重な素材が結び付き、落石などの危険も示されています。','確定している準備ポイントを整理し、階層地図、出現率、道具段階は創作しません。','鉱山数、階層、鉱石位置、スタミナ消費、道具強化、帰還地点、リセット規則は不明です。']
  },
  {
    slug:'guides/traveling-merchants', source:'announcement',
    de:['Reisende Händler','Reisende Händler bieten exklusive Gegenstände an, die laut Natsume anderswo nicht erhältlich sind.','Die Händler sind Teil des Erkundungskreislaufs und schaffen einen Grund, abgelegene Gebiete vorbereitet zu besuchen.','Diese Seite bestätigt ihre exklusive Warenrolle, nennt aber keine erfundenen Standorte, Zeiten oder Preise.','Händlerzahl, Routen, Öffnungszeiten, Währungen, Inventare, Rotationen und Voraussetzungen sind noch nicht veröffentlicht.'],
    ja:['旅商人','旅商人は、Natsumeの説明では他では入手できない限定品を販売します。','旅商人は探索ループの一部で、離れた地域へ準備して向かう理由になります。通常の店と異なる限定品という役割は公式説明から確認できます。','限定商品の役割だけを確定し、未公開の場所、時間、価格は掲載しません。発売後は訪問場所、在庫、更新条件、必要通貨を実機で確認して追記します。','商人数、移動経路、営業時間、通貨、品ぞろえ、更新周期、出現条件は不明です。']
  },
  {
    slug:'guides/stamina-recovery', source:'announcement',
    de:['Ausdauer erholen','Aufgestellte Campsites dienen dazu, Ausdauer zu erholen, Mahlzeiten zu kochen und zu schlafen, bevor die Erkundung fortgesetzt wird.','Natsume beschreibt Camps als praktische Basis für längere Ausflüge; Power-Wisp-Früchte erhöhen zudem die maximale Ausdauer.','Der Guide trennt kurzfristige Erholung im Camp vom dauerhaften Ausbau der Maximalleiste.','Erholungswerte, Kochrezepte, Schlafdauer, Camp-Limits, Fruchtanzahl und maximale Ausdauer sind unbekannt.'],
    ja:['スタミナ回復','設置したキャンプではスタミナを回復し、料理や睡眠を行ってから探索を続けられます。','Natsumeは長距離遠征の拠点としてキャンプを説明し、Power Wisp Fruitsで最大スタミナを増やせることも示しています。','キャンプでの一時回復と、最大値を伸ばす恒久強化を分けて整理します。','回復量、料理レシピ、睡眠時間、設置制限、果実数、最大スタミナは不明です。']
  },
  {
    slug:'guides/rare-animals', source:'announcement',
    de:['Seltene Tiere finden und anfreunden','Seltene Tiere leben unter anderem auf abgelegenen Inseln und können angefreundet werden; Seekarten helfen, solche Reiseziele zu erreichen.','Die offizielle Beschreibung nennt Bären, Tiger und andere seltene Tiere, liefert aber noch keine vollständige Artenliste.','Die Seite erklärt den bestätigten Entdeckungsweg und hält Zähmungsanforderungen für spätere Verifizierung offen.','Arten, Inseln, Tageszeiten, Futter, Freundschaftswerte, Stallplätze und besondere Fähigkeiten sind unbekannt.'],
    ja:['珍しい動物の発見と交流','珍しい動物は離島などに生息し、仲良くすることができます。海図はそうした遠隔地へ向かう手掛かりです。','公式説明ではクマ、トラなどが示されていますが、完全な種類一覧はまだありません。','確認済みの発見ルートを説明し、仲良くなる条件は発売後の検証対象として残します。','種類、島、時間帯、餌、友好度、飼育枠、特殊能力は不明です。']
  },
  {
    slug:'guides/pets-vs-mounts', source:'trailer',
    de:['Haustiere, Begleiter und Reittiere','Tiere können auf Abenteuer mitgenommen werden; einige helfen beim Überwinden von Hindernissen, andere dienen als Reittiere mit besonderen Fähigkeiten.','Natsume beschreibt ein Tierbegleitersystem, das Reisen, versteckte Bereiche und Hindernisse miteinander verbindet.','Der Vergleich ordnet bestätigte Rollen, ohne einzelne Tierarten vorschnell einer Klasse zuzuweisen.','Vollständige Kategorien, Wechselregeln, Reittempo, Ausrüstung, Freundschaftsanforderungen und Fähigkeiten je Tier sind offen.'],
    ja:['ペット・仲間・乗り物の違い','動物を冒険に連れて行くことができ、障害物突破を助ける仲間や、特別な能力を持つ乗り物が存在します。','Natsumeは移動、隠れた場所、障害物を動物コンパニオンシステムと結び付けています。','確定した役割を比較し、個々の動物を未確認の分類へ勝手に割り当てません。','完全な分類、切替方法、移動速度、装備、友好条件、各動物の能力は未発表です。']
  },
  {
    slug:'story/mist-of-teradea', source:'announcement',
    de:['Der Nebel von Teradea','Ein geheimnisvoller Nebel steigt aus dem Forest of Echoes auf und löst Katastrophen sowie nächtliche Gefahren in Teradea aus.','Dieses Ereignis verändert das Leben der in Bloomfield aufgewachsenen Spielfigur und startet die Reise zur Rettung des Landes.','Die Seite erklärt den veröffentlichten Auslöser, ohne Ursache, Antagonist oder spätere Wendungen zu behaupten.','Ursprung des Nebels, Verbindung zur Waldgöttin, Heilungsmethode, Storykapitel und Endzustand sind nicht bekannt.'],
    ja:['テラディアの霧','謎の霧が「Forest of Echoes」から立ち上り、テラディアに災害と夜の危険をもたらします。','この出来事がブルームフィールドで育った主人公の日常を変え、土地を救う旅を始めます。','公開された発端のみを説明し、原因、敵役、後半の展開は推測しません。','霧の起源、森の女神との関係、浄化方法、章構成、結末は不明です。']
  },
  {
    slug:'story/guardian-wolf', source:'announcement',
    de:['Wächterwolf und Lupo','Die Geschichte zeigt einen rätselhaften Wächterwolf; Lupo wird von Natsume als Baby-Wolf und Wächter von Bloomfield bezeichnet.','Der Wolf verbindet Bloomfield, Schutzmotive und das Vorbestellungsplüschtier, doch die genaue Identität im Spiel bleibt sorgfältig getrennt.','Die Seite hält bestätigte Bezeichnungen fest, ohne Lupo automatisch mit jeder gezeigten Wolfsform gleichzusetzen.','Verwandlung, Spielrolle, Dialoge, Begleiterstatus, Fähigkeiten und Beziehung zwischen Lupo und dem Wächterwolf sind offen.'],
    ja:['守護狼とルポ','物語には謎めいた守護狼が登場し、ルポはNatsumeからブルームフィールドの守護者である子オオカミと紹介されています。','狼はブルームフィールド、守護のテーマ、予約特典ぬいぐるみを結びますが、ゲーム内の正確な同一性は分けて扱います。','公開された呼称を記録し、映像に映るすべての狼をルポと断定しません。','変身、物語での役割、会話、仲間化、能力、ルポと守護狼の関係は未確認です。']
  },
  {
    slug:'story/village-disasters', source:'announcement',
    de:['Katastrophen der vier Dörfer','Nebel und Naturkatastrophen treffen Teradeas Dörfer; Tidewind wird mit einem Sturm und Quarrytop mit einem Erdbeben verbunden.','Bloomfield, Tidewind, Quarrytop und Maplehill sind die vier bestätigten Siedlungen des Wiederaufbauziels.','Das Dossier ordnet bekannte Orte und Schäden, ohne die fehlende Katastrophe jedes Dorfs zu ergänzen.','Vollständige Chronologie, Schadensumfang, Maplehills Ereignis, Questfolge, Materialkosten und Wiederaufbaudauer sind unbekannt.'],
    ja:['4つの村を襲った災害','霧と自然災害がテラディアの村々を襲い、タイドウィンドは嵐、クォリートップは地震と関連付けられています。','ブルームフィールド、タイドウィンド、クォリートップ、メープルヒルが復興対象の確認済み4村です。','判明している場所と被害を整理し、各村の未公開災害を補完しません。','完全な時系列、被害規模、メープルヒルの出来事、クエスト順、素材費用、復興期間は不明です。']
  }
];

const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const prefixFor = route => '../'.repeat(route.split('/').filter(Boolean).length);
const schema = (title, description, url, locale) => JSON.stringify({'@context':'https://schema.org','@graph':[
  {'@type':'Article',headline:title,description,dateModified:reviewed,inLanguage:locale,mainEntityOfPage:url,author:{'@type':'Organization',name:'Echoes Guide Editorial Team'},about:{'@type':'VideoGame',name:'Harvest Moon: Echoes of Teradea'}},
  {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:locale==='de'?'Deutsch':'日本語',item:`${site}/${locale}/`},{'@type':'ListItem',position:2,name:title,item:url}]}
]});

function header(prefix, locale) {
  const nav = locale === 'de'
    ? [['guides','Guides'],['characters','Charaktere'],['locations','Orte'],['features','Features'],['faq','FAQ']]
    : [['guides','攻略'],['characters','キャラクター'],['locations','場所'],['features','機能'],['faq','FAQ']];
  return `<header class="site-header"><a class="brand" href="${prefix}${locale}/"><span class="brand-mark">HM</span><span class="brand-copy"><span class="brand-title">Harvest Moon: Echoes of Teradea</span><span class="brand-subtitle">Wiki &amp; Guides</span></span></a><nav class="nav">${nav.map(([href,label])=>`<a href="${prefix}${locale}/${href}/">${label}</a>`).join('')}</nav></header>`;
}

function render(record, locale) {
  const [title,direct,confirmed,use,boundary] = record[locale];
  const route = `${locale}/${record.slug}`;
  const prefix = prefixFor(route);
  const url = `${site}/${route}/`;
  const source = sources[record.source];
  const isDe = locale === 'de';
  const labels = isDe ? {
    crumb:'Deutsch', eyebrow:`Geprüfter Guide · Stand ${reviewed}`, quick:'Kurzantwort',
    facts:'Was offiziell bestätigt ist', use:'Wofür diese Seite nützlich ist',
    boundary:'Noch nicht bestätigt', method:'Redaktionelle Prüfmethode', related:'Weiterführende Seiten',
    home:'Deutsche Startseite', english:'Englische Originalseite', source:'Primärquelle',
    note:'Inoffizieller, quellengeprüfter Fan-Guide.'
  } : {
    crumb:'日本語', eyebrow:`確認済みガイド · ${reviewed}`, quick:'要点',
    facts:'公式に確認できること', use:'このページの使い方',
    boundary:'まだ確認されていないこと', method:'編集・検証方針', related:'関連ページ',
    home:'日本語トップ', english:'英語版ページ', source:'一次情報',
    note:'出典を確認した非公式ファンガイドです。'
  };
  const method = isDe
    ? 'Jede Aussage wird gegen Natsumes Ankündigungen, Trailer-Mitteilung oder Store-Daten geprüft. Serienwissen aus älteren Harvest-Moon-Spielen wird nicht als Beleg für Echoes of Teradea verwendet. Nach Veröffentlichung werden nur reproduzierbare Spieldaten ergänzt.'
    : '各記述はNatsumeの発表、トレーラー告知、ストア情報と照合します。過去のHarvest Moon作品の仕様を本作の根拠にはしません。発売後は実機で再現できるデータだけを追記します。';
  const description = direct.length > 155 ? `${direct.slice(0,152)}…` : direct;
  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | Harvest Moon: Echoes of Teradea Wiki</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${url}"><link rel="icon" href="${prefix}assets/site-icon.svg"><link rel="stylesheet" href="${prefix}styles.css"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="article"><meta property="og:url" content="${url}"><meta property="og:image" content="${site}/assets/hero-fan-art.png"><script type="application/ld+json">${schema(title,description,url,locale)}</script></head><body>${header(prefix,locale)}<main><section class="subpage-hero"><div class="breadcrumb"><a href="${prefix}${locale}/">${labels.crumb}</a><span>/</span><span>${esc(title)}</span></div><p class="eyebrow">${labels.eyebrow}</p><h1>${esc(title)}</h1><p>${esc(direct)}</p></section><section class="section article-layout"><article class="article-main"><h2>${labels.quick}</h2><p class="callout">${esc(direct)}</p><h2>${labels.facts}</h2><div class="fact-panels"><article class="fact-panel"><span>01</span><p>${esc(confirmed)}</p></article><article class="fact-panel"><span>02</span><p>${esc(use)}</p></article><article class="fact-panel"><span>03</span><p>${esc(isDe?'Der Informationsstand wurde bewusst auf nachprüfbare Daten begrenzt.':'確認可能な情報だけに意図的に範囲を限定しています。')}</p></article></div><h2>${labels.use}</h2><p>${esc(use)}</p><p>${esc(isDe?'Diese URL behält genau diesen Suchzweck. Neue Daten werden später hier ergänzt, statt eine zweite, konkurrierende Seite zu erzeugen.':'このURLは一つの検索目的に固定します。新情報は競合する別ページを増やさず、同じページへ追記します。')}</p><div class="boundary-box"><h2>${labels.boundary}</h2><p>${esc(boundary)}</p></div><h2>${labels.method}</h2><p>${esc(method)}</p><h2>${labels.source}</h2><ul class="source-list"><li><a href="${source[2]}" rel="nofollow noopener">${esc(isDe?source[0]:source[1])}</a></li></ul><p class="small-copy">${esc(isDe?'Letzte redaktionelle Prüfung: '+reviewed+'. Änderungen an offiziellen Angaben werden im bestehenden Datensatz nachgeführt.':'最終確認日：'+reviewed+'。公式情報の変更は同じデータページで更新します。')}</p><h2>${labels.related}</h2><div class="page-links"><a href="${prefix}${locale}/">${labels.home}</a><a href="${prefix}${record.slug}/">${labels.english}</a></div></article><aside class="toc"><h2>${labels.quick}</h2><p class="small-copy">${esc(direct)}</p></aside></section></main><footer class="site-footer"><p>${labels.note}</p><a href="${prefix}${locale}/game-status/">${isDe?'Aktueller Spielstatus':'最新ゲーム状況'}</a></footer></body></html>`;
}

for (const record of records) {
  for (const locale of ['de','ja']) {
    const dir = path.join(root,locale,record.slug);
    await mkdir(dir,{recursive:true});
    await writeFile(path.join(dir,'index.html'),render(record,locale));
  }
}

const manifestPath = path.join(root,'seo/indexable-urls.json');
const manifest = JSON.parse(await readFile(manifestPath,'utf8'));
for (const record of records) {
  for (const locale of ['de','ja']) {
    const route = `/${locale}/${record.slug}/`;
    if (!manifest.includes(route)) manifest.push(route);
  }
}
manifest.sort();
await writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${manifest.map(url=>`  <url><loc>${site}${url}</loc><lastmod>${reviewed}</lastmod></url>`).join('\n')}\n</urlset>\n`;
await writeFile(path.join(root,'sitemap.xml'),sitemap);

await writeFile(path.join(root,'data/v10-localized-depth.json'),JSON.stringify({
  reviewed,
  baselineHtml:329,
  baselineIndexable:317,
  localizedSourcePages:records.length,
  addedGerman:records.length,
  addedJapanese:records.length,
  totalAdded:records.length*2,
  routes:records.map(record=>record.slug),
  policy:'Translate only evidence-rich English pages; keep one intent, direct answer, primary source, and explicit unknown boundary in every locale.'
},null,2)+'\n');

console.log(`Generated ${records.length*2} deep localized pages from ${records.length} evidence-rich English source pages.`);
