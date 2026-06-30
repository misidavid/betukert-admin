'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Baloo_2, Quicksand } from 'next/font/google';
import { fetchHomeStatsAction } from './actions/stats';

const displayFont = Baloo_2({
  subsets: ['latin', 'latin-ext'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
});

const bodyFont = Quicksand({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700'],
  variable: '--font-body',
});

const GREEN = '#2F6B3F';
const GREEN_DARK = '#234430';
const RED = '#C0473F';
const MUTED = '#8A8478';
const display = { fontFamily: 'var(--font-display)' };

interface Stats {
  missingImages: number;
  missingSounds: number;
  publishedPackages: number;
}

const sections = [
  {
    href: '/images',
    emoji: '🖼️',
    title: 'Képek',
    desc: 'Képszükségletek listája, feltöltés, jóváhagyás és publikálás',
  },
  {
    href: '/sounds',
    emoji: '🔊',
    title: 'Hangok',
    desc: 'Hangszükségletek listája, feltöltés, jóváhagyás és publikálás',
  },
  {
    href: '/curriculum',
    emoji: '📚',
    title: 'Curriculum',
    desc: 'Betűk, szótagok, szavak áttekintése szint szerint',
  },
  {
    href: '/publish',
    emoji: '🚀',
    title: 'Publikálás',
    desc: 'Tartalom csomag összeállítása és publikálása',
  },
];

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const data = await fetchHomeStatsAction();
    setStats({
      missingImages: data.missingImages,
      missingSounds: data.missingSounds,
      publishedPackages: data.publishedPackages,
    });
    setLoading(false);
  };

  return (
    <div className={`${displayFont.variable} ${bodyFont.variable} space-y-6`} style={{ fontFamily: 'var(--font-body)' }}>
      <div className="rounded-[28px] p-6" style={{ background: 'linear-gradient(135deg, #DCEBDC, #F1ECE0)' }}>
        <h1 className="text-2xl" style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>
          Üdvözöljük a Betűkert Adminban
        </h1>
        <p className="text-sm mt-1" style={{ color: '#5B6E5C' }}>
          Tartalom kezelés, képek és hangok feltöltése, curriculum áttekintés
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Link href="/images" className="bg-white rounded-[24px] shadow-sm p-5 transition-shadow hover:shadow-md">
          <div className="text-3xl" style={{ ...display, fontWeight: 700, color: RED }}>
            {loading ? '...' : stats?.missingImages}
          </div>
          <div className="text-sm mt-1" style={{ color: MUTED }}>Hiányzó kép</div>
        </Link>

        <Link href="/sounds" className="bg-white rounded-[24px] shadow-sm p-5 transition-shadow hover:shadow-md">
          <div className="text-3xl" style={{ ...display, fontWeight: 700, color: RED }}>
            {loading ? '...' : stats?.missingSounds}
          </div>
          <div className="text-sm mt-1" style={{ color: MUTED }}>Hiányzó hang</div>
        </Link>

        <Link href="/publish" className="bg-white rounded-[24px] shadow-sm p-5 transition-shadow hover:shadow-md">
          <div className="text-3xl" style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>
            {loading ? '...' : stats?.publishedPackages}
          </div>
          <div className="text-sm mt-1" style={{ color: MUTED }}>Publikált csomag</div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map(section => (
          <Link
            key={section.href}
            href={section.href}
            className="bg-white rounded-[24px] shadow-sm p-5 transition-shadow hover:shadow-md"
          >
            <div className="text-3xl mb-2">{section.emoji}</div>
            <h2 className="text-lg mb-1" style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>
              {section.title}
            </h2>
            <p className="text-sm" style={{ color: MUTED }}>{section.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
