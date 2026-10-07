import Link from 'next/link';

export const metadata = {
  title: 'Felhasználási feltételek — Betűkert',
  description: 'A Betűkert alkalmazás felhasználási feltételei.',
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

const linkStyle = { color: '#2F6B3F', textDecoration: 'underline' };

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">

      <h1 className="text-3xl mb-2" style={{ fontWeight: 800, color: '#234430' }}>
        Felhasználási feltételek
      </h1>
      <p className="text-sm mb-10" style={{ color: '#8A8478' }}>
        Hatályos: 2026. október 7-től
      </p>

      <Section title="1. A feltételek hatálya">
        <p>
          Jelen feltételek a Betűkert mobilalkalmazás (a továbbiakban: „Alkalmazás” vagy
          „Betűkert”) használatára vonatkoznak. Az Alkalmazás letöltésével, a fiók
          létrehozásával, illetve a bejelentkezéssel elfogadod ezeket a feltételeket. Ha nem
          értesz egyet velük, kérjük, ne használd az Alkalmazást.
        </p>
        <p>
          Az Alkalmazást a szülő vagy más gondviselő tölti le, ő hozza létre a fiókot, és ő
          köti meg a vásárlásokat; a fiókot csak nagykorú személy hozhatja létre. A gyermek az
          Alkalmazást a szülő által létrehozott gyermekprofilban, a szülő felügyelete mellett
          használja.
        </p>
      </Section>

      <Section title="2. A szolgáltató">
        <p>
          Az Alkalmazás fejlesztője és üzemeltetője (a továbbiakban: „szolgáltató”, „mi”):
          <br />
          Név: <strong>Misi Dávid</strong> (magánszemély)
          <br />
          E-mail:{' '}
          <a href="mailto:info@betukert.hu" style={{ color: '#2F6B3F' }}>
            info@betukert.hu
          </a>
          <br />
          Weboldal: betukert.hu
        </p>
      </Section>

      <Section title="3. A szolgáltatás">
        <p>
          A Betűkert magyar nyelvű, gyermekek olvasástanulását segítő oktatási alkalmazás iOS és
          Android készülékekre. A tananyag szintekből épül fel, amelyek egymás után vezetik be a
          betűket, és a gyakorlás betű-, szótag-, szó- és mondatszintű feladatokból áll.
        </p>
        <p>
          Az Alkalmazás a Meixner-módszer elveire épülő önálló fejlesztés; nem a módszer
          kidolgozójának vagy kiadójának hivatalos terméke, és nem helyettesíti a pedagógus,
          gyógypedagógus vagy logopédus munkáját. Az Alkalmazás a gyakorlást segíti, de
          meghatározott tanulási eredményt nem tudunk garantálni.
        </p>
        <p>
          A bejelentkezéshez, a haladás szinkronizálásához és a tananyag letöltéséhez
          internetkapcsolat szükséges; a letöltött tananyaggal a gyakorlás kapcsolat nélkül is
          működik. A tananyagot és az Alkalmazás funkcióit folyamatosan fejlesztjük, ezért azok
          frissítéssel változhatnak.
        </p>
      </Section>

      <Section title="4. Fiók, gyermekprofilok és szülői PIN">
        <p>
          Fiókot e-mail címmel és jelszóval, Google-fiókkal vagy — iOS készüléken —
          Apple-fiókkal lehet létrehozni. Egy fiókhoz több gyermekprofil tartozhat; mindegyiket
          a szülő által beállított 4 számjegyű PIN kód védi, amely a szülői felületet zárja el a
          gyermek elől.
        </p>
        <p>
          A bejelentkezési adataid és a PIN kód titokban tartása a te feladatod. A PIN kód
          gyerekzár, nem pedig a fiók védelmét szolgáló jelszó. Ha úgy látod, hogy illetéktelen
          személy fért hozzá a fiókodhoz, változtasd meg a jelszavadat, és írj nekünk.
        </p>
        <p>
          A fiók és a hozzá tartozó hozzáférés személyes használatra szól, nem adható tovább és
          nem értékesíthető.
        </p>
      </Section>

      <Section title="5. Ingyenes és fizetős tartalom">
        <p>
          Az Alkalmazás <strong>első 5 szintje ingyenes</strong>. A teljes tananyaghoz és a
          szabad gyakorláshoz teljes hozzáférés szükséges, amely havi vagy éves előfizetéssel,
          illetve egyszeri vásárlással (korlátlan idejű hozzáférés) oldható fel. A hozzáférés a
          szülői fiókhoz tartozik, így a fiók összes gyermekprofiljára érvényes.
        </p>
        <p>
          Az aktuális csomagokat és árakat az Alkalmazás vásárlási képernyője, illetve az App
          Store és a Google Play mutatja; az árat és a fizetendő adót az áruház a vásárlás
          előtt feltünteti. A szolgáltató egyedi döntés alapján ajándék (promóciós) hozzáférést
          is biztosíthat.
        </p>
      </Section>

      <Section title="6. Vásárlás, előfizetés és lemondás">
        <p>
          A vásárlás az Apple App Store, illetve a Google Play rendszerében, annak feltételei
          szerint jön létre, és a fizetést is az áruház bonyolítja le a store-fiókodhoz
          rendelt fizetési móddal. Bankkártya- vagy fizetési adatokat mi nem látunk.
        </p>
        <p>
          Az előfizetés a kiválasztott időszak (egy hónap, illetve egy év) végén{' '}
          <strong>automatikusan megújul</strong>, és az áruház a következő időszak díját
          terheli, hacsak nem mondod le a megújulás előtt — az App Store-ban legalább 24 órával
          a megújulás előtt. Az előfizetést az áruház előfizetés-kezelőjében mondhatod le:
          ide a Szülői felület „Előfizetés” kártyáján az „Előfizetés kezelése és lemondása”
          gombbal is eljuthatsz. Lemondás után a hozzáférés a már kifizetett időszak végéig
          megmarad.
        </p>
        <p>
          <strong>Az Alkalmazás vagy a fiók törlése nem mondja le az előfizetést</strong> —
          azt minden esetben az áruházban kell lemondani.
        </p>
        <p>
          A vásárlás az App Store-, illetve Google Play-fiókodhoz kötődik, ezért a
          „Korábbi vásárlás visszaállítása” lehetőséggel másik készüléken vagy új Betűkert-fiókban
          is visszaállítható. Az előfizetés díjának változásáról az áruház a saját szabályai
          szerint előre értesít.
        </p>
      </Section>

      <Section title="7. Elállási jog és visszatérítés">
        <p>
          A megvásárolt digitális tartalom a vásárlás után azonnal elérhetővé válik. Mivel a
          vásárlás az áruházban jön létre, az elállási jog gyakorlásának módját és a
          visszatérítést az App Store, illetve a Google Play szabályai határozzák meg; a díjat
          az áruház szedi be, ezért visszatérítést mi közvetlenül nem tudunk teljesíteni.
          Visszatérítést iOS-en a reportaproblem.apple.com oldalon, Androidon a Google Play
          súgójában kérhetsz.
        </p>
        <p>
          Ha az Alkalmazás vagy a megvásárolt tartalom nem működik megfelelően, írj nekünk, és
          igyekszünk mielőbb megoldani a problémát. Ez a pont nem korlátozza a fogyasztót
          jogszabály alapján megillető jogokat.
        </p>
      </Section>

      <Section title="8. Felhasználási jog és szellemi tulajdon">
        <p>
          Az Alkalmazás és annak teljes tartalma — a programkód, a szövegek, a szó- és
          mondatbank, a képek, a hangfelvételek, a grafikai elemek és a kabala — szerzői jogi
          védelem alatt áll. A hozzáférés idejére személyes, nem kizárólagos, át nem ruházható
          jogot kapsz az Alkalmazás rendeltetésszerű, nem kereskedelmi célú használatára.
        </p>
        <p>Nem megengedett különösen:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>az Alkalmazás vagy tartalmának másolása, terjesztése, nyilvánossághoz közvetítése;</li>
          <li>
            az Alkalmazás visszafejtése vagy módosítása, kivéve, ha ezt jogszabály kifejezetten
            megengedi;
          </li>
          <li>a tartalom tömeges vagy automatizált letöltése, kinyerése;</li>
          <li>a fizetős hozzáférés vagy más hozzáférés-korlátozás megkerülése;</li>
          <li>a szolgáltatás működésének megzavarása vagy túlterhelése.</li>
        </ul>
      </Section>

      <Section title="9. Felelősség">
        <p>
          Az Alkalmazást gondosan fejlesztjük és tartjuk karban, de nem tudjuk garantálni, hogy
          mindig megszakítás és hiba nélkül elérhető; karbantartás, frissítés vagy külső
          szolgáltató (például a tárhely- vagy az áruház-szolgáltató) hibája miatt a működés
          átmenetileg szünetelhet.
        </p>
        <p>
          A jogszabály által megengedett mértékben nem felelünk az olyan károkért, amelyek a
          készülék, az internetkapcsolat vagy harmadik fél szolgáltatásának hibájából, illetve
          az Alkalmazás nem rendeltetésszerű használatából erednek. Ez a korlátozás nem
          vonatkozik a szándékosan vagy súlyos gondatlansággal okozott, valamint az életet,
          testi épséget vagy egészséget megkárosító szerződésszegésért való felelősségre, és nem
          érinti a fogyasztót jogszabály alapján megillető jogokat.
        </p>
      </Section>

      <Section title="10. Adatvédelem">
        <p>
          A fiókhoz, a gyermekprofilokhoz és a tanuláshoz kapcsolódó adatok kezeléséről az{' '}
          <Link href="/adatvedelem" style={linkStyle}>
            Adatvédelmi tájékoztató
          </Link>{' '}
          rendelkezik részletesen.
        </p>
      </Section>

      <Section title="11. A fiók megszüntetése">
        <p>
          A fiókodat bármikor törölheted az Alkalmazásban (Szülői felület → „Fiók” szakasz →
          „Fiók végleges törlése”), vagy e-mailben kérheted a törlését; a lépéseket a{' '}
          <Link href="/fiok-torles" style={linkStyle}>
            Fiók törlése
          </Link>{' '}
          oldalon találod. A törlés a fiókot, az összes gyermekprofilt és a tanulási adatokat
          véglegesen eltávolítja.
        </p>
        <p>
          Ha valaki súlyosan vagy ismételten megszegi ezeket a feltételeket (például
          megkerüli a fizetős hozzáférést, vagy megzavarja a szolgáltatás működését), a fiókját
          — lehetőség szerint előzetes értesítés után — felfüggeszthetjük vagy megszüntethetjük.
        </p>
      </Section>

      <Section title="12. Az áruházak feltételei és forrásmegjelölés">
        <p>
          iOS készüléken az Alkalmazás használatára az Apple szabványos licencszerződése
          (Licensed Application End User License Agreement) is vonatkozik:{' '}
          <a
            href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"
            style={linkStyle}
          >
            apple.com/legal/internet-services/itunes/dev/stdeula
          </a>
          . Ha ez és jelen feltételek között eltérés van, Apple-készüléken az Apple szabványos
          licencszerződése az irányadó. Android készüléken a Google Play felhasználási
          feltételei is érvényesek. Az Apple és a Google nem felel az Alkalmazásért és annak
          tartalmáért, és nem nyújt hozzá támogatást.
        </p>
        <p>
          Szógyakorisági adatok: Hermit Dave, FrequencyWords (OpenSubtitles 2018 alapján),{' '}
          <a href="https://github.com/hermitdave/FrequencyWords" style={linkStyle}>
            github.com/hermitdave/FrequencyWords
          </a>
          ,{' '}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.hu" style={linkStyle}>
            CC BY-SA 4.0
          </a>{' '}
          licenc. Az Alkalmazás ebből szűrt szólistát használ, amely ugyanezen licenc alatt áll.
        </p>
        <p>
          Az Alkalmazás nyílt forráskódú szoftverkomponenseket is tartalmaz, amelyekre a saját
          licencfeltételeik vonatkoznak.
        </p>
      </Section>

      <Section title="13. A feltételek módosítása">
        <p>
          A feltételeket — különösen jogszabályváltozás, illetve az Alkalmazás vagy a csomagok
          változása esetén — módosíthatjuk. A mindenkor hatályos változat ezen az oldalon
          érhető el, a hatálybalépés dátumával. Lényeges módosításról előzetesen, az
          Alkalmazásban vagy e-mailben tájékoztatunk; ha a módosítást nem fogadod el, a fiókodat
          törölheted, és az előfizetésedet lemondhatod.
        </p>
      </Section>

      <Section title="14. Irányadó jog és panaszkezelés">
        <p>
          A feltételekre a magyar jog az irányadó. Panaszodat, észrevételedet az{' '}
          <a href="mailto:info@betukert.hu" style={{ color: '#2F6B3F' }}>
            info@betukert.hu
          </a>{' '}
          címre küldheted; a panaszra legkésőbb 30 napon belül érdemben válaszolunk. Ha a
          panasz rendezése nem sikerül, fogyasztóként a lakóhelyed vagy tartózkodási helyed
          szerint illetékes békéltető testülethez, illetve bírósághoz fordulhatsz.
        </p>
      </Section>

      <Section title="15. Kapcsolat">
        <p>
          Kérdés esetén írj bizalommal:{' '}
          <a href="mailto:info@betukert.hu" style={{ color: '#2F6B3F' }}>
            info@betukert.hu
          </a>
          . Az Alkalmazás használatával kapcsolatos gyakori kérdésekre a{' '}
          <Link href="/tamogatas" style={linkStyle}>
            Támogatás
          </Link>{' '}
          oldal válaszol.
        </p>
      </Section>
    </div>
  );
}
