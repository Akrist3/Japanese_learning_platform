import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Flame, Zap, Trophy, Play, CheckSquare, Layers, AlertCircle, 
  ArrowRight, BookOpen, Sparkles, Target, Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const Dashboard: React.FC = () => {
  const { user, progress } = useAuth();
  const [masteryData, setMasteryData] = useState<any>(null);
  const [dueCardsCount, setDueCardsCount] = useState<number>(0);
  const [dailyQuests, setDailyQuests] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [masteryRes, cardsRes, questsRes] = await Promise.all([
          api.get('/jlpt/mastery'),
          api.get('/flashcards/due'),
          api.get('/gamification/daily-quests')
        ]);
        setMasteryData(masteryRes.data);
        setDueCardsCount(cardsRes.data.length);
        setDailyQuests(questsRes.data.quests || []);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-rose-500/10 blur-[90px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-3">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{progress?.streak_count || 0} Day Streak</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
              Good day, {user?.username || 'Learner'}! 🇯🇵
            </h1>

            <p className="text-slate-400 text-sm max-w-xl">
              Targeting <span className="text-rose-400 font-bold">{user?.target_jlpt || 'N3'}</span> — Daily Goal: {user?.daily_goal_minutes || 20} minutes. Keep your streak burning bright!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/flashcards"
              className="w-full sm:w-auto px-6 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Review SRS ({dueCardsCount})</span>
            </Link>

            <Link
              to="/roadmap"
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl border border-slate-700 flex items-center justify-center gap-2 transition-colors"
            >
              <MapIcon className="w-4 h-4" />
              <span>Continue Lesson</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Gamification Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="text-xs font-bold text-slate-500 uppercase mb-1">Current Level</div>
          <div className="text-2xl font-black text-white flex items-center gap-2">
            <span>Level {progress?.level || 1}</span>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="text-xs font-bold text-slate-500 uppercase mb-1">Total XP</div>
          <div className="text-2xl font-black text-indigo-400 flex items-center gap-1.5">
            <Zap className="w-5 h-5 fill-current" />
            <span>{progress?.xp || 0} XP</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="text-xs font-bold text-slate-500 uppercase mb-1">Overall Mastery</div>
          <div className="text-2xl font-black text-emerald-400">
            {masteryData?.overall_mastery || 0}%
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="text-xs font-bold text-slate-500 uppercase mb-1">Reviews Due</div>
          <div className="text-2xl font-black text-rose-400">
            {dueCardsCount} Cards
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Quests & Mastery Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Quests & Recommended Lessons */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Today's Daily Missions */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-rose-400" />
                <span>Today's Daily Missions</span>
              </h2>
              <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full">
                +100 XP Bonus
              </span>
            </div>

            <div className="space-y-3">
              {dailyQuests.map((quest) => (
                <div 
                  key={quest.id} 
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                    quest.completed 
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-400' 
                      : 'bg-slate-950 border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                      quest.completed ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {quest.completed ? '✓' : '□'}
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${quest.completed ? 'line-through' : ''}`}>
                        {quest.title}
                      </div>
                      <div className="text-[11px] text-slate-500">Progress: {quest.current}/{quest.target}</div>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold text-amber-400">+{quest.reward_xp} XP</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Next Lesson */}
          {masteryData?.recommended_lessons && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span>Adaptive Recommendation</span>
              </h2>

              <div className="space-y-3">
                {masteryData.recommended_lessons.map((lesson: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 to-indigo-950/40 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Remedial Focus</span>
                      <h4 className="text-base font-bold text-white">{lesson.title}</h4>
                      <p className="text-xs text-slate-400">Topic: {lesson.topic}</p>
                    </div>

                    <Link
                      to={lesson.url}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition-colors"
                    >
                      <span>Start</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Mastery Breakdown per Topic */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <span>Topic Mastery</span>
            </h2>

            {masteryData?.topic_mastery ? (
              <div className="space-y-4">
                {Object.entries(masteryData.topic_mastery).map(([topic, pct]: [string, any]) => (
                  <div key={topic} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>{topic}</span>
                      <span className="text-emerald-400">{pct}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">Loading topic progress...</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

function MapIcon(props: any) {
  return <BookOpen {...props} />;
}
