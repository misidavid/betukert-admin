'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function NavWrapper() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/login') return null;
  if (pathname?.startsWith('/design-preview')) return null;
  if (pathname?.startsWith('/landing')) return null;
  if (pathname?.startsWith('/adatvedelem')) return null;

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <nav className="bg-[#2D5A27] text-white px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          🌱 Betűkert Admin
        </Link>
        <div className="flex gap-6 text-sm items-center">
          <Link href="/images" className="hover:text-yellow-300 transition-colors">Képek</Link>
          <Link href="/sounds" className="hover:text-yellow-300 transition-colors">Hangok</Link>
          <Link href="/curriculum" className="hover:text-yellow-300 transition-colors">Curriculum</Link>
          <Link href="/sentences" className="hover:text-yellow-300 transition-colors">Mondatok</Link>
          <Link href="/sentences/images" className="hover:text-yellow-300 transition-colors">Mondatképek</Link>
          <Link href="/loading-screens" className="hover:text-yellow-300 transition-colors">Loading Screens</Link>
          <Link href="/publish" className="hover:text-yellow-300 transition-colors">Publikálás</Link>
          <Link href="/stats" className="hover:text-yellow-300 transition-colors">Statisztikák</Link>
          <Link href="/ui-kit" className="hover:text-yellow-300 transition-colors">UI Kit</Link>
          <button
            onClick={handleLogout}
            className="text-white/70 hover:text-white transition-colors ml-4 text-xs border border-white/30 px-3 py-1 rounded-lg hover:border-white/60"
          >
            Kijelentkezés
          </button>
        </div>
      </div>
    </nav>
  );
}
