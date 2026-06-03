import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import NavWrapper from '../components/NavWrapper';

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
          <NavWrapper />
          <main className="max-w-6xl mx-auto px-6 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
