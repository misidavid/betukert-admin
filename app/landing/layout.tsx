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

// Isolated marketing page: breaks out of the admin root layout's <main>
// padding/width so it can own its own full-bleed background.
export default function LandingLayout({
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
        color: '#234430',
      }}
    >
      {children}
    </div>
  );
}
