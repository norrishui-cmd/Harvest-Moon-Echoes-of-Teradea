import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const site = 'https://harvestmoonechoesofteradea.wiki';
const reviewed = '2026-07-26';

const sources = {
  announce: ['Natsume – offizielle Titelankündigung', 'Natsume公式タイトル発表', 'https://www.natsume.com/news/news_pdffiles/pid_379_HM_EOT_TitleAnnouncementF.pdf'],
  preorder: ['Natsume – offizielle Vorbestellungsankündigung', 'Natsume公式予約発表', 'https://www.natsume.com/news/news_pdffiles/pid_382_HM_EOT_Pre_OrderAnnouncementF.pdf'],
  trailer: ['Natsume – offizielle Ankündigung zum ersten Trailer', 'Natsume公式ファーストトレーラー発表', 'https://www.natsume.com/news/news_pdffiles/pid_383_HMEOT_TrailerAnnouncementF.pdf'],
  store: ['Natsume Store – offizielle Produktseite', 'Natsume Store公式商品ページ', 'https://natsumestore.com/products/harvest-moon-echoes-of-teradea-with-free-wolf-plush'],
  bestbuy: ['Best Buy – Produktseite und aktuelle Screenshots', 'Best Buy商品ページと現行スクリーンショット', 'https://www.bestbuy.com/product/harvest-moon-echoes-of-teradea-nintendo-switch/JXT5SL668Y']
};

const q = (group, slug, source, de, ja) => ({ group, slug, source, de, ja });
const entries = [
  q('Release','when-does-echoes-of-teradea-release','preorder',
    ['Wann erscheint Harvest Moon: Echoes of Teradea?','Harvest Moon: Echoes of Teradea erscheint am 24. September 2026 für Nintendo Switch 2, Nintendo Switch, PlayStation 5, Xbox Series X|S und PC über Steam.','Natsume nannte das Datum erstmals in der Vorbestellungsankündigung vom 12. Mai 2026.','Die Ankündigung zum ersten Trailer bestätigte denselben Termin am 18. Juni erneut.','Alle fünf angekündigten Plattformfamilien werden mit demselben Kalendertag geführt.','Konkrete digitale Freischaltzeiten nach Zeitzone und die Zustellung physischer Vorbestellungen sind noch nicht festgelegt.'],
    ['Harvest Moon: Echoes of Teradeaの発売日は？','Harvest Moon: Echoes of Teradeaは2026年9月24日にNintendo Switch 2、Nintendo Switch、PlayStation 5、Xbox Series X|S、PC（Steam）向けに発売予定です。','Natsumeは2026年5月12日の予約発表で発売日を初めて明記しました。','6月18日のファーストトレーラー発表でも同じ日付が再確認されています。','発表済みの5つの機種系統はすべて同じ発売日です。','地域別のデジタル解禁時刻と、パッケージ予約品の配達日はまだ公表されていません。']),
  q('Release','is-september-24-a-global-release-date','trailer',
    ['Ist der 24. September ein weltweiter Veröffentlichungstermin?','Natsume führt den 24. September 2026 als gemeinsamen Veröffentlichungstermin aller angekündigten Plattformen, veröffentlicht aber keine getrennte Tabelle mit regionalen Terminen.','Switch 2, Switch, PS5, Xbox Series X|S und Steam teilen sich das Datum.','In den offiziellen Ankündigungen werden keine abweichenden regionalen Kalendertage genannt.','Die Verfügbarkeit bei Händlern kann sich trotzdem je nach Land unterscheiden.','Der gemeinsame Kalendertag bestätigt weder die genaue Uhrzeit pro Zeitzone noch eine Lieferung physischer Exemplare am selben Tag.'],
    ['9月24日は世界共通の発売日？','Natsumeは2026年9月24日を発表済み全機種の共通発売日として案内していますが、地域別の日付一覧は公開していません。','Switch 2、Switch、PS5、Xbox Series X|S、Steamはいずれも同じ日付です。','公式発表に地域ごとの別日程は記載されていません。','小売店での取り扱いは国によって異なる場合があります。','共通の日付は各タイムゾーンの解禁時刻や、パッケージ版の発売日到着を保証するものではありません。']),
  q('Release','will-console-and-pc-launch-the-same-day','trailer',
    ['Erscheinen Konsolen- und PC-Version am selben Tag?','Ja. Natsume nennt für Switch 2, Switch, PS5, Xbox Series X|S und Steam gemeinsam den 24. September 2026.','Die offizielle Plattformliste enthält Konsolen und PC.','Die Trailer-Ankündigung wiederholt für alle Plattformen denselben Termin.','Ein zeitversetzter PC-Start wurde nicht angekündigt.','Exakte digitale Freischaltzeiten können je nach Plattform und Region variieren und sind noch nicht veröffentlicht.'],
    ['コンソール版とPC版は同日発売？','はい。NatsumeはSwitch 2、Switch、PS5、Xbox Series X|S、Steamの発売日をすべて2026年9月24日としています。','公式の対応機種一覧にはコンソールとPCが含まれます。','トレーラー発表でも全機種に同じ日付が記載されています。','PC版だけの延期や先行発売は発表されていません。','デジタル版の正確な解禁時刻は機種や地域で異なる可能性があり、まだ公表されていません。']),
  q('Release','which-announcement-confirmed-september-24','preorder',
    ['Welche Ankündigung bestätigte den 24. September?','Natsumes Vorbestellungsankündigung vom 12. Mai 2026 bestätigte den 24. September 2026 als Veröffentlichungstermin.','Die ursprüngliche Titelankündigung vom März nannte noch keinen konkreten Tag.','Die Vorbestellungsankündigung verband Datum, Plattformen und Händlerstart.','Der erste Trailer bestätigte das Datum im Juni erneut.','Ältere undatierte Händlerseiten sollten nicht als primärer Nachweis für den Termin verwendet werden.'],
    ['9月24日を確定した発表はどれ？','2026年5月12日のNatsume公式予約発表が、2026年9月24日という発売日を明記しました。','3月の初報では具体的な発売日は示されていませんでした。','予約発表で発売日、対応機種、予約開始がまとめて案内されました。','6月のファーストトレーラー発表でも同じ日付が再確認されています。','日付の根拠には、古い無日付の小売情報ではなく公式発表を優先します。']),
  q('Release','when-was-echoes-of-teradea-announced','announce',
    ['Wann wurde Echoes of Teradea angekündigt?','Harvest Moon: Echoes of Teradea wurde am 11. März 2026 offiziell von Natsume angekündigt.','Die Ankündigung stellte den Titel und die fünf Plattformfamilien vor.','Sie beschrieb Teradea, die vier Dörfer, Guardian Spirits und Tierfähigkeiten.','Ein genaues Erscheinungsdatum folgte erst in der Mai-Ankündigung.','Die Erstankündigung bestätigte das Projekt, aber noch keine Demo, technischen Leistungswerte oder vollständige Charakterlisten.'],
    ['Echoes of Teradeaはいつ発表された？','Harvest Moon: Echoes of Teradeaは2026年3月11日にNatsumeから正式発表されました。','初報でタイトルと5つの対応機種系統が公開されました。','Teradea、4つの村、Guardian Spirits、動物能力も紹介されました。','具体的な発売日は5月の予約発表で初めて示されました。','初報では体験版、性能数値、全キャラクター一覧までは確認できません。']),

  q('Characters','are-there-five-bachelors-and-five-bachelorettes','trailer',
    ['Gibt es fünf Junggesellen und fünf Junggesellinnen?','Ja. Natsume bestätigt zehn neue Liebesinteressen: fünf Junggesellen und fünf Junggesellinnen.','Beziehungsereignisse sind offiziell bestätigt.','Spieler können einen Partner wählen.','Heirat gehört zum angekündigten Beziehungssystem.','Die Anzahl ist bestätigt; die vollständige Kandidatenliste, Geburtstage, Geschenke und Eventbedingungen sind noch nicht veröffentlicht.'],
    ['独身男性5人と独身女性5人がいる？','はい。Natsumeは新しい恋愛候補が10人で、独身男性5人と独身女性5人だと発表しています。','恋愛イベントがあることは公式に確認済みです。','プレイヤーはパートナーを選べます。','結婚も発表済みの交流システムに含まれます。','人数は確定していますが、全候補名、誕生日、好物、イベント条件はまだ公開されていません。']),
  q('Characters','are-all-ten-love-interests-new','trailer',
    ['Sind alle zehn Liebesinteressen neue Charaktere?','Natsume bezeichnet die Romanzen-Besetzung als zehn neue Liebesinteressen: fünf Junggesellen und fünf Junggesellinnen.','Diese Formulierung steht in der Ankündigung zum ersten Trailer.','Der zurückkehrende Verbündete Doc Jr. wird dort getrennt erwähnt.','Namen aus Screenshots sind nicht automatisch als Heiratskandidaten bestätigt.','Lorelei, Mara, Bryce, Cindy, Amad, Lily und Rick dürfen erst dann als Romanzen geführt werden, wenn Natsume ihre Rollen bestätigt.'],
    ['恋愛候補10人は全員新キャラクター？','Natsumeは恋愛候補を「新しい恋愛候補10人（男性5人、女性5人）」と説明しています。','この表現はファーストトレーラーの公式発表にあります。','再登場する仲間Doc Jr.は別に紹介されています。','スクリーンショットに名前がある人物が全員恋愛候補とは限りません。','Lorelei、Mara、Bryce、Cindy、Amad、Lily、Rickの役割は、Natsumeの正式確認まで断定しません。']),
  q('Characters','which-character-names-appear-in-screenshots','bestbuy',
    ['Welche Charakternamen erscheinen in aktuellen Screenshots?','Aktuelle Händler-Screenshots zeigen die Namen Lorelei, Mara, Bryce, Cindy, Amad, Lily und Rick.','Lorelei spricht über Ressourcen der Mine und Gewerkschaftsregeln.','Mara verwendet Formulierungen zu Kapitän und Ozean.','Bryce erwähnt eine Jam-Session im Maple Mart mit Cindy und Amad; ein Questziel nennt Lily und Rick.','Die sichtbaren Namen sind kein vollständiger Cast und beweisen weder Romanzenstatus noch Beruf, Geburtstag oder Tagesablauf.'],
    ['現在のスクリーンショットに登場する名前は？','現在の小売店スクリーンショットではLorelei、Mara、Bryce、Cindy、Amad、Lily、Rickの名前を確認できます。','Loreleiは鉱山資源と組合規則について話しています。','Maraの台詞には船長や海に関する表現があります。','BryceはCindy、AmadとのMaple Martでの演奏を語り、クエスト目標にはLilyとRickが登場します。','画面上の名前だけでは全キャスト、恋愛対象、職業、誕生日、行動予定までは確定できません。']),
  q('Characters','is-lorelei-connected-to-the-mine','bestbuy',
    ['Ist Lorelei mit der Mine verbunden?','Ein aktueller Screenshot verbindet Lorelei mit Minenressourcen und Gewerkschaftsregeln; ihr genauer Beruf und Wohnort sind jedoch nicht bestätigt.','Lorelei wird im Dialog namentlich angezeigt.','Ihre Aussage bezieht sich auf den Schutz von Minenressourcen.','Im selben Satz werden Gewerkschaftsregeln erwähnt.','Der Screenshot belegt nur einen Minen-Kontext; er macht Lorelei weder zur Besitzerin noch zur Gewerkschaftsleiterin oder bestätigten Romanze.'],
    ['Loreleiは鉱山に関係している？','現在のスクリーンショットではLoreleiが鉱山資源と組合規則に関係する台詞を話しますが、正確な職業や居住地は未発表です。','会話画面にLoreleiの名前が表示されています。','台詞は鉱山資源を守ることに触れています。','同じ台詞で組合規則にも言及しています。','確認できるのは鉱山に関する文脈だけで、所有者、組合代表、恋愛候補である証拠にはなりません。']),
  q('Characters','are-lily-and-rick-linked-by-a-quest','bestbuy',
    ['Sind Lily und Rick durch eine Quest verbunden?','Ja. Ein sichtbares Questziel fordert dazu auf, Lilys Lieblingssnacks zu besorgen, um die Rick gebeten hat.','Beide Namen stehen im selben Questziel.','Der Screenshot zeigt Bloomfield Village und Bloomfield Park.','Ein numerischer Fortschrittszähler ist sichtbar.','Name des Snacks, Questtitel, Belohnung, Auslöser, Frist und die größeren Rollen beider Figuren bleiben unbekannt.'],
    ['LilyとRickはクエストでつながっている？','はい。表示されたクエスト目標では、Rickに頼まれたLilyの好きなおやつを集めるよう指示されます。','同じ目標文に2人の名前が出ています。','画面にはBloomfield VillageとBloomfield Parkも表示されます。','数値の進行カウンターが確認できます。','おやつ名、クエスト名、報酬、発生条件、期限、2人の詳細な役割は未判明です。']),

  q('Features','does-echoes-of-teradea-have-photo-mode','bestbuy',
    ['Hat Echoes of Teradea einen Fotomodus?','Ja. Ein aktueller Gameplay-Screenshot zeigt den Interface-Befehl „Activate Photo Mode“.','Der Fotomodus wird auf dem Bildschirm ausdrücklich benannt.','Der Befehl erscheint zusammen mit DocPad, Songauswahl und Outfit-Wechsel.','Natsumes Vorbestellungsankündigung ordnet die Bilder als neue Gameplay-Screenshots ein.','Kamerasteuerung, Filter, Posen, ausgeblendetes HUD und plattformspezifisches Teilen sind noch nicht dokumentiert.'],
    ['Echoes of Teradeaにフォトモードはある？','はい。現在のゲーム画面に「Activate Photo Mode」という操作が表示されています。','Photo Modeという名称が画面上に明記されています。','DocPad、曲選択、衣装変更と同じ操作画面にあります。','Natsumeの予約発表は掲載画像を新しいゲーム画面として紹介しています。','カメラ操作、フィルター、ポーズ、UI非表示、機種別共有機能はまだ公開されていません。']),
  q('Features','can-you-change-your-outfit','bestbuy',
    ['Kann man das Outfit wechseln?','Ja. Ein aktueller Interface-Screenshot enthält den Befehl „Change Outfit“.','Die Funktion ist als direkt belegter Befehl sichtbar.','Sie steht im selben Hilfsmenü wie der Fotomodus.','Ein vollständiger Outfit-Katalog wurde noch nicht gezeigt.','Bestätigt ist der Wechsel, nicht die Anzahl, Bezugsquellen, Einschränkungen oder Tiefe der Charakteranpassung.'],
    ['衣装を変更できる？','はい。現在の操作画面に「Change Outfit」というコマンドがあります。','機能は割り当て済みの操作として表示されています。','フォトモードと同じユーティリティ画面にあります。','衣装の全一覧はまだ公開されていません。','確認できるのは着替え機能で、衣装数、入手場所、制限、キャラクター編集の深さは未発表です。']),
  q('Features','can-you-select-music','bestbuy',
    ['Kann man Musik auswählen?','Ein aktueller Screenshot zeigt den Befehl „Select Song“ und bestätigt damit eine Funktion zur Songauswahl im Spiel.','Der Befehl ist im Hilfsmenü sichtbar.','Er ist von Fotomodus und Outfit-Wechsel getrennt.','Titelliste und Freischaltmethode werden nicht gezeigt.','Nicht bestätigt ist, ob Musik überall, nur am Lager, über einen Gegenstand oder erst nach Fortschritt ausgewählt werden kann.'],
    ['ゲーム内で曲を選べる？','現在の画面に「Select Song」という操作があり、ゲーム内の曲選択機能を確認できます。','コマンドはユーティリティ操作画面に表示されています。','フォトモードや衣装変更とは別の項目です。','曲一覧と解放方法はまだ示されていません。','どこでも使えるのか、キャンプ限定か、道具や進行条件が必要かは未確認です。']),
  q('Features','does-the-interface-track-quest-objectives','bestbuy',
    ['Verfolgt das Interface Questziele?','Ja. Aktuelle Screenshots zeigen ein aktives Ziel mit Gegenstandszähler und benannten Ortsangaben.','Das Ziel nennt Lily und Rick.','Ein Fortschrittszähler wird eingeblendet.','Bloomfield Village und Bloomfield Park sind als Ortsangaben sichtbar.','Anheften mehrerer Quests, Kartenmarker, automatische Routen und Barrierefreiheitsoptionen sind noch nicht dokumentiert.'],
    ['画面でクエスト目標を追跡できる？','はい。現在の画面には、アイテム数カウンターと場所名を含む進行中の目標が表示されています。','目標文にはLilyとRickの名前があります。','進行カウンターが表示されています。','Bloomfield VillageとBloomfield Parkの場所名を確認できます。','複数クエスト固定、地図マーカー、自動ルート、アクセシビリティ設定はまだ不明です。']),
  q('Features','does-the-hud-show-date-time-and-weather','bestbuy',
    ['Zeigt das HUD Datum, Uhrzeit und Wetter?','Ja. Aktuelle Screenshots zeigen Spielzeit, Wochentag und Datum sowie Wettertext.','Zu sehen sind Beispiele für Vormittags- und Nachmittagszeiten.','Ein Wochentag und eine Tagesnummer werden angezeigt.','Ein Screenshot von Tornado Island enthält eine Wetterangabe.','Die Bilder bestätigen die HUD-Elemente, aber nicht Tageslänge, Pausenverhalten, Vorhersagezeitraum oder Wetterwahrscheinlichkeiten.'],
    ['HUDに日付・時刻・天気が表示される？','はい。現在の画面にはゲーム内時刻、曜日、日付、天気の文字が表示されています。','午前と午後の時刻例が確認できます。','曜日と日数の表示があります。','Tornado Islandの画面には天気表示もあります。','HUD要素は確認できますが、1日の長さ、停止中の時間、予報範囲、天候確率は未発表です。']),

  q('Locations','is-wolf-hill-a-confirmed-location','bestbuy',
    ['Ist Wolf Hill ein bestätigter Ort?','Ja. Ein aktueller Gameplay-Screenshot zeigt das Ziel, den Spirit Tree in Wolf Hill zu untersuchen.','Wolf Hill wird direkt im Questziel genannt.','Der Screenshot zeigt außerdem Bloomfield Village.','Der Name Milky erscheint neben der Zielanzeige.','Der Screenshot bestätigt weder die vollständige Karte noch Eingang, Gegner, Belohnungen oder eine Verbindung zu Lupo.'],
    ['Wolf Hillは確認済みの場所？','はい。現在のゲーム画面に「Wolf HillのSpirit Treeを調査する」という目標が表示されています。','Wolf Hillという名前が目標文に直接あります。','画面にはBloomfield Villageも表示されています。','目標表示の近くにMilkyという名前があります。','全体地図、入口、敵、報酬、Lupoとの関係までは確認できません。']),
  q('Locations','is-tornado-island-a-confirmed-location','bestbuy',
    ['Ist Tornado Island ein bestätigter Ort?','Ja. Tornado Island ist in einem aktuellen Händler-Screenshot als Ortsname sichtbar.','Der Name erscheint direkt im HUD.','Wettertext und eine Nachmittagszeit werden angezeigt.','Offizielle Ankündigungen bestätigen unabhängig davon entfernte Inseln und starke Stürme.','Bestätigt ist der Name; Zugangskarte, Schätze, Tiere, Wettermechanik und Quest-Reihenfolge bleiben unbekannt.'],
    ['Tornado Islandは確認済みの場所？','はい。現在の小売店ゲーム画面にTornado Islandという場所名が表示されています。','場所名はHUDに直接出ています。','天気表示と午後の時刻も確認できます。','公式発表でも離島と激しい嵐は別に確認されています。','名称は確認済みですが、航海図、宝、動物、天候システム、クエスト順は未判明です。']),
  q('Locations','is-bloomfield-park-in-the-game','bestbuy',
    ['Gibt es Bloomfield Park im Spiel?','Ja. Bloomfield Park erscheint als benanntes Ziel in einem aktuellen Quest-Screenshot.','Der Screenshot nennt außerdem Bloomfield Village.','Das aktive Ziel betrifft Lily und Rick.','Eine Richtungs- und Ortsanzeige ist sichtbar.','Genaue Kartenposition, Einrichtungen, Ereignisse, NPC-Zeitpläne und Freischaltzeitpunkt sind noch nicht veröffentlicht.'],
    ['Bloomfield Parkはゲームに登場する？','はい。現在のクエスト画面でBloomfield Parkが目的地として表示されています。','画面にはBloomfield Villageも記載されています。','進行中の目標はLilyとRickに関係します。','方向と場所の表示が確認できます。','正確な地図位置、施設、イベント、住民の予定、解放時期はまだ公開されていません。']),
  q('Locations','what-is-maple-mart','bestbuy',
    ['Was ist Maple Mart?','Maple Mart ist ein benannter Ort, den Bryce in einem Screenshot im Zusammenhang mit einer Jam-Session mit Cindy und Amad erwähnt.','Maple Mart ist im Charakterdialog sichtbar.','Die Szene verbindet den Ort mit Musik.','Cindy und Amad werden als Teilnehmer der erwähnten Session genannt.','Das Bild bestätigt nicht, ob Maple Mart ein Laden, Veranstaltungsort, Stadtteil oder Gebäude in Maplehill ist.'],
    ['Maple Martとは？','Maple Martは、BryceがCindyとAmadとの演奏について語るスクリーンショット内で名前が出る場所です。','キャラクター会話にMaple Martの名称があります。','会話はその場所を音楽と結びつけています。','CindyとAmadが演奏の参加者として名前を挙げられています。','店、会場、地区、Maplehill内の建物のどれかはまだ確定していません。']),
  q('Locations','are-there-spirit-trees','bestbuy',
    ['Gibt es Spirit Trees in Echoes of Teradea?','Mindestens ein Spirit Tree ist bestätigt: Ein sichtbares Questziel schickt den Spieler zur Untersuchung nach Wolf Hill.','Das Ziel verwendet die Einzahl „the Spirit Tree“.','Wolf Hill ist das benannte Ziel.','Guardian Spirits und Wiederaufbau sind zusätzlich durch Natsume bestätigt.','Der Screenshot nennt weder die Anzahl noch die Funktion der Bäume und setzt sie nicht mit Power Statues gleich.'],
    ['Echoes of TeradeaにSpirit Treeはある？','少なくとも1本のSpirit Treeが確認されています。表示された目標でWolf Hillへ調査に向かいます。','目標文は単数形の「the Spirit Tree」を使っています。','目的地はWolf Hillです。','Guardian Spiritsと復興はNatsumeの公式発表でも確認済みです。','本数、役割、Power Statuesと同じものかどうかは画面から判断できません。']),

  q('Platforms','are-switch-and-switch-2-separate-versions','preorder',
    ['Sind Switch und Switch 2 getrennte Versionen?','Ja. Natsume führt Nintendo Switch und Nintendo Switch 2 getrennt und bietet unterschiedliche physische Vorbestellungsvarianten an.','Beide Systeme stehen in der offiziellen Plattformliste.','Für beide gibt es eigene physische Varianten.','Ein kostenloser oder kostenpflichtiger Upgrade-Pfad wurde nicht beschrieben.','Getrennte Angebote verraten noch keine Leistungsunterschiede, Cartridge-Inhalte oder Regeln zur Spielstandübertragung.'],
    ['Switch版とSwitch 2版は別商品？','はい。NatsumeはNintendo SwitchとNintendo Switch 2を別々に記載し、パッケージ予約版も分けています。','両機種は公式対応機種一覧にあります。','それぞれ個別のパッケージ版があります。','無料・有料アップグレード経路は発表されていません。','別商品であることだけでは性能差、カード内容、セーブ移行規則までは分かりません。']),
  q('Platforms','is-the-pc-version-steam-only','announce',
    ['Ist Steam der bestätigte PC-Store?','Ja. Jede geprüfte offizielle Plattformliste nennt PC über Steam; ein anderer PC-Store wurde nicht angekündigt.','Steam steht in der Plattformankündigung vom März.','Steam teilt den Veröffentlichungstermin am 24. September.','Epic Games Store, GOG und Microsoft Store werden für die PC-Version nicht genannt.','Das ist der derzeit angekündigte Store und keine Aussage, dass andere PC-Versionen für immer ausgeschlossen sind.'],
    ['PC版で確認されているストアはSteamだけ？','はい。確認した公式対応機種一覧はいずれもPC（Steam）と記載し、他のPCストアは発表していません。','3月の機種発表にSteamがあります。','Steam版も9月24日発売予定です。','Epic Games Store、GOG、Microsoft StoreはPC版の販売先として記載されていません。','現時点の発表状況であり、将来ほかのPC版が絶対に出ないという意味ではありません。']),
  q('Platforms','is-there-a-physical-xbox-edition','preorder',
    ['Gibt es eine physische Xbox-Version?','Xbox Series X|S ist als Startplattform bestätigt, doch Natsumes physische Vorbestellungsankündigung nennt nur Switch 2, Switch und PS5.','Xbox Series X|S bleibt Teil des Termins am 24. September.','Die genannten physischen Varianten schließen Xbox nicht ein.','Der Zeitpunkt digitaler Vorbestellungen ist nicht vollständig beschrieben.','Die physische Xbox-Ausgabe gilt als nicht angekündigt, nicht als gestrichen; nur eine spätere offizielle oder Händlerliste kann sie bestätigen.'],
    ['Xboxのパッケージ版はある？','Xbox Series X|Sは発売機種ですが、Natsumeのパッケージ予約発表にあるのはSwitch 2、Switch、PS5だけです。','Xbox Series X|Sも9月24日の発売対象です。','掲載されたパッケージ版にはXboxが含まれません。','デジタル予約の時期も完全には案内されていません。','Xboxパッケージ版は「中止」ではなく「未発表」です。今後の公式情報や販売ページでのみ確認できます。']),
  q('Platforms','is-there-a-physical-pc-edition','preorder',
    ['Gibt es eine physische PC-Version?','Natsumes aktuelle Vorbestellungsankündigung führt keine physische PC-Version; der bestätigte PC-Vertrieb ist Steam.','Steam ist der benannte PC-Vertriebskanal.','Physische Vorbestellungen umfassen Switch 2, Switch und PS5.','Eine PC-Box oder Collector-Ausgabe wurde nicht angekündigt.','Dies ist der aktuelle Stand und muss aktualisiert werden, falls Natsume später eine physische PC-Ausgabe ankündigt.'],
    ['PCのパッケージ版はある？','Natsumeの現在の予約発表にPCパッケージ版はなく、確認済みのPC販売先はSteamです。','PC版の販売先としてSteamが明記されています。','パッケージ予約はSwitch 2、Switch、PS5向けです。','PC用の箱版やコレクター版は発表されていません。','現時点の販売状況であり、後日Natsumeが発表した場合は更新が必要です。']),
  q('Platforms','are-switch-2-performance-details-confirmed','preorder',
    ['Sind Leistungsdaten der Switch-2-Version bestätigt?','Nein. Natsumes aktuelle Ankündigungen enthalten keine technischen Zielwerte für die Switch-2-Version.','Switch 2 ist als Startplattform bestätigt.','Eine physische Switch-2-Version kann vorbestellt werden.','Auflösung, Bildrate und Ladezeiten werden nicht verglichen.','Eine bestätigte Version ist kein Beleg für 4K, 60 fps, besondere Steuerung oder einen Performance-Modus.'],
    ['Switch 2版の性能情報は確定している？','いいえ。Natsumeの現在の発表にはSwitch 2版の技術目標値がありません。','Switch 2は発売機種として確認済みです。','Switch 2パッケージ版は予約できます。','解像度、フレームレート、読み込み時間の比較はありません。','対応機種であることだけでは4K、60fps、専用操作、パフォーマンスモードの根拠になりません。']),

  q('Preorder','what-is-the-official-store-price','store',
    ['Wie hoch ist der Vorbestellungspreis im Natsume Store?','Der Natsume Store listet das physische Spiel derzeit für 49,99 US-Dollar in den verfügbaren Varianten für Switch 2, Switch und PS5.','Die Produktseite bietet mehrere Plattformvarianten.','Auf derselben Seite wird das Lupo-Plüsch-Angebot beworben.','Steuern und Versand werden getrennt beim Checkout bestimmt.','Preis, Bestand und Versandberechtigung können sich ändern; maßgeblich ist der aktuelle Warenkorb vor der Bestellung.'],
    ['Natsume Storeの予約価格は？','Natsume Storeでは現在、Switch 2、Switch、PS5のパッケージ版を49.99米ドルで掲載しています。','商品ページで機種別バリエーションを選べます。','同じページでLupoぬいぐるみ特典を案内しています。','税金と送料は購入手続き時の別条件です。','価格、在庫、配送対象は変わる可能性があるため、注文直前のカート表示を確認してください。']),
  q('Preorder','is-the-lupo-plush-guaranteed','preorder',
    ['Ist das Lupo-Plüschtier bei jeder Bestellung garantiert?','Nein. Natsume erklärt, dass das Babywolf-Plüschtier Lupo nur erhältlich ist, solange der Vorrat reicht.','Das Plüschtier wird als Vorbestellungsbonus bezeichnet.','Lupo wird Bloomfield Guardian genannt.','Es gibt keinen veröffentlichten Restbestand oder eine Nachlieferungsgarantie.','Prüfe, ob der Bonus im aktuellen Angebot oder Warenkorb erscheint; die Formulierung garantiert ihn nicht für jede Bestellung.'],
    ['Lupoぬいぐるみは全注文で必ず付く？','いいえ。Natsumeは子オオカミのLupoぬいぐるみを在庫が続く限りの予約特典としています。','ぬいぐるみは予約特典として案内されています。','LupoはBloomfield Guardianと呼ばれています。','残数表示や再入荷保証は公開されていません。','現在の商品説明やカートに特典が表示されるか確認してください。すべての注文への保証ではありません。']),
  q('Preorder','can-you-preorder-from-best-buy','trailer',
    ['Kann man Echoes of Teradea bei Best Buy vorbestellen?','Ja. Best Buy gehört zu den von Natsume genannten Händlern und führt derzeit Produktseiten für unterstützte physische Konsolenversionen.','Best Buy wird in der Juni-Ankündigung genannt.','Die Händlerseite zeigt den 24. September als Erscheinungsdatum.','Die Galerie enthält Gameplay-Screenshots.','Bestand, Abholung, Preis und Bonusbedingungen gelten nur für den Händler; das Natsume-Store-Plüschtier darf nicht vorausgesetzt werden.'],
    ['Best Buyで予約できる？','はい。Best BuyはNatsumeが挙げた販売店の一つで、対応するコンソール向けパッケージ版の商品ページがあります。','Best Buyは6月の公式発表に記載されています。','販売ページには9月24日の発売日があります。','商品ギャラリーにゲーム画面が掲載されています。','在庫、店舗受取、価格、特典は販売店ごとの条件で、Natsume Storeのぬいぐるみは自動的に付きません。']),
  q('Preorder','which-retailers-did-natsume-name','trailer',
    ['Welche Händler nennt Natsume für Vorbestellungen?','Natsume nennt Amazon, Natsume Store, Target, Walmart, Best Buy und GameStop.','Amazon und Natsume Store wurden im Mai genannt.','Target, Walmart, Best Buy und GameStop kamen im Juni hinzu oder wurden erneut aufgeführt.','Die verfügbaren Plattformen unterscheiden sich je nach Händler.','Die Liste garantiert nicht, dass jeder Händler jedes Land bedient oder jede physische Version anbietet.'],
    ['Natsumeが予約先として挙げた販売店は？','NatsumeはAmazon、Natsume Store、Target、Walmart、Best Buy、GameStopを挙げています。','AmazonとNatsume Storeは5月の発表にあります。','Target、Walmart、Best Buy、GameStopは6月に追加または再掲されました。','取り扱う機種は販売店によって異なります。','すべての販売店が全地域に対応し、全パッケージ版を扱う保証はありません。']),
  q('Preorder','does-the-listed-price-include-shipping-and-tax','store',
    ['Enthält der angezeigte Preis Versand und Steuern?','Der angezeigte Produktpreis ist kein allgemein gültiger Endpreis; Steuern, Versand und Einfuhrkosten hängen von Händler und Zielort ab.','Der Natsume Store zeigt einen Basispreis für das Produkt.','Die offizielle Ankündigung verspricht keinen kostenlosen weltweiten Versand.','Internationale Verfügbarkeit kann abweichen.','Prüfe den Endbetrag im Warenkorb einschließlich Lieferadresse und Einfuhrregeln, bevor du die Bestellung abschließt.'],
    ['表示価格に送料と税金は含まれる？','表示された商品価格は一律の支払総額ではなく、税金、送料、輸入費用は販売店と配送先で変わります。','Natsume Storeは商品の基本価格を表示しています。','公式発表は世界共通の送料無料を約束していません。','海外への販売可否も地域によって異なります。','注文確定前に配送先を入力し、カート総額と輸入条件を確認してください。'])
];

const esc = value => value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const markerStart = '<!-- V13_LOCALIZED_FAQ_START -->';
const markerEnd = '<!-- V13_LOCALIZED_FAQ_END -->';

function alternateLinks(slug) {
  return `<link rel="alternate" hreflang="en" href="${site}/faq/${slug}/"><link rel="alternate" hreflang="de" href="${site}/de/faq/${slug}/"><link rel="alternate" hreflang="ja" href="${site}/ja/faq/${slug}/"><link rel="alternate" hreflang="x-default" href="${site}/faq/${slug}/">`;
}

function render(entry, locale) {
  const [title, answer, ...rest] = entry[locale];
  const facts = rest.slice(0, 3);
  const boundary = rest[3];
  const isDe = locale === 'de';
  const labels = isDe ? {
    home:'Start', quick:'Kurzantwort', evidence:'Geprüfte Belege', boundary:'Bestätigungsgrenze',
    source:'Primärquelle', related:'Verwandte Fragen', toc:'Auf dieser Seite', all:'Alle FAQ ansehen',
    english:'Englische Originalseite', disclosure:'Inoffizieller, quellengeprüfter deutschsprachiger Fan-Guide.',
    aria:'Sprache wählen', current:'Deutsch'
  } : {
    home:'ホーム', quick:'要点', evidence:'確認した根拠', boundary:'確認できる範囲',
    source:'一次情報', related:'関連する質問', toc:'このページの内容', all:'FAQ一覧を見る',
    english:'英語版の元ページ', disclosure:'出典を確認した非公式の日本語ファンガイドです。',
    aria:'言語を選択', current:'日本語'
  };
  const groupLabel = isDe
    ? ({Release:'Release',Characters:'Charaktere',Features:'Features',Locations:'Orte',Platforms:'Plattformen',Preorder:'Vorbestellung'}[entry.group])
    : ({Release:'発売日',Characters:'キャラクター',Features:'システム',Locations:'地域',Platforms:'対応機種',Preorder:'予約'}[entry.group]);
  const canonical = `${site}/${locale}/faq/${entry.slug}/`;
  const src = sources[entry.source];
  const peers = entries.filter(x => x.group === entry.group && x.slug !== entry.slug).slice(0, 2);
  const schema = JSON.stringify({
    '@context':'https://schema.org','@graph':[
      {'@type':'FAQPage','inLanguage':locale,'mainEntity':[{'@type':'Question','name':title,'acceptedAnswer':{'@type':'Answer','text':answer}}]},
      {'@type':'BreadcrumbList','itemListElement':[
        {'@type':'ListItem','position':1,'name':labels.home,'item':`${site}/${locale}/`},
        {'@type':'ListItem','position':2,'name':'FAQ','item':`${site}/${locale}/faq/`},
        {'@type':'ListItem','position':3,'name':title,'item':canonical}
      ]}
    ]
  });
  const peerLinks = peers.map(x => `<a href="../${x.slug}/">${esc(x[locale][0])}</a>`).join('');
  return `<!doctype html><html lang="${locale}"><head>
<!-- ADSENSE_START -->
<meta name="google-adsense-account" content="ca-pub-9505220977121599">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9505220977121599" crossorigin="anonymous"></script>
<!-- ADSENSE_END --><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | Harvest Moon: Echoes of Teradea FAQ</title><meta name="description" content="${esc(answer)}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${canonical}">${alternateLinks(entry.slug)}<link rel="icon" href="../../../assets/site-icon.svg"><link rel="stylesheet" href="../../../styles.css"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(answer)}"><meta property="og:type" content="article"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${site}/assets/hero-fan-art.png"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${schema}</script></head><body><header class="site-header"><a class="brand" href="/${locale}/"><span class="brand-mark">HM</span><span class="brand-copy"><span class="brand-title">Harvest Moon: Echoes of Teradea</span><span class="brand-subtitle">Wiki &amp; Guides</span></span></a><nav class="nav"><a href="/${locale}/release-date/">${isDe?'Release':'発売日'}</a><a href="/${locale}/characters/">${isDe?'Charaktere':'キャラクター'}</a><a href="/${locale}/features/">${isDe?'Features':'システム'}</a><a href="/${locale}/locations/">${isDe?'Orte':'地域'}</a><a href="/${locale}/faq/">FAQ</a></nav><!-- LANGUAGE_SWITCHER_START --><details class="language-switcher"><summary aria-label="${labels.aria}"><span aria-hidden="true">🌐</span><span>${labels.current}</span><span class="language-chevron" aria-hidden="true">▾</span></summary><ul role="list"><li><a href="/faq/${entry.slug}/" hreflang="en" lang="en">English</a></li><li><a href="/de/faq/${entry.slug}/" hreflang="de" lang="de"${isDe?' aria-current="page"':''}>Deutsch</a></li><li><a href="/ja/faq/${entry.slug}/" hreflang="ja" lang="ja"${!isDe?' aria-current="page"':''}>日本語</a></li></ul></details><!-- LANGUAGE_SWITCHER_END --></header><main><section class="subpage-hero"><div class="breadcrumb"><a href="/${locale}/">${labels.home}</a><span>/</span><a href="/${locale}/faq/">FAQ</a><span>/</span><span>${esc(title)}</span></div><p class="eyebrow">${groupLabel} FAQ · ${isDe?'Geprüft':'確認日'} ${reviewed}</p><h1>${esc(title)}</h1><p>${esc(answer)}</p></section><section class="section article-layout"><article class="article-main"><h2 id="answer">${labels.quick}</h2><p class="callout">${esc(answer)}</p><h2 id="evidence">${labels.evidence}</h2><ul class="content-list">${facts.map(f=>`<li>${esc(f)}</li>`).join('')}</ul><h2 id="boundary">${labels.boundary}</h2><p>${esc(boundary)}</p><p>${labels.disclosure} ${isDe?'Angaben aus früheren Harvest-Moon-Spielen werden nicht als Beleg für dieses Spiel übernommen.':'過去のHarvest Moon作品の情報を本作の根拠として流用しません。'}</p><h2 id="source">${labels.source}</h2><p><a href="${src[2]}" rel="nofollow noopener">${esc(isDe?src[0]:src[1])}</a> · ${isDe?'zuletzt geprüft':'最終確認'} ${reviewed}</p><h2 id="related">${labels.related}</h2><div class="page-links">${peerLinks}<a href="../">${labels.all}</a><a href="../../../faq/${entry.slug}/">${labels.english}</a></div></article><aside class="toc"><h2>${labels.toc}</h2><a href="#answer">${labels.quick}</a><a href="#evidence">${labels.evidence}</a><a href="#boundary">${labels.boundary}</a><a href="#source">${labels.source}</a><a href="#related">${labels.related}</a></aside></section></main><footer class="site-footer"><p>${labels.disclosure}</p><a href="../">FAQ</a></footer></body></html>`;
}

function switcherForEnglish(slug) {
  return `<!-- LANGUAGE_SWITCHER_START --><details class="language-switcher"><summary aria-label="Choose language"><span aria-hidden="true">🌐</span><span>English</span><span class="language-chevron" aria-hidden="true">▾</span></summary><ul role="list"><li><a href="/faq/${slug}/" hreflang="en" lang="en" aria-current="page">English</a></li><li><a href="/de/faq/${slug}/" hreflang="de" lang="de">Deutsch</a></li><li><a href="/ja/faq/${slug}/" hreflang="ja" lang="ja">日本語</a></li></ul></details><!-- LANGUAGE_SWITCHER_END -->`;
}

for (const entry of entries) {
  for (const locale of ['de','ja']) {
    const dir = path.join(root, locale, 'faq', entry.slug);
    await mkdir(dir, { recursive:true });
    await writeFile(path.join(dir, 'index.html'), render(entry, locale));
  }
  const englishPath = path.join(root, 'faq', entry.slug, 'index.html');
  let english = await readFile(englishPath, 'utf8');
  english = english.replace(/<link rel="alternate" hreflang="en"[\s\S]*?<link rel="alternate" hreflang="x-default"[^>]*>/g, '');
  english = english.replace('</head>', `${alternateLinks(entry.slug)}</head>`);
  english = english.replace(/<!-- LANGUAGE_SWITCHER_START -->[\s\S]*?<!-- LANGUAGE_SWITCHER_END -->/, switcherForEnglish(entry.slug));
  await writeFile(englishPath, english);
}

for (const locale of ['de','ja']) {
  const isDe = locale === 'de';
  const groups = [...new Set(entries.map(x => x.group))];
  const listing = `${markerStart}<h2 id="localized-faq">${isDe?'30 ausführliche FAQ auf Deutsch':'日本語の詳細FAQ 30件'}</h2><p>${isDe?'Diese Seiten spiegeln Aufbau und Informationsdichte der englischen Originale: direkte Antwort, drei Belege, klare Bestätigungsgrenze, Primärquelle und verwandte Fragen.':'英語版と同じ構成・情報量で、結論、3つの根拠、確認範囲、一次情報、関連質問を掲載しています。'}</p>${groups.map(group => `<h3>${group}</h3><div class="page-links">${entries.filter(x=>x.group===group).map(x=>`<a href="/${locale}/faq/${x.slug}/">${esc(x[locale][0])}</a>`).join('')}</div>`).join('')}${markerEnd}`;
  const hubPath = path.join(root, locale, 'faq', 'index.html');
  let hub = await readFile(hubPath, 'utf8');
  const re = new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}`);
  hub = re.test(hub) ? hub.replace(re, listing) : hub.replace('</article>', `${listing}</article>`);
  hub = hub.replace(/<meta property="og:url"/, `<meta property="article:modified_time" content="${reviewed}"><meta property="og:url"`);
  await writeFile(hubPath, hub);
}

const approvedPath = path.join(root, 'seo', 'indexable-urls.json');
const approved = new Set(JSON.parse(await readFile(approvedPath, 'utf8')));
for (const entry of entries) for (const locale of ['de','ja']) approved.add(`/${locale}/faq/${entry.slug}/`);
const sorted = [...approved].sort((a,b)=>a.localeCompare(b,'en'));
await writeFile(approvedPath, `${JSON.stringify(sorted, null, 2)}\n`);

let sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
for (const entry of entries) {
  for (const locale of ['de','ja']) {
    const url = `/${locale}/faq/${entry.slug}/`;
    if (!sitemap.includes(`<loc>${site}${url}</loc>`)) {
      sitemap = sitemap.replace('</urlset>', `  <url>\n    <loc>${site}${url}</loc>\n    <lastmod>${reviewed}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n</urlset>`);
    }
  }
}
await writeFile(path.join(root, 'sitemap.xml'), sitemap);

console.log(`Generated ${entries.length * 2} localized FAQ pages and ${entries.length} reciprocal hreflang sets.`);
