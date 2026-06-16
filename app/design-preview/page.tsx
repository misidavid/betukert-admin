'use client';

import { useState } from 'react';
import { Check, X, Plus, Search, RotateCcw, Trash2 } from 'lucide-react';

type Tab = 'dashboard' | 'szavak' | 'mondatok';

const STATS = { missingImages: 12, missingSounds: 4, publishedPackages: 7 };

const SECTIONS = [
  { emoji: '🖼️', title: 'Képek', desc: 'Képszükségletek listája, feltöltés, jóváhagyás és publikálás' },
  { emoji: '🔊', title: 'Hangok', desc: 'Hangszükségletek listája, feltöltés, jóváhagyás és publikálás' },
  { emoji: '📚', title: 'Curriculum', desc: 'Betűk, szótagok, szavak áttekintése szint szerint' },
  { emoji: '🚀', title: 'Publikálás', desc: 'Tartalom csomag összeállítása és publikálása' },
];

const SAMPLE_WORDS = [
  { id: '1', text: 'sün', syllables: ['sün'], syllable_count: 1, phase: 1, enabled: true },
  { id: '2', text: 'báb', syllables: ['báb'], syllable_count: 1, phase: 1, enabled: true },
  { id: '3', text: 'alma', syllables: ['al', 'ma'], syllable_count: 2, phase: 2, enabled: true },
  { id: '4', text: 'béka', syllables: ['bé', 'ka'], syllable_count: 2, phase: 2, enabled: true },
  { id: '5', text: 'kutya', syllables: ['ku', 'tya'], syllable_count: 2, phase: 3, enabled: false },
  { id: '6', text: 'sapka', syllables: ['sap', 'ka'], syllable_count: 2, phase: 3, enabled: true },
];

const EXCLUDED_WORDS = ['fijaim', 'Magyar'];

const SAMPLE_SENTENCES = [
  { id: 4, words: ['Egy', 'lány', 'fut', 'a', 'kutyával.'], acceptedOrders: 1, phase: 3 },
  { id: 5, words: ['A', 'béka', 'a', 'tavon', 'ül.'], acceptedOrders: 2, phase: 3 },
];

const SAMPLE_COMPREHENSION = [
  {
    id: 4,
    sentence: 'Egy lány fut a kutyával.',
    question: 'Mit csinál a lány?',
    correctAnswer: 'fut',
    wrongAnswers: ['ül', 'alszik'],
    phase: 3,
  },
];

export default function DesignPreviewPage() {
  const [tab, setTab] = useState<Tab>('dashboard');

  return (
    <div className="min-h-screen pb-16" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="bg-[#2F6B3F] text-white text-center text-sm py-2 px-4">
        Statikus design-terv — csak előnézet, az éles admint nem érinti.
      </div>

      <div className="max-w-3xl mx-auto px-5 pt-8">
        <h1
          className="text-3xl text-[#234430] mb-1"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
        >
          Betűkert admin — design terv
        </h1>
        <p className="text-[#8A8478] mb-6">Szóbank és mondatok a new vizuális stílusban</p>

        <div className="flex gap-2 mb-6">
          {[
            { id: 'dashboard' as Tab, label: 'Dashboard' },
            { id: 'szavak' as Tab, label: 'Szóbank' },
            { id: 'mondatok' as Tab, label: 'Mondatok' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="px-5 py-2.5 rounded-2xl text-sm transition-colors"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                background: tab === t.id ? '#2F6B3F' : '#FFFFFF',
                color: tab === t.id ? '#FFFFFF' : '#234430',
                border: tab === t.id ? 'none' : '1px solid #E3DCC9',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'dashboard' ? <Dashboard /> : tab === 'szavak' ? <WordBank /> : <Sentences />}
      </div>
    </div>
  );
}

function PhaseChip({ phase }: { phase: number }) {
  return (
    <span
      className="text-xs px-3 py-1 rounded-full shrink-0"
      style={{ background: '#DCEBDC', color: '#234430', fontWeight: 700 }}
    >
      {phase}. szint
    </span>
  );
}

function StatCard({ value, label, accent }: { value: number; label: string; accent: string }) {
  return (
    <div className="bg-white rounded-[24px] p-5 shadow-sm">
      <div className="text-3xl" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: accent }}>
        {value}
      </div>
      <div className="text-sm mt-1" style={{ color: '#8A8478' }}>{label}</div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="space-y-5">
      <div
        className="rounded-[28px] p-6"
        style={{ background: 'linear-gradient(135deg, #DCEBDC, #F1ECE0)' }}
      >
        <h2 className="text-xl text-[#234430]" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
          Üdvözöljük a Betűkert Adminban
        </h2>
        <p className="text-sm mt-1" style={{ color: '#5B6E5C' }}>
          Tartalom kezelés, képek és hangok feltöltése, curriculum áttekintés
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard value={STATS.missingImages} label="Hiányzó kép" accent="#C0473F" />
        <StatCard value={STATS.missingSounds} label="Hiányzó hang" accent="#C0473F" />
        <StatCard value={STATS.publishedPackages} label="Publikált csomag" accent="#2F6B3F" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SECTIONS.map((s) => (
          <div key={s.title} className="bg-white rounded-[24px] p-5 shadow-sm">
            <div className="text-3xl mb-2">{s.emoji}</div>
            <h3
              className="text-lg mb-1"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#234430' }}
            >
              {s.title}
            </h3>
            <p className="text-sm" style={{ color: '#8A8478' }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function WordBank() {
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-[24px] p-4 flex gap-2 shadow-sm">
        <input
          type="text"
          placeholder="Új szó hozzáadása..."
          className="flex-1 rounded-2xl px-4 py-2.5 text-sm outline-none"
          style={{ background: '#F1ECE0', color: '#234430' }}
        />
        <button
          className="rounded-2xl px-4 py-2.5 text-sm text-white flex items-center gap-1.5"
          style={{ background: '#2F6B3F', fontFamily: 'var(--font-display)', fontWeight: 600 }}
        >
          <Plus size={16} /> Hozzáadás
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 bg-white rounded-2xl px-4 py-2 flex items-center gap-2 shadow-sm">
          <Search size={16} color="#8A8478" />
          <input
            type="text"
            placeholder="Keresés..."
            className="flex-1 text-sm outline-none bg-transparent"
            style={{ color: '#234430' }}
          />
        </div>
        <span className="text-sm text-[#8A8478]">{SAMPLE_WORDS.length} szó</span>
      </div>

      <div className="space-y-3">
        {SAMPLE_WORDS.map((w) => (
          <div
            key={w.id}
            className="bg-white rounded-[24px] p-4 flex items-center gap-4 shadow-sm relative"
            style={{ opacity: w.enabled ? 1 : 0.5 }}
          >
            {w.enabled && (
              <span
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: '#2F6B3F' }}
              >
                <Check size={14} color="white" strokeWidth={3} />
              </span>
            )}
            <span
              className="w-28 shrink-0"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#234430' }}
            >
              {w.text}
            </span>
            <span className="text-sm text-[#8A8478]">{w.syllables.join('-')}</span>
            <span className="text-xs text-[#B5AE9E]">{w.syllable_count} szótag</span>
            <PhaseChip phase={w.phase} />
            <div className="flex-1" />
            <button
              className="text-xs px-3 py-1.5 rounded-xl"
              style={{ background: '#FBE7E5', color: '#C0473F' }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[24px] p-4 shadow-sm">
        <p className="text-sm mb-3" style={{ color: '#8A8478' }}>
          Kizárt szavak ({EXCLUDED_WORDS.length}) — ezeket az alap szóbank visszaállítása nem hozza vissza
        </p>
        <div className="flex flex-wrap gap-2">
          {EXCLUDED_WORDS.map((text) => (
            <span
              key={text}
              className="flex items-center gap-2 rounded-2xl px-3 py-1.5 text-sm"
              style={{ background: '#F1ECE0', color: '#234430' }}
            >
              {text}
              <button className="flex items-center gap-1 text-xs" style={{ color: '#2F6B3F' }}>
                <RotateCcw size={12} /> visszaállít
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Sentences() {
  return (
    <div className="space-y-5">
      <h2
        className="text-lg text-[#234430]"
        style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
      >
        Mondatrendezés
      </h2>
      {SAMPLE_SENTENCES.map((s) => (
        <div key={s.id} className="bg-white rounded-[24px] p-5 flex items-start gap-4 shadow-sm">
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-2">
              {s.words.map((w, i) => (
                <span
                  key={i}
                  className="px-3.5 py-1.5 rounded-2xl text-sm"
                  style={{
                    background: '#DCEBDC',
                    color: '#234430',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                  }}
                >
                  {w}
                </span>
              ))}
            </div>
            <p className="text-xs text-[#B5AE9E]">{s.acceptedOrders} elfogadott sorrend</p>
          </div>
          <PhaseChip phase={s.phase} />
        </div>
      ))}

      <h2
        className="text-lg text-[#234430] pt-2"
        style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
      >
        Mondatértés
      </h2>
      {SAMPLE_COMPREHENSION.map((c) => (
        <div key={c.id} className="bg-white rounded-[24px] p-5 shadow-sm space-y-3">
          <div className="flex items-start justify-between gap-4">
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: '#234430' }}>
              {c.sentence}
            </p>
            <PhaseChip phase={c.phase} />
          </div>
          <p className="text-sm text-[#8A8478]">{c.question}</p>
          <div className="flex flex-wrap gap-2">
            <span
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm relative"
              style={{ background: '#DCEBDC', color: '#234430', fontWeight: 700 }}
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{ background: '#2F6B3F' }}
              >
                <Check size={12} color="white" strokeWidth={3} />
              </span>
              {c.correctAnswer}
            </span>
            {c.wrongAnswers.map((w, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm"
                style={{ background: '#FBE7E5', color: '#8A4A44' }}
              >
                <X size={14} />
                {w}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
