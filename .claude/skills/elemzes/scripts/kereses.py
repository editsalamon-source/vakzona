# Célzott keresés egy letöltött forrásban, hogy ne kelljen a teljes fájlt
# elolvasni. A szöveget egyszer kinyeri (PDF: oldalanként, DOCX, CSV, MD/HTML,
# TXT), a kinyert szöveget gyorsítótárazza a fájl mellé (`.<fájlnév>.txt`),
# majd a megadott kulcsszavak találatait adja vissza oldalszámmal és rövid
# környezettel.
#
# Használat:
#   python kereses.py <fájl> "kulcsszó1" ["kulcsszó2" ...] [--kontextus 300] [--max 15]
#   python kereses.py <fájl> --oldalak 3-5        (adott oldalak szövege)
#   python kereses.py <fájl> --info               (oldalszám, méret, első sorok)
import os, re, sys, csv, zipfile, html

def kinyer(path):
    cache = os.path.join(os.path.dirname(path), "." + os.path.basename(path) + ".txt")
    if os.path.exists(cache) and os.path.getmtime(cache) >= os.path.getmtime(path):
        return open(cache, encoding="utf-8").read()
    ext = os.path.splitext(path)[1].lower()
    if ext == ".pdf":
        import pypdf
        r = pypdf.PdfReader(path)
        txt = "\n".join(f"=== o. {i + 1}\n{(p.extract_text() or '')}" for i, p in enumerate(r.pages))
    elif ext == ".docx":
        with zipfile.ZipFile(path) as z:
            x = z.read("word/document.xml").decode("utf-8")
        x = re.sub(r"</w:p>", "\n", x)
        txt = html.unescape(re.sub(r"<[^>]+>", "", x))
    elif ext in (".csv", ".tsv"):
        raw = open(path, "rb").read()
        for enc in ("utf-8", "cp1250", "latin-1"):
            try:
                txt = raw.decode(enc)
                break
            except UnicodeDecodeError:
                continue
    else:
        raw = open(path, "rb").read()
        try:
            txt = raw.decode("utf-8")
        except UnicodeDecodeError:
            txt = raw.decode("cp1250", errors="replace")
        if ext in (".html", ".htm"):
            txt = html.unescape(re.sub(r"<[^>]+>", " ", txt))
    open(cache, "w", encoding="utf-8").write(txt)
    return txt


def oldal_at(txt, pos):
    m = None
    for m in re.finditer(r"=== o\. (\d+)", txt[:pos]):
        pass
    return m.group(1) if m else "–"


def main():
    a = sys.argv[1:]
    if not a:
        sys.exit(__doc__ or "Használat: python kereses.py <fájl> kulcsszó ...")
    path, rest = a[0], a[1:]
    txt = kinyer(path)
    if "--info" in rest:
        oldalak = len(re.findall(r"=== o\. \d+", txt))
        print(f"{os.path.basename(path)}: {len(txt)} karakter, {oldalak or '–'} oldal")
        print(txt[:800])
        return
    if "--oldalak" in rest:
        tol, ig = (int(x) for x in rest[rest.index("--oldalak") + 1].split("-"))
        for n in range(tol, ig + 1):
            m = re.search(rf"=== o\. {n}\n(.*?)(?==== o\. |\Z)", txt, re.S)
            print(f"=== o. {n}\n{m.group(1) if m else '(nincs)'}")
        return
    ctx, mx = 300, 15
    if "--kontextus" in rest:
        ctx = int(rest[rest.index("--kontextus") + 1])
    if "--max" in rest:
        mx = int(rest[rest.index("--max") + 1])
    szavak = [w for i, w in enumerate(rest) if not w.startswith("--") and (i == 0 or not rest[i - 1].startswith("--"))]
    for w in szavak:
        hits = list(re.finditer(re.escape(w), txt, re.I))
        print(f"### „{w}”: {len(hits)} találat" + (f" (az első {mx})" if len(hits) > mx else ""))
        for h in hits[:mx]:
            s, e = max(0, h.start() - ctx // 2), min(len(txt), h.end() + ctx // 2)
            print(f"- o. {oldal_at(txt, h.start())}: …{' '.join(txt[s:e].split())}…")
        print()


if __name__ == "__main__":
    main()
