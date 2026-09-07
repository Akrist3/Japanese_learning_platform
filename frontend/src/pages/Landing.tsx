import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Trophy, BookOpen, Layers, Flame, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-24 border-b border-slate-800/80">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-widest mb-6 animate-pulse">
            <Sparkles className="w-4 h-4" />
            Zero to JLPT N1 Mastery Engine
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Master Japanese. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-rose-400 via-pink-300 to-amber-300 bg-clip-text text-transparent">
              One Level at a Time.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            Learn Japanese from Hiragana to JLPT N1 through structured gamified lessons, smart SM-2 spaced repetition reviews, real verb conjugators, authentic audio, and full mock exams.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold rounded-2xl shadow-xl shadow-rose-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <span>Start Learning Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/roadmap"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all"
            >
              <span>Explore JLPT Roadmap</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="py-20 max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Complete Curriculum</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Hiragana, Katakana, N5 to N1 Vocabulary, Kanji radicals with stroke drawing pads, Grammar explanations, Particles, and Verb trainers.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">SM-2 Spaced Repetition</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Intelligent Anki-style SuperMemo SM-2 flashcard engine automatically schedules reviews to lock vocabulary into long-term memory.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
            <Trophy className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">JLPT Mock Exams</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Real timed N5-N1 practice exams with section-by-section scoring, diagnostic weak topic detection, and automated lesson recommendations.
          </p>
        </div>
      </div>
    </div>
  );
};
