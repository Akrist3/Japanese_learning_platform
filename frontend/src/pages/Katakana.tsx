import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import api from '../services/api';
import { Kana } from '../types';
import { AudioButton } from '../components/AudioButton';
import { KanjiCanvas } from '../components/KanjiCanvas';
import { useGamification } from '../context/GamificationContext';

export const Katakana: React.FC = () => {
  const [kanaList, setKanaList] = useState<Kana[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<'base' | 'dakuten' | 'handakuten' | 'combination'>('base');
  const [selectedKana, setSelectedKana] = useState<Kana | null>(null);
  const { awardXP } = useGamification();

  useEffect(() => {
    fetchKana();
  }, []);

  const fetchKana = async () => {
    try {
      const res = await api.get('/kana/list?type=katakana');
      setKanaList(res.data);
    } catch (err) {
      console.error('Failed to load katakana', err);
    }
  };

  const filteredKana = kanaList.filter(k => k.category === categoryFilter);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <h1 className="text-3xl font-black text-white flex items-center gap-2">
          <span>Katakana Course (カタカナ)</span>
          <Sparkles className="w-6 h-6 text-rose-400" />
        </h1>
        <p className="text-slate-400 text-sm mt-1">Master Katakana for foreign words, loanwords, and emphasis.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {[
          { label: 'Basic 46 (ア)', value: 'base' },
          { label: 'Dakuten (ガ)', value: 'dakuten' },
          { label: 'Handakuten (パ)', value: 'handakuten' },
          { label: 'Combinations (キャ)', value: 'combination' },
        ].map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategoryFilter(cat.value as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              categoryFilter === cat.value
                ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {filteredKana.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedKana(item)}
            className="bg-slate-900 border border-slate-800 hover:border-rose-500/50 p-4 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 group relative shadow-md"
          >
            <span className="text-3xl font-black text-white group-hover:text-rose-400 transition-colors">
              {item.character}
            </span>
            <span className="text-xs font-medium text-slate-400 mt-1">{item.romaji}</span>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <AudioButton text={item.character} size="sm" />
            </div>
          </div>
        ))}
      </div>

      {selectedKana && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6 relative">
            <button
              onClick={() => setSelectedKana(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold text-lg"
            >
              ✕
            </button>

            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-4xl font-black text-rose-400">
                {selectedKana.character}
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">{selectedKana.romaji}</h3>
                <span className="text-xs font-semibold text-slate-400">Strokes: {selectedKana.stroke_count}</span>
                <div className="mt-1">
                  <AudioButton text={selectedKana.character} size="sm" />
                </div>
              </div>
            </div>

            {selectedKana.mnemonic && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <h4 className="text-xs font-bold text-rose-400 uppercase mb-1">Mnemonic Helper</h4>
                <p className="text-xs text-slate-300 italic">{selectedKana.mnemonic}</p>
              </div>
            )}

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Writing Practice Pad</h4>
              <KanjiCanvas character={selectedKana.character} onSuccess={() => awardXP(15, 'katakana_writing')} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
