# A fejezetek/*.md fájlokból összefűzi a teljes PDF-forrást: <elemzés>/pdf/teljes-elemzes.md
# Használat: python pdf_osszefuz.py "Elemzés/<url-azonosító>"
# - 00_osszefoglalo.md -> "> **Összefoglaló**" blokk; utána a pdf/bevezeto.md (ha van) rövid bevezetőként
# - 00a_alapok.md -> "## Alapok: …" (számozatlan); 01..NN -> "## Cím" (a szám nélkül; a sablon számoz)
# - Mnn mellékletek -> "## N. melléklet: Cím"; az utolsó (forrásanyagok) -> "## Forrásanyagok"
# - minden alcím egy szinttel lejjebb; a "→ *Bővebben: …*" sorok kimaradnak
# - <!-- ÁBRA: Ax … --> megjegyzések helyére kép kerül az abrak/abrak.txt alapján
#   (soronként: "A1 | /elemzesek/<url-azonosító>/kep.webp | képaláírás")
import os, re, sys, glob

E = sys.argv[1]
F = os.path.join(E, "fejezetek")
abrak = {}
ap = os.path.join(E, "abrak", "abrak.txt")
if os.path.exists(ap):
    for line in open(ap, encoding="utf-8"):
        parts = [p.strip() for p in line.split("|")]
        if len(parts) == 3:
            abrak[parts[0]] = (parts[1], parts[2])
used = set()

def body(path):
    return open(path, encoding="utf-8").read().replace("\r\n", "\n")

def shift(text):
    out = []
    for line in text.split("\n"):
        if re.match(r"^→ \*Bővebben", line.strip()):
            continue
        m = re.match(r"^<!--\s*ÁBRA:\s*(A\d+)", line.strip())
        if m:
            k = m.group(1)
            if k in abrak and k not in used:
                used.add(k)
                src, cap = abrak[k]
                out += [f"![{cap}]({src})", f"*{cap}*"]
            continue
        h = re.match(r"^(#{2,5}) (.*)$", line)
        out.append(("#" + h.group(1) + " " + h.group(2)) if h else line)
    return "\n".join(out).strip()

def split_title(text):
    lines = text.split("\n")
    i = next(n for n, l in enumerate(lines) if l.startswith("# "))
    return lines[i][2:].strip(), "\n".join(lines[i + 1:])

parts = []
osz = os.path.join(F, "00_osszefoglalo.md")
osz_web = os.path.join(F, "00_osszefoglalo_web.md")
hosszu = None
if os.path.exists(osz):
    _, b = split_title(body(osz))
    b = re.sub(r"^#{2,4} (.*)$", r"**\1**", b.strip(), flags=re.M)
    if len(b.split()) > 250 and os.path.exists(osz_web):
        # a hosszú összefoglaló nem fér a „Röviden” nyitóoldalra: ott a rövid (webes) doboz áll,
        # a teljes összefoglaló számozatlan „Összefoglaló” fejezetként következik
        w = body(osz_web).strip()
        w = "\n".join(l if l.startswith(">") else "> " + l for l in w.split("\n"))
        parts.append("> **Összefoglaló**\n>\n" + w)
        hosszu = b
    else:
        parts.append("> **Összefoglaló**\n>\n" + "\n".join(("> " + l) if l.strip() else ">" for l in b.split("\n")))
bev = os.path.join(E, "pdf", "bevezeto.md")
if os.path.exists(bev):
    parts.append(body(bev).strip())
if hosszu:
    parts.append("## Részletes összefoglaló\n\n" + hosszu)
alap = os.path.join(F, "00a_alapok.md")
if os.path.exists(alap):
    t, b = split_title(body(alap))
    parts.append(f"## {t}\n\n" + shift(b))
for p in sorted(glob.glob(os.path.join(F, "[0-9][0-9]_*.md"))):
    if os.path.basename(p).startswith("00"):
        continue
    t, b = split_title(body(p))
    t = re.sub(r"^\d+\.\s*", "", t)
    parts.append(f"## {t}\n\n" + shift(b))
mell = sorted(glob.glob(os.path.join(F, "M[0-9][0-9]_*.md")))
for i, p in enumerate(mell):
    t, b = split_title(body(p))
    if i == len(mell) - 1 and "forrás" in t.lower():
        t = "Forrásanyagok"
    parts.append(f"## {t}\n\n" + shift(b))
os.makedirs(os.path.join(E, "pdf"), exist_ok=True)
out = os.path.join(E, "pdf", "teljes-elemzes.md")
txt = "\n\n".join(parts) + "\n"
open(out, "w", encoding="utf-8").write(txt)
missing = [k for k in abrak if k not in used]
print(f"{out}: {len(txt.split())} szó; ábrák beszúrva: {sorted(used)}; nem használt: {missing}")
