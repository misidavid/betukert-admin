import Image from 'next/image';
import logo from '../landing/betukert.svg';
import background from '../landing/soon2.webp';

export const metadata = {
  title: 'Betűkert — sikeres megerősítés',
  description: 'Az e-mail-címed megerősítve. Térj vissza a Betűkert alkalmazásba, és jelentkezz be.',
};

export default function MegerositvePage() {
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
        className="relative z-10 mx-6 flex max-w-xl flex-col items-center gap-5 rounded-[36px] px-10 py-12 text-center sm:px-16"
        style={{
          background: 'rgba(241, 236, 224, 0.75)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: '0 8px 40px rgba(35, 68, 48, 0.15)',
        }}
      >
        <Image
          src={logo}
          alt="Betűkert"
          priority
          style={{ width: 'min(240px, 60vw)', height: 'auto' }}
        />
        <h1
          className="text-2xl"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#31431B' }}
        >
          Sikeres megerősítés!
        </h1>
        <p className="text-base" style={{ color: '#234430' }}>
          Az e-mail-címedet megerősítettük. Térj vissza a Betűkert alkalmazásba, és
          jelentkezz be.
        </p>
      </div>
    </div>
  );
}
