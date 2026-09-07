import React from 'react';
import { Zap, Trophy } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';

export const XPNotification: React.FC = () => {
  const { xpGainNotification, levelUpModal, closeLevelUpModal } = useGamification();

  return (
    <>
      {/* Floating XP Gain Badge */}
      {xpGainNotification !== null && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-extrabold px-5 py-3 rounded-2xl shadow-2xl shadow-amber-500/30 animate-bounce">
          <Zap className="w-5 h-5 fill-current" />
          <span>+{xpGainNotification} XP Gained!</span>
        </div>
      )}

      {/* Level Up Modal */}
      {levelUpModal !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-rose-500 to-amber-400" />
            
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-rose-500 mx-auto flex items-center justify-center text-4xl shadow-xl shadow-amber-500/20 mb-4 animate-pulse">
              🏆
            </div>

            <h3 className="text-2xl font-black text-white mb-1">LEVEL UP!</h3>
            <p className="text-slate-400 text-sm font-medium mb-4">
              Congratulations! You have reached <span className="text-amber-400 font-bold">Level {levelUpModal}</span>.
            </p>

            <button
              onClick={closeLevelUpModal}
              className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/30 transition-all hover:scale-105"
            >
              Continue Learning
            </button>
          </div>
        </div>
      )}
    </>
  );
};
