'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { publishPackageAction } from '../actions/publish';

interface PackageStats {
  publishedImages: number;
  publishedSounds: number;
  totalImages: number;
  totalSounds: number;
}

interface PublishedPackage {
  id: string;
  version: string;
  created_at: string;
  image_count: number;
  sound_count: number;
  manifest: any;
}

export default function PublishPage() {
  const [stats, setStats] = useState<PackageStats | null>(null);
  const [packages, setPackages] = useState<PublishedPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    const [
      { count: totalImages },
      { count: publishedImages },
      { count: totalSounds },
      { count: publishedSounds },
    ] = await Promise.all([
      supabase.from('image_needs').select('*', { count: 'exact', head: true }),
      supabase.from('image_needs').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('sound_needs').select('*', { count: 'exact', head: true }),
      supabase.from('sound_needs').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    ]);

    setStats({
      totalImages: totalImages || 0,
      publishedImages: publishedImages || 0,
      totalSounds: totalSounds || 0,
      publishedSounds: publishedSounds || 0,
    });

    // Publikált csomagok betöltése
    const { data: pkgs } = await supabase
      .from('published_packages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (pkgs) setPackages(pkgs);
    setLoading(false);
  };

  const handlePublish = async () => {
    setPublishing(true);
    setMessage('');
    const result = await publishPackageAction();
    if (result.error) {
      setMessage(`❌ Hiba: ${result.error}`);
    } else {
      setMessage(`✅ Csomag publikálva! Verzió: ${result.version} | ${result.imageCount} kép, ${result.soundCount} hang`);
      loadData();
    }
    setPublishing(false);
  };

  const readinessPercent = stats
    ? Math.round(((stats.publishedImages + stats.publishedSounds) /
        Math.max(stats.totalImages + stats.totalSounds, 1)) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2D5A27]">🚀 Publikálás</h1>
        <p className="text-gray-500 text-sm mt-1">
          Tartalom csomag összeállítása és publikálása az apphoz
        </p>
      </div>

      {message && (
        <div className="bg-white border rounded-lg p-4 text-sm">
          {message}
        </div>
      )}

      {/* Készültség */}
      {stats && (
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-bold text-[#2D5A27]">Tartalom készültség</h2>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Képek</span>
                <span className="text-gray-500">
                  {stats.publishedImages} / {stats.totalImages} publikált
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2D5A27] rounded-full transition-all"
                  style={{
                    width: `${stats.totalImages > 0
                      ? (stats.publishedImages / stats.totalImages) * 100
                      : 0}%`
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Hangok</span>
                <span className="text-gray-500">
                  {stats.publishedSounds} / {stats.totalSounds} publikált
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2D5A27] rounded-full transition-all"
                  style={{
                    width: `${stats.totalSounds > 0
                      ? (stats.publishedSounds / stats.totalSounds) * 100
                      : 0}%`
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-gray-500">
              Összesített készültség: <span className="font-bold text-[#2D5A27]">{readinessPercent}%</span>
            </div>
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="bg-[#2D5A27] text-white px-6 py-2 rounded-lg hover:bg-[#4A7C42] transition-colors disabled:opacity-50"
            >
              {publishing ? 'Publikálás...' : '🚀 Csomag publikálása'}
            </button>
          </div>
        </div>
      )}

      {/* Korábbi csomagok */}
      <div className="space-y-3">
        <h2 className="font-bold text-[#2D5A27]">Korábbi csomagok</h2>
        {packages.length === 0 ? (
          <div className="bg-white rounded-xl border p-6 text-center text-gray-400">
            Még nincs publikált csomag
          </div>
        ) : (
          packages.map(pkg => (
            <div key={pkg.id} className="bg-white rounded-xl border p-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="font-bold text-[#2D5A27]">v{pkg.version}</div>
                <div className="text-sm text-gray-500">
                  {new Date(pkg.created_at).toLocaleString('hu-HU')} •
                  {pkg.image_count} kép • {pkg.sound_count} hang
                </div>
              </div>
              <button
                onClick={() => {
                  const blob = new Blob(
                    [JSON.stringify(pkg.manifest, null, 2)],
                    { type: 'application/json' }
                  );
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `betukert-package-${pkg.version}.json`;
                  a.click();
                }}
                className="bg-gray-50 text-gray-700 text-xs px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                ⬇️ Letöltés
              </button>
            </div>
          ))
        )}
      </div>

      {/* SQL migráció */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <h3 className="font-bold text-yellow-800 mb-2">⚠️ Szükséges SQL migráció</h3>
        <p className="text-sm text-yellow-700 mb-3">
          Ha a publikálás nem működik, futtasd le ezt a Supabase SQL Editorban:
        </p>
        <pre className="bg-white rounded-lg p-3 text-xs overflow-x-auto text-gray-700">
{`CREATE TABLE published_packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  version TEXT NOT NULL,
  image_count INTEGER DEFAULT 0,
  sound_count INTEGER DEFAULT 0,
  manifest JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
        </pre>
      </div>
    </div>
  );
}
