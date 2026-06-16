'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { toggleRequiresImageAction } from '../../actions/exerciseTypeConfig';
import Link from 'next/link';

const GREEN = '#2F6B3F';
const GREEN_DARK = '#234430';
const GREEN_LIGHT = '#DCEBDC';
const MUTED = '#8A8478';
const TRACK = '#F1ECE0';
const display = { fontFamily: 'var(--font-display)' };

interface ExerciseTypeConfig {
  id: string;
  label: string;
  requires_image: boolean;
  updated_at: string;
}

export default function ImageSettingsPage() {
  const [configs, setConfigs] = useState<ExerciseTypeConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('exercise_type_config')
      .select('*')
      .order('id');
    if (!error && data) setConfigs(data);
    setLoading(false);
  };

  const handleToggle = async (id: string, value: boolean) => {
    setSaving(id);
    const result = await toggleRequiresImageAction(id, value);
    if (result.error) {
      setMessage(`❌ Hiba: ${result.error}`);
    } else {
      await loadConfigs();
      setMessage('✅ Mentve');
      setTimeout(() => setMessage(''), 2000);
    }
    setSaving(null);
  };

  const imageRequired = configs.filter(c => c.requires_image);
  const imageNotRequired = configs.filter(c => !c.requires_image);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/images" className="text-sm hover:underline" style={{ color: GREEN }}>
              Vissza a kepekhez
            </Link>
          </div>
          <h1 className="text-2xl" style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>
            Kepkoteles feladattipusok
          </h1>
          <p className="text-sm mt-1" style={{ color: MUTED }}>
            Allitsd be melyik feladattipusokhoz szukseges kep
          </p>
        </div>
        {message && (
          <span className="text-sm" style={{ color: GREEN, fontWeight: 600 }}>{message}</span>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12" style={{ color: '#B5AE9E' }}>Betoltes...</div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-[24px] shadow-sm p-6 space-y-1">
            <h2 className="mb-2" style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>
              Kepet igenyo feladatok ({imageRequired.length})
            </h2>
            {imageRequired.map((config, i) => (
              <div
                key={config.id}
                className="flex items-center justify-between py-2.5"
                style={{ borderBottom: i < imageRequired.length - 1 ? '1px solid #F1ECE0' : 'none' }}
              >
                <span style={{ fontWeight: 600, color: GREEN_DARK }}>{config.label}</span>
                <button
                  onClick={() => handleToggle(config.id, false)}
                  disabled={saving === config.id}
                  className="text-xs px-3 py-1.5 rounded-xl transition-colors"
                  style={{ background: GREEN_LIGHT, color: GREEN_DARK, fontWeight: 600 }}
                >
                  {saving === config.id ? '...' : 'Kepkoteles - kattints a kikapcsolashoz'}
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-[24px] shadow-sm p-6 space-y-1">
            <h2 className="mb-2" style={{ ...display, fontWeight: 700, color: MUTED }}>
              Nem igenyli a kepet ({imageNotRequired.length})
            </h2>
            {imageNotRequired.map((config, i) => (
              <div
                key={config.id}
                className="flex items-center justify-between py-2.5"
                style={{ borderBottom: i < imageNotRequired.length - 1 ? '1px solid #F1ECE0' : 'none' }}
              >
                <span style={{ color: MUTED }}>{config.label}</span>
                <button
                  onClick={() => handleToggle(config.id, true)}
                  disabled={saving === config.id}
                  className="text-xs px-3 py-1.5 rounded-xl transition-colors"
                  style={{ background: TRACK, color: MUTED, fontWeight: 600 }}
                >
                  {saving === config.id ? '...' : 'Kepkotelessze tesz'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
