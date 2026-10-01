# Gépies ellenőrzések egy elemzésen, hogy a proofreader agentnek ne kelljen
# ezeket „olvasással” végeznie:
#   - forráskódok: a szövegben hivatkozott kódok megvannak-e a FORRASJEGYZEK-ben,
#     van-e hozzájuk kivonat, és hány forrásra hivatkozunk (irányérték 15–20);
#   - halmozás: egymás melletti több forráskód ugyanarra az állításra;
#   - [helykitöltő] előfordulások;
#   - tiltott maradványok (régi jelölők, MVT-kódok);
#   - kivonatok: van-e „## Fenntartások és érvényesség” részük;
#   - linkek (--linkek kapcsolóval): a FORRASJEGYZEK eredeti URL-jei;
#   - lezáró kör (--lezaro): linkek + megvan-e a munkajegyzetek/tenyellenorzes.md.
#
# Használat: python ellenorzes.py "Elemzés/<url-azonosító>" [--linkek | --lezaro]
import os, re, sys, glob, urllib.request

E = sys.argv[1] if len(sys.argv) > 1 else sys.exit("Használat: python ellenorzes.py <elemzés-könyvtár> [--linkek]")
LINKEK = "--linkek" in sys.argv or "--lezaro" in sys.argv
LEZARO = "--lezaro" in sys.argv
K = os.path.join(E, "kulso-forrasanyagok")

reg = {}
fj = os.path.join(K, "FORRASJEGYZEK.md")
if os.path.exists(fj):
    for line in open(fj, encoding="utf-8"):
        c = [x.strip() for x in line.strip().strip("|").split("|")]
        if len(c) >= 6 and c[1] in ("hazai", "uniós", "nemzetközi"):
            code = c[0].replace("(ÚJ)", "").strip()
            m = re.search(r"https?://[^\s;|<>)\]]+", c[5])
            reg[code] = dict(kor=c[1], url=m.group(0) if m else "")

fajlok = [f for f in sorted(glob.glob(os.path.join(E, "fejezetek", "*.md"))) if not f.endswith("_forrasanyagok.md")]
used, halmozas, helyk, tiltott = {}, [], [], []
TILTOTT = r"\[\[(CALLOUT|WIDTHS|NOBREAK|FIGURE)|\b(P|RC|IG|ALT|KOC|KPI)-\d|GO/NO-GO|megvalósíthatósági tanulmány"
for f in fajlok:
    n = os.path.basename(f)
    for i, line in enumerate(open(f, encoding="utf-8"), 1):
        for code in reg:
            if re.search(r"(?<![A-Z0-9-])" + re.escape(code) + r"(?![A-Z0-9-])", line):
                used.setdefault(code, []).append(f"{n}:{i}")
        for m in re.finditer(r"\[([A-Z0-9][A-Z0-9-]*[A-Z0-9])\]", line):
            if m.group(1) not in reg and m.group(1) != "K":
                used.setdefault(m.group(1), []).append(f"{n}:{i}")
        if re.search(r"(\[[A-Z0-9-]+\][\s,;]*){3,}", line):
            halmozas.append(f"{n}:{i}")
        if "[helykitöltő]" in line:
            helyk.append(f"{n}:{i}: {line.strip()[:110]}")
        if re.search(TILTOTT, line):
            tiltott.append(f"{n}:{i}: {line.strip()[:110]}")

print(f"Hivatkozott források: {sum(1 for c in used if c in reg)} (irányérték: 15–20)")
for kor in ("hazai", "uniós", "nemzetközi"):
    print(f"  {kor}: {sum(1 for c in used if reg.get(c, {}).get('kor') == kor)}")
ism = sorted(c for c in used if c not in reg)
print("A jegyzékben nem szereplő kódok:", ism or "nincs")
kiv = os.path.join(K, "kivonatok")
if os.path.isdir(kiv):
    hiany = sorted(c for c in used if c in reg and not os.path.exists(os.path.join(kiv, c + ".md")))
    print("Kivonat nélküli hivatkozott források:", hiany or "nincs")
    fenntartas_nelkul = sorted(
        os.path.splitext(fn)[0] for fn in os.listdir(kiv) if fn.endswith(".md")
        and not re.search(r"^##\s+Fenntartások", open(os.path.join(kiv, fn), encoding="utf-8").read(), re.M))
    print("Kivonat „## Fenntartások és érvényesség” rész nélkül:", fenntartas_nelkul or "nincs")
if LEZARO:
    te = os.path.join(K, "munkajegyzetek", "tenyellenorzes.md")
    print("Lezáró tényellenőrzés (munkajegyzetek/tenyellenorzes.md):",
          "megvan" if os.path.exists(te) else "HIÁNYZIK – lezárás előtt kötelező")
print(f"Halmozás (3+ kód egymás mellett): {len(halmozas)}", "; ".join(halmozas[:20]))
print(f"[helykitöltő]: {len(helyk)}")
for h in helyk:
    print("  " + h)
print(f"Tiltott maradványok: {len(tiltott)}")
for t in tiltott:
    print("  " + t)

if LINKEK:
    print("\nLinkellenőrzés (csak a hivatkozott források):")
    for code in sorted(c for c in used if c in reg and reg[c]["url"]):
        url = reg[code]["url"]
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            st = urllib.request.urlopen(req, timeout=20).status
        except urllib.error.HTTPError as e:
            st = e.code
        except Exception as e:
            st = type(e).__name__
        jel = "OK" if st == 200 else ("bot-blokk" if st in (202, 403, 405, 429) else "HIBA")
        if jel != "OK":
            print(f"  {jel} {st} {code} {url}")
    print("  (a fel nem sorolt linkek 200-at adtak)")
