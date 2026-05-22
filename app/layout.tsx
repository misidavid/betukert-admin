import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Betűkert Admin',
  description: 'Betűkert tartalomkezelő rendszer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu">
      <body className={inter.className}>
        <div className="min-h-screen bg-[#FAF7F2]">
          {/* Navigáció */}
          <nav className="bg-[#2D5A27] text-white px-6 py-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <Link href="/" className="text-xl font-bold">
                🌱 Betűkert Admin
              </Link>
              <div className="flex gap-6 text-sm">
                <Link href="/images" className="hover:text-yellow-300 transition-colors">
                  Képek
                </Link>
                <Link href="/sounds" className="hover:text-yellow-300 transition-colors">
                  Hangok
                </Link>
                <Link href="/curriculum" className="hover:text-yellow-300 transition-colors">
                  Curriculum
                </Link>
                <Link href="/publish" className="hover:text-yellow-300 transition-colors">
                  Publikálás
                </Link>
              </div>
            </div>
          </nav>

          {/* Tartalom */}
          <main className="max-w-6xl mx-auto px-6 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
