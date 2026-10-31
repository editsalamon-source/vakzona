import React from "react";
import { Link } from "react-router-dom";
import PageCSS from "../css/Page.module.css";

// Adatkezelési tájékoztató a Vakzóna-fiókhoz (src/utils/fiok.js, supabase/README.md).
// A [helykitöltő] részeket az adatkezelő adataival kell kitölteni, a szöveget élesítés előtt jogásszal érdemes átnézetni.
function Privacy() {
  return (
    <div className={`wrap ${PageCSS.page}`}>
      <div className={PageCSS.prose}>
        <span className="tag">Adatkezelés</span>
        <h1>Adatkezelési tájékoztató</h1>
        <p className="lead">
          A Vakzóna-fiókhoz a lehető legkevesebb adatot kezeljük: az e-mail-címét és a jelszava titkosított
          (visszafejthetetlen) lenyomatát.
        </p>

        <h2>Ki kezeli az adatokat?</h2>
        <p>
          Adatkezelő: [helykitöltő: név]. Székhely vagy cím: [helykitöltő]. Kapcsolat adatvédelmi ügyekben:
          [helykitöltő: e-mail-cím].
        </p>

        <h2>Milyen adatot kezelünk, és miért?</h2>
        <ul>
          <li>
            <strong>E-mail-cím:</strong> ezzel azonosítjuk a fiókot, ide küldjük a regisztráció megerősítését és a
            jelszó-visszaállító linket.
          </li>
          <li>
            <strong>Jelszó:</strong> csak a titkosított lenyomatát tároljuk, magát a jelszót senki sem látja.
          </li>
          <li>
            <strong>Hozzáférések:</strong> melyik tanfolyamot vagy zárolt dokumentumot nyithatja meg a fiók.
          </li>
          <li>
            <strong>Technikai adatok:</strong> a regisztráció és az utolsó belépés időpontja, valamint a
            szolgáltató biztonsági naplójában rövid ideig a belépéshez használt IP-cím.
          </li>
        </ul>
        <p>
          Nevet, telefonszámot, címet, fizetési adatot nem kérünk. Nem használunk hirdetési vagy követő sütit, és
          az adatokat nem adjuk el, nem használjuk marketingcélra.
        </p>
        <p>
          Az adatkezelés jogalapja a GDPR 6. cikk (1) bekezdés b) pontja: a fiók és a hozzáférés biztosítása, amelyet
          a regisztrációval kér.
        </p>

        <h2>Mi marad csak az Ön eszközén?</h2>
        <p>
          A tanfolyamokon elért haladás, az oklevélre írt név és a belépési munkamenet a böngészője helyi
          tárolójában van. Ezeket nem küldjük el, és a böngésző adatainak törlésével eltávolíthatók.
        </p>

        <h2>Kik férnek hozzá az adatokhoz (adatfeldolgozók)?</h2>
        <ul>
          <li>
            <strong>Supabase Inc.:</strong> a fiókok tárolása és a belépés. Az adatok az Európai Unióban lévő
            szerveren (Frankfurt, Németország) tárolódnak.
          </li>
          <li>
            <strong>[helykitöltő: levélküldő szolgáltató]:</strong> a megerősítő és a jelszó-visszaállító levelek
            kézbesítése.
          </li>
          <li>
            <strong>Vercel Inc.:</strong> a weboldal kiszolgálása.
          </li>
        </ul>

        <h2>Meddig őrizzük az adatokat?</h2>
        <p>
          A fiók adatait a fiók törléséig őrizzük. A fiókot bármikor törölheti a <Link to="/fiok">Fiók</Link> oldalon,
          ekkor az e-mail-cím, a jelszó lenyomata és a hozzáférések véglegesen törlődnek. A meg nem erősített
          regisztrációkat [helykitöltő] nap után töröljük.
        </p>

        <h2>Milyen jogai vannak?</h2>
        <p>
          Kérheti az adatai megismerését, helyesbítését, törlését, kezelésük korlátozását, és tiltakozhat az
          adatkezelés ellen. Az adatait géppel olvasható formában is kikérheti. Kérését a fenti kapcsolati címen
          fogadjuk.
        </p>
        <p>
          Panaszt a Nemzeti Adatvédelmi és Információszabadság Hatóságnál (NAIH, <a href="https://naih.hu" target="_blank" rel="noopener">naih.hu</a>)
          tehet, vagy bírósághoz fordulhat.
        </p>

        <p className="meta">Hatályos: [helykitöltő: dátum]</p>
      </div>
    </div>
  );
}

export default Privacy;
