'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

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
    color: 'bg-blue-50 border-blue-200',
  },
  {
    href: '/sounds',
    emoji: '🔊',
    title: 'Hangok',
    desc: 'Hangszükségletek listája, feltöltés, jóváhagyás és publikálás',
    color: 'bg-green-50 border-green-200',
  },
  {
    href: '/curriculum',
    emoji: '📚',
    title: 'Curriculum',
    desc: 'Betűk, szótagok, szavak áttekintése szint szerint',
    color: 'bg-yellow-50 border-yellow-200',
  },
  {
    href: '/publish',
    emoji: '🚀',
    title: 'Publikálás',
    desc: 'Tartalom csomag összeállítása és publikálása',
    color: 'bg-purple-50 border-purple-200',
  },
];

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [
      { count: missingImages },
      { count: missingSounds },
      { count: publishedPackages },
    ] = await Promise.all([
      supabase
        .from('image_needs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'missing'),
      supabase
        .from('sound_needs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'missing'),
      supabase
        .from('published_packages')
        .select('*', { count: 'exact', head: true }),
    ]);

    setStats({
      missingImages: missingImages || 0,
      missingSounds: missingSounds || 0,
      publishedPackages: publishedPackages || 0,
    });
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#2D5A27]">
          Üdvözöljük a Betűkert Adminban
        </h1>
        <p className="text-gray-500 mt-2">
          Tartalom kezelés, képek és hangok feltöltése, curriculum áttekintés
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Link
          href="/images"
          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="text-2xl font-bold text-red-600">
            {loading ? '...' : stats?.missingImages}
          </div>
          <div className="text-sm text-gray-500 mt-1">Hiányzó kép</div>
        </Link>

        <Link
          href="/sounds"
          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="text-2xl font-bold text-red-600">
            {loading ? '...' : stats?.missingSounds}
          </div>
          <div className="text-sm text-gray-500 mt-1">Hiányzó hang</div>
        </Link>

        <Link
          href="/publish"
          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="text-2xl font-bold text-[#2D5A27]">
            {loading ? '...' : stats?.publishedPackages}
          </div>
          <div className="text-sm text-gray-500 mt-1">Publikált csomag</div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map(section => (
          <Link
            key={section.href}
            href={section.href}
            className={`rounded-xl p-6 border-2 ${section.color} hover:shadow-md transition-shadow`}
          >
            <div className="text-3xl mb-3">{section.emoji}</div>
            <h2 className="text-xl font-bold text-[#2D5A27] mb-2">
              {section.title}
            </h2>
            <p className="text-gray-600 text-sm">{section.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
