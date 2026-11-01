// Témacímkék az MI-tartalmakhoz (tanfolyamok és elemzések) egy helyen: ezekre lehet szűrni az Akadémia
// és az elemzések kategóriaoldalán. A Markdown fejlécében: `címkék: Alapok, Vállalati bevezetés`
// (névvel vagy azonosítóval, vesszővel elválasztva; egy tartalom több címkét is kaphat). Azonosító = az URL-paraméter
// (?cimke=jog). Új címkét csak itt kell felvenni. Külön fájl, mert a Node-os build-szkriptek is használhatják.
const CIMKEK = [
  { slug: "alapok", name: "Alapok", description: "Belépő szint: fogalmak, működés és tudatos használat." },
  { slug: "modszertan", name: "Módszertan", description: "Lépésről lépésre: hogyan készül el és hogyan fut egy MI-program." },
  { slug: "agensek", name: "Ágensek és technológia", description: "Hogyan működnek a modellek, az ágensek és a platformok." },
  { slug: "bevezetes", name: "Vállalati bevezetés", description: "Döntések, szervezet és értékteremtés a vállalati használatban." },
  { slug: "jog", name: "Jog és adatvédelem", description: "Szabályozás, szerződések, adatvédelem és jogérvényesítés." },
  { slug: "biztonsag", name: "Biztonság és kockázat", description: "Kockázatok, kontrollok és biztonságos használat." },
  { slug: "munka", name: "Munka és társadalom", description: "Az MI hatása a munkára, a pályákra és a társadalomra." },
];

export function getCimke(slugOrName) {
  return CIMKEK.find((c) => c.slug === slugOrName || c.name === slugOrName) || null;
}

// „Alapok, Biztonság és kockázat” → címkeobjektumok (az ismeretlent jelezzük, de kihagyjuk)
export function parseCimkek(value = "", forras = "") {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const c = getCimke(s);
      if (!c) console.warn(`Ismeretlen címke: „${s}”${forras ? ` (${forras})` : ""}`);
      return c;
    })
    .filter(Boolean);
}

// a tartalmakon ténylegesen előforduló címkék darabszámmal, a fenti sorrendben
export function cimkekDarabbal(items) {
  return CIMKEK.map((c) => ({ ...c, count: items.filter((i) => i.tags?.some((t) => t.slug === c.slug)).length })).filter(
    (c) => c.count > 0
  );
}

export default CIMKEK;
