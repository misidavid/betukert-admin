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
          <a href="mailto:misi.david@gmail.com" style={{ color: '#2F6B3F', fontWeight: 700 }}>
            misi.david@gmail.com
          </a>
        </p>
        <p className="text-sm" style={{ color: '#8A8478' }}>
          For support in English, email us at the address above — we typically reply within 1–2
          business days.
        </p>
      </Section>

      <Section title="Gyakori kérdések">
        <div className="space-y-5">
          <Faq q="Nem tudok bejelentkezni. Mit tegyek?">
            Ellenőrizd, hogy ugyanazzal a módszerrel (e-mail + jelszó, Google vagy Apple)
            próbálsz-e belépni, amellyel a fiókot létrehoztad. Ha elfelejtetted a jelszavad,
            a bejelentkező képernyőn kérhetsz új jelszót. Ha továbbra sem sikerül, írj nekünk
            e-mailben.
          </Faq>
          <Faq q="Megvettem az előfizetést, de nem aktív. Hogyan állíthatom vissza?">
            Az előfizetés az App Store vagy a Google Play fiókodhoz kötődik. Nyisd meg az Alkalmazásban az
            előfizetési képernyőt, és koppints a „Vásárlások visszaállítása” lehetőségre.
            Ha ez nem segít, írj nekünk a vásárláskor kapott nyugta dátumával.
          </Faq>
          <Faq q="Hogyan mondhatom le az előfizetést?">
            Az előfizetést az Apple és a Google kezeli: a készüléken a Beállítások → saját név →
            Előfizetések menüpontban mondhatod le. Lemondás után a már kifizetett időszak
            végéig a hozzáférés megmarad.
          </Faq>
          <Faq q="Hogyan törölhetek egy gyermekprofilt?">
            Az Alkalmazásban a Profilok képernyőn választhatod a „Profil törlése” lehetőséget —
            ez a profilt és a hozzá tartozó tanulási adatokat véglegesen eltávolítja.
          </Faq>
          <Faq q="Hogyan törölhetem a teljes fiókomat?">
            A szülői módba lépve, az oldal alján lévő „Fiók” szakaszban találod a „Fiók végleges
            törlése” lehetőséget. Ha nem tudsz belépni, e-mailben is kérheted a törlést — a
            részletes lépéseket a{' '}
            <a href="/fiok-torles" style={{ color: '#2F6B3F', textDecoration: 'underline' }}>
              Fiók törlése
            </a>{' '}
            oldalon találod.
          </Faq>
        </div>
      </Section>

      <Section title="Adatvédelem">
        <p>
          Az adatkezelésről részletesen az{' '}
          <a href="/adatvedelem" style={{ color: '#2F6B3F', textDecoration: 'underline' }}>
            Adatvédelmi tájékoztatóban
          </a>{' '}
          olvashatsz.
        </p>
      </Section>
    </div>
  );
}
