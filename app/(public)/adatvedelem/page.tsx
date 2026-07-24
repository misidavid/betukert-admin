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
        Hatályos: 2026. július 9-től
      </p>

      <Section title="1. Bevezetés">
        <p>
          Jelen tájékoztató a Betűkert mobilalkalmazás (a továbbiakban: „Alkalmazás” vagy
          „Betűkert”) használata során kezelt személyes adatokról nyújt tájékoztatást, az
          Európai Parlament és a Tanács (EU) 2016/679 rendelete (a továbbiakban: GDPR), valamint
          az információs önrendelkezési jogról és az információszabadságról szóló 2011. évi
          CXII. törvény (Infotv.) alapján.
        </p>
        <p>
          A Betűkert egy gyermekek olvasástanulását segítő oktatási alkalmazás, amelyet a
          Meixner-módszer elvei alapján a szülő vagy más gondviselő tölt le és állít be a
          gyermeke számára. Az Alkalmazásban fiókot kizárólag a szülő/gondviselő hoz létre és
          kezel — az Alkalmazás nem gyűjt közvetlenül hozzájárulást gyermekektől.
        </p>
      </Section>

      <Section title="2. Az adatkezelő">
        <p>
          Adatkezelő: <strong>[VÁLLALKOZÁS NEVE]</strong> egyéni vállalkozó
          <br />
          Székhely: <strong>[SZÉKHELY CÍME]</strong>
          <br />
          Adószám: <strong>[ADÓSZÁM]</strong>
          <br />
          E-mail: <a href="mailto:misi.david@gmail.com" style={{ color: '#2F6B3F' }}>misi.david@gmail.com</a>
        </p>
      </Section>

      <Section title="3. Milyen adatokat kezelünk">
        <p><strong>a) Regisztrációs és bejelentkezési adatok (szülő/gondviselő fiókja)</strong></p>
        <p>
          A bejelentkezéshez választásod szerint az alábbi módok egyikét használhatod: e-mail
          cím és jelszó, Google-fiók, vagy Apple-fiók. A választott módtól függően kezeljük az
          e-mail címedet, valamint a Google/Apple által megosztott azonosítót és — ha a
          szolgáltatás megadja — a nevedet. A jelszavakat titkosított formában, harmadik fél
          (Supabase) infrastruktúráján tároljuk, azt mi magunk nem ismerjük meg.
        </p>
        <p><strong>b) Gyermekprofil adatok</strong></p>
        <p>
          Egy szülői fiókhoz egy vagy több gyermekprofil hozható létre. Ehhez a gyermek
          keresztneve vagy beceneve (szabadon megadható, akár álnév is lehet), valamint egy, a
          szülő által beállított 4 számjegyű PIN kód (szülői kapu) kerül tárolásra. Gyermek
          életkorát vagy születési dátumát az Alkalmazás nem kéri és nem tárolja.
        </p>
        <p><strong>c) Tanulási / használati adatok</strong></p>
        <p>
          Az Alkalmazás rögzíti, hogy a gyermek mely betűket, szavakat és feladattípusokat
          gyakorolta, milyen eredménnyel (helyes/helytelen válaszok száma, gyakorlási munkamenetek
          száma, utolsó gyakorlás időpontja), valamint az aktuális tanulási fázist és a már
          ismert betűket. Ezek az adatok kizárólag a tanulási folyamat személyre szabásához és a
          szülői áttekintő nézet (Szülői irányítópult) megjelenítéséhez szükségesek.
        </p>
        <p><strong>d) Előfizetési / vásárlási adatok</strong></p>
        <p>
          Az Alkalmazásban elérhető előfizetés/egyszeri vásárlás lebonyolítását a RevenueCat
          nevű harmadik fél szolgáltatás végzi, az Apple App Store fizetési rendszerén
          keresztül. Bankkártya- vagy fizetési adatokat mi magunk nem tárolunk és nem is látunk —
          kizárólag azt az információt kapjuk meg, hogy a fiókodhoz tartozik-e érvényes
          előfizetés/hozzáférés.
        </p>
        <p><strong>e) Eszközön tárolt adatok</strong></p>
        <p>
          Az aktív gyermekprofil azonosítója és a tanulási adatok egy ideiglenes, offline
          másolata a készülék helyi tárhelyén (AsyncStorage) is tárolásra kerül, hogy az
          Alkalmazás internetkapcsolat nélkül is használható legyen. Ezek az adatok a szülői
          fiókkal szinkronizálva a felhőben (Supabase) is mentésre kerülnek.
        </p>
        <p>
          Az Alkalmazás nem gyűjt eszközazonosítót, helyadatot, és nem küld push
          értesítéseket, továbbá nem használ harmadik féltől származó analitikai vagy hirdetési
          szoftverfejlesztő-készletet (SDK-t).
        </p>
      </Section>

      <Section title="4. Az adatkezelés célja és jogalapja">
        <p>
          Az adatkezelés célja a szülői fiók és a gyermekprofilok létrehozásának és
          kezelésének lehetővé tétele, a tanulási folyamat személyre szabása és a szülő
          tájékoztatása a gyermek fejlődéséről, valamint az előfizetéshez kötött funkciók
          biztosítása.
        </p>
        <p>
          Jogalap: a szolgáltatás igénybevételéhez szükséges szerződés teljesítése (GDPR 6.
          cikk (1) bekezdés b) pont) — a felhasználói fiók létrehozásával a szülő/gondviselő és
          az adatkezelő között létrejövő szerződés alapján.
        </p>
      </Section>

      <Section title="5. Adatfeldolgozók, címzettek">
        <p>Az adatok kezeléséhez az alábbi szolgáltatókat vesszük igénybe adatfeldolgozóként:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Supabase</strong> — adatbázis, hitelesítés (bejelentkezés) és adattárolás</li>
          <li><strong>Google LLC</strong> — Google-fiókkal történő bejelentkezés</li>
          <li><strong>Apple Inc.</strong> — Apple-fiókkal történő bejelentkezés és a fizetések lebonyolítása (App Store)</li>
          <li><strong>RevenueCat, Inc.</strong> — előfizetések és vásárlások kezelése</li>
          <li><strong>Expo / EAS</strong> — az Alkalmazás frissítéseinek kézbesítése</li>
        </ul>
        <p>
          Ezen szolgáltatók egy része az Európai Gazdasági Térségen (EGT) kívüli szerverén is
          feldolgozhatja az adatokat. Ilyen esetben a szolgáltatók az Európai Bizottság által
          jóváhagyott általános szerződési feltételek (Standard Contractual Clauses) vagy más
          megfelelő garanciák alapján járnak el.
        </p>
      </Section>

      <Section title="6. Adatmegőrzés időtartama">
        <p>
          A fiók és a hozzá tartozó adatok a fiók törléséig, illetve a törlési kérelem
          teljesítéséig kerülnek megőrzésre. Egy gyermekprofil önállóan, az Alkalmazáson belül
          (Profilok képernyő → „Profil törlése”) bármikor törölhető — ez a profilt és a hozzá
          tartozó tanulási adatokat véglegesen eltávolítja.
        </p>
        <p>
          A szülői fiók az Alkalmazáson belül is véglegesen törölhető (szülői mód → az oldal
          alján lévő „Fiók” szakasz → „Fiók végleges törlése”); ez a fiókot és a hozzá tartozó
          összes gyermekprofilt és tanulási adatot eltávolítja. Ha nem tudsz belépni, a törlést
          e-mailben is kérheted a 2. pontban megadott címen — a kérelem beérkezésétől számított
          30 napon belül gondoskodunk a fiók és a hozzá tartozó összes adat végleges törléséről.
          A törlés részletes lépéseit a{' '}
          <a href="/fiok-torles" style={{ color: '#2F6B3F', textDecoration: 'underline' }}>
            Fiók törlése
          </a>{' '}
          oldalon találod.
        </p>
      </Section>

      <Section title="7. A gyermekek adatainak védelme">
        <p>
          Az Alkalmazást gyermekek használják, de a fiókot, a bejelentkezést és az
          előfizetéseket kizárólag a szülő/gondviselő kezeli. Gyermektől az Alkalmazás nem kér
          és nem gyűjt önállóan személyes adatot (pl. e-mail címet, valós nevet, elérhetőséget) —
          a gyermekprofilban megadott név szabadon választható, akár becenév is lehet.
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
          e-mail címen. Ha úgy ítéled meg, hogy adataid kezelése sérti a jogszabályokat,
          panasszal fordulhatsz a Nemzeti Adatvédelmi és Információszabadság Hatósághoz (NAIH,
          1055 Budapest, Falk Miksa utca 9–11., ugyfelszolgalat@naih.hu, naih.hu).
        </p>
      </Section>

      <Section title="9. Adatbiztonság">
        <p>
          Az adatokat a Supabase adatbázisában, sor szintű hozzáférés-szabályozással (Row Level
          Security) tároljuk, amely biztosítja, hogy egy felhasználó kizárólag a saját, illetve a
          saját fiókjához tartozó gyermekprofilok adataihoz férjen hozzá. Az adatátvitel
          titkosított kapcsolaton (HTTPS/TLS) keresztül történik.
        </p>
      </Section>

      <Section title="10. Sütik és követés">
        <p>
          Az Alkalmazás nem használ harmadik féltől származó nyomkövető, analitikai vagy
          hirdetési kódot. A jelen weboldal (bemutatkozó oldal) kizárólag a működéshez
          szükséges, minimális technikai adatokat kezel.
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
          Adatvédelemmel kapcsolatos kérdés, kérelem esetén írj bizalommal:{' '}
          <a href="mailto:misi.david@gmail.com" style={{ color: '#2F6B3F' }}>misi.david@gmail.com</a>
        </p>
      </Section>
    </div>
  );
}
