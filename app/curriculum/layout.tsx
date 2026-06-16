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

export default function CurriculumLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${display.variable} ${body.variable}`} style={{ fontFamily: 'var(--font-body)' }}>
      {children}
    </div>
  );
}
