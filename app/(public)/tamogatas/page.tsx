import Link from 'next/link';

export const metadata = {
  title: 'Támogatás — Betűkert',
  description: 'Segítség és kapcsolatfelvétel a Betűkert alkalmazással kapcsolatban.',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl mb-3" style={{ fontWeight: 700, color: '#234430' }}>
        {title}
      </h2>
      <div className="space-y-3 text-[15px] leading-relaxed" style={{ color: '#3C4A3D' }}>
        {children}
      </div>
    </section>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontWeight: 700 }}>{q}</p>
      <p>{children}</p>
    </div>
  );
}

const linkStyle = { color: '#2F6B3F', textDecoration: 'underline' };

export default function SupportPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl mb-2" style={{ fontWeight: 800, color: '#234430' }}>
        Támogatás
      </h1>
      <p className="text-sm mb-10" style={{ color: '#8A8478' }}>
        Segítség a Betűkert alkalmazás használatához — Support for the Betűkert app
      </p>

      <Section title="Kapcsolat">
        <p>
          Kérdésed van, hibát találtál, vagy segítségre van szükséged az Alkalmazás
          használatában? Írj nekünk bátran, általában 1–2 munkanapon belül válaszolunk:
        </p>
        <p>
          E-mail:{' '}
          <a href="mailto:info@betukert.hu" style={{ color: '#2F6B3F', fontWeight: 700 }}>
            info@betukert.hu
          </a>
        </p>
        <p>
          Hibabejelentésnél sokat segít, ha megírod, milyen készüléket és rendszert használsz
          (iPhone / Android), melyik képernyőn történt a hiba, és ha tudsz, mellékelsz egy
          képernyőfotót.
        </p>
        <p className="text-sm" style={{ color: '#8A8478' }}>
          For support in English, email us at the address above — we typically reply within 1–2
          business days. The app itself is available in Hungarian only.
        </p>
      </Section>

      <Section title="Az alkalmazásról röviden">
        <p>
          A Betűkert magyar nyelvű, Meixner-módszerre épülő olvasástanuló alkalmazás gyerekeknek,
          iOS és Android telefonokra. A tananyag <strong>45 szintből</strong> áll: minden szint
          egy (a nagybetűs szakaszon több) új betűt vezet be, és a gyakorlás <strong>22
          feladattípusból</strong> áll össze a betűfelismeréstől a mondatértésig.
        </p>
        <p>
          Az <strong>első 5 szint ingyenes</strong>. A teljes tananyaghoz (mind a 45 szint) és a
          szabad gyakorláshoz teljes hozzáférés szükséges, amely egyszeri vásárlással vagy havi,
          illetve éves előfizetéssel oldható fel. A hozzáférés a szülői fiókhoz tartozik, tehát
          egyszerre érvényes az összes gyermekprofilra. Az Alkalmazás nem tartalmaz hirdetést.
        </p>
      </Section>

      <Section title="Fiók és bejelentkezés">
        <div className="space-y-5">
          <Faq q="Nem tudok bejelentkezni. Mit tegyek?">
            Ellenőrizd, hogy ugyanazzal a módszerrel (e-mail + jelszó, Google vagy Apple)
            próbálsz-e belépni, amellyel a fiókot létrehoztad — a Google-fiók és az ugyanolyan
            című e-mailes fiók két külön fiók. E-mailes regisztráció után a megerősítő levélben
            lévő linkre is rá kell kattintani, különben a belépés elutasításra kerül. Ha továbbra
            sem sikerül, írj nekünk e-mailben.
          </Faq>
          <Faq q="Elfelejtettem a fiókom jelszavát.">
            Az e-mail + jelszó módszerrel létrehozott fiókokhoz jelenleg e-mailben tudunk
            jelszó-visszaállító linket küldeni: írj nekünk arról a címről (vagy azzal a címmel),
            amellyel a fiók készült. Google- vagy Apple-fiókkal belépve a jelszót az adott
            szolgáltatónál tudod kezelni.
          </Faq>
          <Faq q="Elfelejtettem a szülői PIN kódot.">
            A szülői PIN-képernyő alján koppints az „Elfelejtetted a PIN kódot?” linkre. Igazold,
            hogy te vagy a fiók tulajdonosa (e-mailes fióknál a fiók jelszavával, Google/Apple
            fióknál újra bejelentkezve), majd adj meg egy új 4 jegyű PIN kódot.
          </Faq>
          <Faq q="Több gyereknek is használhatjuk egy fiókkal?">
            Igen. Egy szülői fiók alatt tetszőleges számú gyermekprofil hozható létre, mindegyik
            saját haladással; a profilválasztón bármikor lehet köztük váltani. A megvásárolt
            teljes hozzáférés mindegyik profilra érvényes.
          </Faq>
          <Faq q="Új telefonra váltottam. Megmarad a haladás?">
            Igen. Lépj be ugyanazzal a fiókkal, és a gyermekprofilok, a szintek és a tanulási
            adatok letöltődnek a felhőből. A vásárlást a „Korábbi vásárlás visszaállítása”
            gombbal töltheted vissza.
          </Faq>
        </div>
      </Section>

      <Section title="Vásárlás és előfizetés">
        <div className="space-y-5">
          <Faq q="Megvettem az előfizetést, de nem aktív. Hogyan állíthatom vissza?">
            A vásárlás az App Store, illetve a Google Play fiókodhoz kötődik. Nyisd meg a
            vásárlási képernyőt (vagy a Szülői felület „Előfizetés” kártyáját), és koppints a
            „Korábbi vásárlás visszaállítása” lehetőségre. Fontos, hogy ugyanazzal a store-fiókkal
            legyél bejelentkezve a készüléken, amellyel vásároltál. Ha ez nem segít, írj nekünk a
            vásárláskor kapott nyugta dátumával.
          </Faq>
          <Faq q="Hogyan mondhatom le az előfizetést?">
            Az előfizetést az Apple, illetve a Google kezeli. A legegyszerűbb út: Szülői felület →
            „Előfizetés” kártya → „Előfizetés kezelése és lemondása” — ez közvetlenül a store
            előfizetés-kezelőjét nyitja meg. Ugyanide jutsz iPhone-on a Beállítások → saját neved →
            Előfizetések, Androidon a Play Áruház → profilkép → Fizetések és előfizetések
            menüponton át. Lemondás után a már kifizetett időszak végéig megmarad a hozzáférés.
          </Faq>
          <Faq q="Hol látom, meddig érvényes a hozzáférésem?">
            A Szülői felület alján lévő „Előfizetés” kártyán. Ott jelenik meg a következő terhelés
            vagy a lejárat dátuma, illetve az, ha örök (egyszeri vásárlásos) hozzáférésed van.
          </Faq>
          <Faq q="Egyszeri vásárlásom van, mégis fut egy előfizetés is. Mit tegyek?">
            Ilyenkor az Alkalmazás külön figyelmeztet az „Előfizetés” kártyán: az előfizetésre
            nincs szükséged, mert a hozzáférésed enélkül is megmarad — érdemes lemondani a store
            előfizetés-kezelőjében.
          </Faq>
          <Faq q="Visszatéríthető a vásárlás?">
            A visszatérítést az Apple, illetve a Google intézi, mert a vásárlás náluk történt:
            iOS-en a reportaproblem.apple.com oldalon, Androidon a Google Play súgójában kérhető.
            Ha elakadsz, szólj nekünk, és segítünk.
          </Faq>
        </div>
      </Section>

      <Section title="Használat és haladás">
        <div className="space-y-5">
          <Faq q="Hogyan lép szintet a gyerek?">
            Automatikusan, a teljesítménye alapján: egy betű akkor „érik be”, ha legalább hat
            külön gyakorlókörben találkozott vele, összegyűlt rá a szükséges számú helyes válasz,
            és a legutóbbi válaszainak legalább 80%-a helyes volt. Amikor a szint minden betűje
            beérett, az Alkalmazás a kör végén léptet, és ünnepli az új betűt.
          </Faq>
          <Faq q="A gyerekem elakadt egy szinten.">
            Néhány kör után egy beépített biztonsági háló magától továbbengedi, a nehezen rögzülő
            betű pedig ismétlésként tér vissza a következő szinteken (a Szülői felületen az
            „Ismétlésre vár” kártyán látod, melyek ezek). Ha gyorsítanál, a Szülői felületen a
            szint melletti „+” gombbal kézzel is léptethetsz; a „Betűnként” bontásból pedig
            látszik, pontosan melyik betű a nehéz.
          </Faq>
          <Faq q="A haladás megállt a 35. szinten.">
            Ez nem hiba: a 35. szinttel elfogynak a kisbetűk. A folytatáshoz a Szülői felületen be
            kell kapcsolni a „Nagybetűk” kapcsolót (a 28. szinttől jelenik meg), ezután indul a
            nagybetűs szakasz.
          </Faq>
          <Faq q="Beleszámít a szabad gyakorlás a haladásba?">
            Nem. A szabad gyakorlás szándékosan nem rögzít haladást, nem léptet szintet és nem
            jelenik meg a statisztikában — így bátran használható egy-egy nehezebb feladattípus
            külön gyakorlására.
          </Faq>
          <Faq q="Miért nem jelennek meg bizonyos feladattípusok?">
            Három oka lehet: a szülő kikapcsolta a típust (vagy a beállított szinttartományon
            kívül esik); a típus csak magasabb szinttől indul (a mondatfeladatok például a 10.
            szinttől, a kis- és nagybetű párosítás a 36.-tól); vagy az adott szinten még nincs
            hozzá elég tartalom. A beállításokat a Szülői felület → „Feladattípusok beállítása”
            képernyőn találod.
          </Faq>
          <Faq q="Túl sok / túl kevés egy feladattípus.">
            Minden típusnál állítható a súlyozás (Ritka / Normál / Gyakori), a szinttartomány, és
            teljesen ki is kapcsolható. A betűs típusoknál látható ★ jelzés arra figyelmeztet,
            hogy az adott típus beleszámít a szintlépésbe: kikapcsolva a haladás lassulhat, de nem
            áll meg.
          </Faq>
        </div>
      </Section>

      <Section title="Technikai kérdések">
        <div className="space-y-5">
          <Faq q="Nem hallható a feladatok felolvasása.">
            Ellenőrizd, hogy a Szülői felületen be van-e kapcsolva az „Automatikus felolvasás”, és
            hogy a készülék hangereje nincs-e lehalkítva. Néhány feladattípushoz szándékosan nincs
            felvett hang — ezeknél a hangszóró gomb sem jelenik meg. Az utasítás bármikor újra
            lejátszható a jobb felső 🔊 gombbal.
          </Faq>
          <Faq q="Egy feladatnál nem jelenik meg a kép.">
            Ilyenkor az adott feladathoz még nincs feltöltött kép, vagy a tananyag letöltése nem
            fejeződött be. Kapcsolódj internetre, és a Szülői felület „Feladatok forrása” sorában
            az ↺ gombbal indítsd újra a szinkronizálást. Ha a probléma megmarad, írj nekünk.
          </Faq>
          <Faq q="Működik internet nélkül?">
            Igen, az első sikeres szinkronizálás után. A tananyag (képek, hangok, szavak,
            mondatok) letöltődik a készülékre, és a haladás offline is rögzül — a szinkronizálás
            magától pótlódik, amint újra van kapcsolat.
          </Faq>
          <Faq q="Hogyan hozhatom vissza az alkalmazáson belüli tippeket?">
            Szülői felület → „Fiók” szakasz → „Tippek újraindítása”. Ezután a madár tippjei újra
            megjelennek a képernyőkön.
          </Faq>
          <Faq q="Milyen készülék kell hozzá?">
            Telefonra készült alkalmazás (álló tájolás), iOS és Android rendszeren. Tabletre
            jelenleg nincs külön optimalizált változat.
          </Faq>
        </div>
      </Section>

      <Section title="Adatok és törlés">
        <div className="space-y-5">
          <Faq q="Hogyan törölhetek egy gyermekprofilt?">
            A profilválasztó („Ki olvas ma?”) képernyőn koppints a profil melletti 🗑 ikonra, add
            meg a profilhoz tartozó szülői PIN kódot, majd erősítsd meg a törlést. Ez a profilt és
            a hozzá tartozó összes tanulási adatot véglegesen eltávolítja.
          </Faq>
          <Faq q="Hogyan törölhetem a teljes fiókomat?">
            Szülői felület → „Fiók” szakasz → „Fiók végleges törlése” (két megerősítéssel). Ez a
            szülői fiókot, az összes gyermekprofilt és minden haladási adatot törli. Ha nem tudsz
            belépni, e-mailben is kérheted a törlést — a részletes lépéseket a{' '}
            <Link href="/fiok-torles" style={linkStyle}>
              Fiók törlése
            </Link>{' '}
            oldalon találod. A fiók törlése nem mondja le az előfizetést, és a megvásárolt
            hozzáférés egy új fiókban visszaállítható.
          </Faq>
          <Faq q="Milyen adatokat kezeltek a gyerekről?">
            Csak a profil nevét (akár becenév is lehet) és a gyakorlás eredményeit, a tanulás
            személyre szabásához. Életkort, fényképet, hangfelvételt vagy elérhetőséget nem kérünk,
            hirdetést és külső analitikát nem használunk. Részletek az{' '}
            <Link href="/adatvedelem" style={linkStyle}>
              Adatvédelmi tájékoztatóban
            </Link>
            .
          </Faq>
        </div>
      </Section>
    </div>
  );
}
