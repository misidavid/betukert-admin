import { Inter } from 'next/font/google';

// Semleges, jól olvasható UI-betűtípus az adatsűrű nézetekhez (táblázatos
// számjegyek, kis méretek) — a játékos márkabetűk itt a számokat zavarnák.
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-stats',
});

export default function StatsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={inter.variable} style={{ fontFamily: 'var(--font-stats), system-ui, sans-serif' }}>
      {children}
    </div>
  );
}
