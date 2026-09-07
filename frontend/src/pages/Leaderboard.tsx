import React, { useEffect, useState } from 'react';
import { Trophy, Flame, Zap } from 'lucide-react';
import api from '../services/api';

export const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get('/user/leaderboard');
      setLeaderboard(res.data);
    } catch (err) {
      console.error('Failed to load leaderboard', err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-1">
        <h1 className="text-3xl font-black text-white flex items-center gap-2">
          <Trophy className="w-7 h-7 text-amber-400" />
          <span>Global Leaderboard</span>
        </h1>
        <p className="text-slate-400 text-sm">Compete with learners worldwide. Earn XP by studying daily and completing reviews.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="divide-y divide-slate-800">
          {leaderboard.map((user) => (
            <div key={user.rank} className="p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                  user.rank === 1 ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20' :
                  user.rank === 2 ? 'bg-slate-300 text-slate-950' :
                  user.rank === 3 ? 'bg-amber-700 text-white' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {user.rank}
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-rose-400">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{user.username}</h4>
                    <span className="text-[11px] text-slate-400">Level {user.level}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                  <Flame className="w-4 h-4 fill-amber-400" />
                  <span>{user.streak}d</span>
                </div>

                <div className="flex items-center gap-1 text-sm font-black text-indigo-400">
                  <Zap className="w-4 h-4 fill-current" />
                  <span>{user.xp} XP</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
