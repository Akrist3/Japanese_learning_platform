import React, { useEffect, useState } from 'react';
import { Sparkles, BookOpen, AlertTriangle } from 'lucide-react';
import api from '../services/api';
import { GrammarItem } from '../types';

export const Grammar: React.FC = () => {
  const [grammarList, setGrammarList] = useState<GrammarItem[]>([]);
  const [levelFilter, setLevelFilter] = useState('N5');

  useEffect(() => {
    fetchGrammar();
  }, [levelFilter]);

  const fetchGrammar = async () => {
    try {
      const res = await api.get(`/grammar/list?jlpt_level=${levelFilter}`);
      setGrammarList(res.data);
    } catch (err) {
      console.error('Failed to load grammar', err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-rose-400" />
            <span>Grammar Engine</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Detailed breakdowns of JLPT sentence formations, particles, and usage notes.</p>
        </div>

        <div className="flex gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 max-w-xs">
          {['N5', 'N4', 'N3', 'N2', 'N1'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                levelFilter === lvl ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {grammarList.map((item) => {
          let examples: any[] = [];
          try {
            if (item.example_sentences_json) {
              examples = JSON.parse(item.example_sentences_json);
            }
          } catch (e) {}

          return (
            <div key={item.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xl font-black text-white">{item.point}</h3>
                <span className="text-xs font-extrabold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3 py-1 rounded-full">
                  {item.jlpt_level}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-500 uppercase">Meaning</span>
                <p className="text-base font-extrabold text-white">{item.meaning}</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block mb-1">Formation Structure</span>
                <code className="text-sm font-mono text-slate-200 font-bold">{item.formation}</code>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{item.explanation}</p>

              {examples.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Example Sentences</span>
                  <div className="space-y-2">
                    {examples.map((ex: any, idx: number) => (
                      <div key={idx} className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 text-xs">
                        <p className="font-bold text-slate-100">{ex.japanese}</p>
                        <p className="text-slate-400 italic">{ex.english}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {item.common_mistakes && (
                <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-3 rounded-2xl text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Common Mistake Note: </span>
                    <span>{item.common_mistakes}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
