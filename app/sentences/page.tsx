'use client';

import { useState } from 'react';
import { SENTENCE_BANK, COMPREHENSION_BANK } from '../../shared/data/sentencebank';
import { GRAPHEMES } from '../../shared/curriculum/graphemes';

type Tab = 'mondatrendezes' | 'mondatertes';

const maxPhase = Math.max(...GRAPHEMES.filter(g => !g.rare).map(g => g.phase));

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
        <h1 className="text-2xl font-bold text-[#2D5A27]">📝 Mondatok</h1>
        <p className="text-gray-500 text-sm mt-1">
          Mondatrendezés és mondatértés feladatok áttekintése
        </p>
      </div>

      {/* Szintcsúszka */}
      <div className="bg-white rounded-xl border p-6 space-y-3">
        <div className="flex items-center justify-between">
          <label className="font-bold text-[#2D5A27]">Szint: {phaseFilter}</label>
          <span className="text-sm text-gray-500">
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
          className="w-full accent-[#2D5A27]"
        />
      </div>

      {/* Keresés + Tabok */}
      <div className="flex items-end justify-between gap-4">
        <div className="flex gap-2 border-b flex-1">
          {[
            { id: 'mondatrendezes', label: 'Mondatrendezés' },
            { id: 'mondatertes', label: 'Mondatértés' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id as Tab); setSearch(''); }}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-[#2D5A27] text-[#2D5A27]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
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
          className="border rounded-lg px-3 py-2 text-sm bg-white w-48 mb-0.5"
        />
      </div>

      {/* Mondatrendezés tab */}
      {tab === 'mondatrendezes' && (
        <div className="space-y-2">
          {filteredSentences.length === 0 ? (
            <div className="text-center py-12 text-gray-400">Nincs találat.</div>
          ) : (
            filteredSentences.map(s => (
              <div key={s.id} className="bg-white rounded-xl border p-4 flex items-start gap-4">
                <span className="text-xs text-gray-400 w-10 pt-0.5 shrink-0">{s.id}</span>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {s.words.map((w, i) => (
                      <span
                        key={i}
                        className="bg-[#E8F0E5] text-[#2D5A27] font-bold px-3 py-1 rounded-lg text-sm"
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-gray-400">
                    {s.acceptedOrders.length} elfogadott sorrend
                    {s.acceptedOrders.length > 1 && (
                      <span className="ml-2 text-gray-300">
                        ({s.acceptedOrders.map(o => o.join(' ')).join(' / ')})
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs bg-[#E8F0E5] text-[#2D5A27] px-2 py-1 rounded-full shrink-0">
                  {s.phase}. szint
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Mondatértés tab */}
      {tab === 'mondatertes' && (
        <div className="space-y-3">
          {filteredComprehensions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">Nincs találat.</div>
          ) : (
            filteredComprehensions.map(c => (
              <div key={c.id} className="bg-white rounded-xl border p-4 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-xs text-gray-400 w-10 pt-0.5 shrink-0">{c.id}</span>
                    <p className="font-medium text-gray-800">{c.sentence}</p>
                  </div>
                  <span className="text-xs bg-[#E8F0E5] text-[#2D5A27] px-2 py-1 rounded-full shrink-0">
                    {c.phase}. szint
                  </span>
                </div>
                <div className="ml-13 pl-10 space-y-1 text-sm">
                  <div className="text-gray-500">
                    <span className="font-medium text-gray-700">K:</span> {c.question}
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="bg-green-50 text-green-700 border border-green-200 px-3 py-0.5 rounded-lg text-xs font-medium">
                      ✓ {c.correctAnswer}
                    </span>
                    {c.wrongAnswers.map((w, i) => (
                      <span key={i} className="bg-red-50 text-red-600 border border-red-200 px-3 py-0.5 rounded-lg text-xs">
                        ✗ {w}
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
