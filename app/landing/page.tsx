import {
  Check,
  Volume2,
  Layers,
  Sparkles,
  MessageSquareText,
  BookOpen,
  Leaf,
} from 'lucide-react';

const STEPS = [
  {
    icon: BookOpen,
    title: 'Betűk',
    desc: 'A hangok és betűk megismerése, egyenként, türelmesen — sorrendben, ahogy a Meixner-módszer javasolja.',
  },
  {
    icon: Layers,
    title: 'Szótagok',
    desc: 'Betűkből szótagok, szótagokból szavak — minden lépés vizuálisan tagolva, hogy érthető legyen az építkezés.',
  },
  {
    icon: Sparkles,
    title: 'Szavak',
    desc: 'Képpel és hanggal megerősített szavak, játékos kvízekben — a gyerek a saját tempójában halad.',
  },
  {
    icon: MessageSquareText,
    title: 'Mondatok',
    desc: 'Mondatrendezés és mondatértés: a gyerek már nem csak olvas, hanem érti is, amit olvasott.',
  },
];

const FEATURES = [
  {
    icon: Sparkles,
    title: 'Játékos kvízek',
    desc: 'Minden feladat egy rövid, képes-hangos kvíz — azonnali, bátorító visszajelzéssel, nem leckeszerű kényszerrel.',
  },
  {
    icon: Volume2,
    title: 'Kép és hang segít',
    desc: 'Minden szóhoz illusztráció és kimondott hang társul, így azok is haladnak, akik még bizonytalanok az olvasásban.',
  },
  {
    icon: Layers,
    title: 'Fokozatos nehézség',
    desc: 'A szintek apró lépésekben nehezednek, hogy mindig legyen siker — se unalom, se túlterhelés.',
  },
  {
    icon: Leaf,
    title: 'Saját tempó',
    desc: 'Nincs óra, nincs verseny. A gyerek annyi feladatot old meg, amennyit szeretne, amikor szeretné.',
  },
];

function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="rounded-2xl px-7 py-3.5 text-base text-white shadow-sm transition-transform hover:scale-[1.02]"
      style={{ background: '#2F6B3F', fontFamily: 'var(--font-display)', fontWeight: 700 }}
    >
      {children}
    </button>
  );
}

function StoreBadge({ label }: { label: string }) {
  return (
    <div
      className="rounded-2xl px-5 py-3 text-sm flex items-center gap-2"
      style={{ background: '#FFFFFF', color: '#8A8478', border: '1px solid #E3DCC9' }}
    >
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: '#234430' }}>
        {label}
      </span>
      <span className="text-xs">hamarosan</span>
    </div>
  );
}

function PhoneMockup() {
  return (
    <div
      className="relative rounded-[44px] p-3 shadow-2xl mx-auto"
      style={{ background: '#1F2421', width: 300 }}
    >
      <div className="rounded-[34px] overflow-hidden" style={{ background: '#F1ECE0' }}>
        {/* illustration area */}
        <div
          className="relative h-56 flex items-center justify-center overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #E8E1CC, #C9D6BE)' }}
        >
          <svg width="150" height="120" viewBox="0 0 150 120" fill="none">
            <ellipse cx="75" cy="95" rx="55" ry="10" fill="#00000010" />
            <g>
              <ellipse cx="75" cy="60" rx="34" ry="26" fill="#C0473F" />
              <path d="M75 34 L75 86" stroke="#1F2421" strokeWidth="2" />
              <circle cx="62" cy="48" r="5" fill="#1F2421" />
              <circle cx="62" cy="62" r="5" fill="#1F2421" />
              <circle cx="62" cy="76" r="5" fill="#1F2421" />
              <circle cx="88" cy="48" r="5" fill="#1F2421" />
              <circle cx="88" cy="62" r="5" fill="#1F2421" />
              <circle cx="88" cy="76" r="5" fill="#1F2421" />
              <circle cx="46" cy="42" r="9" fill="#1F2421" />
              <circle cx="43" cy="39" r="2" fill="#fff" />
            </g>
          </svg>
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            className="absolute top-4 right-5"
          >
            <path
              d="M20 4 C24 12 32 14 36 14 C32 14 24 18 20 28 C16 18 8 14 4 14 C8 14 16 12 20 4Z"
              fill="#E8D27A"
            />
          </svg>
        </div>

        {/* quiz area */}
        <div className="px-5 pt-5 pb-4">
          <p
            className="text-lg mb-4"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#234430' }}
          >
            Mi van a képen?
          </p>

          <div className="flex flex-col gap-2.5 mb-5">
            <div
              className="relative rounded-2xl px-4 py-3 text-sm flex items-center justify-between"
              style={{ border: '2px solid #2F6B3F', background: '#E5F0E4', color: '#234430', fontFamily: 'var(--font-display)', fontWeight: 700 }}
            >
              katica
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: '#2F6B3F' }}
              >
                <Check size={12} color="white" strokeWidth={3} />
              </span>
            </div>
            <div
              className="rounded-2xl px-4 py-3 text-sm"
              style={{ background: '#FFFFFF', color: '#234430', fontFamily: 'var(--font-display)', fontWeight: 700 }}
            >
              répa
            </div>
            <div
              className="rounded-2xl px-4 py-3 text-sm"
              style={{ background: '#FFFFFF', color: '#234430', fontFamily: 'var(--font-display)', fontWeight: 700 }}
            >
              alma
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full" style={{ background: '#E3DCC9' }}>
              <div className="h-1.5 rounded-full" style={{ width: '40%', background: '#2F6B3F' }} />
            </div>
            <span className="text-xs" style={{ color: '#8A8478' }}>4/10</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div>
      {/* header */}
      <header className="max-w-6xl mx-auto px-6 pt-7 flex items-center justify-between">
        <div
          className="flex items-center gap-2 text-lg"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#234430' }}
        >
          🌱 Betűkert
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm" style={{ color: '#5B6E5C' }}>
          <a href="#hogyan" className="hover:opacity-70 transition-opacity">Hogyan működik</a>
          <a href="#miert" className="hover:opacity-70 transition-opacity">Miért a Betűkert</a>
          <a href="#kiknek" className="hover:opacity-70 transition-opacity">Kiknek készült</a>
        </nav>
        <a href="#cta">
          <button
            className="rounded-2xl px-5 py-2.5 text-sm text-white"
            style={{ background: '#2F6B3F', fontFamily: 'var(--font-display)', fontWeight: 700 }}
          >
            Próbáld ki
          </button>
        </a>
      </header>

      {/* hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span
            className="inline-block rounded-full px-4 py-1.5 text-xs mb-5"
            style={{ background: '#DCEBDC', color: '#234430', fontWeight: 700 }}
          >
            Meixner-módszer alapján
          </span>
          <h1
            className="text-4xl md:text-5xl leading-tight mb-5"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#234430' }}
          >
            Hogy a gyermeke szeressen olvasni
          </h1>
          <p className="text-lg mb-8" style={{ color: '#5B6E5C' }}>
            A Betűkert lépésről lépésre vezeti a gyerekeket a betűktől a mondatokig —
            játékos kvízekkel, képpel és hanggal, mindig a saját tempójukban.
          </p>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <a href="#cta"><PrimaryButton>Próbáld ki ingyenesen</PrimaryButton></a>
          </div>
          <div className="flex flex-wrap gap-3">
            <StoreBadge label="App Store" />
            <StoreBadge label="Google Play" />
          </div>
        </div>
        <PhoneMockup />
      </section>

      {/* hogyan epul fel */}
      <section id="hogyan" className="max-w-6xl mx-auto px-6 py-16">
        <h2
          className="text-3xl mb-3 text-center"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#234430' }}
        >
          Hogyan épül fel az olvasástanulás?
        </h2>
        <p className="text-center mb-12 max-w-xl mx-auto" style={{ color: '#8A8478' }}>
          Négy egymásra épülő szint, apró lépésekben — mindig csak annyi új dolog, amennyit
          a gyerek éppen be tud fogadni.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {STEPS.map((step, i) => (
            <div key={step.title} className="bg-white rounded-[24px] p-6 shadow-sm relative">
              <span
                className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm"
                style={{ background: '#2F6B3F', color: 'white', fontWeight: 700 }}
              >
                {i + 1}
              </span>
              <step.icon size={26} color="#2F6B3F" className="mb-3" />
              <h3
                className="text-lg mb-1.5"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#234430' }}
              >
                {step.title}
              </h3>
              <p className="text-sm" style={{ color: '#8A8478' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* features */}
      <section id="miert" className="py-16" style={{ background: '#FFFFFF' }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2
            className="text-3xl mb-3 text-center"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#234430' }}
          >
            Miért szeretik a szülők és a gyerekek
          </h2>
          <p className="text-center mb-12 max-w-xl mx-auto" style={{ color: '#8A8478' }}>
            Nem egy újabb leckefüzet — egy kert, amiben minden megtanult betű, szó és mondat
            egy-egy új növény.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex gap-4 p-5 rounded-[24px]" style={{ background: '#F1ECE0' }}>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: '#DCEBDC' }}
                >
                  <f.icon size={22} color="#2F6B3F" />
                </div>
                <div>
                  <h3
                    className="text-base mb-1"
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#234430' }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-sm" style={{ color: '#8A8478' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* kiknek */}
      <section id="kiknek" className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2
          className="text-3xl mb-5"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#234430' }}
        >
          Kiknek készült a Betűkert?
        </h2>
        <p className="text-lg" style={{ color: '#5B6E5C' }}>
          Óvodás és kisiskolás korú gyerekeknek, akik most ismerkednek a betűkkel és az
          olvasással — és azoknak is, akiknek egy kicsit több gyakorlásra, megerősítésre van
          szükségük. A Meixner-módszer hangsúlyos lépésekre bontja az olvasástanulást, hogy
          minél kevesebb gyerek ütközzön falba az út elején.
        </p>
      </section>

      {/* cta */}
      <section id="cta" className="py-20 text-center" style={{ background: '#2F6B3F' }}>
        <div className="max-w-2xl mx-auto px-6">
          <h2
            className="text-3xl mb-4 text-white"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}
          >
            Kezdjétek el még ma
          </h2>
          <p className="text-base mb-8" style={{ color: '#DCEBDC' }}>
            Az első kert ingyenes — nézzétek meg együtt, hogyan tanul olvasni játszva a gyermeke.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              className="rounded-2xl px-7 py-3.5 text-base shadow-sm"
              style={{ background: '#FFFFFF', color: '#234430', fontFamily: 'var(--font-display)', fontWeight: 700 }}
            >
              Próbáld ki ingyenesen
            </button>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="py-10 text-center text-sm" style={{ color: '#8A8478' }}>
        <div
          className="mb-2"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#234430' }}
        >
          🌱 Betűkert
        </div>
        <p>© {new Date().getFullYear()} Betűkert. Minden jog fenntartva.</p>
        <p className="mt-2">
          <a href="/adatvedelem" className="hover:opacity-70 transition-opacity" style={{ textDecoration: 'underline' }}>
            Adatvédelmi tájékoztató
          </a>
        </p>
      </footer>
    </div>
  );
}
