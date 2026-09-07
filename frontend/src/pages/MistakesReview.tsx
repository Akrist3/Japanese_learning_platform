import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, RotateCw } from 'lucide-react';
import api from '../services/api';
import { UserMistake } from '../types';

export const MistakesReview: React.FC = () => {
  const [mistakes, setMistakes] = useState<UserMistake[]>([]);

  useEffect(() => {
    fetchMistakes();
  }, []);

  const fetchMistakes = async () => {
    try {
      const res = await api.get('/mistakes/my');
      setMistakes(res.data);
    } catch (err) {
      console.error('Failed to load mistakes', err);
    }
  };

  const markReviewed = async (id: number) => {
    try {
      await api.post(`/mistakes/review/${id}`);
      setMistakes(prev => prev.map(m => m.id === id ? { ...m, reviewed: true } : m));
    } catch (err) {
      console.error('Failed to mark mistake reviewed', err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-1">
        <h1 className="text-3xl font-black text-white flex items-center gap-2">
          <AlertTriangle className="w-7 h-7 text-amber-400" />
          <span>Your Mistakes Log</span>
        </h1>
        <p className="text-slate-400 text-sm">Every incorrect answer is logged here for targeted review and mastery re-testing.</p>
      </div>

      <div className="space-y-4">
        {mistakes.map((m) => (
          <div 
            key={m.id} 
            className={`p-6 rounded-3xl border transition-all ${
              m.reviewed 
                ? 'bg-slate-950 border-slate-900 text-slate-500 opacity-60' 
                : 'bg-slate-900 border-slate-800 shadow-lg'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-md">
                Topic: {m.topic}
              </span>
              
              {!m.reviewed && (
                <button
                  onClick={() => markReviewed(m.id)}
                  className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/20 transition-colors"
                >
                  Mark Mastered
                </button>
              )}
            </div>

            <h4 className="text-base font-bold text-white mb-2">{m.question_text}</h4>

            <div className="grid grid-cols-2 gap-3 text-xs mb-3">
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-2xl">
                <span className="block font-bold text-[10px] uppercase text-rose-400 mb-0.5">Your Answer</span>
                <span>{m.user_answer}</span>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3 rounded-2xl">
                <span className="block font-bold text-[10px] uppercase text-emerald-400 mb-0.5">Correct Answer</span>
                <span>{m.correct_answer}</span>
              </div>
            </div>

            {m.explanation && (
              <p className="text-xs text-slate-400 italic bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                Explanation: {m.explanation}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
