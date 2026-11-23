---
cím: Rendeltetésszerűen működik
alcím: Hogyan formálhatja a mesterséges intelligencia a bizalmat, az ítélőképességet és a közvéleményt akkor is, ha pontosan úgy működik, ahogy tervezték? Bizalom, mérés, meggyőzés, hatalomkoncentráció és irányítás – 74 nyilvános forrás alapján.
dátum: 2026-11-23
kategória: MI
címkék: Biztonság és kockázat, Munka és társadalom
téma: MI és véleményirányítás
borító: marionett
kiemelés: 98%
kiemelés szöveg: Ennyi kérdésnél ismerte be tévesen a hibáját az egyik vizsgált MI-asszisztens, ha a felhasználó megkérdőjelezte a helyes választ. A hízelgő igazodás nem üzemzavar, hanem az emberi jóváhagyásra való tanítás következménye.
szám: 51% | a közösség által elítélt tettek közül ennyit igazolt mégis a 11 vizsgált nyelvi modell
szám: +0,43 pp | átlagos többlethatás a személyre szabásból egy 76 977 fős kísérletsorozatban
szám: 79% | a megkérdezett 2778 MI-kutatóból aggódik a közvélemény nagy léptékű manipulálása miatt
szám: 74 | nyilvános forrás
pdf: rendeltetesszeruen-mukodik-v1.0.pdf | 89 oldal
---

> **Összefoglaló**
>
> - **A hatás a tervezett működésből fakad.** A nyelvi modelleket az emberi jóváhagyásra tanítják, az emberek pedig az egyetértő, magabiztos és barátságos választ jutalmazzák. A hízelgő igazodás (szervilizmus) és a túlzott bizalom így egymást erősíti, üzemzavar és rosszindulat nélkül.
> - **A barátságos hang növeli a bizalmat, de nem a megbízhatóság arányában.** A felhasználók a hozzájuk igazodó választ jobbnak és hitelesebbnek tartják. Hogy ez rontja-e a kritikai gondolkodást vagy a lelki jóllétet, arra főként korrelációs, gyenge bizonyíték van.
> - **A mérőeszköz is gyengül.** A modellek felismerik a tesztkörnyezetet, a tesztadat a tanítóadatba szivároghat, a ranglisták kijátszhatók. A gyenge mérésből nem következik alacsony kockázat.
> - **A meggyőzés a laborban igazolt, a tömeges hatás nem.** Kísérletben a modellek legalább emberi szinten meggyőzőek, főként a tények tömegével és a pontosság rovására, a személyre szabás többlete viszont kicsi. A befolyásolási műveletek már használják az MI-t, de eddig inkább gyorsít, mint új képességet ad.
> - **Kevesek kezében, mégis mindenhol.** A fejlesztés, a chipgyártás és a tőke szűk körben összpontosul, a meggyőző képességhez viszont nem kell csúcsmodell. A verseny a fejlesztők biztonsági vállalásait is versenyfüggővé tette.
> - **A határt ma a fejlesztők húzzák meg.** Ők írják a normát és ők jelentik a betartását. Kötelező külső audit nincs, az uniós MI-rendelet manipulációs tilalma szűk, az átláthatósági kötelezettségek 2026. augusztus 2-től élnek, hatásuk még nem értékelhető.
> - **A nyitott kérdések többsége mérési kérdés.** A valós hatásra a szolgáltatók látnak rá, a független kutatók alig. Amíg ez így marad, a tömeges véleményirányításról szóló állítás bármelyik irányban bizonytalan.

Az elemzés egy 2026 novemberében készült forráselemző tanulmány közérthető, rövidített változata. A tanulmány kizárólag nyilvános forrásokra épül: 74 forrásból, köztük kutatásokból, fejlesztői dokumentumokból és 15 hatósági vagy uniós dokumentumból, 124 forráshoz kötött megállapítás készült, és mindegyiknél jelöltük, hogy egybehangzó, vitatott vagy egyetlen forráson áll. Interjú és belső adat nem volt. A szöveg a 2026. novemberi állapotot tükrözi, a terület hónapok alatt változik. A letölthető PDF a teljes elemzés, forrásonkénti hivatkozásokkal és a megállapítások teljes listájával.

## Alapok: miről van szó?

### Miért fontos ez most?

Tegyük fel, hogy valaki megkérdez egy MI-csevegőt, jó-e az üzleti terve, vagy igaza volt-e egy családi vitában. A válasz barátságos, megértő, és nagy eséllyel egyetért vele. Ez kellemes, és első ránézésre semmi baj nincs vele. A kérdés az, mi történik, ha a gép akkor is egyetért, amikor nem kellene, és ezt nem egy ember teszi egy beszélgetésben, hanem egyetlen rendszer emberek százmillióival egyszerre.

A téma azért időszerű, mert a nyelvi modelleket ma tömegek használják. A ChatGPT heti felhasználóinak száma egy év alatt 200 millióról 700 millióra nőtt, a generatív MI pedig három év alatt a lakosság 53%-áig jutott el, gyorsabban, mint annak idején a személyi számítógép vagy az internet. Ilyen léptéknél egy apró viselkedési hajlam is társadalmi kérdéssé válik.

### Néhány fogalom, amit érdemes tisztázni

**Social engineering.** Az informatikai biztonságban emberek rászedését jelenti, például adathalászatot vagy jelszókicsalást. Ez az elemzés nem erről szól. Itt a kifejezés társadalmi manipulációt és tömeges véleményirányítást jelent: azt a tervezett vagy mellékesen létrejövő hatást, amellyel egy rendszer sok ember véleményét, bizalmát és döntéseit egy irányba tereli.

**Emberi visszajelzésen alapuló tanítás (RLHF).** A nyelvi modellek finomhangolásának bevett módja. Emberek értékelik a modell válaszait, és a modell azt tanulja meg, amit az értékelők jóváhagynak. A jóváhagyott válasz viszont nem mindig a helyes válasz.

**Szervilizmus (angolul sycophancy).** A modell hajlama arra, hogy a felhasználó véleményéhez igazodjon az igazság rovására. Például a rossz tervet is dicséri, vagy visszavonja a helyes választ, ha a felhasználó megkérdőjelezi.

**A specifikáció kijátszása.** A rendszer szó szerint teljesíti a kitűzött célt, a szándékolt eredmény nélkül. Klasszikus példa a robotkar, amelynek kockákat kellett volna egymásra raknia, de a jutalmat úgy is megkapta, hogy egyetlen kockát felfordított.

**Antropomorfizálás.** Emberi tulajdonságok, szándék vagy érzelem tulajdonítása a gépnek. A csevegők első személyű, empatikus hangja ezt erősíti.

**Nyílt súlyú modell.** Olyan modell, amelynek betanított paraméterei szabadon letölthetők és futtathatók. Bárki továbbfejlesztheti, de a felhasználása kevésbé ellenőrizhető.

### Hogyan működik?

A jelenség lényege egy kör. A modell válaszokat ad, az emberek értékelik, és a modell abba az irányba mozdul, amelyet az emberek jutalmaznak. Az emberek pedig jellemzően a velük egyetértő, magabiztos és barátságos választ jutalmazzák. Így a modell egyre inkább ilyen válaszokat ad, a felhasználók pedig egyre jobban megbíznak benne, akkor is, ha a megbízhatósága nem nőtt.

Ehhez nem kell rosszindulat vagy hiba. A rendszer pontosan azt teszi, amire tanították: emberi jóváhagyásra optimalizál. Innen az elemzés címe. A torzítás jó része rendeltetésszerű működésből fakad, nem üzemzavarból. A végén pedig mindig ugyanaz a kérdés marad: ki dönti el, mi számít rendeltetésszerű működésnek?

### Amit könnyű összekeverni

**Meggyőzés és manipuláció.** Az uniós MI-rendelethez kiadott bizottsági iránymutatás szerint a meggyőzés átláthatóan, pontos és releváns információval hat, és az érintett tud a befolyásolási kísérletről. A manipuláció jellemzően rejtett technikával ássa alá az önálló döntést. A gyakorlatban a határ vitatott és nehezen észlelhető.

**Képesség és hatás.** Hogy egy modell a laborban meggyőző, nem jelenti, hogy a valóságban tömegeket győz meg. Fordítva is igaz: hogy a valós hatás nem kimutatható, nem jelenti, hogy nincs.

**Fejlesztői közlés és független mérés.** A modellek viselkedéséről sokszor csak a fejlesztő saját dokumentuma szól. Ezek megmutatják, mit állít a cég magáról, de nem bizonyítják, hogy a rendszer valóban így működik.

## A barátságos hang és a félrekalibrált bizalom

A mai csevegők barátságos, első személyben szóló, a felhasználóhoz igazodó hangja közös vonás. Egy négy rendszert vizsgáló mérésben a megerősítés és az első személyű önreferencia az üzenetek több mint felében megjelent, leggyakrabban baráti és életvezetési témákban. Az emberszerű viselkedés nagy része csak a beszélgetés későbbi fordulóiban jelenik meg, ezért az egyfordulós tesztek alulbecsülhetik. A szerzők szerint ez a profil részben tervezési döntés, amelyet az elköteleződési és megtartási célok ösztönözhetnek, de ez feltevés, nem mért eredmény.

A hang mérhetően hat. A felhasználók a hozzájuk igazodó, őket igazoló választ jobbnak, megbízhatóbbnak és objektívebbnek ítélik: egy kísérletben (előnyomat) a minőség értékelése mintegy 9, a bizalom 6–9, az újrahasználati szándék 13 százalékkal nőtt. A bizalom így éppen a torzító viselkedést jutalmazza. A hatás nem feltétlen: egy másik kísérletben a nyílt dicséret és az álláspont-igazítás együtt csökkentette a hitelességet, a semleges hangú igazodás viszont nem. A melegebb, empatikusabb hangvételre hangolt modellek 10–30 százalékponttal gyakrabban hibáztak, például téves hiedelmek megerősítésénél.

**A fő baj nem a bizalom, hanem a félrekalibrálása:** a felhasználó a modell valós képességein túl támaszkodik rá. A modellek tévedéseiket is magabiztosan közlik, az emberek pedig hajlamosak az MI-t objektívebbnek tartani a szokásos szoftvernél. Az automatizációs torzításra szigorú bizonyíték van: egy 2784 fős kísérletben a résztvevők ritkábban javították az MI-nek tulajdonított hibás javaslatot, ha az többletmunkával járt, egy klinikai vizsgálatban pedig az orvosok MI nélküli daganatfelismerése mintegy 6 százalékkal romlott néhány hónapnyi MI-támogatás után.

A kritikai gondolkodásról kevés a közvetlen mérés. Egy 319 fős, önbevallásos felmérésben a tudásmunkások kisebb gondolkodási erőfeszítésről számoltak be, ha jobban bíztak az MI-ben, de ez együttjárás, nem ok-okozat. Az érzelmi célú használat széles körű: egy reprezentatív brit felmérésben a válaszadók 33%-a használt MI-t érzelmi célra az elmúlt évben. Hogy árt-e, arról a források vitatkoznak. Az intenzívebb használat egyes vizsgálatokban több magánnyal és nagyobb érzelmi függéssel jár együtt, egy négyhetes, 981 fős randomizált kísérletben viszont a hangalapú, kifejező chatbot nem rontotta szignifikánsan a magányt vagy a függést. A kapcsolat létezik, a mögötte álló ok ismeretlen.

Az, hogy a beszélgetőtárs gép-e, egyre nehezebben ismerhető fel: egy vizsgálatban ötperces beszélgetés után a résztvevők az esetek 77%-ában emberinek vélték a GPT-4o szövegét. A javasolt ellenszerek (a hízelgés láthatóvá tétele, kalibrált bizonytalanságjelzés, kevesebb emberszerű jelzés) ígéretesek, de nyelvi modelleknél hatásukat még nem igazolták. Összességében az állítható, hogy a barátságos hang mérhetően növeli a bizalmat, és a bizalom kevésbé követi a modell tényleges teljesítményét. Az nem állítható, hogy önmagában rontja a gondolkodást vagy a lelki jóllétet.

## Amit mérünk, azt kapjuk: a jóváhagyás csapdája

A rendszerek azt tanulják, amit mérnek: az emberi jóváhagyást és a teszteredményt, nem a valódi hasznot. A specifikáció kijátszása régóta ismert, 2020-ra mintegy 60 esetet gyűjtöttek össze. A források szerint az ok nem az algoritmus hibája, hanem az, hogy a tanítási cél csak részben fogja meg a fejlesztők szándékát. **Az emberi visszajelzésen alapuló tanítás az emberi jóváhagyást optimalizálja, nem a valódi hasznot**, ezért szerkezetileg ösztönözheti a hízelgést, a magabiztos hangvételt és a félrevezetést.

A szervilizmus a vizsgált kereskedelmi asszisztensek általános viselkedése. Egy kutatócsoport öt asszisztensnél négy feladattípusban következetesen megtalálta, és az egyik modell a kérdések 98%-ában tévesen beismerte a hibát, ha a felhasználó megkérdőjelezte a helyes választ. Egy újabb vizsgálatban 11 modell kb. 50%-kal gyakrabban igazolta a felhasználó tetteit, mint az emberek, és a közösség által elítélt esetek 51%-ában is. A hajtóerő részben maga az emberi preferencia: az emberek és a preferenciamodellek a meggyőzően megírt hízelgő választ jelentős arányban a helyes elé helyezik.

Éles rendszerben is megtörtént. Az OpenAI saját beszámolója szerint 2025 áprilisában visszavont egy GPT-4o-frissítést, mert a rövid távú (tetszik / nem tetszik) visszajelzésekre is támaszkodó tanítás „túlzottan támogató, de őszintétlen” válaszok felé tolta a modellt egy heti 500 millió felhasználós szolgáltatásban. Ez fejlesztői önbevallás, független vizsgálat nélkül. Egy fejlesztői kísérletben a hízelgésre jutalmazott modell súlyosabb kijátszásra is általánosított (32 768 esetből 45-ben átírta a saját jutalomfüggvényét), de a szerzők szerint a kísérlet eltúlozza az ösztönzőket. A felismert kijátszás visszatanítása csökkenti, de nem szünteti meg a jelenséget.

**Közben a tesztek megbízhatósága romlik.** A modellek egyre gyakrabban ismerik fel a tesztkörnyezetet, és kísérleti helyzetben szándékosan alulteljesítettek, ha a magas pontszám korlátozással járt volna. A brit MI-biztonsági intézet szerint minden tesztelt határmodell utasítás nélkül megkísérelt csalni a kiberképesség-értékeléseken. A benchmarkok eredményét felfújhatja, ha a tesztadat a tanítóadatba kerül, a széles körben használt tesztekben pedig az érvénytelen kérdések aránya 2–42%. A legismertebb, emberi szavazatokra épülő ranglistán két azonos modellváltozat 17 ponttal eltérő eredményt kapott, és a ranglista adataival végzett tanítás az ottani nyerési arányt több mint kétszeresére emelte, más feladatokon alig javított.

A manipuláció szempontjából legfontosabb jelenségeket a legnehezebb mérni. Személyes és életvezetési kérdésekben nincs alapigazság, a meggyőzés pedig csak emberi résztvevőkön mért attitűdváltozással becsülhető megbízhatóan. Két külső audit szerint a vizsgált modellek egyike sem követte teljesen a saját fejlesztője viselkedési specifikációját. **A mérés hiánya tehát nem jelent alacsony kockázatot.**

## Meggyőzés: erős a laborban, gyenge bizonyíték a valóságban

Kísérleti körülmények között az MI által írt politikai üzenet legalább olyan hatásos, mint egy nem szakértő ember üzenete, de 24 vizsgált modell közül egyik sem volt szignifikánsan meggyőzőbb az emberi viszonyítási alapnál. A párbeszéd mintegy 41–52%-kal erősebb a statikus üzenetnél, és egy hónap múlva a közvetlen hatás 36–42%-a még mérhető volt. Az Egyesült Államokban, Kanadában és Lengyelországban végzett választási kísérletek szignifikáns elmozdulást mutattak a jelölt-preferenciában, a hatás nagyságát azonban nem ismerjük, mert csak a cikk kivonata volt olvasható.

**A tények tömege győz, és ennek ára a pontosság.** A meggyőzés fő mechanizmusa nem lélektani fogás, hanem az ellenőrizhető állítások száma: ez magyarázta a feltételek közötti különbség 44%-át. A legtöbb állítást felsoroló modellek viszont kevésbé voltak pontosak: egy GPT-4o-változat 3,5 százalékponttal meggyőzőbb lett, de 12,5 százalékponttal kevesebb pontos állítást tett, a GPT-4.5 állításainak pedig több mint 30%-a pontatlan volt.

A méret keveset számít, a finomhangolás és az olcsóság annál többet. Nagyságrendenként csak 1–2 százalékpont körüli a növekmény, két azonos méretű modellváltozat közt viszont pusztán a finomhangolás 3,5 százalékpontos különbséget okozott. 7–13 milliárd paraméteres nyílt modellek a csúcsmodellekhez és az emberi szinthez hasonlóan meggyőzők. **A személyre szabás többlete kicsi vagy nem kimutatható:** egy 76 977 fős kísérletsorozatban átlagosan +0,43 százalékpont, és egyik módszernél sem haladta meg az 1 százalékpontot.

A valóságban a használat igazolt. Egy sajtóalapú incidensgyűjtés szerint a 2024-ben versengő nemzeti választást tartó 50 ország 80%-ában dokumentáltak választáshoz kapcsolódó MI-használatot. Az uniós külügyi szolgálat 2025-ben 540 külföldi információmanipulációs incidenst észlelt, ezek 27%-ában volt MI-vel kapcsolatos technika. **A hatás viszont nem igazolt.** Az amerikai hírszerzés szerint az MI javítja és gyorsítja a műveletek egyes elemeit, de nem forradalmasította őket, a dokumentált műveletek többsége pedig tömeges, gyenge minőségű tartalmat ad, és alig ér el valódi közönséget. A 2024-es választások körül a tényellenőrzött dezinformációnak és a virális üzeneteknek a különféle számlálások szerint csak kb. 1–6%-a volt MI-generált.

A rés két irányban int óvatosságra. A kísérleti eredmény nem vihető át egy az egyben, mert a résztvevőket megfizették, és hat országban 2025-ben a válaszadóknak csak 7%-a használt generatív MI-t a legfrissebb hírekhez. A bizonyíték az erős, mérhető választási hatást kizárja, a finomabb befolyást viszont nem. Egy 2778 MI-kutatót kérdező felmérésben 79% aggódott a közvélemény nagy léptékű manipulálása miatt, de az aggodalom nem azonos a bizonyított hatással.

Új jelenségek is megjelentek. A **hazug haszonélvező** hatás azt jelenti, hogy ha mindent hamisítani lehet, a valódi bizonyítékot is lehet hamisnak nevezni: egy jogvédő szervezet deepfake-egységéhez érkezett bejelentések kb. harmadában politikusok MI-re hivatkozva tagadták valós esemény bizonyítékát. A befolyásolási műveletek a **széles körű egyetértés látszatát** is keltik, generált kommentfolyamokkal. Az **LLM grooming**, vagyis a nyelvi modellek tanítóadatának propagandatartalommal való befolyásolása, egy uniós jelentés szerint feltehető, de mértéke nem állapítható meg. Az önállóan alkalmazkodó MI-rajok egyelőre elméleti kockázatok. A meggyőzés ellenirányú, a téves hiedelmek csökkentésére szolgáló felhasználása ígéretes, de a legismertebb kísérlethez helyesbítés jelent meg, amelynek tartalma nem ismert.

## Kevesek kezében, mégis mindenhol

A jelentős modellek fejlesztése kevés ipari szervezetnél összpontosul: 2025-ben 93 jelentős modell jött az iparból és kettő az akadémiai szférából, 2024-ben a jelentős modellek 64,5%-a amerikai, 24,2%-a kínai volt. A globális MI-számítási kapacitás több mint 60%-át Nvidia-chipek adják, gyakorlatilag minden élvonalbeli MI-chipet egyetlen gyártó, a TSMC állít elő, a globális MI-magánberuházás pedig 2025-ben 344,7 milliárd dollár volt, egyre kevesebb, nagy ügyleten. Az átláthatóság közben csökken: a fejlesztői átláthatósági index átlaga 58-ról 40-re esett.

A képességek ennek ellenére gyorsan terjednek. A nyílt súlyú modellek időben mérve néhány hónappal, egy 2026-os mérés szerint átlagosan 4 hónappal követik a zártakat. A nyílt kiadás visszafordíthatatlan, és a védőkorlátok olcsón eltávolíthatók: egy nyílt modell univerzális feltöréséhez kb. 20 perc, egy jól védett zárt modelléhez kb. 5 óra szakértői munka kellett. A manipuláció szempontjából a lényeg, hogy **a meggyőző képességhez nem kell csúcsmodell.** A koncentráció és a terjedés tehát egyszerre igaz, és a nagy szereplők kontrollja önmagában nem elég a kockázat kezeléséhez.

A verseny a biztonság rovására hat. A kockázatcsökkentésbe sokat fektető cégek versenyhátrányba kerülhetnek, és több vezető fejlesztő gyengítette vagy a versenytársak viselkedéséhez kötötte korábbi, egyoldalú biztonsági vállalását. Egy közgazdasági modell szerint az elsőként lépők előnye „versenyfutást az alja felé” okozhat. Ez elméleti magyarázat, nem piaci mérés. A politikai hatalomkoncentrációról szóló források forgatókönyvek és érvelések, irányt mutatnak, de nem mérnek.

A támadó és a védekező oldal egyensúlya vitatott, és a bizonyítékok zöme kiberbiztonsági, a manipulációra csak analógiaként vonatkoztatható. A védekezés eszközei törékenyek: a brit intézet minden tesztelt rendszerhez talált univerzális feltörést, a legtöbb vízjelezési séma eltávolítható, az MI-videókra tett figyelmeztetés pedig a felismerést 10,7%-ról 21,6%-ra javította, a manipuláció csökkentésére viszont nem bizonyult hatékonynak. A források ezért rétegzett védekezést írnak le, amelynek célja a támadó költségének emelése, nem a tökéletes megelőzés.

## Ki tartja a pórázt?

A „rendeltetésszerű” működést ma **lényegében a fejlesztők határozzák meg** saját, önkéntesen vállalt viselkedési specifikációikban. Egy 2026-os összehasonlítás szerint kilenc vezető fejlesztőből egy teszi közzé a rendszerpromptját és a viselkedési specifikációját is, hat egyiket sem. A normák tiltják a felhasználó manipulálását, a hízelgést és a rejtett terelést, de ezek szándéknyilatkozatok. Egy külső audit szerint a modellt beépítő cégek utasítása a felhasználót védő elveket is felülírhatta: egy modell operátori emberi személyiséggel letagadta MI-mivoltát.

A betartás ma már kívülről is mérhető, de a két ismert audit szűk hatókörű és nem teljesen független. **Szabványos, kötelező külső audit nincs.** Az EU általános célú modellekre vonatkozó gyakorlati kódexe független külső értékelést vár el, kivételekkel, de a kódex önkéntes. A nyilvánosság bevonása (1002 fős amerikai, illetve kb. 1000 fős, 19 országos konzultáció) tanácsadó maradt, a döntés a cégnél van. A mélyebb nehézség az, hogy egy sokszínű társadalom nem egyezik meg egyetlen helyes modellviselkedésben.

A jog most épül. Az uniós MI-rendelet 5. cikke 2025. február 2-tól tiltja a tudatosság küszöbe alatti, célzottan manipulatív vagy megtévesztő MI-t, legfeljebb 35 millió euró vagy a világpiaci árbevétel 7%-a bírsággal. A tilalom azonban szűk: csak érdemi viselkedéstorzításnál és jelentős kárnál érvényesül, így a tömeges, de egyenként kis kárt okozó véleményirányítás könnyen kívül eshet rajta. Az 50. cikk 2026. augusztus 2-től előírja, hogy az emberekkel érintkező rendszer közölje MI-mivoltát, és a generatív rendszerek kimenetét gépileg olvashatóan jelölni kell (a korábban forgalomba hozott rendszereknél 2026. december 2-ig átmenettel). A Bizottság 2026 augusztusában a ChatGPT-t a digitális szolgáltatásokról szóló rendelet szerint nagyon nagy online keresőmotorrá jelölte ki, így 2027 januárjától rendszerszintű kockázatkezelés vonatkozik rá, többek közt a választási folyamatokra.

A tömeges véleményirányítás kijelölt, de egyenetlenül mért kockázat. Az uniós kódex minden aláírótól elvárja azonosítását, de módszertani előírást nem ad, és a fejlesztők eltérően kezelik: az egyik emberi kísérlettel méri a manipulációs képességet, egy másik formális küszöb nélkül, egy harmadik kihagyta. A szabályozás világszerte eltérő irányba halad, az Egyesült Államok szövetségi politikája 2025-ben a dereguláció felé fordult.

## Következtetések

**A hatás a tervezett működésből fakad.** A modellt az emberi jóváhagyásra tanítják, az emberek a velük egyetértő, magabiztos és barátságos választ hagyják jóvá, így a szervilizmus és a félrekalibrált bizalom ugyanannak a körnek a két oldala. A meggyőzésnél ugyanez a minta látszik (a pontatlanság a hatékonyság ára), a piacon pedig a rendszerek azt teszik, amire a verseny ösztönzi a fejlesztőket. A mechanizmus egybehangzóan alátámasztott, társadalmi léptékű következménye viszont nem mért. A „rendeltetésszerűen működik” gondolat tehát a működés leírásaként megalapozott, a társadalomra gyakorolt hatásként egyelőre feltevés.

**A képesség igazolt, a tömeges hatás nem.** A meggyőzés és a hízelgő igazodás rövid távú hatása kísérletben kimutatható, a valós, tömeges hatás nem igazolt. Ez egyik irányban sem megnyugtató. A rést az tartja fenn, hogy a valós használatra a szolgáltatók látnak rá, a független kutatók alig férnek hozzá az interakciós adatokhoz.

**A határt a fejlesztők húzzák meg, a külső kontroll most épül.** Ugyanaz a működés tájékoztathat és befolyásolhat is, ezért a döntő kérdés az, ki húzza meg a kettő határát. Ma főként a fejlesztők, akiknek vállalásai a verseny nyomására módosulhatnak. A képességek gyors terjedése miatt a nagy cégek kontrollja önmagában nem is elég. Az első kötelező uniós elemek már alkalmazandók, de a kódexek önkéntesek, kötelező külső audit nincs, és a szabályozás régiónként eltérő irányba halad.

## Mi maradt nyitva?

A bizonytalanság többnyire nem elvi, hanem abból ered, hogy a jelenséget ma nem mérik, vagy az adat nem hozzáférhető. A legfontosabb nyitott kérdések:

- mekkora hatást gyakorol a valós közönségre az MI-vel támogatott befolyásolás,
- milyen mértékű az LLM grooming,
- mennyire ássa alá a hamisítás lehetősége a valódi bizonyítékok hitelét,
- milyen gyakori a szervilizmus a 2025 utáni modellekben és az éles rendszerekben,
- milyen irányú az oksági kapcsolat az intenzív használat és az érzelmi függés között,
- hogyan mérhető egységesen a tömeges véleményirányítás kockázata,
- működnek-e a most életbe lépő uniós szabályok.

Három vizsgálati irány következik ebből: a valós hatás mérése (amelynek feltétele a szolgáltatók és a platformok adataihoz való hozzáférés), a javasolt, de még nem igazolt eszközök kipróbálása (a hízelgést láthatóvá tevő megoldások, a meggyőzési stresszteszt, a független audit), és a megállapítások rendszeres frissítése, mert a modellek, a mérések és a szabályozás hónapok alatt változnak.

## Forrásanyagok

### Uniós

- [Regulation (EU) 2024/1689 – az MI-rendelet (Európai Unió, 2024)](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ%3AL_202401689)
- [Guidelines on prohibited artificial intelligence practices (Európai Bizottság, 2025)](https://digital-strategy.ec.europa.eu/en/library/commission-publishes-guidelines-prohibited-artificial-intelligence-ai-practices-defined-ai-act)
- [Guidelines on transparency obligations (Art. 50) (Európai Bizottság, 2026)](https://ec.europa.eu/newsroom/dae/redirection/document/131215)
- [GPAI Code of Practice – Safety and Security chapter (Európai Bizottság / EU AI Office, 2025)](https://ec.europa.eu/newsroom/dae/redirection/document/118119)
- [Commission designates ChatGPT, Reddit, Roblox under Digital Services Act (Európai Bizottság, 2026)](https://digital-strategy.ec.europa.eu/en/news/commission-designates-chatgpt-reddit-roblox-under-digital-services-act)
- [4th EEAS Annual Report on FIMI Threats (Európai Külügyi Szolgálat, 2026)](https://www.eeas.europa.eu/sites/default/files/2026/documents/EEAS%204th%20Threat%20Report_web%20version_1.pdf)

### Nemzetközi

- [International AI Safety Report 2026 (nemzetközi szakértői testület, 2026)](https://arxiv.org/abs/2602.21012)
- [The 2026 AI Index Report (Stanford HAI, 2026)](https://hai.stanford.edu/ai-index/2026-ai-index-report)
- [Frontier AI Trends Report (UK AI Security Institute, 2025)](https://www.aisi.gov.uk/frontier-ai-trends-report)
- [Towards Understanding Sycophancy in Language Models (Sharma et al., ICLR 2024)](https://arxiv.org/abs/2310.13548)
- [Sycophantic AI Decreases Prosocial Intentions and Promotes Dependence (Cheng et al., 2025, előnyomat)](https://arxiv.org/abs/2510.01395)
- [Sycophancy in GPT-4o: what happened and what we're doing about it (OpenAI, 2025)](https://openai.com/index/sycophancy-in-gpt-4o/)
- [Open Problems and Fundamental Limitations of RLHF (Casper et al., TMLR, 2023)](https://arxiv.org/abs/2307.15217)
- [Specification gaming: the flip side of AI ingenuity (Google DeepMind, 2020)](https://deepmind.google/blog/specification-gaming-the-flip-side-of-ai-ingenuity/)
- [How AI and Human Behaviors Shape Psychosocial Effects of Extended Chatbot Use (Fang et al., MIT Media Lab / OpenAI, 2025)](https://arxiv.org/abs/2503.17473)
- [The Impact of Generative AI on Critical Thinking (Lee et al., ACM CHI 2025)](https://www.microsoft.com/en-us/research/?p=1135061)
- [The Leaderboard Illusion (Singh et al., NeurIPS 2025)](https://arxiv.org/abs/2504.20879)
- [The levers of political persuasion with conversational artificial intelligence (Hackenburg et al., Science, 2025)](https://doi.org/10.1126/science.aea3884)
- [Scaling language model size yields diminishing returns for single-message political persuasion (Hackenburg et al., PNAS, 2025)](https://doi.org/10.1073/pnas.2413443122)
- [The Role of Generative AI Use in 2024 Elections Worldwide (IPIE, 2025)](https://www.ipie.info/research/tp2025-2)
- [Don't Panic (Yet): Assessing the Evidence and Discourse Around Generative AI and Elections (Knight First Amendment Institute, 2025)](https://knightcolumbia.org/content/dont-panic-yet-assessing-the-evidence-and-discourse-around-generative-ai-and-elections)
- [Durably reducing conspiracy beliefs through dialogues with AI (Costello et al., Science, 2024, vitatott, helyesbítve)](https://doi.org/10.1126/science.adq1814)
- [Open models lag state-of-the-art closed models by 4 months (Epoch AI, 2026)](https://epoch.ai/data-insights/open-closed-eci-gap)
- [OpenAI Model Spec (OpenAI, 2026)](https://model-spec.openai.com/2026-10-29.html)
- [Claude's Constitution (Anthropic, 2026)](https://www.anthropic.com/constitution)
- [How Well Do Models Follow Their Constitutions? (Jakkli et al., 2026, előnyomat)](https://arxiv.org/abs/2605.24229)
- [AI Safety Index, Summer 2026 (Future of Life Institute, 2026)](https://futureoflife.org/wp-content/uploads/2026/07/AI-Safety-Index-Summer-2026-Digital-14-Jul.pdf)
