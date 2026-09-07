import React, { useState } from 'react';
import { Settings as SettingsIcon, Volume2, Moon, Shield, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Settings: React.FC = () => {
  const { progress, updateRomajiMode } = useAuth();
  const [dailyMins, setDailyMins] = useState(20);
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-1">
        <h1 className="text-3xl font-black text-white flex items-center gap-2">
          <SettingsIcon className="w-7 h-7 text-rose-400" />
          <span>User Settings & Preferences</span>
        </h1>
        <p className="text-slate-400 text-sm">Customize Romaji display levels, audio notifications, and daily study goals.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6 shadow-xl">
        
        {/* Romaji Mode Preference */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-white">Romaji Display Mode</h3>
          <p className="text-xs text-slate-400">Control how Romaji pronunciation is rendered across lessons and vocabulary.</p>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Full Romaji', value: 'full', desc: 'Japanese + Romaji + English' },
              { label: 'Intermediate', value: 'intermediate', desc: 'Kana + English' },
              { label: 'Japanese Only', value: 'off', desc: 'Kanji & Kana Only' }
            ].map((mode) => (
              <button
                key={mode.value}
                onClick={() => updateRomajiMode(mode.value as any)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  progress?.romaji_mode === mode.value
                    ? 'bg-rose-500/10 border-rose-500 text-rose-300 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-sm text-white mb-0.5">{mode.label}</div>
                <div className="text-[11px] text-slate-500">{mode.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Daily Goal Commitment */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h3 className="text-base font-bold text-white">Daily Study Goal Target</h3>
          
          <div className="flex gap-2">
            {[10, 20, 30, 45, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => setDailyMins(mins)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  dailyMins === mins
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-400'
                }`}
              >
                {mins} Mins
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
