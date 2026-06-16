'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { SENTENCE_BANK, COMPREHENSION_BANK } from '../../shared/data/sentencebank';
import { GRAPHEMES } from '../../shared/curriculum/graphemes';

type Tab = 'mondatrendezes' | 'mondatertes';

const GREEN = '#2F6B3F';
const GREEN_DARK = '#234430';
const GREEN_LIGHT = '#DCEBDC';
const RED_LIGHT = '#FBE7E5';
const RED_TEXT = '#8A4A44';
const MUTED = '#8A8478';
const display = { fontFamily: 'var(--font-display)' };

const maxPhase = Math.max(...GRAPHEMES.filter(g => !g.rare).map(g => g.phase));

function PhaseChip({ phase }: { phase: number }) {
  return (
    <span
      className="text-xs px-3 py-1 rounded-full shrink-0"
      style={{ background: GREEN_LIGHT, color: GREEN_DARK, fontWeight: 700 }}
    >
      {phase}. szint
    </span>
  );
}

export default function SentencesPage() {
  const [tab, setTab] = useState<Tab>('mondatrendezes');
  const [phaseFilter, setPhaseFilter] = useState<number>(maxPhase);
  const [search, setSearch] = useState('');

  const filteredSentences = SENTENCE_BANK
    .filter(s => s.phase <= phaseFilter)
    .filter(s => search === '' || s.words.join(' ').toLowerCase().includes(search.toLowerCase()));

  const filteredComprehensions = COMPREHENSION_BANK
    .filter(c => c.phase <= phaseFilter)
    .filter(c => search === '' || c.sentence.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl" style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>📝 Mondatok</h1>
        <p className="text-sm mt-1" style={{ color: MUTED }}>
          Mondatrendezés és mondatértés feladatok áttekintése
        </p>
      </div>

      {/* Szintcsúszka */}
      <div className="bg-white rounded-[24px] shadow-sm p-6 space-y-3">
        <div className="flex items-center justify-between">
          <label style={{ ...display, fontWeight: 700, color: GREEN_DARK }}>Szint: {phaseFilter}</label>
          <span className="text-sm" style={{ color: MUTED }}>
            {tab === 'mondatrendezes'
              ? `${filteredSentences.length} mondat`
              : `${filteredComprehensions.length} feladat`}
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={maxPhase}
          value={phaseFilter}
          onChange={e => setPhaseFilter(Number(e.target.value))}
          className="w-full"
          style={{ accentColor: GREEN }}
        />
      </div>

      {/* Keresés + Tabok */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          {[
            { id: 'mondatrendezes' as Tab, label: 'Mondatrendezés' },
            { id: 'mondatertes' as Tab, label: 'Mondatértés' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setSearch(''); }}
              className="px-5 py-2.5 rounded-2xl text-sm transition-colors"
              style={{
                ...display,
                fontWeight: 600,
                background: tab === t.id ? GREEN : '#FFFFFF',
                color: tab === t.id ? '#FFFFFF' : GREEN_DARK,
                border: tab === t.id ? 'none' : '1px solid #E3DCC9',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Keresés..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="rounded-2xl px-4 py-2.5 text-sm outline-none w-48"
          style={{ background: '#FFFFFF', border: '1px solid #E3DCC9', color: GREEN_DARK }}
        />
      </div>

      {/* Mondatrendezés tab */}
      {tab === 'mondatrendezes' && (
        <div className="space-y-3">
          {filteredSentences.length === 0 ? (
            <div className="text-center py-12" style={{ color: '#B5AE9E' }}>Nincs találat.</div>
          ) : (
            filteredSentences.map(s => (
              <div key={s.id} className="bg-white rounded-[24px] shadow-sm p-5 flex items-start gap-4">
                <span className="text-xs w-10 pt-0.5 shrink-0" style={{ color: '#B5AE9E' }}>{s.id}</span>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {s.words.map((w, i) => (
                      <span
                        key={i}
                        className="px-3.5 py-1.5 rounded-2xl text-sm"
                        style={{ ...display, background: GREEN_LIGHT, color: GREEN_DARK, fontWeight: 600 }}
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs" style={{ color: '#B5AE9E' }}>
                    {s.acceptedOrders.length} elfogadott sorrend
                    {s.acceptedOrders.length > 1 && (
                      <span className="ml-2" style={{ color: '#D8D2C2' }}>
                        ({s.acceptedOrders.map(o => o.join(' ')).join(' / ')})
                      </span>
                    )}
                  </div>
                </div>
                <PhaseChip phase={s.phase} />
              </div>
            ))
          )}
        </div>
      )}

      {/* Mondatértés tab */}
      {tab === 'mondatertes' && (
        <div className="space-y-3">
          {filteredComprehensions.length === 0 ? (
            <div className="text-center py-12" style={{ color: '#B5AE9E' }}>Nincs találat.</div>
          ) : (
            filteredComprehensions.map(c => (
              <div key={c.id} className="bg-white rounded-[24px] shadow-sm p-5 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-xs w-10 pt-0.5 shrink-0" style={{ color: '#B5AE9E' }}>{c.id}</span>
                    <p style={{ ...display, fontWeight: 600, color: GREEN_DARK }}>{c.sentence}</p>
                  </div>
                  <PhaseChip phase={c.phase} />
                </div>
                <div className="ml-13 pl-10 space-y-2 text-sm">
                  <div style={{ color: MUTED }}>
                    <span style={{ fontWeight: 600, color: GREEN_DARK }}>K:</span> {c.question}
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span
                      className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm"
                      style={{ background: GREEN_LIGHT, color: GREEN_DARK, fontWeight: 700 }}
                    >
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: GREEN }}
                      >
                        <Check size={12} color="white" strokeWidth={3} />
                      </span>
                      {c.correctAnswer}
                    </span>
                    {c.wrongAnswers.map((w, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm"
                        style={{ background: RED_LIGHT, color: RED_TEXT }}
                      >
                        <X size={14} />
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
