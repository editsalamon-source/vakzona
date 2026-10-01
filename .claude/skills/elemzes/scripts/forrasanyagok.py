# A Forrásanyagok melléklet generálása: a fejezetekben ténylegesen hivatkozott
# forráskódokat kikeresi a kulso-forrasanyagok/FORRASJEGYZEK.md-ből, és
# körönként (hazai, uniós, nemzetközi) táblázatba rendezi, eredeti URL-lel.
import os, re, glob
import sys
if len(sys.argv) < 3:
    sys.exit("Használat: python forrasanyagok.py <elemzés-könyvtár> <melléklet-szám> [lezárás dátuma]")
E = sys.argv[1]
NUM = sys.argv[2]
DATE = sys.argv[3] if len(sys.argv) > 3 else "[helykitöltő]"
fj = open(os.path.join(E, "kulso-forrasanyagok", "FORRASJEGYZEK.md"), encoding="utf-8").read()
reg = {}
for line in fj.split("\n"):
    if not line.startswith("| ") or line.startswith("| Kód") or line.startswith("|---"):
        continue
    c = [x.strip() for x in line.strip().strip("|").split("|")]
    if len(c) >= 11 and c[1] in ("hazai", "uniós", "nemzetközi"):
        reg.setdefault(c[0].replace("(ÚJ)", "").strip(), []).append(dict(kor=c[1], cim=c[2], kiado=c[3], datum=c[4], url=c[5], megb=c[8]))

used = {}
for f in sorted(glob.glob(os.path.join(E, "fejezetek", "*.md"))):
    if os.path.basename(f).endswith("_forrasanyagok.md"):
        continue
    for m in re.finditer(r"\[([A-Z0-9][A-Z0-9-]*[A-Z0-9])\]", open(f, encoding="utf-8").read()):
        used.setdefault(m.group(1), set()).add(os.path.basename(f))
# szögletes zárójelen belüli, vesszővel/pontosvesszővel felsorolt kódok is
for f in sorted(glob.glob(os.path.join(E, "fejezetek", "*.md"))):
    if os.path.basename(f).endswith("_forrasanyagok.md"):
        continue
    for m in re.finditer(r"\[([A-Z0-9][A-Z0-9 ,;/-]+)\]", open(f, encoding="utf-8").read()):
        for code in re.split(r"[ ,;/]+", m.group(1)):
            if code:
                used.setdefault(code, set()).add(os.path.basename(f))

for f in sorted(glob.glob(os.path.join(E, "fejezetek", "*.md"))):
    if os.path.basename(f).endswith("_forrasanyagok.md"):
        continue
    txt = open(f, encoding="utf-8").read()
    for code in reg:
        if re.search(r"(?<![A-Z0-9-])" + re.escape(code) + r"(?![A-Z0-9-])", txt):
            used.setdefault(code, set()).add(os.path.basename(f))

unknown = sorted(c for c in used if c not in reg)
print("hivatkozott források:", len(used), "(irányérték: kb. 15–20)")
print("a jegyzékben nem szereplő kódok:", unknown)
unused = sorted(c for c in reg if c not in used)
print("in register, not cited:", unused)

def clean_url(u):
    # több URL vagy megjegyzés esetén az első URL
    m = re.search(r"https?://[^\s;|<>)\]]+(?:\([^\s)]*\)[^\s;|<>)\]]*)*", u)
    return m.group(0) if m else u.strip()


def clean_title(t):
    # munkajegyzet-megjegyzések eltávolítása a címből
    t = re.sub(r"\s*[–-]\s*\*\*.*?\*\*", "", t)
    t = re.sub(r"\s*\((?:[^()]*\b(?:új|helyett|helyettesít)\w*\b[^()]*)\)", "", t)
    t = t.replace("**", "")
    return t.strip()

out = [f"# {NUM}. melléklet: Forrásanyagok", "",
       f"A források lezárásának dátuma: {DATE}. Minden hivatkozás az",
       "eredeti, hivatalos lelőhelyre mutat. A melléklet kizárólag külső, nyilvános",
       "forrásokat tartalmaz. Megbízhatóság: **M** = magas (hivatalos, lektorált vagy",
       "elsődleges intézményi forrás), **K** = közepes (érdekelt fél, például",
       "pilotszervező, párt vagy érdekképviselet saját közlése).", ""]
for kor, title in (("hazai", "Hazai források"), ("uniós", "Uniós források"), ("nemzetközi", "Nemzetközi források")):
    out += [f"## {title}", "", "| Kód | Forrás | Kiadó | Dátum | Megb. |", "|---|---|---|---|---|"]
    for code in sorted(c for c in used if c in reg and reg[c][0]["kor"] == kor):
        for r in reg[code]:
            cim = clean_title(r["cim"]).replace("[", "(").replace("]", ")")
            out.append(f"| {code} | [{cim}]({clean_url(r['url'])}) | {r['kiado']} | {r['datum']} | {r['megb']} |")
    out.append("")
open(os.path.join(E, "fejezetek", f"M{int(NUM):02d}_forrasanyagok.md"), "w", encoding="utf-8").write("\n".join(out))
print("written")
