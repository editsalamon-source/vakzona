---
cím: Előfizetés vagy platform?
alcím: Mit kap egy cég egy MI-gyártó vállalati előfizetésével, és mit tesz hozzá egy saját MI-platform – döntéshozóknak és munkavállalóknak közérthetően.
dátum: 2026-10-08
kategória: MI
téma: Vállalati MI
kiemelés: 10,37%
kiemelés szöveg: a magyar 10+ fős vállalkozások ennyi százaléka használt MI-technológiát 2025-ben, az uniós átlag 19,95% (Eurostat).
szám: 10,37% | a magyar vállalatok MI-használati aránya 2025-ben (EU: 19,95%)
szám: 14,86% | a munkájukhoz generatív MI-t használó magyarok aránya 2025-ben (EU: 15,36%)
szám: 4 | vizsgált vállalati előfizetés
szám: 21 | hivatalos forrás
pdf: vallalati-ai-platform-v1.0.pdf | 94 oldal
---

> **Összefoglaló**
>
> - **A vállalat nem egy MI-terméket vesz, hanem saját MI-belépési pontot hoz létre, ha platformot épít.** Egy Enterprise előfizetésnél a felületet, a funkciókat és a frissítéseket a gyártó szabja meg, a cég csak az admin-beállításokra van korlátozva. A vállalati MI-platform ezzel szemben egy köztes réteg, amelyet a cég maga épít a munkatársak és akár több gyártó modellje közé.
> - **A jogosultság-öröklés jó elv, de kettős élű.** Mind a négy vizsgált gyártó (OpenAI, Anthropic, Google, Microsoft) azt állítja, hogy az MI-eszköz csak azt éri el, amihez a felhasználó egyébként is hozzáférne. Ha azonban a cég jogosultsági rendje már eleve túl tág volt, az MI ezt a hibát nem javítja ki, hanem felnagyítja – erre maga a Microsoft figyelmeztet.
> - **A platform legfontosabb ígérete az, hogy a modell a felszín alatt cserélhető.** A cég nem egyetlen gyártóhoz van kötve, és elvben csökkentheti a költségeit, ha a kérdéseket mindig a legalkalmasabb modellhez irányítja – ez a megtakarítás azonban nem automatikus, folyamatos méréssel és hangolással jár.
> - **A különbség nem éles, hanem fokozatbeli, és gyorsan mozdul.** A négy nagy gyártó Enterprise csomagja ma már konnektorokat, megosztható asszisztenseket és szervezeti szintű „skilleket” is ad – egyre inkább platformszerű funkciókat egy gyártóhoz kötve.
> - **Sem az előfizetés, sem a saját platform nem tesz önmagában „megfelelővé” egy céget.** A jogi és adatvédelmi felelősség mindig a cégé marad, és az uniós MI-rendelet legszigorúbb szabályai csak a nagy kockázatúnak minősülő MI-rendszerekre vonatkoznak, nem egy általános irodai chat-segédre.
> - **Magyarországon a vállalatok mérhetően lemaradva állnak az uniós átlaghoz képest**, miközben a dolgozók egyéni, munkára történő MI-használata közel van az uniós szinthez – ez a két szám mást mér, és nyitott kérdés marad, hol és milyen fiókkal használják a dolgozók azokat az eszközöket, amelyekről a saját cégük nem számol be.

Ez az írás a Vakzóna arról szóló elemzésének rövidített, webes változata, hogy miben különbözik egy MI-modellt gyártó cég vállalati (Enterprise) előfizetése egy saját vállalati MI-platformtól, és melyik szervezetnek mire van szüksége. Az elemzés négy nevesített Enterprise előfizetést vizsgál (ChatGPT Enterprise, Claude Enterprise, a Google Workspace-be épített Gemini, Microsoft 365 Copilot) a gyártók hivatalos, 2026. október 8-i állapotot tükröző leírása alapján, a platform egységeit pedig gyártósemlegesen, szabványokra és szakmai forrásokra épülve. Az elemzés nem termékajánlás, nem rangsorolja a gyártók modelljeinek képességét, és árakat nem közöl. Készítése során MI-eszközöket használtunk, emberi forrásellenőrzéssel.

## Alapok: miről van szó?

### Miért fontos ez most?

Egyre több cég és közintézmény vezeti be a munkatársak kezébe valamilyen mesterséges intelligencia (MI) alapú eszközt. A legtöbb vezető előtt elsőre csak egy kérdés látszik: megrendeljünk-e egy kész, fizetős MI-csomagot. Valójában a döntés ennél több rétegű: nem csak arról kell dönteni, melyik gyártó kész felületét vegyék meg, hanem arról is, hogy a szervezet milyen saját réteget épít a munkatársak és a modellek közé – mert ez határozza meg, ki lát mit a cég adataiból, ki szabja a használat szabályait, és mennyire marad a cég kiszolgáltatva egy gyártónak.

### Néhány fogalom, amit érdemes tisztázni

**Nyelvi modell.** A szöveget felismerő és generáló program, amelyre a mai MI-asszisztensek épülnek. Önmagában csak azt „tudja”, amit a betanítása idején megtanult – a cég friss, saját dokumentumait nem ismeri.

**Vállalati (Enterprise) előfizetés.** Egy MI-modellt gyártó cég kész, munkatársanként fizetett csomagja, egy kész chat-felülettel, a gyártó egy vagy néhány modelljéhez kapcsolva. A felületet, a funkciókat és a frissítéseket a gyártó határozza meg.

**API.** Programozói hozzáférés a modellhez: nem kész felület, hanem egy csatlakozási pont, amelyre egy fejlesztő saját alkalmazást építhet. Olyan, mintha nem kész ruhát vennénk, hanem anyagot, amelyből saját szabó varr ruhát.

**Vállalati MI-platform.** Egy köztes réteg, amelyet a szervezet épít a munkatársak és egy vagy több gyártó modellje közé. A cég nem egy terméket vesz meg, hanem saját MI-belépési pontot hoz létre: ez dönt arról, melyik kérés melyik modellhez kerüljön, milyen céges adat kapcsolódjon hozzá, és mi kerüljön naplózásra.

**Modellkapu és routing.** A platform eleme, amely a kérdést nem egyetlen, előre kiválasztott modellhez küldi, hanem eldönti, melyik a legalkalmasabb – ezt hívják modell-útválasztásnak (routingnak). Olyan, mint egy telefonközpont: a hívó egy számot tárcsáz, a központ dönt a háttérben. A modell a felszín alatt cserélhető: ezt nevezzük absztrakciós rétegnek.

**RAG / céges tudásbázis.** A visszakereséssel kiegészített generálás (retrieval-augmented generation, RAG) azt jelenti, hogy a modell a válasz előtt „belenéz” egy külön tárolt, kereshető céges dokumentumtárba. Olyan ez, mintha egy olvasott kollégát ültetnénk egy céges irattár mellé.

**Jogosultság-öröklés és túlosztás.** A legtöbb vállalati MI-eszköz nem ad plusz hozzáférést, csak azt örökli, amihez a felhasználó egyébként is hozzáférne. Ennek árnyoldala: ha a meglévő jogosultságok eleve túl tágak voltak (túlosztás, oversharing), ezt az MI nem javítja, hanem felhasználja.

**Agent.** Egy célt kapó, önállóan, több lépésben dolgozó MI-segéd: fájlt olvas, rendszerbe belép, dönt a következő lépésről. Egy chat-alapú segéd megír egy választ egy e-mailre, ha bemásolják; egy agent viszont maga beléphet a postafiókba.

**Skill.** Egy mappa, amelyben egy utasítás és esetleg szkriptek, sablonok vannak, és amely egy ismétlődő munkafolyamatot ír le úgy, hogy az agent mindig ugyanúgy végezze el. A cég „hogyan csináljuk nálunk” tudása kerülhet ide, nem egy betanított modellbe, hanem egy olvasható, karbantartható mappába.

**Governance.** A cég nem esetről esetre dönt, mit szabad egy MI-rendszerrel kapcsolatban, hanem előre lefektetett, dokumentált szabályokat épít be: ki milyen modellt használhat, milyen adat mehet ki, milyen feladathoz kell emberi jóváhagyás.

### Hogyan működik egy kérdés útja egy platformon?

A munkatárs beír egy kérdést a belépési ponton. A rendszer megnézi, ki kérdez, és mihez van jogosultsága – ezt a cég meglévő jogosultsági rendszeréből örökli. Megvizsgálja, milyen céges dokumentumok relevánsak, és visszakeresi azokat a tudásbázisból. A modellkapu eldönti, melyik gyártó melyik modelljéhez küldje a kérdést – ezt a felhasználó nem látja. A kiválasztott modell megkapja a kérdést és a szűrt kontextust, és megfogalmazza a választ, amely a visszaküldés előtt áthalad a védőkorlátokon. A teljes folyamat naplózásra kerül, hogy utólag visszakereshető legyen.

### Amit könnyű összekeverni

Az Enterprise előfizetés és az API nem ugyanaz: az előfizetés kész felületet ad, munkatársankénti díjjal; az API egy csatlakozási pont, amelyre saját alkalmazást lehet építeni, és a használat mennyisége szerint számláznak.

„Nem tanítanak az adatainkon” és „senki nem látja az adatainkat” két különböző állítás. A négy vizsgált gyártó mindegyike azt állítja, hogy alapértelmezésben nem használja a céges beszélgetéseket a modell tanítására – de az admin jellemzően naplót, beszélgetéstörténetet láthat.

A platform megléte nem azonos a jogi megfeleléssel: sem egy előfizetés, sem egy saját platform nem tesz önmagában „megfelelővé” egy céget. Az uniós MI-rendelet 26. cikke sem minden MI-használatra vonatkozik, csak a nagy kockázatúnak minősülő rendszerek alkalmazóira – egy általános célú irodai chat-asszisztens önmagában nem tartozik ide.

## Három út: előfizetés, API, platform

„Bevezetjük a mesterséges intelligenciát” a gyakorlatban legalább három, egymástól jól megkülönböztethető döntést rejt. A leggyakoribb félreértés, hogy a három út egy fokozatos „nehézségi szint” – valójában nem egymást helyettesítő, hanem egymásra épülő, illetve egymást kiegészítő megoldások.

A **vállalati (Enterprise) előfizetés** a legegyszerűbb belépési pont: a szervezet megrendeli egy gyártó kész chat-felületét, munkatársanként fizetve. A felületet és a frissítéseket a gyártó határozza meg, a szervezet mozgástere az admin-beállításokra korlátozódik. Az Anthropic Claude Enterprise csomagja saját leírása szerint „egyetlen identitást, egyetlen szabályzatot és egyetlen admin-kontroll-készletet” ad a Claude használatára. A Microsoft 365 Copilot a Microsoft 365-ös környezetbe épül be, a Google Workspace-be épített Gemini pedig a Gmail, Drive, Docs, Chat tartalmát vonja be, a felhasználó meglévő jogosultságai szerint.

Az **API** nem kész felület, hanem egy „nyers” csatlakozási pont: egy fejlesztő saját alkalmazást építhet a modell fölé. Jellemzően a használat mennyisége szerint, nem munkatársankénti díjjal számláznak. Az OpenAI-nál az API-forgalomra külön szabály él: a be- és kimeneteket akár 30 napig is megőrizhetik, kivéve ha az ügyfél „nulla adatmegőrzést” kér egy jogosult végponton.

A **vállalati MI-platform** abban különbözik a két korábbi úttól, hogy itt a szervezet nem egy MI-terméket vesz, hanem saját MI-belépési pontot hoz létre. A platform egy köztes réteg, amelyet a szervezet épít a munkatársak és egy vagy több gyártó modellje közé, és jellemzően maga is API-kon keresztül éri el a mögötte álló modelleket, csak a felhasználó ezt nem látja. A platform legfontosabb tulajdonsága, hogy megtartja az absztrakciós réteget: a mögötte futó modell cserélhető, anélkül hogy a munkatársaknak alkalmazkodniuk kellene. Ezt egy nyílt szabvány, a Model Context Protocol (MCP) is támogatja, amely szabványosítja, hogyan kapcsolódhat egy MI-alkalmazás külső rendszerekhez.

A három út között a legfontosabb különbség az, ki dönt az adatkezelésben, a szabályokban, a modellválasztásban, a felületben és a naplózásban. Az Enterprise előfizetésnél ezt mind a gyártó admin-felülete szabja meg a cég számára; a platformnál a szervezet dönt. A modellválasztás az előfizetésnél egy gyártóra korlátozódik, a platformnál viszont a kérdés eldöntheti, melyik modell a legalkalmasabb.

![Előfizetés vagy platform: hol van a kontroll? Az előfizetésnél a gyártó felülete áll a munkatársak és a modell között, a platformnál a cég saját rétege, amely mögött több gyártó modellje is lehet.](/elemzesek/vallalati-ai-platform/elofizetes-vs-platform.webp)

Fontos leszögezni, hogy a három út a valóságban gyakran együtt él egy szervezeten belül. Egy tipikus elrendezés: a munkatársak napi kérdéseikre egy Enterprise előfizetést használnak, míg egy konkrét munkafolyamatra a szervezet saját, API-ra épülő alkalmazást fejleszt. Ha ezeket egy közös belépési ponttal, jogosultságkezeléssel és naplózással egységesítik, az már a platform irányába mutat. A gyártók Enterprise csomagjai is egyre inkább platformszerű funkciókat adnak: az Anthropic konnektorokat ad „belső rendszerekhez […] egyéni konnektorok MCP-n keresztül”, és szervezeti szintű „skilleket”, amelyek „rögzítik a sablonjaikat, szabványaikat és munkafolyamataikat”. A Microsoft 365 Copilot adminisztrátorai pedig „teljes kontrollal rendelkeznek afelett, mely agenteket engedélyezik” a szervezetben. A határvonal tehát nem éles: minél több platformszerű funkciót ad egy Enterprise csomag, annál kisebb az indok egy teljesen saját platform felépítésére.

Van a kérdésnek jogi oldala is. Az uniós MI-rendelet két fő szerepkört különböztet meg: a **szolgáltatót**, aki egy MI-rendszert vagy modellt a saját neve alatt forgalomba hozza, és az **alkalmazót**, aki egy MI-rendszert a felügyelete alatt használ. Egy Enterprise előfizetést használó cég tipikusan alkalmazó. Egy saját platformot építő szervezet esetében a szereposztás bonyolultabb lehet: ha a platform maga egy, sajátos célra szabott, új funkcióval ellátott MI-rendszert hoz üzembe, elvben maga is szolgáltatói kötelezettségek alá kerülhet.

## Mit ad ma egy Enterprise előfizetés?

A négy gyártó mindegyike ugyanazt az alapélményt adja: egy beszélgetőfelület, amelybe be lehet írni egy kérdést, és a mögötte álló modell válaszol. Egy cégvezetőnek vagy IT-vezetőnek nyolc kérdést érdemes feltennie, mielőtt a munkatársak kezébe ad egy MI-eszközt: tanítja-e a gyártó a saját modelljét a cég adatain; ki láthatja a beszélgetéseket, és mennyi ideig őrzik meg őket; hogyan lép be a munkatárs; van-e nyoma annak, ki mit csinált; a meglévő jogosultságokat követi-e a rendszer; hogyan kapcsolódik a céges fájlokhoz; lehet-e saját, testre szabott segítőt építeni; és van-e papír, amely az adatkezelésért jogilag is felel.

Mind a négy gyártó – ahol a forrás erről nyilatkozik – azt állítja, hogy alapértelmezésben nem használja a céges adatot a modell tanítására. Az OpenAI szerint „alapértelmezésben nem tanítjuk a modelljeinket az Ön adatain”. Az Anthropic ugyanezt mondja a Claude Enterprise-ról. A Google Workspace szerződéses vállalása hasonló, a Microsoft pedig közli, hogy a promptokat és a Microsoft Graphon keresztül elért adatokat nem használják az alapmodellek tanítására. Mindegyik állítás „alapértelmezés szerint” szól – egyedi szerződéses eltérés lehetséges, a pontos feltételeket a vizsgált oldalak nem részletezik.

Az adatmegőrzés cégenként eltér. Az OpenAI-nál az ügyfél szabja meg az időt, a törölt beszélgetések 30 napon belül kikerülnek a rendszerből. Az Anthropicnál egyedi adatmegőrzés és ügyfél által kezelt titkosítási kulcsok érhetők el, a kérésre futtatott következtetés pedig csak az Egyesült Államokban történhet. A Google Workspace esetében a két Gemini-szolgáltatás szabálya nem azonos: a Workspace-be épített Gemininél az admin 90 naptól a végtelenig szabhatja meg a megőrzést, a különálló Gemini-alkalmazásnál viszont legfeljebb 36 hónap, alapértelmezésben 18 hónap. A Microsoftnál az admin a Purview nevű eszközzel állíthat be megőrzési szabályokat.

A belépés és felhasználókezelés terén az OpenAI vállalati szintű SAML SSO-t és „részletes hozzáférés- és funkcióvezérlést” kínál. Az Anthropic ennél bővebben nyilatkozik: SSO, domain capture (amely megakadályozza, hogy a céges e-mail-domainnel bárki magánfiókot regisztráljon), SCIM, JIT fiókkiosztás, szerepkör-alapú hozzáférés és IP-engedélyezési lista is elérhető. A Google Workspace a meglévő fiók-struktúrába illeszkedik, a Microsoft-nál az agentek engedélyezését az admin a Microsoft 365 admin centeren kezeli.

A naplózás terén az OpenAI egy Compliance API-n keresztül ad hozzáférést a beszélgetések naplójához, az Anthropic auditnaplókat, egy Compliance API-t, OpenTelemetry-t és egy Analytics API-t ad, amelyek a cég biztonsági eszközeibe is betölthetők. A Google Workspace auditnaplókat és egy Reporting API-t biztosít, a Microsoft-nál a Purview tartalomkeresésén keresztül állíthatók be a megőrzési szabályok.

A legfontosabb közös tulajdonság mind a négy csomagnál a **jogosultságok öröklése**: a meglévő céges jogosultsági rendszert követik, plusz hozzáférést nem adnak. A Google Workspace ezt a legegyértelműbben fogalmazza meg: „ha a felhasználónak nincs hozzáférése egy dokumentumhoz vagy e-mailhez, a Gemini nem kéri le azt a tartalmat.” A Microsoft forrása azonban – egyedüliként a négy közül – kifejezetten az előny **árnyoldalára** is figyelmeztet: „alapértelmezés szerint a SharePoint a legengedékenyebb megosztási beállítást állítja be”, és emiatt a Copilot és a hasonló agentek a „véletlen túlosztás” (oversharing) kockázatát hordozzák – ha egy fájl jogosultsága rosszul van beállítva, ezt a hibát a Copilot nem javítja ki, hanem örökli, és ugyanolyan könnyen felhasználja a válaszadáshoz. A Microsoft konkrét kockázati jelzőket is ad: széles körű megosztás „Bárki” vagy „Mindenki” linkekkel, nagy létszámú, de túl sok jogosultsággal rendelkező csoportok, megszakadt jogosultság-öröklési lánc, érzékeny tartalom gyenge védelemmel. Ez az egyetlen pont, ahol egy gyártó forrása maga mutat rá az előny árnyoldalára: a jogosultság-öröklés önmagában nem biztonsági garancia, csak annyit jelent, hogy az MI-eszköz nem ad **több** hozzáférést a meglévőnél.

A négy csomag mindegyike lehetőséget ad saját, testre szabott segítő építésére is. Az OpenAI-nál ezt „GPT”-nek nevezik, és a felhasználók megoszthatják egymással saját GPT-jeiket. Az Anthropic egy külön fogalmat is bevezet: a **skillt**, amely egy mappa, amely „kódolja, hogyan dolgoznak valójában a csapatok”, úgy hogy minden csapat ugyanúgy végezze a munkát a saját sablonjai szerint.

Egy fontos szerkezeti határ mind a négy csomagra érvényes: a vállalati előfizetés egyetlen gyártó modelljeire épül. Ha a cég a jövőben másik gyártó modelljére akarna váltani, a felépített egyedi asszisztenseket, a beállított jogosultsági logikát és a naplózási integrációkat jellemzően újra kellene építeni az új gyártó rendszerében. Ugyanakkor a leírt funkciók (konnektorok, admin által szabályozható jogosultságok, auditnapló, szervezeti szinten megosztott asszisztensek) azt mutatják, hogy a különbség az Enterprise előfizetés és egy önálló vállalati MI-platform között nem fekete-fehér, hanem fokozatbeli – a kérdés egyre inkább arról szól, hogy a cég elfogadja-e, hogy mindez egyetlen gyártó rendszerében épüljön fel, vagy szükségesnek látja, hogy a saját beállításait, jogosultsági logikáját és betanított tudását gyártótól függetlenül tartsa meg.

| Szempont | ChatGPT Enterprise | Claude Enterprise | Gemini (Google Workspace) | Microsoft 365 Copilot |
|---|---|---|---|---|
| Tanítás a céges adaton | Alapértelmezésben nem | Alapértelmezésben nem | Nem, ügyfélengedély nélkül nem | Nem kerül az alapmodellek tanításába |
| Adatmegőrzés | Admin szabja meg az időt, 30 napos törlés | Egyedi megőrzés, ügyfélkulcs | Admin állítja (90 nap – végtelen / max. 36 hónap) | Admin (Purview) állít be szabályt |
| Belépés | SAML SSO, hozzáférés-vezérlés | SSO, domain capture, SCIM, JIT, IP-lista | App-szintű be/kikapcsolás | Admin centeren engedélyezés |
| Jogosultság öröklése | A konnektoroknál igen | A konnektoroknál igen | Igen, általános elvként | Igen; a gyártó figyelmeztet a túlosztásra |

→ *Bővebben: a melléklet részletes összehasonlító táblázata.*

## Miből áll egy vállalati MI-platform?

Amikor egy cég MI-t vezet be, a munkatárs csak egyetlen dolgot lát: egy felületet, ahol kérdezhet, és egy választ. Ami e mögött történik, több egymásra épülő rétegből áll: a **felhasználó**, a **belépési pont**, a **szabályok és a tudás** rétege, a **modellkapu**, és végül maguk a **modellek**. A platformot nem a modell maga, hanem ezek a köztes rétegek alkotják.

![Miből áll egy vállalati MI-platform? A tipikus egységek rétegekbe rendezve, zárójelben a részletes tárgyalás helyével.](/elemzesek/vallalati-ai-platform/platform-egysegei.webp)

A **saját MI-belépési pont** egyetlen, közös felületet ad minden munkatársnak, ahelyett hogy mindenki saját fiókkal regisztrálna egy-egy gyártó chat-felületén. Ez a gyakorlatban „vadhajtásokat” válthat ki: ha nincs saját belépési pont, a munkatársak gyakran maguktól kezdenek el ingyenes vagy saját fiókkal fizetett MI-eszközöket használni, amelyekbe céges adat kerülhet, a cég kontrollja nélkül.

Az **identitás és jogosultságok** rétege örökli a cég már meglévő jogosultsági rendszerét: nem épít fel újra egy saját hozzáférési logikát, hanem azt veszi alapul, aki az adott munkatárs. Ez pontosan olyan megbízható, mint a jogosultsági rendszer, amelyből örököl. A biztonsági szakirodalom egy szinttel mélyebbről is megerősíti a kockázatot: ha a céges tudásbázis egy visszakereső rendszeren keresztül válik elérhetővé, több bérlős (több ügyfélszervezetet egy rendszeren belül kiszolgáló) környezetben előfordulhat, hogy a hasonlóságkeresés a teljes indexen fut, mielőtt a hozzáférés-vezérlés érvénybe lépne – egy illetéktelen így akkor is következtethet más dokumentumok létezésére, ha minden formálisan helyesen van címkézve.

A **közös vállalati tudásréteg** (RAG) azt a hiányt pótolja, hogy a nagy nyelvi modellek önmagukban csak azt tudják, amit a betanításuk idején megtanultak – ez nem tartalmazza a cég saját, friss dokumentumait. A módszert eredetileg 2020-ban leíró kutatók két előnyt emeltek ki: a tudás frissíthető és bővíthető anélkül, hogy a modellt újra kellene tanítani, és a válasz forráshoz köthető, mert a modell megjelölheti, mely dokumentumrészekre épült. A kutatók maguk is figyelmeztettek: „a Wikipédia, vagy bármely más külső tudásforrás, valószínűleg soha nem lesz teljesen tényszerű és teljesen torzítástól mentes” – a tudásréteg karbantartása folyamatos, nem egyszeri feladat.

A **modellkapu** eldönti, melyik modell a legalkalmasabb az adott feladatra, és oda irányítja a kérdést – a felhasználó ezt nem látja. Két fő indok van rá: nincs egyetlen modell, amely minden feladatra egyformán legjobb és legolcsóbb, és a gyártói függőség elkerülése. A modellek közötti automatikus választást (routing) vizsgáló kutatás szerint egy erősebb és egy gyengébb modell közötti dinamikus választással „a válaszminőség feláldozása nélkül több mint kétszeresére” lehet csökkenteni a költségeket, egy adott esetben akár 3,66-szoros megtakarítást mértek. A kutatók azonban saját fenntartásként jelzik: ezek nyilvános teszteken mért eredmények, és „a valós alkalmazások eloszlása jelentősen eltérhet ezektől a benchmarkoktól”. Nincs egyetlen legjobb router minden kérdéstípusra, és a döntési réteg futtatása is apró, de nem nulla költséggel jár.

Az **egységes MI-governance** azt jelenti, hogy a cég előre lefektetett, dokumentált szabályokat épít be: ki milyen modellt használhat, milyen adat mehet ki a cégen kívülre, milyen feladathoz kell emberi jóváhagyás. Egy közismert, semleges keretet erre az amerikai szabványügyi hivatal, a NIST adott ki 2024-ben, négy fő funkcióval: Govern (irányítás), Map (feltérképezés), Measure (mérés) és Manage (kezelés). A keret tizenkét kockázati kategóriát sorol fel, köztük az **értéklánc-kockázatot**: a generatív MI-rendszerek sok harmadik féltől származó komponenst (beszerzett adatkészlet, előre betanított modell, szoftverkönyvtár) tartalmaznak, amelyeket esetleg nem megfelelően szereztek be vagy ellenőriztek.

A **védőkorlátok** azok a technikai szűrők, amelyek a bemenet és a kimenet szintjén ellenőrzik, mi mehet be a modellhez, és mi jöhet ki belőle – elsősorban a prompt injection és az érzékeny adat kiszivárgása ellen. A **naplózás** rögzíti, ki mikor mit kérdezett, milyen dokumentumhoz fért hozzá, és milyen választ kapott – ez olyan, mint egy beléptetőrendszer naplója.

A **költségkontroll** azt szabályozza, mennyit költhet felhasználónként vagy feladatonként a cég a modellek használatára. A biztonsági szakirodalom külön kockázatként nevezi meg a „korlátlan fogyasztást”: ennek meghatározó jellemzője a költségaszimmetria, amikor viszonylag kis erőfeszítéssel is aránytalanul nagy költség keletkezhet. A javasolt védekezés token-tudatos költségkontroll, szigorú kiadási plafonok és agent-szintű megszakítók.

A **minőségmérés** azt vizsgálja folyamatosan, mennyire pontosak és megbízhatóak a válaszok – mérés nélkül a cég nem tudja megállapítani, hogy egy modellváltás vagy routing-beállítás javította vagy rontotta a minőséget. Végül a **telepítési mód** azt dönti el, hol fut a platform és az adat: felhőben, ahol a frissítést a szolgáltató végzi, vagy saját infrastruktúrán, ahol az adat nem hagyja el a cég közvetlen ellenőrzése alatt álló környezetet, de ennek ára az üzemeltetési teher.

Áttekintve az egységeket: a gyártói Enterprise csomagok mára már több platformfunkciót is tartalmaznak – a belépési pont, a jogosultság-öröklés, az alapvető naplózás és az adminisztráció egy gyártóra korlátozva. Azok az egységek, amelyek jellemzően csak egy gyártóktól független platformnál jelennek meg teljes formában: a több gyártó modellje közötti modellkapu, az egységes governance, a finoman szabályozott költségoptimalizálás és a tartalmi minőségmérés rendszeres kiépítése. Ez a különbség azonban gyorsan változik, és nem állandó szabály. Egy gépi tanulási rendszereket vizsgáló, egy évtizede megjelent kutatás szerint egy ilyen rendszernek csak kis részét teszi ki maga a modell, a „szükséges körülvevő infrastruktúra pedig hatalmas és összetett” – ezt a „rejtett technikai adósságot” a saját platform kiépítése és üzemeltetése folyamatosan hordozza.

## Agentek, folyamatok, skillek

A legtöbb munkavállaló az MI-vel chat-ablakban ismerkedik meg: kérdést ír be, a rendszer válaszol. Az **agent** ennél többet csinál: egy célt kap, és maga dönt, milyen lépéseken és eszközökön keresztül éri el – fájlt olvas, rendszerbe belép, dönt a következő lépésről, és ezt a ciklust addig ismétli, amíg a célhoz nem ér, vagy emberi jóváhagyást nem kér. Minél több lépést és rendszert érint egy agent, annál nagyobb a tere a hibának és a visszaélésnek is: az agent nem helyettesíti a vállalati rendszereket, hanem belép azokba, ezért a platform jogosultságkezelésének és tudásrétegének felhasználója is egyben.

Ahhoz, hogy egy agent valóban be tudjon lépni egy céges rendszerbe, szabványos kapcsolódásra van szükség: ezt adja a **Model Context Protocol** (MCP). A szabvány háromszereplős modellt ír le: a **host** (a chat- vagy agent-felület), a **kliens** (a host-on belüli kapcsoló) és a **szerver** (amely a kontextust biztosítja). A szerver eszközöket, erőforrásokat és promptokat kínálhat a kliensnek. A specifikáció kifejezetten kimondja, hogy a host-oknak kifejezett felhasználói hozzájárulást kell kérniük, mielőtt egy eszközt meghívnának. Fontos korlát azonban: az engedélyezési réteg a specifikációban **opcionális** – a dokumentum maga mondja ki, hogy „az MCP önmagában nem tudja protokollszinten érvényesíteni ezeket a biztonsági elveket”. Az, hogy egy konkrét vállalati megvalósítás valóban kér-e hozzájárulást, az adott alkalmazáson múlik, nem magán a szabványon.

A konnektorok és az agentek önmagukban csak „képességet” adnak. A vállalati haszon ott kezdődik, amikor egy ismétlődő munkafolyamatot egyszer megépítenek egy agent és a hozzá tartozó konnektorok, promptok és szabályok köré, és utána sokan, ismételten használják. Ennek egyszerűbb formája a gyártói csomagokban a megosztható, egyedi asszisztens: az OpenAI-nál a munkatársak megépíthetik és megoszthatják saját GPT-jeiket egymással.

Az **Agent Skills** egy nyílt szabvány, amely azt írja le, hogyan csomagolható be egy agent számára a feladat elvégzéséhez szükséges eljárási tudás. Szerkezete egy mappa, amelyben egy `SKILL.md` fájl tartalmazza a skill nevét, leírását és az utasítást, a mappa pedig futtatható szkripteket, referenciadokumentumokat és sablonokat is tartalmazhat. Az agent egy háromlépcsős mechanizmussal tölti be: felfedezés (csak a nevet és rövid leírást tölti be), aktiválás (a teljes utasítás betöltése, amikor egy feladat ehhez illik), és végrehajtás. A specifikáció kiemeli a gyártók közötti hordozhatóságot: „a skillt egyszer kell megépíteni, és bármely skill-kompatibilis agentnél felhasználható” – egy önbevalláson alapuló lista mintegy 45 MI-eszközt és agent-klienst sorol fel, amelyek állítása szerint támogatják a szabványt.

Vállalati nyelvre lefordítva: a skill az a hely, ahová a cég „hogyan csináljuk nálunk” tudása kerülhet, nem egy betanított modellbe, hanem egy olvasható, karbantartható mappába. A felhasznált források nem térnek ki arra, hol kell egy skillnek szervezetileg élnie, és ki hagyja jóvá a tartalmát – ez döntés és felelősség marad a cégnél.

Az agentek – éppen azért, hogy önállóan cselekedhessenek – olyan kockázatokat is hoznak, amelyek egy hagyományos chat-használatnál nem jelentkeznek. A nemzetközi biztonsági szervezet, az OWASP ezekre külön, tíz pontos listát állított össze. A vállalati platform szempontjából a legfontosabb az **eszközzel való visszaélés** és a **jogosultsággal való visszaélés**: saját, elkülönült és kormányzott identitás nélkül az agent egy „attribúciós résben” működik, amely lehetetlenné teszi a legkisebb jogosultság elvének valódi érvényesítését. Jellemző hibaminta a **nem körülhatárolt jogosultság-öröklés**: amikor egy magas jogosultságú „menedzser-agent” feladatot delegál anélkül, hogy a legkisebb jogosultság elvét alkalmazná, és egy szűkebb feladatra szánt „munkás-agent” így túlzott jogosultságot kap. Az OWASP ajánlása három elvet hangsúlyoz: a legkisebb jogosultság érvényesítését, emberi jóváhagyás megkövetelését a nagy hatású műveleteknél, és teljes körű naplózást.

→ *Bővebben: a melléklet részletes összehasonlító táblázata.*

## Kockázatok és védőkorlátok

A hagyományos vállalati szoftver kiszámítható: ugyanaz a bemenet ugyanazt a kimenetet adja, és a program élesen különbséget tesz a kód és az adat között. Egy nyelvi modellre épülő rendszernél ez a határ elmosódik: a modell a bemenetét egyetlen folyamatos szövegfolyamként kezeli, nincs architekturális különbség „utasítás” és „adat” között. Ez azt jelenti, hogy egy dokumentumba rejtett mondat is „utasításként” viselkedhet, ha a modell felolvassa. A modell válasza nem determinisztikus, és magabiztosan is tud hibázni: a szakirodalom erre a „konfabuláció” szót használja, köznyelven hallucinációnak is nevezik.

Az amerikai szabványügyi hivatal, a NIST 2024-ben adta ki a generatív MI-re szabott kockázati profilját, amely tizenkét kategóriát sorol fel három csoportba: technikai/modellkockázat, emberi visszaélésből eredő kockázat, és az MI-ökoszisztéma szintű kockázat. A legfontosabbak: a **konfabuláció** (hibás vagy kitalált tartalom tényként), az **adatvédelem** (kiszivárgó vagy helyesen kikövetkeztetett személyes adat), az **információbiztonság** (prompt injection, adatmérgezés), az **értéklánc-kockázat** (sok, nem megfelelően ellenőrzött harmadik féltől származó komponens), az **ember–MI konfiguráció** (rosszul kialakított munkamegosztás), és a **szellemi tulajdon** kérdései.

A gyakorlati, fejlesztőknek szóló részletezést az OWASP adja, amely tíz fő kockázatot sorol fel a nyelvimodell-alkalmazásokra. A legfontosabb négy: a **prompt injection**, amikor a modellnek adott bemenet – közvetlen szöveg, visszakeresett dokumentum vagy eszközkimenet – a fejlesztő szándékától eltérő viselkedésre bírja a modellt; az **érzékeny információ kiszivárgása**, amelynek egyik fő oka a „felfelé irányuló túlosztás” (oversharing) – nem körülhatárolt meghajtók és elavult jogosultságok táplálják a céges tudáskeresést érzékeny adattal, és a javítást nem a modellen, hanem az adatfelszínen kell elvégezni; a **vektor- és embedding-gyengeségek**, amikor a tudásbázis hasonlóságkeresése a teljes indexen fut, mielőtt a jogosultság-ellenőrzés érvénybe lépne, így egy illetéktelen akkor is következtethet más dokumentumok létezésére, ha minden hitelesített; és a **korlátlan fogyasztás**, amelynek meghatározó jellemzője a költségaszimmetria.

Az agentikus rendszerekre az OWASP külön, tíz kockázatból álló listát adott ki. A legfontosabb a **céleltérítés** (az agent nem tudja megbízhatóan megkülönböztetni az utasítást a kapcsolódó tartalomtól) és az **identitással és jogosultsággal való visszaélés**, amely a dinamikus bizalmat és a feladat-átadást (delegálást) használja ki.

A fenti kockázatokra a források visszatérő intézkedéscsomagot ajánlanak: bemenet és kimenet szűrése, a legkisebb jogosultság elve, emberi jóváhagyás kritikus lépéseknél, naplózás és megfigyelés, keretek a fogyasztásra, és rendszeres tesztelés. Ezek mindegyike csökkenti, nem szünteti meg a kockázatot: az OWASP maga is leírja, hogy a keresztbérlői kiszivárgási támadás „akkor is sikeres, ha minden dokumentum helyesen van megjelölve és minden hozzáférés hitelesített”. A MI-bevezetés kockázatkezelése tehát folyamat, nem egyszeri beállítás: a gyártói Enterprise-csomag és egy esetleges saját platform-réteg együtt csökkenti a kitettséget, de egyik sem helyettesíti a szervezet saját, folyamatos felülvizsgálatát.

## Ki miért felel? Szabályozás és adatvédelem

Sem egy Enterprise előfizetés megvásárlása, sem egy vállalati MI-platform felépítése nem tesz önmagában „megfelelővé” egy céget. A jogi és adatvédelmi kötelezettségek a céget terhelik, mint munkáltatót és adatkezelőt, függetlenül attól, hogy a munkatársak egy gyártói előfizetésben vagy egy saját platformon érik el az MI-t.

Az uniós MI-rendelet két alapszerepet különböztet meg: **szolgáltató**, aki egy MI-rendszert a saját neve alatt forgalomba hozza, és **alkalmazó**, aki a felügyelete alá tartozó MI-rendszert használja. Egy Enterprise előfizetést használó cég tipikusan alkalmazó. A rendelet eredeti 4. cikke úgy fogalmazott, hogy a szolgáltatóknak és alkalmazóknak „biztosítaniuk” kell a személyzet megfelelő szintű MI-jártasságát. Ezt a 2026-os digitális omnibusz csomag módosította: a hatályos szöveg szerint a kötelezettség „nem írja elő […], hogy bármely személy számára garantálják az MI-jártasság bármely konkrét szintjét” – a jogalkotó indoklása szerint egy szigorú szintet megkövetelő kötelezettség „további megfelelési terhet jelent, különösen a kisebb vállalkozások számára”. A kötelezettség nem szűnt meg, csak gyengébb, támogatás-jellegű formát kapott.

A rendelet 26. cikke az alkalmazókra viszonylag részletes kötelezettségeket ír elő: emberi felügyelet, legalább hat hónapos naplózás, munkavállalói tájékoztatás a bevezetés előtt. **Fontos korlátozás**: ez kizárólag a rendelet szerint **nagy kockázatú** MI-rendszerek alkalmazóira vonatkozik. Egy általános célú, irodai munkára használt chat-asszisztens önmagában nem tartozik ide. A III. melléklet szerinti nagy kockázatú rendszerekre vonatkozó szakaszok az omnibusz után **2027. december 2-től** alkalmazandók.

Magyarországon a 2025. évi LXXV. törvény adja meg a hazai végrehajtás kereteit: két hatóságot jelöl ki (bejelentő és piacfelügyeleti hatóságot), és létrehozza a Magyar Mesterséges Intelligencia Tanácsot. A törvény lényegében intézményi jellegű: az alkalmazókra vonatkozó érdemi kötelezettségek magából a rendeletből következnek.

Amikor egy cég munkatársai MI-t használnak, és ennek során személyes adat kerül a rendszerbe, a GDPR alapján a cég jellemzően **adatkezelő**, a gyártó pedig – szerződéstől függően – **adatfeldolgozó**. A GDPR 28. cikke szabja meg, mit kell egy adatfeldolgozói szerződésnek tartalmaznia; ha az adatfeldolgozó maga határozza meg az adatkezelés céljait, az adott kezelés tekintetében őt magát kell adatkezelőnek tekinteni. A 35. cikk adatvédelmi hatásvizsgálatot ír elő, ha egy adatkezelési típus „valószínűsíthetően magas kockázattal jár” – ezt a cégnek esetenként kell megítélnie. A gyártók jellemzően kínálnak adatfeldolgozási szerződést (DPA): az OpenAI közlése szerint ilyen szerződést köthet a vállalati ügyfeleivel a GDPR-megfelelés támogatására.

Fontos kérdés az adattovábbítás az Egyesült Államokba: a nagy gyártók amerikai székhelyűek, és a feldolgozás – ha a cég nem kér kifejezetten európai régiót – gyakran amerikai szerverekre is kiterjedhet. Az Egyesült Államokra hatályos megfelelőségi határozat van: az EU–USA adatvédelmi keret (Data Privacy Framework) alapján a személyes adat szabadon áramolhat azokhoz a vállalatokhoz, amelyek szerepelnek a keretben. **Fontos fenntartás**: a keretet bírósági úton meg is támadták; az Európai Unió Törvényszéke 2025 szeptemberében elutasította a megsemmisítésére irányuló keresetet, de az ítélet ellen fellebbezés nyújtható be, amelynek kimenete nyitott.

Magyarországon a NIS2 uniós irányelvet átültető 2024. évi LXIX. törvény azokra a szervezetekre vonatkozik, amelyek a mellékleteiben felsorolt ágazatokba tartoznak, és elérik a középvállalkozási méretet. Ha egy cég a hatálya alá esik, szerződéses kötelemként kell rögzítenie a kiberbiztonsági követelményeket minden közreműködőnél – ez vonatkozik arra az esetre is, ha a cég egy külső MI-gyártót von be az adatkezelésébe. Ha egy MI-platform több gyártó modelljét kapcsolja össze, ezt minden egyes bevont közreműködőre nézve külön kell lefedni, nem egyetlen általános záradékkal.

Egy saját, gyártósemleges platform lehetőséget ad arra, hogy a cég egységesen alakítsa ki a naplózást és a jogosultságokat, de ennek kiépítése saját üzemeltetési terhet igényel – a technika önmagában nem helyettesíti a cég saját jogosultság-rendjének karbantartását.

## Hol tart Magyarország?

Az Eurostat két, egymástól független adatforrásból méri a mesterséges intelligencia elterjedését. A **vállalati felmérés** azt kérdezi meg a legalább 10 fős vállalkozásoktól, hogy használnak-e legalább egy MI-technológiát. Az **egyéni felmérés** azt kérdezi meg a 16–74 éves lakosságtól, hogy az elmúlt három hónapban használtak-e generatív MI-eszközt munkára. A két mutató más kérdést tesz fel, más embereket vagy szervezeteket kérdez meg, és nem vethető össze egyszerűen egymással.

A vállalati mutató tág definíciót használ: legalább egyet a felsorolt MI-technológiák közül (szövegbányászat, beszédfelismerés, képfelismerés, gépi tanulás és mások), a legalább 10 fős vállalkozások körében. A legfrissebb, 2025-ös felvétel szerint az uniós átlag **19,95%**, a magyar érték **10,37%**. A különbség nem új: 2021-ben az uniós átlag 7,65%, a magyar érték 2,98% volt. Magyarország az egész időszakban az uniós átlag alatt maradt, és bár az arány mindkét oldalon nő, a magyar érték az uniós átlag nagyjából felén áll.

| Vállalati méret | HU, 2025 | EU27, 2025 |
|---|--:|--:|
| Kis (10–49 fő) | 8,70% | 17,00% |
| Közepes (50–249 fő) | 15,34% | 30,36% |
| Nagy (250+ fő) | 39,99% | 55,03% |
| Teljes vállalati kör (10+ fő) | 10,37% | 19,95% |

*Forrás: Eurostat, isoc_eb_ai.*

A különbség minden méretkategóriában megvan: a magyar nagyvállalati arány (39,99%) még mindig elmarad az uniós kisvállalati szinttől (17,00%) nem éri el, és körülbelül a 2024-es uniós közepes vállalati szinthez van közelebb. Fontos korlát: a mutató a mikrovállalkozásokat (1–9 fő) nem méri, miközben éppen ezek lehetnek a legkevésbé felkészültek, de a legkevésbé adatolt réteg is.

A másik Eurostat-felmérés a dolgozókat, nem a vállalatokat kérdezi. A 2025-ös, első ilyen felvétel szerint az uniós átlag **15,36%**, a magyar érték **14,86%** – ez sokkal kisebb különbség, mint a vállalati mutatónál, és a magyar érték lényegében egy szintet mutat az uniós átlaggal. Ez a mutató önbevalláson alapul, és nem tesz különbséget aszerint, hogy a dolgozó munkahelyi, saját fiókkal vagy ingyenes verzióval használta az eszközt.

A két adat egymás mellé állítása önmagában félrevezető lenne, mert más alapsokaságot mér. Nem szabad úgy fogalmazni, hogy „a vállalatok lemaradnak, a dolgozók viszont nem”. Ami viszont felvethető **kérdésként**, nem tényként: ha igaz, hogy a magyar dolgozók generatív MI-használata munkára közel van az uniós átlaghoz, miközben a magyar vállalatok MI-bevezetése jelentősen elmarad, akkor hol használják a dolgozók azokat az eszközöket, amelyekről a saját cégük felmérése szerint a vállalat nem is „vállalati MI-használóként” számol be? Ez felveti a „saját fiókos” MI-használat lehetőségét – amit a jelen két forrás nem bizonyít, csak jelez.

A magyar kormány 2025 szeptemberében tette közzé Magyarország Mesterséges Intelligencia Stratégiáját a 2025–2030-as időszakra, amely 2030-ra **40%-os** MI-használati arányt céloz a KKV-k körében. Ezt a célt két okból kell óvatosan kezelni: a „40%” kormányzati célkitűzés, nem mérés, és nincs megadva, hogy a „MI-t használó KKV” kifejezés pontosan mit jelent, illetve hogy a cél az Eurostat mutatójával azonos definíciót használ-e.

## Mit jelent ez a munkatársnak?

Az előző szakaszok a vállalat, az IT-vezető és a jogszabályok szemszögéből írták le a vállalati MI-platformot. A dolgozó számára a három út nagyon eltérően jelenik meg: ha a cég csak egy vagy több Enterprise-csomagot vesz, a dolgozó több, egymástól független felületet lát, mindegyiknek saját bejelentkezésével. Ha a cég egy platformot épít, a dolgozó egy közös felületet lát, amely a háttérben választhat a modellek közül.

Ami a dolgozó saját rálátását illeti: az OpenAI szerint a végfelhasználók megtekinthetik a saját beszélgetéseiket, míg a cég adminisztrátorai egy Compliance API-n keresztül auditnaplóhoz férnek hozzá. Ez nem azt jelenti, hogy az admin rendszeresen figyeli a dolgozók MI-használatát, csak azt, hogy a technikai lehetőség megvan rá – ahogy egy céges levelezőrendszerben is megvan az adminisztrátori hozzáférés lehetősége.

Ha egy dolgozó céges adatot másol be egy személyes, ingyenes vagy egyéni előfizetéses MI-fiókba, az a vállalati csomagokra vonatkozó adatvédelmi garanciák (tanítási tilalom, adminisztrátori kontroll, auditnapló) nélkül történik – azok csak a vállalati fiókra vonatkoznak. Az, hogy a gyártók ezt a kockázatot komolyan veszik, abból is látszik, hogy az Anthropic Enterprise csomagja kifejezetten tartalmaz egy hálózati szintű védelmet, amely „megakadályozza a személyes vagy nem céges Claude-példányok elérését a vállalati hálózatokról”.

A dolgozó jogosultságai közvetlen hatással vannak arra, mit „tud” róla egy MI-asszisztens: ha egy dolgozónak – akár egy régi projekt miatt – véletlenül hozzáférése van egy olyan mappához, amelyhez nem kellene, az MI-asszisztens ugyanúgy megtalálja és felhasználja azt a tartalmat, mint bármely más elérhető fájlt.

Néhány gyakorlati szempont, amire egy MI-eszközt használó dolgozó érdemes figyelni: ne másoljon céges adatot személyes fiókba; tudja, melyik eszközt szabad használnia; ne lepődjön meg, ha az MI olyan dokumentumot is megtalál, amelyet elfelejtett; jelezze, ha egy MI-válaszban olyan adatot lát, amelyet nem kellene elérnie; ellenőrizze az MI válaszának forrását, különösen fontos döntés előtt; kérdezzen rá a saját adataira vonatkozó szabályokra; és vegye igénybe a munkáltató által felajánlott MI-képzést, amelyre a módosított uniós rendelet szerint a munkáltatónak továbbra is kötelezettsége van.

## Döntési útmutató: melyik szervezetnek mi kell?

Ez a szakasz nem termékajánlás, hanem szempontrendszer: a konkrét döntést minden szervezetnek a saját adatára, kockázataira és kapacitására kell alapoznia. Tíz kulcskérdés érdemben befolyásolja, egy Enterprise előfizetés elég-e, vagy szükség lehet egy platformrétegre:

Hány gyártó modelljét szeretnénk vagy kell használnunk? Ha a szervezet elfogadja, hogy minden folyamata egyetlen gyártó modelljeire épüljön, egy Enterprise előfizetés elegendő lehet; ha több gyártó modelljét szeretné feladatfüggően váltogatva használni, ehhez modellkapu szükséges.

Mennyire érzékeny az adatunk, és hol dolgozható fel? Minél érzékenyebb a kezelt adat, annál fontosabb pontosan tudni, hol tárolják és futtatják a modellt, és hogy a feldolgozás kilép-e az Európai Unióból.

Kell-e közös vállalati tudásréteg? Ha a cég dokumentumainak kereshetővé tétele több rendszert és gyártót is érintene, ez egy rendszerfüggetlen közös tudásréteg felé mutat.

Mennyire fontos a jogosultságok pontos követése – és rendben vannak-e most a jogosultságaink? A bevezetés előtt érdemes megvizsgálni, nincs-e már most túlosztás. Ez a kérdés függetlenül felmerül attól, hogy a szervezet előfizetést vagy platformot választ.

Kell-e egységes saját szabály és naplózás minden MI-használatra? Ha egységes, minden modellre kiterjedő governance-re van szükség, ez platform-funkció.

Vannak-e folyamatba építendő agentek? Minél több rendszert érint egy agent, annál fontosabb, hogy a legkisebb jogosultság elve és az emberi jóváhagyás valóban beépüljön.

Mekkora a költségkontroll igényünk? Ha a feladatonkénti elszámolás fontos, ez finomabb, platform-szintű kontrollt igényel.

Van-e üzemeltetői kapacitásunk? Egy saját platform felépítése és karbantartása folyamatos technikai feladat, nem egyszeri beruházás.

Szabályozott ágazatban dolgozunk? Ha a szervezet a kiberbiztonsági törvény hatálya alá esik, vagy nagy kockázatú MI-rendszert tervez, a döntés előtt jogi minősítés szükséges.

Mennyire fontos számunkra a gyártófüggetlenség? Ha a cég el akarja kerülni, hogy egy szolgáltatáskiesés vagy áremelés az egész MI-használatát veszélyeztesse, egy absztrakciós réteg megtartása jelentősebb súlyt kap.

Négy tipikus helyzet szemlélteti, mi lehet az ésszerű kiindulópont – ezek értékelésként, nem tényállításként szerepelnek. Egy **kis cégnél**, kevés érzékeny adattal, egy Enterprise előfizetés önmagában gyors, kezelhető belépési pont lehet; egy saját platform aránytalanul nagy üzemeltetési terhet jelentene. Egy **közepes cégnél**, sok belső dokumentummal, már megérheti egy legalább a tudásréteget egységesítő megoldás mérlegelése, a modellkaput kezdetben egyetlen gyártóra korlátozva. **Szabályozott ágazatban vagy közszférában** a döntés előtt jogi véleményt kell kérni, mert a technikai megoldás választása másodlagos a jogi minősítéshez képest. Egy **nagyvállalatnál**, több részleggel és saját fejlesztéssel, a platform-egységek adhatják a legtöbb hozzáadott értéket, de csak akkor, ha a szervezet valóban rendelkezik az üzemeltetéshez szükséges kapacitással – és a döntés gyakran nem is „előfizetés vagy platform”, hanem részlegenként eltérő válasz.

Három ellenpontot érdemes végiggondolni. A saját platform üzemeltetési terhe nem egyszeri beruházás, hanem folyamatos, gyakran alábecsült teher. A routing-megtakarítás feltételes: nyilvános teszteken mért eredmény, folyamatos méréssel kell ellenőrizni. A gyártói csomagok folyamatosan közelednek a platform-funkciókhoz, ezért a „mire van szükségem egy platformtól” kérdést érdemes időről időre újraértékelni. És: a platform sem old meg mindent – a jogi felelősség minden esetben a szervezeté marad.

![Első körös döntési fa: öt kérdés sorrendje és a lehetséges ágak; a fa sorrendet javasol, nem döntést.](/elemzesek/vallalati-ai-platform/dontesi-fa.webp)

Egy egyszerűsített döntési fa öt csomópontból áll: hány gyártó modelljére van szükség; mennyire érzékeny az adat és van-e szabályozott ágazati kötelezettség; van-e üzemeltetői kapacitás egy platform felépítésére; kell-e folyamatba épített agent, vagy csak chat-alapú használat; és mennyire fontos a finom költségkontroll és a rendszeres minőségmérés. A fa nem helyettesíti a fenti tíz kérdést, csak azok sorrendjét javasolja egy gyors, első körös tájékozódáshoz.

## Következtetések

A legfontosabb szemléletbeli különbség az Enterprise előfizetés és a vállalati MI-platform között nem a funkciók listájában, hanem abban van, ki dönt. Egy Enterprise előfizetésnél a felületet és a funkciókat a gyártó szabja meg; a platform ezzel szemben egy köztes réteg, amely megtartja az absztrakciós réteget: a mögötte futó modell cserélhető, anélkül hogy a munkatársaknak alkalmazkodniuk kellene. A három út a gyakorlatban nem egymást kizáró lépcsőfok, hanem gyakran egymás mellett élő megoldás.

A jogosultság-öröklés jó elv, de kettős élű: ugyanazt a hibát felnagyítja, amit korábban rejtve tartott. Mind a négy vizsgált gyártó azt állítja, hogy az MI-eszköz nem ad plusz hozzáférést a meglévőnél; a Microsoft azonban maga mutat rá az árnyoldalra, és az OWASP egy független forrásból erősíti meg, hogy a legtöbb érzékenyadat-kiszivárgási incidens mögött éppen ez a szerkezeti hiba áll. A bevezetés előtt érdemes a meglévő jogosultsági rendet átvizsgálni, függetlenül a választott megoldástól.

A céges tudás egy közös, kereshető réteggé válik – a skillek pedig ennek egy olyan formáját adják, amely nem dokumentum, hanem eljárás, és amely egy nyílt szabvány szerint elméletileg gyártótól függetlenül hordozható. A több gyártó modellje közötti váltás (routing) valódi költségmegtakarítást ígér, de a feltételei nem automatikusak: a megtakarítás csak folyamatos méréssel, feladatfüggő hangolással valósul meg.

A jogi és adatvédelmi felelősség minden esetben a cégnél marad, függetlenül a választott megoldástól. Az MI-rendelet 26. cikkének részletes kötelezettségei kizárólag a nagy kockázatúnak minősülő rendszerek alkalmazóira vonatkoznak; egy általános célú, irodai munkára használt chat-asszisztens önmagában nem tartozik ide. A gyártói csomagok és a saját platform közötti határ mozgásban van, és ezt az üzemeltetési teherrel együtt kell mérlegelni: minél több platformszerű funkciót ad egy Enterprise csomag, annál kisebb az indok egy teljesen saját platform felépítésére – de egy saját platform kiépítése nem egyszeri beruházás, hanem folyamatos, „rejtett technikai adósságot” hordozó feladat.

A magyar vállalati MI-elmaradás és a munkavállalói MI-használat két, nem közvetlenül összevethető szám. A magyar vállalatok MI-használata az uniós átlag nagyjából felén áll, miközben a dolgozók egyéni, munkára történő MI-használata alig marad el az uniós átlagtól – ez nem bizonyítja, de felveti a kérdést, hol használják a dolgozók azokat az eszközöket, amelyekről a saját cégük nem számol be.

Mit érdemes most tenni? Mielőtt egy szervezet Enterprise előfizetés és platform között választ, érdemes elsőként tisztázni, hány gyártó modelljére van szükség, és mennyire érzékeny a kezelt adat. Érdemes a jogosultsági rendet a bevezetés előtt átvizsgálni, függetlenül a választott megoldástól. Szabályozott ágazatban vagy nagy kockázatú MI-felhasználás gyanúja esetén a technikai döntés előtt jogi minősítés szükséges. És egy saját platform mérlegelésekor az üzemeltetési kapacitást legalább annyira érdemes számba venni, mint a funkcionális előnyöket.

## Forrásanyagok

### Hazai

- [2024. évi LXIX. törvény Magyarország kiberbiztonságáról (Nemzeti Jogszabálytár, 2024)](https://njt.jog.gov.hu/jogszabaly/2024-69-00-00)
- [Magyarország Mesterséges Intelligencia Stratégiája (2025–2030) (Magyar Kormány, 2025)](https://cdn.kormany.hu/uploads/document/c/c0/c0d/c0dfdbd37cfa520ae37361a168d244c85e7295af.pdf)
- [2025. évi LXXV. törvény az Európai Unió mesterséges intelligenciáról szóló rendeletének magyarországi végrehajtásáról (Nemzeti Jogszabálytár, 2025)](https://njt.hu/jogszabaly/2025-75-00-00)

### Uniós

- [(EU) 2024/1689 rendelet (MI-rendelet) (Európai Parlament és Tanács, 2024)](https://eur-lex.europa.eu/legal-content/HU/TXT/?uri=CELEX:32024R1689)
- [(EU) 2026/1744 rendelet (az MI-rendeletet módosító digitális omnibusz) (Európai Parlament és Tanács, 2026)](https://eur-lex.europa.eu/legal-content/HU/TXT/?uri=CELEX:32026R1744)
- [(EU) 2023/1795 bizottsági végrehajtási határozat (EU–USA adatvédelmi keret) (Európai Bizottság, 2023)](https://eur-lex.europa.eu/legal-content/HU/TXT/?uri=CELEX:32023D1795)
- [(EU) 2016/679 rendelet (GDPR) (Európai Parlament és Tanács, 2016)](https://eur-lex.europa.eu/legal-content/HU/TXT/?uri=CELEX:32016R0679)
- [Use of artificial intelligence in enterprises (Eurostat, 2025)](https://ec.europa.eu/eurostat/databrowser/view/isoc_eb_ai)
- [Individuals' use of generative AI tools (Eurostat, 2025)](https://ec.europa.eu/eurostat/databrowser/view/isoc_ai_iaiu/default/table)

### Nemzetközi

- [Claude Enterprise (Anthropic, letöltve 2026)](https://claude.com/solutions/enterprise)
- [Generative AI in Google Workspace Privacy Hub (Google, 2026)](https://knowledge.workspace.google.com/admin/generative-ai/generative-ai-in-google-workspace-privacy-hub)
- [RouteLLM: Learning to Route LLMs with Preference Data (Ong et al., ICLR 2025)](https://proceedings.iclr.cc/paper_files/paper/2025/file/5503a7c69d48a2f86fc00b3dc09de686-Paper-Conference.pdf)
- [Model Context Protocol specifikáció (Model Context Protocol, 2025)](https://modelcontextprotocol.io/specification/2025-11-25)
- [Data, Privacy, and Security for Microsoft 365 Copilot (Microsoft, letöltve 2026)](https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-privacy)
- [Hidden Technical Debt in Machine Learning Systems (Sculley et al., NeurIPS 2015)](https://proceedings.neurips.cc/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf)
- [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (Lewis et al., NeurIPS 2020)](https://proceedings.neurips.cc/paper/2020/file/6b493230205f780e1bc26945df7481e5-Paper.pdf)
- [NIST AI 600-1: Artificial Intelligence Risk Management Framework – Generative Artificial Intelligence Profile (NIST, 2024)](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf)
- [Enterprise privacy at OpenAI (OpenAI, 2026)](https://openai.com/enterprise-privacy/)
- [OWASP Top 10 for Agentic Applications (Version 2026) (OWASP GenAI Security Project, 2025)](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/)
- [OWASP Top 10 for LLM Applications 2026 (OWASP GenAI Security Project, 2026)](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/)
- [Agent Skills – Overview (Agent Skills, letöltve 2026)](https://agentskills.io)
