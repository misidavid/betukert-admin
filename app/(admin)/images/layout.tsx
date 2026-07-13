'use client';

import { usePathname } from 'next/navigation';
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

// Scoped to the routes under /images that have been restyled so far —
// any future un-restyled nested route should keep falling back to the
// root layout's Inter font instead of inheriting this one.
const RESTYLED_PATHS = ['/images', '/images/settings'];

export default function ImagesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const restyled = RESTYLED_PATHS.includes(pathname ?? '');

  return (
    <div className={restyled ? `${display.variable} ${body.variable}` : undefined} style={restyled ? { fontFamily: 'var(--font-body)' } : undefined}>
      {children}
    </div>
  );
}
