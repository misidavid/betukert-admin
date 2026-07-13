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

// Isolated playground: restyles the admin UI without touching the real
// pages/components. Breaks out of the root layout's <main> padding so it
// can own its own background and width.
export default function DesignPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${display.variable} ${body.variable}`}
      style={{
        marginInline: 'calc(50% - 50vw)',
        marginTop: '-2rem',
        marginBottom: '-2rem',
        width: '100vw',
        fontFamily: 'var(--font-body)',
        background: '#F1ECE0',
      }}
    >
      {children}
    </div>
  );
}
