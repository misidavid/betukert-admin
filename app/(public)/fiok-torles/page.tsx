export const metadata = {
  title: 'Fiók törlése — Betűkert',
  description:
    'Hogyan törölheted a Betűkert-fiókodat és a hozzá tartozó adatokat — Betűkert account and data deletion.',
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

export default function AccountDeletionPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl mb-2" style={{ fontWeight: 800, color: '#234430' }}>
        Fiók törlése
      </h1>
      <p className="text-sm mb-10" style={{ color: '#8A8478' }}>
        A Betűkert-fiók és a hozzá tartozó adatok törlése — Betűkert account and data deletion
      </p>

      <Section title="Fiók törlése az alkalmazásban">
        <p>
          A legegyszerűbb, ha közvetlenül az Alkalmazásban törlöd a fiókodat:
        </p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Nyisd meg a Betűkert alkalmazást, és jelentkezz be.</li>
          <li>Lépj be a <strong>szülői módba</strong>.</li>
          <li>
            Görgess az oldal alján lévő <strong>„Fiók”</strong> szakaszhoz, és koppints a{' '}
            <strong>„Fiók végleges törlése”</strong> gombra.
          </li>
          <li>Erősítsd meg a törlést a megjelenő kérdéseknél.</li>
        </ol>
        <p>
          A törlés véglegesen eltávolítja a fiókodat és a hozzá kapcsolódó összes gyermekprofilt
          és tanulási adatot.
        </p>
      </Section>

      <Section title="Fiók törlése kérése e-mailben">
        <p>
          Ha nem tudsz belépni az Alkalmazásba, e-mailben is kérheted a fiókod törlését. Írj a{' '}
          <a href="mailto:misi.david@gmail.com" style={{ color: '#2F6B3F', fontWeight: 700 }}>
            misi.david@gmail.com
          </a>{' '}
          címre a következő tárggyal: <strong>„Fiók törlése”</strong>, és add meg a levélben azt az{' '}
          <strong>e-mail címet</strong>, amellyel a fiókodat létrehoztad.
        </p>
        <p>
          A törlési kérelmet a kézhezvételtől számított <strong>30 napon belül</strong>{' '}
          feldolgozzuk, és e-mailben visszaigazoljuk. Adatvédelmi okból csak a fiók tulajdonosának
          e-mail címéről érkező kérelmet tudunk teljesíteni.
        </p>
      </Section>

      <Section title="Milyen adatokat törlünk">
        <p>A fiók törlésekor véglegesen és visszavonhatatlanul eltávolítjuk:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>a fiókod azonosítására szolgáló adatokat (e-mail cím, bejelentkezési adatok);</li>
          <li>a fiókhoz tartozó gyermekprofilokat;</li>
          <li>a tanulási előrehaladást és gyakorlási adatokat.</li>
        </ul>
        <p>
          Jogszabályi kötelezettség esetén (pl. számviteli előírások miatt a vásárlásokhoz
          kapcsolódó számlázási adatok) egyes adatokat a törvényben előírt ideig megőrizhetünk;
          ezekről az{' '}
          <a href="/adatvedelem" style={{ color: '#2F6B3F', textDecoration: 'underline' }}>
            Adatvédelmi tájékoztatóban
          </a>{' '}
          olvashatsz részletesen.
        </p>
      </Section>

      <Section title="Előfizetés">
        <p>
          Az előfizetést az App Store, illetve a Google Play kezeli, ezért azt a fiók törlése nem
          mondja le automatikusan. Ha aktív előfizetésed van, azt a készüléked{' '}
          <strong>Beállítások → (saját név) → Előfizetések</strong> menüpontjában külön kell
          lemondanod, hogy ne terheljünk további díjat.
        </p>
      </Section>

      <p className="text-sm" style={{ color: '#8A8478' }}>
        To request deletion of your account and associated data, use the in-app option (parental
        mode → “Account” section at the bottom → “Delete account permanently”), or email us at{' '}
        <a href="mailto:misi.david@gmail.com" style={{ color: '#2F6B3F', fontWeight: 700 }}>
          misi.david@gmail.com
        </a>{' '}
        with the email address used to create your account. Requests are processed within 30 days.
      </p>
    </div>
  );
}
