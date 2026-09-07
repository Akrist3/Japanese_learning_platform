import React from 'react';
import { User, Flame, Zap, Trophy, Calendar, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Profile: React.FC = () => {
  const { user, progress } = useAuth();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      
      {/* Profile Card */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-rose-500/20">
            {user?.username.charAt(0).toUpperCase()}
          </div>

          <div className="text-center sm:text-left space-y-1">
            <h1 className="text-3xl font-black text-white">{user?.username}</h1>
            <p className="text-xs text-slate-400 font-semibold">{user?.email}</p>
            <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
              <span className="text-xs font-bold bg-rose-500/10 border border-rose-500/30 text-rose-400 px-3 py-1 rounded-full">
                Target: JLPT {user?.target_jlpt}
              </span>
              <span className="text-xs font-bold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-3 py-1 rounded-full">
                Role: {user?.role.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800 text-center">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Level</span>
            <span className="text-2xl font-black text-white">Level {progress?.level || 1}</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Total XP</span>
            <span className="text-2xl font-black text-indigo-400">{progress?.xp || 0} XP</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Streak</span>
            <span className="text-2xl font-black text-amber-400">{progress?.streak_count || 0} Days</span>
          </div>
        </div>
      </div>

    </div>
  );
};
