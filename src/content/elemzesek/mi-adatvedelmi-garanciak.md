---
cím: Odaadjuk, de mi lesz vele?
alcím: Mit vállalnak az MI-szolgáltatók az átadott adatokról, hol szivároghat az adat, mit vár el a jog, és mit tehet egy szervezet, ha baj van – adatkörönkénti döntési javaslattal, tíz szolgáltató nyilvános feltételei alapján.
dátum: 2026-10-31
kategória: MI
téma: MI és adatvédelem
borító: pajzs
kiemelés: 48 óra
kiemelés szöveg: Ennyi időn belül ígér értesítést adatvédelmi incidensről az Anthropic, a tíz vizsgált MI-szolgáltató közül az egyetlen, amely órában vállal határidőt. A többiek szerződése csak annyit mond: „indokolatlan késedelem nélkül”.
szám: 0 | szolgáltató vállal kártalanítást adatvédelmi incidensre
szám: 12 hónap | díjáig felel az OpenAI, az Anthropic és a Mistral, ha baj van
szám: 96 a 190-ből | szolgáltatói vállalás csak súgóban vagy dokumentációban áll, nem szerződésben
szám: 10 | vizsgált szolgáltató
pdf: mi-adatvedelmi-garanciak-v1.0.pdf | 100 oldal
pdf védett: mi-adatvedelmi-garanciak-teljes-v1.0.pdf.enc | 515 oldal | Adatvédelmi garanciák és jogérvényesítés – teljes tanulmány
---

> **Összefoglaló**
>
> - **Üzleti szinten a nagyok nem tanítanak az adatunkkal.** Az OpenAI, az Anthropic, a Google, a Microsoft és az AWS üzleti ajánlatainál közös alapszint, hogy az ügyféltartalommal nem tanítanak modellt, adatfeldolgozóként járnak el, titkosítanak, és független tanúsítvánnyal rendelkeznek. A fogyasztói és ingyenes szint feltételei viszont fejlesztési felhasználást is engedhetnek.
> - **A vállalások fele nem szerződésben áll.** A 190 vizsgált szolgáltatói vállalásból 96 súgóoldalon vagy termékdokumentációban szerepel, például a megőrzést kizáró ZDR és a feldolgozási hely egy része. Hogy ezek a konkrét szerződésben is kötik-e a szolgáltatót, nyilvános forrásból nem állapítható meg.
> - **Ha baj van, kevés a szerződéses fedezet.** Adatvédelmi incidensre egyik szolgáltató sem vállal kártalanítást. Az OpenAI, az Anthropic és a Mistral felelőssége az előző 12 hónap díjára korlátozott, órában mért értesítési határidőt pedig csak az Anthropic ad (48 óra).
> - **A szerződés a tervezett adathasználat ellen véd.** A tanítás, a megőrzés és az alfeldolgozók ügyében erős. A támadások, a hibák, az EU-n kívüli feldolgozás, a külföldi hatósági hozzáférés és a nem engedélyezett eszközhasználat ellen alig vagy egyáltalán nem.
> - **A kitettség a szervezetnél marad.** Az érintettel szemben adatkezelőként a szolgáltatóért is felel, az uniós bíróság pedig a bizonyítási terhet is rá rakja. A hatósági bírság nem kártérítés.
> - **Feltétel nélkül szinte semmi sem vállalható.** Öt megoldás és négy adatkör 20 párosából egy GO, 13 feltételes GO és 6 NO-GO. Fogyasztói szolgáltatásba egyik adatkör sem való, banktitok a nagy szolgáltatókhoz sem.
> - **A védelem a szerződéskötéskor dől el.** A szolgáltatói hozzáférés szűkítését, a külföldi hatósági megkeresések jelentését, az auditjogot, a tartalék adattovábbítási jogalapot és az órában mért értesítést a szerződésbe kell emelni.

Az elemzés egy 2026 októberében készült megvalósíthatósági tanulmány közérthető, rövidített változata. A tanulmány kizárólag nyilvános, hivatalos forrásokra épül: 153 forrásból, köztük jogszabályokból, bírósági ítéletekből, hatósági anyagokból és a szolgáltatók saját szerződéseiből és dokumentációjából 558, pontos idézettel igazolt megállapítás készült. A szolgáltatói feltételek a 2026. október 28-i, a jogi ütemterv a 2026. október 29-i állapotot tükrözik. Az értékelés szakértői, jogi tanácsadásnak nem minősül, és egy konkrét ajánlat átvilágítását nem helyettesíti. A letölthető PDF a teljes elemzés, forrásonkénti hivatkozásokkal.

## Alapok: miről van szó?

### Miért fontos ez most?

Tegyük fel, hogy egy munkatárs egy hosszú szerződést másol be egy MI-csevegőbe, hogy az összefoglalja. A szöveg ezzel kikerült a gépéről, és egy szolgáltató rendszerébe került. Onnantól nem a szervezet dönti el, hol tárolják, ki látja, és mire használják. Ugyanez igaz a magánemberre is, aki személyes adatot ír be egy ilyen szolgáltatásba.

Felmerül, hogy az átadott adat kiszivároghat-e, jogosulatlan felhasználásra kerülhet-e, például modelltanításra, és mi a teendő, ha mégis baj történik. A kérdés most azért időszerű, mert a szolgáltatók vállalásai eltérnek egymástól, a szabályozás pedig változik.

### Néhány fogalom, amit érdemes tisztázni

**Adatkezelő és adatfeldolgozó.** Az adatkezelő határozza meg, mire és hogyan használják a személyes adatot. Az adatfeldolgozó az ő nevében, az ő utasításai szerint kezeli. MI-szolgáltatás igénybevételekor a szervezet az adatkezelő, a szolgáltató az adatfeldolgozó. A szervezet adatkezelő marad akkor is, ha a szolgáltató adatfeldolgozóként jár el.

**DPA és alfeldolgozó.** A DPA az adatfeldolgozói szerződés (data processing agreement), amelynek minimumtartalmát a GDPR 28. cikke szabja meg. Az alfeldolgozó a szolgáltató által bevont további szolgáltató, például egy analitikai cég. Bevonásához az adatkezelő felhatalmazása kell.

**Fogyasztói és üzleti szint.** Ugyanaz a márka két feltételrendszer alatt érhető el. Üzleti szinten a nagy szolgáltatók vállalják, hogy az ügyféltartalommal nem tanítanak modellt. A fogyasztói vagy ingyenes szinten a fejlesztési felhasználás lehet az alapértelmezés.

**Adatmegőrzés és ZDR.** A közös kiindulópont a 30 napos megőrzés. A zero data retention (ZDR) azt jelenti, hogy a szolgáltató az ügyféltartalmat nem őrzi meg. Nem alapértelmezés, jóváhagyáshoz kötött, és vannak kivételei.

**Feldolgozási hely.** Az EU-régió azt jelenti, hogy a szolgáltatás szerverei az Unióban vannak. A flex routing a Microsoft 365 Copilot funkciója, amellyel csúcsidőszakban a feldolgozás az uniós adathatáron kívül is történhet. A 2026. március 25. után létrehozott jogosult bérlőknél alapértelmezésben be van kapcsolva.

**SCC és DPF.** Az Unión kívülre csak megfelelő jogalappal szabad személyes adatot továbbítani. Az SCC a standard szerződéses kikötések, a DPF az EU–USA adatvédelmi keret. A DPF jogalapja nem végleges, mert a fellebbezés folyamatban van.

**Prompt injection.** Támadás, amelynél a támadó utasítást csempész a modell bemenetébe, akár olyan adatba rejtve, amelyet az alkalmazás előhív. Így védett adat lopható el.

**Négy adatkör, öt megoldás.** Az elemzés négy adatkört értékel külön: személyes adat, üzleti titok, hivatásbeli titok (ügyvédi, orvosi, banktitok), valamint közszféra- és minősített adat. Öt megoldást (konstrukciót) hasonlít össze: fogyasztói szolgáltatás, közvetlen üzleti szolgáltatás ZDR-rel, hyperscaler-platform EU-régióval, EU-s szuverén felhő, helyben futtatott nyílt súlyú modell. A döntési javaslat GO, feltételes GO vagy NO-GO. A feltételes GO nem azt jelenti, hogy ma vállalható, hanem azt, hogy a megjelölt követelmények teljesítése esetén az lesz.

### Hogyan utazik az adat?

Az adat először átkerül a szolgáltatóhoz, titkosítva. Ott feldolgozzák, a szolgáltató pedig további szolgáltatókat vonhat be. Egy ideig megőrzi, és vizsgálja, hogy nem használják-e szabálysértően a szolgáltatást. A szerződés megszűnése után törli. Ha baj történik, a szerződések többnyire csak annyit mondanak, hogy a szolgáltató „indokolatlan késedelem nélkül” értesít. Órában mért határidőt egyedül az Anthropic nevesít, 48 órát.

A szerződés a szolgáltató tervezett adathasználata ellen, vagyis a tanítás, a megőrzés és az alfeldolgozók esetében véd a legjobban. A váratlan hibák, a támadások, a joghatósági kockázatok és a szervezeti viselkedés ellen alig vagy egyáltalán nem.

### Amit könnyű összekeverni

**„Nem tanítanak az adatommal” nem azonos azzal, hogy „nem tárolják, és senki nem látja”.** A tanítási tilalom mellett az adat megmaradhat, és a jelölt tartalmat emberek is átnézhetik. A ZDR-nek is vannak kivételei.

**A súgóoldali vállalás nem szerződéses vállalás.** A 190 szolgáltatói megállapításból 96 nem szerződéses dokumentumra épül. Hogy ezek a konkrét szerződésben is kötik-e a szolgáltatót, nem állapítható meg.

**Az „n. a.” nem azt jelenti, hogy „nem vállalja”.** Forráshiányt jelez: a szerződéses szöveg nincs a vizsgált források között. A négy kisebb európai szolgáltató 72 vállalási hiány-cellájából 50 ilyen.

**A szolgáltató felelőssége nem azonos a szervezet felelősségével az érintettel szemben.** Az érintett felé az adatkezelő szervezet felel, a nevében eljáró adatfeldolgozóért is. A szolgáltatóval szemben viszont a szerződés számít, és az OpenAI, az Anthropic és a Mistral felelőssége az esemény előtti 12 hónapban fizetett díjra korlátozott.

**A bírság nem kártérítés.** A hatósági bírság az érintettnek közvetlenül nem jár, a kártérítés külön út.

## Mit vállalnak ma a szolgáltatók?

Az elemzés tíz szolgáltatót vizsgált: öt nagy MI-szolgáltatót (OpenAI, Anthropic, Google, Microsoft, AWS) és öt európait (Mistral, Aleph Alpha, OVHcloud, STACKIT, IONOS). Összevetési alternatívaként szerepel a helyben futtatott nyílt súlyú modell is (például Llama, Gemma, Qwen, DeepSeek és a Mistral nyílt modelljei).

### Amiben a piac egységes

Üzleti szinten a nagy szolgáltatók alapszintje közös:

- **Nincs tanítás.** Az OpenAI, az Anthropic és a Google szerződéses szövegben, a Microsoft és az AWS termékdokumentációban vállalja, hogy az ügyféltartalmat nem használja modelltanításra. Az OVHcloud, a STACKIT és az IONOS ugyanezt közli.
- **A szolgáltató adatfeldolgozó.** Az ügyfél utasításai szerint jár el, de néhány területen önálló adatkezelő is: a Microsoft az üzleti műveleteinél, a Google a számlázási és használati adatnál, a Mistral a tanításnál és a moderációnál.
- **Alfeldolgozók.** Általános felhatalmazás, előzetes értesítés és kifogási jog a jellemző, a kifogás következménye pedig többnyire a felmondás. A kifogási idő 10 nap a Mistralnál, 15 az Anthropicnál, 30 az OpenAI-nál és 90 a Googlenél.
- **Titkosítás.** AES-256 nyugalmi és TLS 1.2 vagy újabb továbbítási titkosítás az OpenAI-nál és az Anthropicnál kifejezett vállalás.
- **Tanúsítás.** Mind az öt nagy szolgáltatónak van független tanúsítványa vagy auditjelentése (SOC 2, ISO 27001 és társaik). Az ügyfél saját auditja viszont jellemzően korlátozott gyakoriságú, és az ügyfél költségén történik.
- **Az értesítés nincs órához kötve.** A szerződések „indokolatlan késedelem nélküli” incidens-értesítést írnak. Órában mért határidőt csak az Anthropic nevesít: 48 órát.

### Amiben eltérnek

**Megőrzés.** A közös kiindulópont a 30 nap: az OpenAI API-naplói, az Anthropic és a Mistral API-adatai alapértelmezésben ennyi ideig maradnak meg. A szabálysértőnek jelölt tartalom tovább marad: az Anthropicnál a beszélgetések legfeljebb 2 évig, a besorolási pontszámok legfeljebb 7 évig. A szerződés megszűnése utáni törlés 30 nap az OpenAI-nál és az Anthropicnál, 90 az AWS-nél, 90 + 90 a Microsoftnál és legfeljebb 180 nap a Googlenél.

**ZDR.** A megőrzést kizáró opció ritkán alapértelmezés. Az OpenAI-nál jóváhagyáshoz kötött, az Anthropicnál jóváhagyással egyes ügyfeleknek elérhető, a Mistralnál csak állapotmentes hívásokra szól. Az AWS egyik programjának ZDR-je csak 2026. december 31-ig érvényes, a Microsoft forrásaiban pedig ZDR-vállalás nincs. A felsorolt ZDR-vállalások mind súgóoldalakon állnak, nem a szerződésben.

**Feldolgozási hely.** Az OpenAI API-nál az USA vagy Európa választható. A Google szerződése szerint az adat bármely olyan országban feldolgozható, ahol létesítménye van, a listás szolgáltatásoknál viszont régió választható. A Microsoft EU Data Boundary-je az Unióban tartja az adatot, de a Microsoft 365 Copilot flex routingja csúcsidőszakban kiviheti onnan a feldolgozást. Az Anthropic forrásaiban földrajzi vállalás nincs.

**Felelősség és kártalanítás.** Az OpenAI, az Anthropic és a Mistral felelőssége az esemény előtti 12 hónapban fizetett díjra korlátozott. Szellemi tulajdoni igényekre mind a hat szerződéses szolgáltató ad kártalanítást, a generált kimenetre kifejezetten az Anthropic, a Google, a Microsoft és az AWS. **Adatvédelmi incidens miatti kártalanítást viszont egyik sem vállal.**

| Szolgáltató | Alfeldolgozói kifogás | Törlés a szerződés után | Felelősségi plafon | Órában mért értesítés |
|---|---|---|---|---|
| OpenAI | 30 nap | 30 nap | 12 havi díj | nincs |
| Anthropic | 15 nap | 30 nap | 12 havi díj | 48 óra |
| Google | 90 nap | legfeljebb 180 nap | nem állapítható meg | nincs |
| Microsoft | – | 90 + 90 nap | nem állapítható meg | nincs |
| AWS | – | 90 nap | nem állapítható meg | nincs |
| Mistral | 10 nap | – | 12 havi díj | nincs |

*A „–” azt jelzi, hogy a vizsgált forrásokban erre nincs megállapítás. A „nem állapítható meg” azt, hogy a teljes felelősségi szabály nem szerepel a nyilvános forrásokban.*

### Fogyasztói és üzleti: ugyanaz a márka, két szabálykönyv

Az OpenAI fogyasztói feltételei szerint a tartalom fejlesztésre is felhasználható, kilépni a beállításokban lehet, és a feltételek emberi felülvizsgálatot is említenek. Az Anthropic uniós fogyasztói feltételei szerint a tanítás a kilépésig alapértelmezett, és a felhasználói visszajelzéssel vagy biztonsági jelöléssel érintett tartalom kilépés mellett is tanításra kerülhet. A Google ingyenes Gemini API szintje a tartalmat termékfejlesztésre használja, és emberi felülvizsgálók is olvashatják. A szabályok tehát az ajánlati szinthez kötődnek, nem a márkához vagy a modellhez.

### Az európai szolgáltatók

A Mistral az egyetlen európai szolgáltató, amelynek szerződése és adatfeldolgozói szerződése is nyilvános. Szerkezete a nagyokéhoz hasonló, egy fontos eltéréssel: a DPA szerint a Mistral önálló adatkezelőként tanításra is használhatja a személyes adatot, ha az ügyfél nem lépett ki. Az Aleph Alpha, az OVHcloud, a STACKIT és az IONOS esetében csak termékdokumentáció, közlemény vagy tanúsítványoldal érhető el. Közös elemük az európai infrastruktúra, és több szolgáltató megőrzés nélküli működést közöl. A vállalásaik jelentős része azonban nyilvános forrásból nem ítélhető meg, mert a szerződéses szöveg hiányzik. Ez nem azt jelenti, hogy kevesebbet vállalnak.

## Hol szivároghat az adat?

Az elemzés 19 kockázatot azonosított, négy csoportban:

- **a szolgáltató rendes működése:** tanítás, megőrzés, emberi hozzáférés, a ZDR korlátai, alfeldolgozók, titkosítási rések, fogyasztói szint,
- **földrajz és joghatóság:** feldolgozás az EU-n kívül, külföldi hatósági hozzáférés, a DPF bizonytalansága,
- **technikai támadás és hiba:** prompt injection, kiszivárogtatás a kimeneten át, dokumentumkereső (RAG) rendszerek, a tanítóadat visszanyerése, ellátási lánc, az ügyfelek közötti elkülönítés hibája, rosszul beállított adatbázis,
- **a szervezet maga:** nem engedélyezett eszközök használata és a szolgáltatói feltételek átvilágításának elmaradása.

### Ami már megtörtént

A vizsgált források négy dokumentált incidenst rögzítenek. Az OpenAI 2023-as gyorsítótár-hibája miatt egyes felhasználók más felhasználók csevegéseinek címeit látták, a ChatGPT Plus előfizetők 1,2%-ánál pedig fizetési adat is látható lehetett. A Microsoft 365 Copilot egyik sérülékenysége (CVE-2025-32711) lehetővé tette, hogy támadó hálózaton át információt szerezzen, a Microsoft szerint a hibát elhárította, és kihasználását nem jelezték. Az OpenAI egyik analitikai alfeldolgozójánál, a Mixpanelnél történt behatolás 2025-ben ügyfélazonosítókat és analitikai adatot érintett, tartalmat nem. A negyedik eset, egy DeepSeek-adatbázis kitettsége, csak független kutatói jelentésben szerepel.

A tanulság: az ügyfelek közötti elkülönítés hibája a vezető szolgáltatónál is bekövetkezett, és az ügyfél nem tudta megelőzni. Az indirekt injekció pedig a felhasználó hibája nélkül is adatot szerezhet.

### A hét legsúlyosabb kockázat

| Kockázat | Mi ellen véd a szerződés? |
|---|---|
| Fogyasztói vagy ingyenes szint használata | Az üzleti szint tanítási tilalma véd, de csak ha a munkatárs valóban az üzleti szinten dolgozik. |
| Feldolgozás az EU-n kívül | Részben: régióválasztás van, de az alapértelmezett kivételek (flex routing, globális telepítés, keresztrégiós feldolgozás) ellen nem véd. |
| Prompt injection | Nem véd, ilyen szolgáltatói vállalás nincs. |
| Az ügyfelek közötti elkülönítés hibája | A megelőzést nem garantálja, csak az értesítést szabályozza. |
| Alfeldolgozói lánc | Részben: van helytállás és kifogási jog, de a kifogás következménye többnyire a felmondás. |
| Külföldi hatósági hozzáférés | Nem véd, a hatósági kérelmek kezelésére szolgáltatói vállalás nincs. |
| Nem engedélyezett eszközök használata | Nem véd, ez a szervezet feladata. |

A francia kiberbiztonsági hatóság (ANSSI) szerint egyes államok területen kívüli hatályú jogszabályai kibertámadás nélkül is hozzáférést adhatnak a felhőben tárolt adatokhoz. Ugyanez a hatóság azt ajánlja, hogy nyilvános generatív MI-szolgáltatásnak érzékeny adatot semmiképp ne küldjenek. A magyar adatvédelmi hatóság (NAIH) a bankok MI-használatáról szóló jelentésében a jóváhagyás nélküli MI-használatot („shadow AI”) adatbiztonsági kockázatnak nevezi.

## Mit vár el a jog?

### Az alap: a GDPR szerinti szerződés

A GDPR 28. cikke megmondja, mit kell tartalmaznia az adatfeldolgozói szerződésnek: a szolgáltató csak írásbeli utasításra kezelheti az adatot, alfeldolgozót csak felhatalmazással vonhat be, az auditokhoz információt ad, a szolgáltatás végén töröl vagy visszaad, és a kockázattal arányos biztonsági intézkedéseket tesz. Incidensnél indokolatlan késedelem nélkül értesít. Az ismert 72 órás bejelentési határidő az adatkezelőt, vagyis a szervezetet terheli, a szolgáltatóra a GDPR órában mért határidőt nem ír elő.

### Magyar és ágazati szigorítások

- **Bankoknál** a Hpt. szerint kiszervezéskor a szerződésnek tartalmaznia kell a belső ellenőrzés, az adatvédelmi tisztviselő, a könyvvizsgáló és a Felügyelet ellenőrzési jogát. Az MNB a felhőszolgáltatásokról szóló ajánlásában a kárral arányos biztosítékot és a kártérítés szerződéses rögzítését is elvárja. Nyitott jogi kérdés, hogy az MI-szolgáltatás igénybevétele kiszervezésnek minősül-e.
- **Ügyvédeknél** a Magyar Ügyvédi Kamara szakmai álláspontja szerint az MI-szolgáltató adatfeldolgozóként igénybe vehető, az ügyfél jóváhagyása nem törvényi követelmény, de a szerződésnek ki kell zárnia a modellképzést és a saját célú felhasználást.
- **Egészségügyben** az orvosi titkot az adatfeldolgozó is köteles megtartani, az egészségügyi adat pedig különleges kategóriás személyes adat.
- **A közszférában** a kiberbiztonsági törvény hatálya alá tartozó szervezet nem privát felhőt vagy külföldi adatkezelést csak adatosztályozás, költség-haszon elemzés és kilépési terv alapján választhat, és a kiberbiztonsági incidensről 24 órán belül első bejelentést kell tennie.
- **Minősített adat** csak a Nemzeti Biztonsági Felügyelet engedélyével, személyi biztonsági tanúsítvánnyal rendelkező felhasználóknak kezelhető.

### Adattovábbítás: a DPF bizonytalansága

Az Unión kívülre személyes adatot megfelelőségi határozat vagy megfelelő garanciák, például standard szerződéses kikötések (SCC) alapján lehet továbbítani. Az USA-ba irányuló továbbítás egyik alapja az EU–USA adatvédelmi keret (DPF). Ezt az Európai Unió Törvényszéke 2025. szeptember 3-án a Latombe-ügyben fenntartotta, a fellebbezés azonban 2025. október 31. óta folyamatban van (C-703/25 P). A Bizottság a határozatot fel is függesztheti. Az OpenAI, az Anthropic, a Microsoft és a Mistral SCC-re épít, a Microsoft DPF-tanúsítvánnyal is rendelkezik.

### Mi változik?

- Az uniós MI-rendelet (AI Act) általános alkalmazási kezdőnapja 2026. augusztus 2. volt, a III. melléklet szerinti nagy kockázatú rendszerekre 2027. december 2-től, az I. melléklet szerintiekre 2028. augusztus 2-től alkalmazandók a követelmények.
- Az új termékfelelősségi irányelv a 2026. december 9. után forgalomba hozott termékekre vonatkozik, és a szoftvert is terméknek tekinti. Az MI-felelősségi irányelv javaslatát visszavonták.
- A Data Act szerint 2027. január 12-től a szolgáltatóváltásért nem lehet díjat kérni.
- A digitális omnibusz-csomag, a felhő-szuverenitási javaslat és a Kiberbiztonsági Aktus felülvizsgálata még nem hatályos.

A lényeg: a forrásokban nincs olyan hatályos vagy közelgő kötelező változás, amely a legsúlyosabb szerződéses hiányokat, a felelősségi plafont és a kártalanítás hiányát közvetlenül megszüntetné. Ezek kezelése a szervezet szerződéses és beszerzési feltételein múlik.

## Mi elég és mi kevés?

Az elemzés 18 vállalási hiányt vizsgált mind a tíz szolgáltatónál. Egy vállalás akkor elég, ha a szervezet számíthat rá, amikor baj van: szerződésben áll, alapértelmezett, ellenőrizhető, és felelősség áll mögötte. A 180 cellából 13 elégséges, legtöbb az Anthropicnál (5), az OpenAI-nál (3) és a Googlenél (3). Egyetlen hiány összesített értékelése sem elégséges.

| Szolgáltató | Elégséges | Részben elégséges | Elégtelen | Nincs vállalás | Forráshiány |
|---|--:|--:|--:|--:|--:|
| OpenAI | 3 | 7 | 6 | 2 | 0 |
| Anthropic | 5 | 5 | 4 | 4 | 0 |
| Google | 3 | 10 | 2 | 2 | 1 |
| Microsoft | 1 | 10 | 3 | 4 | 0 |
| AWS | 1 | 11 | 2 | 3 | 1 |
| Mistral | 0 | 8 | 5 | 3 | 2 |
| Aleph Alpha | 0 | 4 | 0 | 0 | 14 |
| OVHcloud | 0 | 5 | 0 | 0 | 13 |
| STACKIT | 0 | 5 | 0 | 0 | 13 |
| IONOS | 0 | 8 | 0 | 0 | 10 |

**Ami rendben van:** a tanítási tilalom, a feldolgozói szerep, a törlés és az alapszintű titkosítás szerződéses szinten több szolgáltatónál.

**A legsúlyosabb hiányok a felelősség és a kötőerő körül vannak:** nincs adatvédelmi kártalanítás, a felelősség 12 havi díjra korlátozott, az incidenshatáridő többnyire nincs órában rögzítve, és a vállalások mintegy fele dokumentációra épül. A közszférában 24 órás bejelentési kötelezettség van, ehhez az Anthropic 48 órás vállalása is kevés.

A hiányokra az elemzés 30 minimum-követelménnyel válaszol: 22 a szolgáltatóval, 8 az igénybe vevő szervezettel szemben fogalmaz meg elvárást. 15 közülük jogszabályból következik, 3 hatósági elvárás, 12 szakmai ajánlás. A 22 szolgáltatói követelményből ma hatot teljesít teljesen legalább egy szolgáltató, a többit egyik sem.

## Mit lehet tenni, ha baj van?

Az őszinte válasz: elvben sokat, gyakorlatban keveset.

**A szervezet kettős helyzetben van.** Az érintettel szemben adatkezelőként felel, az Európai Unió Bírósága szerint a nevében eljáró adatfeldolgozó adatkezeléséért is, és a kárt nem háríthatja át arra, aki az irányítása alatt mulasztott. A szolgáltatóval szemben viszont csak megrendelő, aki a szerződés alapján léphet fel. A szervezet tehát az érintettnek akkor is felelhet, ha a szolgáltatóval szemben csak korlátozott igénye van.

**A bírósági gyakorlat az érintettnek kedvez.** A kártérítéshez jogsértés, kár és okozati kapcsolat kell, súlyossági küszöb viszont nincs. Nem vagyoni kár lehet az adatok feletti rendelkezés átmeneti elvesztése és a megalapozott félelem is. A biztonsági intézkedések megfelelőségét az adatkezelőnek kell bizonyítania, és egy harmadik fél támadása önmagában nem mentesíti. A kártérítés kompenzációs, nem büntető.

**A szerződéses út szűk.** A 12 havi díjplafon és az adatvédelmi kártalanítás hiánya korlátozza, hogy a szervezet mennyit kaphat vissza a szolgáltatótól. Azt pedig, hogy hol és melyik jog szerint lehetne a szolgáltatót perelni, a nyilvános források nem árulják el.

**A hatósági út nem kártérítés.** Az olasz adatvédelmi hatóság (Garante) 15 millió eurós bírságot szabott ki az OpenAI-ra, a holland hatóság 30,5 millió eurót a Clearview-ra. Az OpenAI-bírságot egy római bíróság 2026 márciusában hatásköri okból megsemmisítette, mert az ügyet az ír hatóságnak kellett volna vinnie, az érdemi kérdésekben pedig nem döntött. A bírság egyébként sem jár az érintettnek vagy a megrendelőnek.

**Harmadik országbeli szolgáltatónál a jogalap is bizonytalan.** A DPF-et a fellebbezés még megdöntheti, és a szolgáltatók jogválasztási és fórumkikötései nem szerepelnek a nyilvános forrásokban.

A következtetés egyértelmű: **a jogérvényesítés hatékonysága a szerződés megkötésekor dől el.** Három követelmény számít leginkább: az órában mért incidens-értesítés, az adatvédelmi károkat nem kizáró vagy a várható kárral arányos felelősségkorlát, és az adatvédelmi kártalanítás. Az utóbbi kettőt ma egyik szolgáltató sem teljesíti, az elsőt csak az Anthropic, 48 órával.

## Melyik megoldás vállalható?

Az elemzés öt megoldást és négy adatkört vetett össze. A minősített adatot külön kezelte.

| Megoldás | Személyes adat | Üzleti titok | Hivatásbeli titok | Közszféra-adat | Minősített adat |
|---|---|---|---|---|---|
| Fogyasztói szolgáltatás | NO-GO | NO-GO | NO-GO | NO-GO | NO-GO |
| Közvetlen üzleti szolgáltatás (ZDR-rel) | feltételes GO | feltételes GO | NO-GO banktitokra, feltételes GO ügyvédi és orvosi titokra | feltételes GO | NO-GO |
| Hyperscaler-platform EU-régióval | feltételes GO | feltételes GO | NO-GO banktitokra, feltételes GO ügyvédi és orvosi titokra | feltételes GO | NO-GO |
| EU-s szuverén felhő | feltételes GO (forráshiány) | feltételes GO (forráshiány) | feltételes GO (forráshiány) | feltételes GO (forráshiány) | NO-GO |
| Helyben futtatott modell | feltételes GO | GO (saját szerveren) | feltételes GO | feltételes GO | feltételes GO (forráshiány) |

*A közvetlen üzleti szolgáltatás: OpenAI, Anthropic, Google, Mistral közvetlen szerződéssel. Hyperscaler-platform: Azure OpenAI, AWS Bedrock, Google Vertex AI (ide soroltuk a Microsoft 365 Copilotot is). EU-s szuverén felhő: OVHcloud, STACKIT, IONOS, Aleph Alpha.*

**Miért NO-GO a fogyasztói szolgáltatás?** Mert a feltételei fejlesztési felhasználást és emberi felülvizsgálatot engednek, a feldolgozó pedig saját célra nem kezelhet személyes adatot.

**Miért NO-GO a banktitok a nagy szolgáltatóknál?** Mert a banki kiszervezésnél kötelező felügyeleti ellenőrzési jogot egyik szolgáltató sem vállalja, még részben sem.

**Miért NO-GO a minősített adat a külső megoldásoknál?** Ez következtetés, nem kifejezett tilalom: a jog az MI-használatot minősített adatra nem tiltja, de egyik szolgáltató sem vállalja a kezeléséhez szükséges engedélyezési, hozzáférési és ellenőrzési feltételeket.

**Mitől függ a feltételes GO a nagy szolgáltatóknál?** Elsősorban attól, hogy a szervezet a szerződésbe emeli-e, amit ma egyik szolgáltató sem teljesít: a szolgáltató munkatársainak hozzáférését szűk, felsorolt esetekre, a külföldi hatósági megkeresések jelentését, valamint az információadást és az auditjogot. Személyes adatnál ehhez jön az adattovábbítási jogalap tartalékkal, közszféra-adatnál a 24 órás értesítés is. Külső szolgáltató közül személyes adatnál a közvetlen üzleti szolgáltatás, azon belül az Anthropic feltételrendszere a legkedvezőbb, mert a kötelező követelmények közül a legtöbbet, négyet teljesít.

**Miért „forráshiányos” az EU-s szuverén felhő?** Mert a négy szolgáltató szerződéses szövegei nem nyilvánosak. A besorolás ezért feltételes, és a szerződések ismeretében változhat, akár javulhat is.

**A helyben futtatott modell** feltételrendszere a legkedvezőbb, de a kockázatot a szervezetre telepíti: a modellfájlok ellenőrzése, az elkülönítés, a titkosítás és a licencek átvilágítása a saját feladata, a szükséges kapacitásról és költségről pedig a források nem szólnak. A licencek modellenként eltérnek: a Llama 700 millió, a Qwen2.5-72B 100 millió havi aktív felhasználós küszöböt tartalmaz, a Mistral 3 család és a Gemma 4 Apache 2.0, a DeepSeek R1 MIT licencű.

Egyetlen megoldás sem jó mindenre. A külső szolgáltatók átveszik az üzemeltetés terhét, de a szerződéses hiányokat a szerződésben kell pótolni.

## Mit tegyen egy szervezet?

1. **Rögzítse, milyen adatot akar MI-vel feldolgoztatni.** A táblázat melyik cellája érvényes, azon múlik, kezel-e személyes adatot, üzleti titkot, banki, ügyvédi vagy orvosi titkot, illetve közszféra- vagy minősített adatot.
2. **Tiltsa a fogyasztói szintet** munkaadattal, és engedélyezze az eszközöket adatosztályozás alapján.
3. **Kérje be a teljes dokumentációt** a kiválasztott szolgáltatótól szerződés előtt: a teljes adatfeldolgozói szerződést, az alfeldolgozói listát, a tanúsítványok hatókörét, az auditjelentést, a ZDR-jóváhagyást és a régióbeállításokat.
4. **Emelje szerződésbe, ami ma csak a súgóban áll:** a ZDR-t, a megőrzést és a feldolgozási helyet.
5. **Tárgyalja a kulcsfeltételeket:** a szolgáltatói hozzáférés szűk eseteit, a külföldi hatósági megkeresések jelentését, az auditjogot, a tartalék adattovábbítási jogalapot, az órában mért értesítést, valamint a felelősségi plafont és az adatvédelmi kártalanítást.
6. **Készítsen hatásvizsgálatot és kilépési tervet,** a közszférában költség-haszon elemzést is.
7. **Készüljön fel az incidensre:** értesítési lánc, belső határidők, bizonyítékmegőrzés, a szerződési feltételek verzióinak archiválása.
8. **Évente vizsgálja felül a feltételeket.** A szolgáltatók egyoldalúan módosíthatnak, ahogy a flex routing bekapcsolása mutatja, az AWS programszintű ZDR-je 2026. december 31-én lejár, a DPF-ügy pedig még nem zárult le.

A nyitott jogi kérdésekben, például hogy az MI-szolgáltatás kiszervezésnek minősül-e a banki szabályozás szerint, vagy hogy a konkrét használat nagy kockázatú rendszer-e az MI-rendelet szerint, érdemes jogi szakember véleményét kérni.

## Mire figyeljünk az eredmények olvasásakor?

- A besorolások szakértői értékelések, nem számszerű becslések és nem jogi tanácsadás.
- Az elemzés a szolgáltatók standard, nyilvános feltételeit vizsgálta. Az egyedi ügyfélszerződés ennél többet vagy mást is tartalmazhat.
- Az OpenAI, az Anthropic és a Microsoft úgynevezett trust portáljainak tartalma nem volt nyilvánosan elérhető, ezek ismeretében a nagy szolgáltatók értékelése javulhat.
- A négy kisebb európai szolgáltatónál a vállalások nagy része nyilvános forrásból nem ítélhető meg.
- Az elemzés a 2026. október végi állapotot tükrözi, a feltételek azóta változhattak.

## Forrásanyagok

A források lezárásának dátuma: 2026. október 29. Az alábbiak a legfontosabb források, a teljes, 153 tételes jegyzéket a letölthető PDF tartalmazza. Minden hivatkozás az eredeti, hivatalos lelőhelyre mutat.

### Hazai

- [2011. évi CXII. törvény az információs önrendelkezési jogról és az információszabadságról (Nemzeti Jogszabálytár)](https://njt.hu/jogszabaly/2011-112-00-00)
- [2013. évi CCXXXVII. törvény a hitelintézetekről és a pénzügyi vállalkozásokról (Nemzeti Jogszabálytár)](https://njt.hu/jogszabaly/2013-237-00-00)
- [2017. évi LXXVIII. törvény az ügyvédi tevékenységről (Nemzeti Jogszabálytár)](https://njt.hu/jogszabaly/2017-78-00-00)
- [2024. évi LXIX. törvény Magyarország kiberbiztonságáról (Nemzeti Jogszabálytár)](https://njt.hu/jogszabaly/2024-69-00-00)
- [Az MNB 2/2025. (I. 13.) számú ajánlása a felhőszolgáltatások igénybevételéről (Magyar Nemzeti Bank, 2025)](https://www.mnb.hu/letoltes/2-2025-felho-ajanlas.pdf)
- [Jelentés a magyarországi bankok MI-használatáról (NAIH, 2025)](https://naih.hu/adatvedelmi-jelentesek?download=1358:jelentes-magyarorszagi-bankok-mi-hasznalatarol)
- [A MÜK Elnökségének 4/2026. (VII. 13.) szakmai álláspontja (Magyar Ügyvédi Kamara, 2026)](https://www.xn--mk-xka.hu/_files/ugd/1ea598_37d4b4b16ba14985ae27a27aa604b424.pdf)

### Uniós

- [(EU) 2016/679 rendelet, általános adatvédelmi rendelet (GDPR) (Európai Parlament és Tanács, 2016)](https://eur-lex.europa.eu/eli/reg/2016/679/oj)
- [(EU) 2024/1689 rendelet, mesterséges intelligenciáról szóló rendelet (Európai Parlament és Tanács, 2024)](https://eur-lex.europa.eu/eli/reg/2024/1689/oj)
- [(EU) 2023/2854 rendelet, Data Act (Európai Parlament és Tanács, 2023)](https://eur-lex.europa.eu/eli/reg/2023/2854/oj)
- [(EU) 2022/2555 irányelv, NIS2 (Európai Parlament és Tanács, 2022)](https://eur-lex.europa.eu/eli/dir/2022/2555/oj)
- [(EU) 2021/914 végrehajtási határozat, általános szerződési feltételek (SCC) (Európai Bizottság, 2021)](https://eur-lex.europa.eu/eli/dec_impl/2021/914/oj)
- [(EU) 2023/1795 végrehajtási határozat, EU–USA adatvédelmi keret (Európai Bizottság, 2023)](https://eur-lex.europa.eu/eli/dec_impl/2023/1795/oj)
- [C-340/21. sz. ügy, Natsionalna agentsia za prihodite (Európai Unió Bírósága)](https://eur-lex.europa.eu/legal-content/HU/TXT/?uri=CELEX:62021CJ0340)
- [C-683/21. sz. ügy, Nacionalinis visuomenės sveikatos centras (Európai Unió Bírósága)](https://eur-lex.europa.eu/legal-content/HU/TXT/?uri=CELEX:62021CJ0683)
- [C-703/25 P. sz. ügy, Latombe kontra Bizottság, fellebbezés (Hivatalos Lap, 2025)](https://eur-lex.europa.eu/eli/C/2025/6610/oj/eng)
- [EDPB 28/2024. sz. vélemény a mesterségesintelligencia-modellek egyes adatvédelmi kérdéseiről (Európai Adatvédelmi Testület, 2024)](https://www.edpb.europa.eu/our-work-tools/our-documents/opinion-board-art-64/opinion-282024-certain-data-protection-aspects_en)

### Nemzetközi

- [OpenAI Data Processing Addendum (OpenAI, 2025)](https://openai.com/policies/data-processing-addendum/)
- [Anthropic Data Processing Addendum (Anthropic, 2025)](https://www.anthropic.com/legal/data-processing-addendum)
- [Google Cloud Data Processing Addendum (Google)](https://cloud.google.com/terms/data-processing-addendum)
- [Flex routing a Microsoft 365 Copilotban (Microsoft, 2026)](https://learn.microsoft.com/en-us/microsoft-365/copilot/copilot-flex-routing)
- [Mistral AI Data Processing Addendum (Mistral AI, 2026)](https://legal.mistral.ai/terms/data-processing-addendum)
- [March 20 ChatGPT outage: Here's what happened (OpenAI, 2023)](https://openai.com/index/march-20-chatgpt-outage/)
- [Recommendations on hosting sensitive information systems in the cloud (ANSSI)](https://messervices.cyber.gouv.fr/documents-guides/anssi_Recommendations%20on%20hosting%20sensitive%20IS%20in%20the%20cloud.pdf)
- [OWASP Top 10 for LLM Applications 2025 (OWASP, 2025)](https://genai.owasp.org/resource/owasp-top-10-for-llm-applications-2025/)
- [CCBE guide on the use of generative AI by lawyers (CCBE, 2025)](https://www.ccbe.eu/fileadmin/speciality_distribution/public/documents/IT_LAW/ITL_Guides_recommendations/EN_ITL_20251002_CCBE-guide-on-the-use-of-the-use-of-generative-AI-for-lawyers.pdf)
- [A Garante 755/2024. sz. határozata az OpenAI ügyében (Garante per la protezione dei dati personali, 2024)](https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/10085432)
