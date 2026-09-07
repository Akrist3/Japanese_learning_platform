import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Clock, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [currentLevel, setCurrentLevel] = useState('Beginner');
  const [targetLevel, setTargetLevel] = useState('N3');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(20);
  const [preferredStyle, setPreferredStyle] = useState('Visual & Gamified');
  const [loading, setLoading] = useState(false);
  const { refreshUserData } = useAuth();
  const navigate = useNavigate();

  const handleComplete = async () => {
    setLoading(true);
    try {
      await api.post('/onboarding/submit', {
        current_jlpt: currentLevel,
        target_jlpt: targetLevel,
        target_exam_date: '2026-12-06',
        daily_goal_minutes: dailyGoalMinutes,
        preferred_style: preferredStyle
      });
      await refreshUserData();
      navigate('/dashboard');
    } catch (err) {
      console.error('Onboarding failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-xl w-full shadow-2xl relative overflow-hidden">
        
        {/* Progress Bar Header */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Step {step} of 3</span>
          <div className="flex gap-1.5">
            <div className={`w-8 h-1.5 rounded-full ${step >= 1 ? 'bg-rose-500' : 'bg-slate-800'}`} />
            <div className={`w-8 h-1.5 rounded-full ${step >= 2 ? 'bg-rose-500' : 'bg-slate-800'}`} />
            <div className={`w-8 h-1.5 rounded-full ${step >= 3 ? 'bg-rose-500' : 'bg-slate-800'}`} />
          </div>
        </div>

        {/* Step 1: Level Assessment */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-black text-white mb-2">What is your current Japanese level?</h2>
            <p className="text-slate-400 text-sm mb-6">We will adapt lessons to match your current experience.</p>
            
            <div className="space-y-3 mb-8">
              {['Complete Beginner', 'Beginner (Knows Kana)', 'JLPT N5', 'JLPT N4', 'JLPT N3', 'JLPT N2'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setCurrentLevel(lvl)}
                  className={`w-full p-4 rounded-2xl border text-left font-bold text-sm transition-all flex items-center justify-between ${
                    currentLevel === lvl
                      ? 'bg-rose-500/10 border-rose-500 text-rose-300 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{lvl}</span>
                  {currentLevel === lvl && <CheckCircle className="w-5 h-5 text-rose-400" />}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Target Goal */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-black text-white mb-2">What is your target JLPT goal?</h2>
            <p className="text-slate-400 text-sm mb-6">Select your dream JLPT level target.</p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {['N5', 'N4', 'N3', 'N2', 'N1'].map((target) => (
                <button
                  key={target}
                  onClick={() => setTargetLevel(target)}
                  className={`p-5 rounded-2xl border text-center font-extrabold text-lg transition-all ${
                    targetLevel === target
                      ? 'bg-gradient-to-br from-rose-500/20 to-pink-500/20 border-rose-500 text-rose-300 shadow-lg'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-semibold text-slate-500 mb-1">JLPT</div>
                  <div>{target}</div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Daily Commitment */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-black text-white mb-2">Daily Study Commitment</h2>
            <p className="text-slate-400 text-sm mb-6">How many minutes can you study each day?</p>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {[10, 20, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setDailyGoalMinutes(mins)}
                  className={`p-4 rounded-2xl border text-center font-bold text-sm transition-all ${
                    dailyGoalMinutes === mins
                      ? 'bg-rose-500/10 border-rose-500 text-rose-300 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="text-lg font-black">{mins}</div>
                  <div className="text-[11px] text-slate-500">mins / day</div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleComplete}
                disabled={loading}
                className="w-2/3 py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold rounded-2xl shadow-xl shadow-rose-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
              >
                <span>Generate My Path</span>
                <CheckCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
