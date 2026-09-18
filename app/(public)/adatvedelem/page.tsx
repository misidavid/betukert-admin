import Link from 'next/link';

export const metadata = {
  title: 'Adatvédelmi tájékoztató — Betűkert',
  description: 'A Betűkert alkalmazás adatvédelmi és adatkezelési tájékoztatója.',
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

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">

      <h1 className="text-3xl mb-2" style={{ fontWeight: 800, color: '#234430' }}>
        Adatvédelmi tájékoztató
      </h1>
      <p className="text-sm mb-10" style={{ color: '#8A8478' }}>
        Hatályos: 2026. szeptember 18-tól
      </p>

      <Section title="1. Bevezetés">
        <p>
          Jelen tájékoztató a Betűkert mobilalkalmazás (a továbbiakban: „Alkalmazás” vagy
          „Betűkert”) és a betukert.hu weboldal használata során kezelt személyes adatokról
          nyújt tájékoztatást, az Európai Parlament és a Tanács (EU) 2016/679 rendelete (a
          továbbiakban: GDPR), valamint az információs önrendelkezési jogról és az
          információszabadságról szóló 2011. évi CXII. törvény (Infotv.) alapján.
        </p>
        <p>
          A Betűkert gyermekek olvasástanulását segítő oktatási alkalmazás, amely a
          Meixner-módszer elvei alapján épül fel. Az Alkalmazást a szülő vagy más gondviselő
          tölti le, ő hozza létre és kezeli a fiókot, állítja be a gyermekprofilokat, és ő intézi
          az esetleges előfizetést — az Alkalmazás közvetlenül gyermektől nem kér és nem gyűjt
          személyes adatot, és nem kér gyermektől hozzájárulást.
        </p>
        <p>
          Az Alkalmazás iOS és Android rendszeren érhető el, kizárólag magyar nyelven. Az
          Alkalmazás nem tartalmaz hirdetést, nem használ analitikai vagy hirdetési
          szoftverfejlesztő-készletet (SDK-t), és nem tartalmaz a gyermek számára elérhető külső
          hivatkozást vagy vásárlási felületet: a vásárlási képernyő a szülői PIN-nel védett
          szülői felületről, illetve a fizetős funkciók megnyitásakor érhető el.
        </p>
      </Section>

      <Section title="2. Az adatkezelő">
        <p>
          Név: <strong>Betűkert</strong>
          <br />
          E-mail:{' '}
          <a href="mailto:info@betukert.hu" style={{ color: '#2F6B3F' }}>
            info@betukert.hu
          </a>
        </p>
      </Section>

      <Section title="3. Milyen adatokat kezelünk">
        <p><strong>a) Regisztrációs és bejelentkezési adatok (a szülő/gondviselő fiókja)</strong></p>
        <p>
          A bejelentkezéshez választásod szerint az alábbi módok egyikét használhatod: e-mail cím
          és jelszó, Google-fiók, vagy — iOS készüléken — Apple-fiók. A választott módtól függően
          kezeljük az e-mail címedet, valamint a Google/Apple által megosztott azonosítót és — ha
          a szolgáltatás megadja — a nevedet. A jelszavakat titkosított (hasított) formában,
          adatfeldolgozónk (Supabase) infrastruktúráján tároljuk, azokat mi magunk nem ismerjük
          meg. E-mailes regisztráció esetén megerősítő levelet küldünk a megadott címre.
        </p>

        <p><strong>b) Gyermekprofil adatok</strong></p>
        <p>
          Egy szülői fiókhoz egy vagy több gyermekprofil hozható létre. Ehhez a gyermek
          keresztneve vagy beceneve (szabadon megadható, akár álnév is lehet), valamint egy, a
          szülő által beállított 4 számjegyű szülői PIN kód (gyerekzár) tartozik. A PIN kódot nem
          nyílt szövegként, hanem <strong>titkosított lenyomat (SHA-256 hash)</strong> formájában
          tároljuk. A gyermek életkorát vagy születési dátumát az Alkalmazás nem kéri és nem
          tárolja, és nem kér fényképet, hangfelvételt vagy más elérhetőséget sem.
        </p>

        <p><strong>c) Tanulási és beállítási adatok</strong></p>
        <p>
          A tanulás személyre szabásához gyermekprofilonként rögzítjük, hogy a gyermek mely
          betűket, szótagokat, szavakat és mondatokat gyakorolta, és milyen eredménnyel:
          helyes és helytelen válaszok száma, hány külön gyakorlókörben találkozott az adott
          elemmel, a legutóbbi néhány válasz eredménye (a szintlépéshez szükséges friss
          pontossághoz), az elem állapota, valamint az utolsó gyakorlás időpontja. Ezen kívül
          tároljuk a gyermek aktuális szintjét, a már bevezetett betűk listáját, és a profilhoz
          tartozó szülői beállításokat (feladattípusok engedélyezése, szinthatárok és súlyozás,
          automatikus felolvasás, nagybetűs szakasz engedélyezése).
        </p>
        <p>
          Ezeket az adatokat kizárólag arra használjuk, hogy a gyakorlás a gyermek tudásához
          igazodjon, és hogy a szülő a Szülői felületen lássa a haladást és a statisztikát.
          Profilozásra a jogi értelemben vett, joghatással járó automatizált döntéshozatalhoz
          nem használjuk őket.
        </p>

        <p><strong>d) Előfizetési és vásárlási adatok</strong></p>
        <p>
          Az Alkalmazásban elérhető előfizetés, illetve egyszeri vásárlás lebonyolítását a
          RevenueCat nevű adatfeldolgozó végzi, az Apple App Store, illetve a Google Play
          fizetési rendszerén keresztül. Bankkártya- és fizetési adatokat mi magunk nem látunk és
          nem tárolunk — kizárólag azt az információt kapjuk meg, hogy a fiókhoz tartozik-e
          érvényes hozzáférés, annak típusát (előfizetés, egyszeri vásárlás vagy ajándék
          hozzáférés), valamint az előfizetés lejáratának/megújulásának dátumát.
        </p>

        <p><strong>e) Az eszközön tárolt adatok</strong></p>
        <p>
          Az Alkalmazás a készülék helyi tárhelyén is tárolja a gyermekprofilokat, a tanulási
          adatokat, az aktív profil azonosítóját és az adott szinten lejátszott gyakorlókörök
          számát, hogy internetkapcsolat nélkül is használható legyen. Ugyancsak a készüléken
          tárolódik a letöltött tananyag (képek, hangfájlok, szó- és mondatbank). Ezek az adatok
          a szülői fiókkal szinkronizálva a felhőben (Supabase) is mentésre kerülnek, így
          eszközváltás vagy újratelepítés után a haladás visszatölthető. Fiókszinten tároljuk azt
          is, hogy a szülő mely alkalmazáson belüli tippeket látta már.
        </p>

        <p><strong>f) Amit nem kezelünk</strong></p>
        <p>
          Az Alkalmazás nem gyűjt eszközazonosítót és helyadatot, nem küld push értesítéseket,
          nem kér mikrofon-, kamera- vagy fájlhozzáférést, nem használ harmadik féltől származó
          analitikai vagy hirdetési SDK-t, és nem tesz lehetővé semmilyen kommunikációt vagy
          tartalommegosztást más felhasználókkal. A tananyag frissítésekor az Alkalmazás
          kizárólag letölti a tartalmat a szerverünkről — ilyenkor a gyermekről semmilyen adatot
          nem küld.
        </p>
      </Section>

      <Section title="4. Az adatkezelés célja és jogalapja">
        <p>
          Az adatkezelés célja a szülői fiók és a gyermekprofilok létrehozásának és kezelésének
          lehetővé tétele, a tanulási folyamat személyre szabása, a szülő tájékoztatása a gyermek
          fejlődéséről, a haladás eszközök közötti szinkronizálása, valamint az előfizetéshez
          kötött funkciók biztosítása és a jogosultság ellenőrzése.
        </p>
        <p>
          Jogalap: a szolgáltatás igénybevételéhez szükséges szerződés teljesítése (GDPR 6. cikk
          (1) bekezdés b) pont) — a felhasználói fiók létrehozásával a szülő/gondviselő és az
          adatkezelő között létrejövő szerződés alapján. A vásárlásokhoz kapcsolódó számviteli
          kötelezettségeket az App Store, illetve a Google Play teljesíti mint eladó.
        </p>
      </Section>

      <Section title="5. Adatfeldolgozók, címzettek">
        <p>Az adatok kezeléséhez az alábbi szolgáltatókat vesszük igénybe adatfeldolgozóként:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Supabase</strong> — adatbázis, hitelesítés (bejelentkezés), adattárolás és a tananyag kiszolgálása</li>
          <li><strong>Google LLC</strong> — Google-fiókkal történő bejelentkezés, valamint a fizetések lebonyolítása Android készüléken (Google Play)</li>
          <li><strong>Apple Inc.</strong> — Apple-fiókkal történő bejelentkezés, valamint a fizetések lebonyolítása iOS készüléken (App Store)</li>
          <li><strong>RevenueCat, Inc.</strong> — előfizetések és vásárlások kezelése, a hozzáférés ellenőrzése</li>
          <li><strong>Expo / EAS</strong> — az Alkalmazás frissítéseinek kézbesítése</li>
          <li><strong>Vercel Inc.</strong> — a betukert.hu weboldal kiszolgálása</li>
        </ul>
        <p>
          Az adatokat ezen kívül harmadik félnek nem adjuk át, és nem értékesítjük. Ezen
          szolgáltatók egy része az Európai Gazdasági Térségen (EGT) kívüli szerveren is
          feldolgozhatja az adatokat; ilyen esetben az Európai Bizottság által jóváhagyott
          általános szerződési feltételek (Standard Contractual Clauses) vagy más megfelelő
          garanciák alapján járnak el.
        </p>
      </Section>

      <Section title="6. Adatmegőrzés időtartama">
        <p>
          A fiók és a hozzá tartozó adatok a fiók törléséig, illetve a törlési kérelem
          teljesítéséig kerülnek megőrzésre.
        </p>
        <p>
          Egy gyermekprofil önállóan, az Alkalmazáson belül bármikor törölhető (profilválasztó
          képernyő → 🗑 ikon → a profilhoz tartozó szülői PIN megadása → megerősítés) — ez a
          profilt és a hozzá tartozó összes tanulási adatot véglegesen eltávolítja.
        </p>
        <p>
          A szülői fiók szintén törölhető az Alkalmazáson belül (Szülői felület → „Fiók” szakasz
          → „Fiók végleges törlése”, két megerősítéssel); ez a fiókot, az összes gyermekprofilt
          és minden tanulási adatot véglegesen eltávolítja. Ha nem tudsz belépni, a törlést
          e-mailben is kérheted a 2. pontban megadott címen — a kérelem beérkezésétől számított
          30 napon belül gondoskodunk a fiók és a hozzá tartozó összes adat végleges törléséről.
          A törlés részletes lépéseit a{' '}
          <Link href="/fiok-torles" style={{ color: '#2F6B3F', textDecoration: 'underline' }}>
            Fiók törlése
          </Link>{' '}
          oldalon találod.
        </p>
        <p>
          A megvásárolt hozzáférés az App Store / Google Play fiókodhoz kötődik, ezért az a fiók
          törlése után is visszaállítható egy új fiókban. Az előfizetés lemondása az App Store,
          illetve a Google Play előfizetés-kezelőjében történik; a fiók törlése önmagában nem
          mondja le az előfizetést.
        </p>
      </Section>

      <Section title="7. A gyermekek adatainak védelme">
        <p>
          Az Alkalmazást gyermekek használják, de a fiókot, a bejelentkezést, a beállításokat és
          az előfizetéseket kizárólag a szülő/gondviselő kezeli. A szülői felületet 4 számjegyű
          PIN kód védi. Gyermektől az Alkalmazás nem kér és nem gyűjt önállóan személyes adatot
          (e-mail címet, valós nevet, elérhetőséget, fényképet vagy hangfelvételt) — a
          gyermekprofilban megadott név szabadon választható, akár becenév is lehet. Az
          Alkalmazásban nincs hirdetés, nincs közösségi funkció, és nincs gyermek által elérhető
          külső hivatkozás.
        </p>
      </Section>

      <Section title="8. Az érintett jogai">
        <p>A GDPR alapján az alábbi jogok illetnek meg:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>hozzáférés a rólad és gyermekedről kezelt adatokhoz;</li>
          <li>az adatok helyesbítése, ha pontatlanok;</li>
          <li>az adatok törlése („elfeledtetéshez való jog”);</li>
          <li>az adatkezelés korlátozása;</li>
          <li>adathordozhatóság;</li>
          <li>tiltakozás az adatkezelés ellen.</li>
        </ul>
        <p>
          E jogok gyakorlásához kérjük, vedd fel velünk a kapcsolatot a 2. pontban megadott
          e-mail címen. A kérelmekre a beérkezéstől számított legfeljebb 30 napon belül
          válaszolunk. Ha úgy ítéled meg, hogy adataid kezelése sérti a jogszabályokat,
          panasszal fordulhatsz a Nemzeti Adatvédelmi és Információszabadság Hatósághoz (NAIH,
          1055 Budapest, Falk Miksa utca 9–11., ugyfelszolgalat@naih.hu, naih.hu), illetve
          bírósághoz.
        </p>
      </Section>

      <Section title="9. Adatbiztonság">
        <p>
          Az adatokat a Supabase adatbázisában, sor szintű hozzáférés-szabályozással (Row Level
          Security) tároljuk, amely biztosítja, hogy egy felhasználó kizárólag a saját fiókjához
          tartozó gyermekprofilok és tanulási adatok megtekintésére és módosítására legyen
          jogosult. Az adatátvitel titkosított kapcsolaton (HTTPS/TLS) keresztül történik. A
          szülői PIN kódot titkosított lenyomat formájában tároljuk, a fiók jelszavát pedig a
          hitelesítési szolgáltató kezeli hasított formában.
        </p>
      </Section>

      <Section title="10. Sütik és követés">
        <p>
          Az Alkalmazás nem használ sütiket, sem harmadik féltől származó nyomkövető, analitikai
          vagy hirdetési kódot. A betukert.hu weboldal kizárólag a működéshez szükséges,
          minimális technikai adatokat kezel, és nem használ marketing- vagy analitikai sütiket.
        </p>
      </Section>

      <Section title="11. A tájékoztató módosítása">
        <p>
          Fenntartjuk a jogot jelen tájékoztató módosítására, különösen jogszabályváltozás vagy
          az Alkalmazás funkcióinak bővülése esetén. A mindenkor hatályos verzió ezen az oldalon
          érhető el, a hatálybalépés dátumának feltüntetésével.
        </p>
      </Section>

      <Section title="12. Kapcsolat">
        <p>
          Adatvédelemmel kapcsolatos kérdés vagy kérelem esetén írj bizalommal:{' '}
          <a href="mailto:info@betukert.hu" style={{ color: '#2F6B3F' }}>
            info@betukert.hu
          </a>
          . Az Alkalmazás használatával kapcsolatos általános kérdésekben a{' '}
          <Link href="/tamogatas" style={{ color: '#2F6B3F', textDecoration: 'underline' }}>
            Támogatás
          </Link>{' '}
          oldal segít.
        </p>
      </Section>
    </div>
  );
}
