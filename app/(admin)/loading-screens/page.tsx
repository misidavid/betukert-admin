'use client';

import { useState, useEffect, useRef } from 'react';
import { LoadingScreen, fetchLoadingScreensAction, uploadLoadingScreenAction, deleteLoadingScreenAction } from '../../actions/loadingScreens';

const GREEN = '#2F6B3F';
const GREEN_DARK = '#234430';
const MUTED = '#8A8478';
const TRACK = '#F1ECE0';
const cardStyle = 'bg-white rounded-[24px] shadow-sm p-6';
const display = { fontFamily: 'var(--font-display)' };

export default function LoadingScreensPage() {
  const [items, setItems] = useState<LoadingScreen[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    const { items, error } = await fetchLoadingScreensAction();
    if (error) setMessage(`❌ ${error}`);
    setItems(items);
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage('');
    const formData = new FormData();
    formData.append('file', file);
    const result = await uploadLoadingScreenAction(formData);
    if (result.error) {
      setMessage(`❌ ${result.error}`);
    } else {
      setMessage('✅ Kép feltöltve!');
      loadItems();
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setDeleteConfirmId(null);
    setMessage('');
    const result = await deleteLoadingScreenAction(id);
    if (result.error) {
      setMessage(`❌ ${result.error}`);
    } else {
      setMessage('✅ Kép törölve.');
      setItems(prev => prev.filter(i => i.id !== id));
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl" style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>
            🖼️ Loading Screens
          </h1>
          <p className="text-sm mt-1" style={{ color: MUTED }}>
            Indítóképek kezelése — az app véletlenszerűen választ egyet ezek közül az első betöltéskor
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-5 py-2.5 rounded-2xl text-white transition-colors disabled:opacity-50 text-sm"
          style={{ ...display, fontWeight: 600, background: GREEN }}
        >
          {uploading ? 'Feltöltés...' : '+ Kép feltöltése'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {message && (
        <div className="bg-white rounded-[24px] shadow-sm p-4 text-sm" style={{ color: GREEN_DARK }}>
          {message}
        </div>
      )}

      {loading ? (
        <div className={`${cardStyle} text-center`} style={{ color: MUTED }}>
          Betöltés...
        </div>
      ) : items.length === 0 ? (
        <div className={`${cardStyle} text-center py-12`} style={{ color: '#B5AE9E' }}>
          <div className="text-4xl mb-3">🖼️</div>
          <div style={{ ...display, fontWeight: 600 }}>Nincs loading screen</div>
          <div className="text-sm mt-1">Tölts fel képeket a gombbal fent</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-[24px] shadow-sm overflow-hidden relative group">
              <div className="aspect-[9/16] bg-gray-100 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.file_url}
                  alt={item.filename}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <div className="text-xs truncate" style={{ color: MUTED }}>
                  {item.filename.replace(/^\d+_/, '')}
                </div>
                <div className="text-xs mt-0.5" style={{ color: '#B5AE9E' }}>
                  {new Date(item.created_at).toLocaleDateString('hu-HU')}
                </div>
              </div>

              {deleteConfirmId === item.id ? (
                <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center gap-3 p-4">
                  <div className="text-sm text-center" style={{ color: GREEN_DARK, fontWeight: 600 }}>
                    Biztosan törlöd?
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="px-4 py-1.5 rounded-xl text-white text-sm disabled:opacity-50"
                      style={{ background: '#C0392B', fontWeight: 600 }}
                    >
                      Törlés
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-4 py-1.5 rounded-xl text-sm"
                      style={{ background: TRACK, color: GREEN_DARK, fontWeight: 600 }}
                    >
                      Mégsem
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirmId(item.id)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm shadow"
                  title="Törlés"
                >
                  🗑️
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="rounded-[24px] p-5" style={{ background: '#FBF3DD' }}>
        <h3 className="mb-2" style={{ ...display, fontWeight: 700, color: '#8A6A1F' }}>⚠️ Szükséges SQL migráció</h3>
        <p className="text-sm mb-3" style={{ color: '#9A7A2F' }}>
          Futtasd le ezt a Supabase SQL Editorban, ha még nem tetted meg:
        </p>
        <pre className="bg-white rounded-2xl p-3 text-xs overflow-x-auto" style={{ color: MUTED }}>
{`-- 1. Loading screens tábla
CREATE TABLE IF NOT EXISTS loading_screens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. published_packages tábla új kolumna
ALTER TABLE published_packages
  ADD COLUMN IF NOT EXISTS loading_screen_count INTEGER DEFAULT 0;`}
        </pre>
        <p className="text-sm mt-3" style={{ color: '#9A7A2F' }}>
          A feltöltött képek a következő <strong>Csomag publikálása</strong> után kerülnek az appba.
        </p>
      </div>
    </div>
  );
}
