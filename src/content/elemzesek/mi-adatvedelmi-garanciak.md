---
cím: Odaadjuk, de mi lesz vele?
alcím: Mit vállalnak az MI-szolgáltatók az átadott adatokról, hol szivároghat az adat, mit vár el a jog, és mit tehet egy szervezet, ha baj van – adatkörönkénti döntési javaslattal, tíz szolgáltató nyilvános feltételei alapján.
dátum: 2026-10-31
kategória: MI
címkék: Jog és adatvédelem, Vállalati bevezetés
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

> **A védelem az aláírásnál dől el**
>
> Egy munkatárs bemásol egy hosszú szerződést egy MI-csevegőbe, hogy az néhány bekezdésben összefoglalja. Pár másodperc, és kész. Csakhogy a szöveg közben elhagyta a gépét, és egy szolgáltató rendszerébe került. Onnantól már nem a szervezet dönti el, hol tárolják, ki látja, és mire használják.
>
> Mit ígérnek erről a szolgáltatók, és mennyit érnek ezek az ígéretek, ha baj történik? Ennek járt utána ez az elemzés, tíz szolgáltató nyilvános feltételei alapján: öt nagyét (OpenAI, Anthropic, Google, Microsoft, AWS) és öt európaiét (Mistral, Aleph Alpha, OVHcloud, STACKIT, IONOS).
>
> Kezdjük a jó hírrel. Üzleti szinten a nagyoknál van egy közös alapszint: az ügyféltartalommal nem tanítanak modellt, adatfeldolgozóként, vagyis az ügyfél utasításai szerint járnak el, titkosítanak, és független tanúsítvánnyal rendelkeznek. **Ugyanaz a márka azonban két szabálykönyv szerint működik.** A fogyasztói és ingyenes szint feltételei fejlesztési felhasználást, egyes esetekben emberi felülvizsgálatot is engedhetnek. A szabályok tehát az ajánlati szinthez kötődnek, nem a márkához vagy a modellhez.
>
> Az első meglepetés akkor jön, amikor megnézzük, hol is állnak ezek az ígéretek. **A 190 vizsgált szolgáltatói vállalásból 96 nem szerződésben, hanem súgóoldalon vagy termékdokumentációban szerepel.** Ide tartozik például a ZDR (zero data retention), vagyis az, hogy a szolgáltató az ügyféltartalmat nem őrzi meg. Ez ritkán alapértelmezés, jóváhagyáshoz kötött, és vannak kivételei. Hogy a súgóban álló vállalások a konkrét szerződésben is kötik-e a szolgáltatót, nyilvános forrásból nem állapítható meg.
>
> A második meglepetés a baj pillanatára vonatkozik. **Adatvédelmi incidensre egyik vizsgált szolgáltató sem vállal kártalanítást.** Az OpenAI, az Anthropic és a Mistral felelőssége az esemény előtti 12 hónapban fizetett díjra korlátozott. A szerződések többnyire csak annyit mondanak, hogy a szolgáltató „indokolatlan késedelem nélkül” értesít. Órában mért határidőt egyedül az Anthropic nevesít, 48 órát.
>
> Hogy ez nem elméleti kérdés, azt a vizsgált források is mutatják. Az OpenAI 2023-as gyorsítótár-hibája miatt egyes felhasználók más felhasználók csevegéseinek címeit látták, a ChatGPT Plus előfizetők 1,2%-ánál pedig fizetési adat is látható lehetett. A tanulság: az ügyfelek közötti elkülönítés hibája a vezető szolgáltatónál is bekövetkezett, és az ügyfél nem tudta megelőzni.
>
> Az elemzés 19 kockázatot azonosított. Ezekből kirajzolódik a szerződések valódi hatóköre. A tanítás, a megőrzés és az alfeldolgozók, vagyis a szolgáltató által bevont további cégek ügyében erősek. A támadások, például a prompt injection, amikor a támadó utasítást csempész a modell bemenetébe, a hibák, az EU-n kívüli feldolgozás, a külföldi hatósági hozzáférés és a nem engedélyezett eszközhasználat ellen alig vagy egyáltalán nem védenek.
>
> > „A szerződés a szolgáltató tervezett adathasználata ellen véd. A váratlan hibák és a támadások ellen alig.”
>
> És itt jön a legkényelmetlenebb rész. **A kitettség a szervezetnél marad.** Az érintettel szemben a szervezet adatkezelőként felel, az Európai Unió Bírósága szerint a nevében eljáró adatfeldolgozóért is. A biztonsági intézkedések megfelelőségét neki kell bizonyítania, és egy harmadik fél támadása önmagában nem mentesíti. A kártérítéshez súlyossági küszöb sincs. A szolgáltatóval szemben viszont csak megrendelő, aki a szerződés alapján léphet fel, és ott a 12 havi díjplafon a határ.
>
> A hatósági út sem segít a károsultnak. Az olasz adatvédelmi hatóság 15 millió eurós bírságot szabott ki az OpenAI-ra, ezt azonban egy római bíróság 2026 márciusában hatásköri okból megsemmisítette, érdemi kérdésekben nem döntött. **A bírság egyébként sem kártérítés:** sem az érintettnek, sem a megrendelőnek nem jár.
>
> Mit lehet akkor MI-re bízni? Az elemzés öt megoldást és négy adatkört (személyes adat, üzleti titok, hivatásbeli titok, közszféra-adat) vetett össze. **Az eredmény józanító: a 20 párosból egy GO, 13 feltételes GO és 6 NO-GO.** A feltételes GO nem azt jelenti, hogy ma vállalható, hanem azt, hogy a megjelölt követelmények teljesítése esetén az lesz. Fogyasztói szolgáltatásba egyik adatkör sem való, banktitok a nagy szolgáltatókhoz sem, mert a banki kiszervezésnél kötelező felügyeleti ellenőrzési jogot egyik sem vállalja.
>
> Az egyetlen feltétel nélküli GO a saját szerveren futtatott modell az üzleti titokra. Ez a feltételrendszer a legkedvezőbb, de a kockázatot a szervezetre telepíti: a modellfájlok ellenőrzése, az elkülönítés, a titkosítás és a licencek átvilágítása a saját feladata. Az európai szuverén felhők besorolása feltételes és forráshiányos, mert szerződéses szövegeik nem nyilvánosak. Ez nem azt jelenti, hogy kevesebbet vállalnak.
>
> Változtat-e mindezen a jog? Az elemzés szerint a forrásokban nincs olyan hatályos vagy közelgő kötelező változás, amely a felelősségi plafont és a kártalanítás hiányát közvetlenül megszüntetné. **A szigorúbb ágazati szabályokhoz a mai vállalások sem mindig elegek.** A közszférában 24 órán belül első bejelentést kell tenni a kiberbiztonsági incidensről, ehhez az Anthropic 48 órás vállalása is kevés.
>
> Az elemzés javaslata ezért a beszerzési asztalra mutat. A szolgáltatói hozzáférés szűkítését, a külföldi hatósági megkeresések jelentését, az auditjogot, a tartalék adattovábbítási jogalapot és az órában mért értesítést a szerződésbe kell emelni, ahogy azt is, ami ma csak a súgóban áll. A munkaadat számára a fogyasztói szintet pedig érdemes tiltani.
>
> Mindez szakértői értékelés, nem jogi tanácsadás. A vizsgálat a standard, nyilvános feltételekre épül, a 2026. október végi állapot szerint, és egy egyedi ügyfélszerződés ennél többet vagy mást is tartalmazhat.
>
> > „A jogérvényesítés hatékonysága nem a baj után dől el, hanem a szerződés aláírásakor.”
>
> Az a pár másodperces bemásolás tehát egy jóval korábbi döntésen múlik. **A védelem ott kezdődik, ahol a szervezet még az aláírás előtt eléri, hogy a fontos ígéretek a szerződésbe kerüljenek.**

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
