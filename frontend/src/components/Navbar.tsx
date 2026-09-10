import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Flame,
  Zap,
  LogOut,
  Shield,
  ChevronDown,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, progress, logout, updateRomajiMode } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#070b18]/90 backdrop-blur-xl">

      <div className="h-[72px] px-4 lg:px-7 flex items-center justify-between">

        {/* Brand */}
        <Link
          to={user ? '/dashboard' : '/'}
          className="flex items-center gap-3 group"
        >
          <div
            className="
              w-11 h-11 rounded-2xl
              bg-gradient-to-br from-rose-400 to-orange-400
              flex items-center justify-center
              shadow-lg shadow-rose-500/20
              group-hover:scale-105
              transition-transform
            "
          >
            <span className="text-xl">🌸</span>
          </div>

          <div className="hidden sm:block">
            <div className="text-[17px] font-black tracking-tight text-white">
              Japanese Journey
            </div>

            <div className="text-[9px] uppercase tracking-[0.22em] text-slate-500 font-bold">
              Zero → JLPT N1
            </div>
          </div>
        </Link>

        {user && progress && (
          <div className="hidden lg:flex items-center gap-3">

            {/* Level */}
            <div className="jp-glass rounded-2xl px-4 py-2 flex items-center gap-3">

              <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-400/20 flex items-center justify-center">
                <span className="text-xs font-black text-indigo-300">
                  {progress.level}
                </span>
              </div>

              <div className="w-28">
                <div className="jp-progress">
                  <div
                    className="jp-progress-bar"
                    style={{
                      width: `${progress.xp % 100}%`,
                    }}
                  />
                </div>

                <div className="text-[9px] text-slate-500 mt-1">
                  NEXT LEVEL
                </div>
              </div>

              <span className="text-xs font-black text-slate-200">
                {progress.xp} XP
              </span>
            </div>

            {/* Streak */}
            <div className="jp-glass rounded-2xl px-4 py-2 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />

              <div>
                <div className="text-sm font-black text-white leading-none">
                  {progress.streak_count}
                </div>

                <div className="text-[9px] text-slate-500 uppercase">
                  day streak
                </div>
              </div>
            </div>

            {/* Romaji */}
            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">

              <button
                onClick={() => updateRomajiMode('full')}
                className={`
                  px-3 py-1.5 rounded-lg text-[11px] font-bold transition
                  ${
                    progress.romaji_mode === 'full'
                      ? 'bg-rose-500 text-white'
                      : 'text-slate-500 hover:text-slate-200'
                  }
                `}
              >
                Romaji
              </button>

              <button
                onClick={() => updateRomajiMode('off')}
                className={`
                  px-3 py-1.5 rounded-lg text-[11px] font-bold transition
                  ${
                    progress.romaji_mode === 'off'
                      ? 'bg-rose-500 text-white'
                      : 'text-slate-500 hover:text-slate-200'
                  }
                `}
              >
                JP
              </button>

            </div>
          </div>
        )}

        {/* User */}
        {user && (
          <div className="flex items-center gap-3">

            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="
                  hidden md:flex items-center gap-2
                  px-3 py-2 rounded-xl
                  bg-amber-400/10
                  border border-amber-400/20
                  text-amber-300
                  text-xs font-bold
                "
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}

            <Link
              to="/profile"
              className="
                flex items-center gap-3
                px-2 py-1.5
                rounded-xl
                hover:bg-white/[0.04]
                transition
              "
            >
              <div className="
                w-9 h-9 rounded-full
                bg-gradient-to-br from-rose-400 to-purple-500
                flex items-center justify-center
                text-sm font-black
                text-white
              ">
                {user.username.charAt(0).toUpperCase()}
              </div>

              <div className="hidden md:block">
                <div className="text-xs font-bold text-white">
                  {user.username}
                </div>

                <div className="text-[9px] text-slate-500">
                  Learner
                </div>
              </div>

              <ChevronDown className="hidden md:block w-3.5 h-3.5 text-slate-600" />
            </Link>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="
                p-2.5 rounded-xl
                text-slate-500
                hover:text-rose-400
                hover:bg-rose-500/10
                transition
              "
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>
        )}

        {!user && (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-bold text-slate-300 hover:text-white"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="jp-primary-btn"
            >
              Start Learning
            </Link>
          </div>
        )}

      </div>
    </header>
  );
};