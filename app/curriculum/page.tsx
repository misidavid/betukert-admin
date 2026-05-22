'use client';

import { useState } from 'react';
import { GRAPHEMES } from '../../shared/curriculum/graphemes';
import { generateSyllables } from '../../shared/curriculum/syllableGenerator';
import { filterWordsByPhase } from '../../shared/curriculum/wordFilter';
import { WORD_BANK } from '../../shared/data/wordbank';

type Tab = 'graphemes' | 'syllables' | 'words';

export default function CurriculumPage() {
  const [tab, setTab] = useState<Tab>('graphemes');
  const [phaseFilter, setPhaseFilter] = useState<number>(1);

  const graphemes = GRAPHEMES.filter(g => !g.rare && g.phase <= phaseFilter);
  const syllables = generateSyllables(phaseFilter).slice(0, 100);
  const words = filterWordsByPhase(WORD_BANK, phaseFilter);

  const maxPhase = Math.max(...GRAPHEMES.filter(g => !g.rare).map(g => g.phase));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2D5A27]">📚 Curriculum</h1>
        <p className="text-gray-500 text-sm mt-1">
          Betűk, szótagok és szavak áttekintése szint szerint
        </p>
      </div>

      {/* Szintcsúszka */}
      <div className="bg-white rounded-xl border p-6 space-y-3">
        <div className="flex items-center justify-between">
          <label className="font-bold text-[#2D5A27]">
            Szint: {phaseFilter}
          </label>
          <span className="text-sm text-gray-500">
            {graphemes.length} betű elérhető
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
        <div className="flex justify-between text-xs text-gray-400">
          <span>1. szint</span>
          <span>{maxPhase}. szint</span>
        </div>

        {/* Ismert betűk */}
        <div className="flex flex-wrap gap-2 pt-2">
          {graphemes.map(g => (
            <span
              key={g.id}
              className="bg-[#E8F0E5] text-[#2D5A27] font-bold px-3 py-1 rounded-lg text-sm"
            >
              {g.display}
            </span>
          ))}
        </div>
      </div>

      {/* Tabok */}
      <div className="flex gap-2 border-b">
        {[
          { id: 'graphemes', label: `Betűk (${graphemes.length})` },
          { id: 'syllables', label: `Szótagok (${syllables.length})` },
          { id: 'words', label: `Szavak (${words.length})` },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as Tab)}
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

      {/* Betűk tab */}
      {tab === 'graphemes' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {graphemes.map(g => (
            <div
              key={g.id}
              className="bg-white rounded-xl border p-4 text-center"
            >
              <div className="text-4xl font-bold text-[#2D5A27] mb-2">
                {g.display}
              </div>
              <div className="text-xs text-gray-500">{g.type}</div>
              <div className="text-xs text-gray-400">{g.phase}. szint</div>
            </div>
          ))}
        </div>
      )}

      {/* Szótagok tab */}
      {tab === 'syllables' && (
        <div className="space-y-4">
          {['VC', 'CV', 'CVC'].map(type => {
            const typeSyllables = syllables.filter(s => s.type === type);
            if (typeSyllables.length === 0) return null;
            return (
              <div key={type}>
                <h3 className="font-bold text-[#2D5A27] mb-2">
                  {type} típus ({typeSyllables.length} db)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {typeSyllables.map(s => (
                    <span
                      key={s.id}
                      className="bg-white border rounded-lg px-3 py-1 text-sm font-medium text-[#2D5A27]"
                    >
                      {s.text}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Szavak tab */}
      {tab === 'words' && (
        <div className="space-y-2">
          {words.map(w => (
            <div
              key={w.id}
              className="bg-white rounded-xl border p-3 flex items-center gap-4"
            >
              <span className="font-bold text-[#2D5A27] w-32">{w.text}</span>
              <span className="text-sm text-gray-500">
                {w.syllables.join('-')}
              </span>
              <span className="text-xs text-gray-400">
                {w.syllableCount} szótag
              </span>
              <span className="text-xs bg-[#E8F0E5] text-[#2D5A27] px-2 py-0.5 rounded-full">
                {w.phase}. szint
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
