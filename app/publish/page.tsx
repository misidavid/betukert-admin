'use client';

import { useState, useEffect } from 'react';
import { publishPackageAction, fetchPublishDataAction, PublishedPackage } from '../actions/publish';

const GREEN = '#2F6B3F';
const GREEN_DARK = '#234430';
const MUTED = '#8A8478';
const TRACK = '#F1ECE0';
const cardStyle = 'bg-white rounded-[24px] shadow-sm p-6';
const display = { fontFamily: 'var(--font-display)' };

interface PackageStats {
  publishedImages: number;
  publishedSounds: number;
  totalImages: number;
  totalSounds: number;
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
    const data = await fetchPublishDataAction();
    setStats({
      totalImages: data.totalImages,
      publishedImages: data.publishedImages,
      totalSounds: data.totalSounds,
      publishedSounds: data.publishedSounds,
    });
    setPackages(data.packages);
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
        <h1 className="text-2xl" style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>🚀 Publikálás</h1>
        <p className="text-sm mt-1" style={{ color: MUTED }}>
          Tartalom csomag összeállítása és publikálása az apphoz
        </p>
      </div>

      {message && (
        <div className="bg-white rounded-[24px] shadow-sm p-4 text-sm" style={{ color: GREEN_DARK }}>
          {message}
        </div>
      )}

      {/* Készültség */}
      {stats && (
        <div className={`${cardStyle} space-y-4`}>
          <h2 style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>Tartalom készültség</h2>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span style={{ color: GREEN_DARK, fontWeight: 600 }}>Képek</span>
                <span style={{ color: MUTED }}>
                  {stats.publishedImages} / {stats.totalImages} publikált
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: TRACK }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    background: GREEN,
                    width: `${stats.totalImages > 0
                      ? (stats.publishedImages / stats.totalImages) * 100
                      : 0}%`
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span style={{ color: GREEN_DARK, fontWeight: 600 }}>Hangok</span>
                <span style={{ color: MUTED }}>
                  {stats.publishedSounds} / {stats.totalSounds} publikált
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: TRACK }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    background: GREEN,
                    width: `${stats.totalSounds > 0
                      ? (stats.publishedSounds / stats.totalSounds) * 100
                      : 0}%`
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-sm" style={{ color: MUTED }}>
              Összesített készültség: <span style={{ fontWeight: 700, color: GREEN_DARK }}>{readinessPercent}%</span>
            </div>
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="px-6 py-2.5 rounded-2xl text-white transition-colors disabled:opacity-50"
              style={{ ...display, fontWeight: 600, background: GREEN }}
            >
              {publishing ? 'Publikálás...' : '🚀 Csomag publikálása'}
            </button>
          </div>
        </div>
      )}

      {/* Korábbi csomagok */}
      <div className="space-y-3">
        <h2 style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>Korábbi csomagok</h2>
        {packages.length === 0 ? (
          <div className={`${cardStyle} text-center`} style={{ color: '#B5AE9E' }}>
            Még nincs publikált csomag
          </div>
        ) : (
          packages.map(pkg => (
            <div key={pkg.id} className="bg-white rounded-[24px] shadow-sm p-4 flex items-center gap-4">
              <div className="flex-1">
                <div style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>v{pkg.version}</div>
                <div className="text-sm" style={{ color: MUTED }}>
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
                className="text-xs px-3 py-1.5 rounded-xl transition-colors"
                style={{ background: TRACK, color: GREEN_DARK, fontWeight: 600 }}
              >
                ⬇️ Letöltés
              </button>
            </div>
          ))
        )}
      </div>

      {/* SQL migráció */}
      <div className="rounded-[24px] p-5" style={{ background: '#FBF3DD' }}>
        <h3 className="mb-2" style={{ ...display, fontWeight: 700, color: '#8A6A1F' }}>⚠️ Szükséges SQL migráció</h3>
        <p className="text-sm mb-3" style={{ color: '#9A7A2F' }}>
          Ha a publikálás nem működik, futtasd le ezt a Supabase SQL Editorban:
        </p>
        <pre className="bg-white rounded-2xl p-3 text-xs overflow-x-auto" style={{ color: MUTED }}>
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
