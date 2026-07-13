import Image from 'next/image';
import logo from './betukert.svg';
import soon1 from './soon1.webp';
import soon2 from './soon2.webp';
import soon3 from './soon3.webp';

const BACKGROUNDS = [soon1, soon2, soon3];

// Kérésenkénti renderelés, hogy minden oldalbetöltésre másik háttér sorsolódjon
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Betűkert — hamarosan',
  description:
    'Betűkert: játékos olvasástanulás gyerekeknek a Meixner-módszer alapján. Hamarosan érkezik.',
};

export default function LandingPage() {
  const background = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];

  return (
    <div
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: '100dvh' }}
    >
      <Image
        src={background}
        alt=""
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        style={{ objectFit: 'cover' }}
      />

      <div
        className="relative z-10 mx-6 flex flex-col items-center gap-5 rounded-[36px] px-10 py-12 text-center sm:px-16"
        style={{
          background: 'rgba(241, 236, 224, 0.2)',
          backdropFilter: 'blur(1px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: '0 8px 40px rgba(35, 68, 48, 0.15)',
        }}
      >
        <Image
          src={logo}
          alt="Betűkert"
          priority
          style={{ width: 'min(320px, 70vw)', height: 'auto' }}
        />
        <p
          className="text-xl tracking-wide"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#31431B' }}
        >
          Hamarosan
        </p>
      </div>
    </div>
  );
}
