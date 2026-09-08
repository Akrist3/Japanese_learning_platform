import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  Lock,
  Play,
  Star,
  Target,
  BookOpen,
  Headphones,
  MessageCircle,
  Trophy,
  ChevronRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import api from '../services/api';

interface Mission {
  id: string;
  number: number;
  level: string;
  title: string;
  purpose: string;
  skills: string[];
  path: string;
  xp: number;
  type: string;
  status: 'completed' | 'active' | 'unlocked' | 'locked';
  priority?: 'high' | 'normal';
  focus_skills?: string[];
}

interface RoadmapData {
  current_level: string;
  target_level: string;
  weak_skills: string[];
  total_missions: number;
  missions: Mission[];
}

export const Roadmap: React.FC = () => {
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get<RoadmapData>('/roadmap');

      setRoadmap(response.data);
    } catch (err: any) {
      console.error('Failed to load roadmap:', err);

      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else {
        setError(
          err.response?.data?.detail ||
          'Unable to load your roadmap.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const getSkillIcon = (skill: string) => {
    switch (skill) {
      case 'Reading':
        return <BookOpen className="w-3.5 h-3.5" />;

      case 'Listening':
        return <Headphones className="w-3.5 h-3.5" />;

      case 'Speaking':
        return <MessageCircle className="w-3.5 h-3.5" />;

      case 'Grammar':
        return <Target className="w-3.5 h-3.5" />;

      default:
        return <Star className="w-3.5 h-3.5" />;
    }
  };

  const getLevelColor = (level: string) => {
    if (level.includes('N5')) return 'text-emerald-400';
    if (level.includes('N4')) return 'text-cyan-400';
    if (level.includes('N3')) return 'text-blue-400';
    if (level.includes('N2')) return 'text-purple-400';
    return 'text-rose-400';
  };

  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-rose-400" />

          <p className="text-sm font-semibold">
            Building your Japanese journey...
          </p>
        </div>
      </div>
    );
  }

  // =======================================================
  // ERROR
  // =======================================================

  if (error || !roadmap) {
    return (
      <div className="min-h-screen p-6 max-w-3xl mx-auto flex items-center justify-center">
        <div className="w-full bg-slate-900 border border-red-500/20 rounded-3xl p-8 text-center">

          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />

          <h2 className="text-xl font-black text-white mb-2">
            Couldn't Load Your Roadmap
          </h2>

          <p className="text-sm text-slate-400 mb-6">
            {error || 'Something went wrong.'}
          </p>

          <button
            onClick={fetchRoadmap}
            className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold"
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }

  // =======================================================
  // CALCULATE PROGRESS
  // =======================================================

  const completedMissions = roadmap.missions.filter(
    (mission) => mission.status === 'completed'
  ).length;

  const progressPercentage =
    roadmap.total_missions > 0
      ? Math.round(
          (completedMissions / roadmap.total_missions) * 100
        )
      : 0;

  const activeMission = roadmap.missions.find(
    (mission) => mission.status === 'active'
  );

  // =======================================================
  // UI
  // =======================================================

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="text-center mb-8">

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold mb-4">

          <Target className="w-4 h-4" />

          YOUR JAPANESE JOURNEY

        </div>

        <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
          From {roadmap.current_level} to {roadmap.target_level}
        </h1>

        <p className="text-slate-400 max-w-2xl mx-auto text-sm">
          Your learning path adapts as your Japanese improves.
        </p>

      </div>


      {/* ===================================================
          LEVEL + PROGRESS
      =================================================== */}

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-8">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div>

            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Current Level
            </p>

            <h2 className="text-2xl font-black text-white mt-1">
              {roadmap.current_level}
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Target: {roadmap.target_level}
            </p>

          </div>

          <div className="text-left md:text-right">

            <p className="text-2xl font-black text-white">
              {progressPercentage}%
            </p>

            <p className="text-xs text-slate-500">
              {completedMissions} / {roadmap.total_missions} missions
            </p>

          </div>

        </div>

        <div className="mt-5 h-2 bg-slate-800 rounded-full overflow-hidden">

          <div
            className="h-full bg-rose-500 rounded-full transition-all duration-700"
            style={{
              width: `${progressPercentage}%`,
            }}
          />

        </div>

      </div>


      {/* ===================================================
          WEAK SKILLS
      =================================================== */}

      {roadmap.weak_skills.length > 0 && (
        <div className="bg-amber-950/20 border border-amber-500/20 rounded-3xl p-5 mb-8">

          <div className="flex items-start gap-3">

            <Target className="w-5 h-5 text-amber-400 mt-0.5" />

            <div>

              <h3 className="text-sm font-black text-white">
                Your Focus Areas
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                We'll give these skills extra attention.
              </p>

              <div className="flex flex-wrap gap-2 mt-3">

                {roadmap.weak_skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-300"
                  >
                    {skill}
                  </span>
                ))}

              </div>

            </div>

          </div>

        </div>
      )}


      {/* ===================================================
          CURRENT MISSION
      =================================================== */}

      {activeMission && (
        <div className="mb-10">

          <div className="flex items-center gap-2 mb-3">

            <Play className="w-4 h-4 text-rose-400" />

            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              Continue Your Journey
            </h2>

          </div>

          <div className="bg-gradient-to-r from-rose-950/40 to-slate-900 border border-rose-500/30 rounded-3xl p-6 shadow-xl shadow-rose-500/5">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

              <div>

                <div className="flex items-center gap-2 mb-2">

                  <span className="text-xs font-bold text-rose-400">
                    MISSION {activeMission.number}
                  </span>

                  <span className="text-xs text-slate-600">
                    •
                  </span>

                  <span className="text-xs text-slate-500">
                    +{activeMission.xp} XP
                  </span>

                </div>

                <h3 className="text-2xl font-black text-white">
                  {activeMission.title}
                </h3>

                <p className="text-sm text-slate-400 mt-2 max-w-xl">
                  {activeMission.purpose}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">

                  {activeMission.skills.map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-300"
                    >
                      {getSkillIcon(skill)}
                      {skill}
                    </span>
                  ))}

                </div>

              </div>

              <Link
                to={activeMission.path}
                className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm transition-all shadow-lg shadow-rose-500/20"
              >
                Continue

                <ChevronRight className="w-4 h-4" />

              </Link>

            </div>

          </div>

        </div>
      )}


      {/* ===================================================
          ROADMAP
      =================================================== */}

      <div>

        <div className="flex items-center gap-2 mb-6">

          <Trophy className="w-5 h-5 text-yellow-400" />

          <h2 className="text-lg font-black text-white">
            Your Roadmap
          </h2>

          <span className="text-xs text-slate-500">
            {roadmap.current_level} → {roadmap.target_level}
          </span>

        </div>


        <div className="relative border-l-2 border-slate-800 ml-5 pl-8 space-y-6">

          {roadmap.missions.map((mission) => {

            const isCompleted =
              mission.status === 'completed';

            const isActive =
              mission.status === 'active';

            const isUnlocked =
              mission.status === 'unlocked' ||
              isCompleted ||
              isActive;

            const isHighPriority =
              mission.priority === 'high';

            return (

              <div
                key={mission.id}
                className="relative group"
              >

                {/* TIMELINE NODE */}

                <div
                  className={`absolute -left-[45px] top-5 w-9 h-9 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-transform group-hover:scale-110 ${
                    isCompleted
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                      : isActive
                      ? 'bg-rose-500 border-rose-400 text-white animate-pulse'
                      : isUnlocked
                      ? 'bg-slate-800 border-slate-700 text-slate-300'
                      : 'bg-slate-950 border-slate-800 text-slate-600'
                  }`}
                >

                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : isActive ? (
                    <Play className="w-4 h-4 fill-current" />
                  ) : isUnlocked ? (
                    mission.number
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}

                </div>


                {/* MISSION CARD */}

                <div
                  className={`p-6 rounded-3xl border transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-slate-900 to-rose-950/30 border-rose-500/40 shadow-xl shadow-rose-500/5'
                      : isCompleted
                      ? 'bg-slate-900 border-slate-800'
                      : isUnlocked
                      ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-950/50 border-slate-900 opacity-60'
                  }`}
                >

                  {/* LEVEL + XP */}

                  <div className="flex items-center justify-between mb-2">

                    <span
                      className={`text-[10px] font-black tracking-widest ${getLevelColor(
                        mission.level
                      )}`}
                    >
                      {mission.level}
                    </span>

                    <span className="flex items-center gap-1 text-xs text-yellow-400 font-bold">

                      <Star className="w-3 h-3 fill-current" />

                      {mission.xp} XP

                    </span>

                  </div>


                  {/* TITLE + ACTION */}

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                    <div>

                      <div className="flex flex-wrap items-center gap-2">

                        <h3
                          className={`text-lg font-extrabold ${
                            isUnlocked
                              ? 'text-white'
                              : 'text-slate-500'
                          }`}
                        >
                          {mission.title}
                        </h3>

                        {isHighPriority && (
                          <span className="px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-[9px] font-black text-amber-400">
                            FOCUS AREA
                          </span>
                        )}

                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed mt-2 max-w-2xl">
                        {mission.purpose}
                      </p>

                    </div>


                    {/* ACTION */}

                    {isUnlocked ? (

                      <Link
                        to={mission.path}
                        className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                          isActive
                            ? 'bg-rose-500 hover:bg-rose-600 text-white'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                      >

                        {isCompleted ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            Review
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            Start
                          </>
                        )}

                      </Link>

                    ) : (

                      <div className="shrink-0 flex items-center gap-1.5 text-xs text-slate-600 font-bold bg-slate-950 px-3 py-2 rounded-xl border border-slate-900">

                        <Lock className="w-3.5 h-3.5" />

                        Locked

                      </div>

                    )}

                  </div>


                  {/* SKILLS */}

                  <div className="flex flex-wrap gap-2 mt-4">

                    {mission.skills.map((skill) => (

                      <span
                        key={skill}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          isUnlocked
                            ? 'bg-slate-950 text-slate-400 border border-slate-800'
                            : 'bg-slate-950/50 text-slate-600 border border-slate-900'
                        }`}
                      >

                        {getSkillIcon(skill)}

                        {skill}

                      </span>

                    ))}

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>


      {/* ===================================================
          FOOTER
      =================================================== */}

      <div className="text-center pt-8 pb-4">

        <p className="text-xs text-slate-600">
          Your roadmap will continuously adapt as your Japanese improves.
        </p>

      </div>

    </div>
  );
};