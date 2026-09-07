import React, { useEffect, useState } from 'react';
import { Award, Lock, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { AchievementItem } from '../types';

export const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const res = await api.get('/gamification/achievements');
      setAchievements(res.data);
    } catch (err) {
      console.error('Failed to load achievements', err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-1">
        <h1 className="text-3xl font-black text-white flex items-center gap-2">
          <Award className="w-7 h-7 text-amber-400" />
          <span>Achievements Showcase</span>
        </h1>
        <p className="text-slate-400 text-sm">Unlock badges and earn XP rewards as you progress through lessons, streaks, and mock exams.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className={`p-6 rounded-3xl border transition-all ${
              ach.unlocked
                ? 'bg-slate-900 border-amber-500/40 shadow-xl shadow-amber-500/5'
                : 'bg-slate-950/60 border-slate-900 text-slate-600 opacity-60'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${
                ach.unlocked ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' : 'bg-slate-900 text-slate-700'
              }`}>
                {ach.icon}
              </div>

              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                ach.unlocked ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-slate-900 text-slate-600'
              }`}>
                +{ach.xp_reward} XP
              </span>
            </div>

            <h3 className={`text-lg font-black ${ach.unlocked ? 'text-white' : 'text-slate-500'}`}>{ach.title}</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{ach.description}</p>

            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-1.5 text-xs font-bold">
              {ach.unlocked ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Unlocked</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-slate-600" />
                  <span className="text-slate-600">Locked</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
