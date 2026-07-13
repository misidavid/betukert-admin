import { Baloo_2, Quicksand } from 'next/font/google';

const display = Baloo_2({
  subsets: ['latin', 'latin-ext'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
});

const body = Quicksand({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700'],
  variable: '--font-body',
});

// A publikus oldalak (landing, adatvédelem, támogatás, megerősítve) közös
// layoutja — az admin navigáció ide nem kerül be. A későbbi publikus menü
// helye a {children} elé kerülő <header>.
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${display.variable} ${body.variable} min-h-screen`}
      style={{
        fontFamily: 'var(--font-body)',
        background: '#F1ECE0',
        color: '#234430',
      }}
    >
      {children}
    </div>
  );
}
