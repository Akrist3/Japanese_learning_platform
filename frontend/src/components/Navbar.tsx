import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flame, Zap, Award, User as UserIcon, LogOut, Settings, Shield, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, progress, logout, updateRomajiMode } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-xl font-bold shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
            🇯🇵
          </div>
          <div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-rose-400 via-pink-300 to-amber-200 bg-clip-text text-transparent">
              Japanese Journey
            </span>
            <span className="block text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Zero to JLPT N1</span>
          </div>
        </Link>

        {/* Center Gamification & Romaji Controls */}
        {user && progress && (
          <div className="hidden md:flex items-center gap-6 bg-slate-950/60 border border-slate-800 rounded-full px-5 py-1.5">
            
            {/* Level & XP */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-indigo-100 flex items-center justify-center text-xs font-black">
                {progress.level}
              </div>
              <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-rose-500 h-full transition-all duration-500" 
                  style={{ width: `${progress.xp % 100}%` }}
                />
              </div>
              <span className="text-xs font-bold text-slate-300">{progress.xp} XP</span>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
              <Flame className="w-4 h-4 fill-amber-400 animate-pulse" />
              <span>{progress.streak_count} Days</span>
            </div>

            {/* Romaji Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-medium">
              <button
                onClick={() => updateRomajiMode('full')}
                className={`px-2 py-0.5 rounded ${progress.romaji_mode === 'full' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                title="Japanese + Romaji + English"
              >
                Romaji ON
              </button>
              <button
                onClick={() => updateRomajiMode('off')}
                className={`px-2 py-0.5 rounded ${progress.romaji_mode === 'off' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                title="Japanese Only"
              >
                OFF
              </button>
            </div>
          </div>
        )}

        {/* Right Action Menu */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {user.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/20 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
              )}

              <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-rose-400">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-sm font-semibold text-slate-200">{user.username}</span>
              </Link>

              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-slate-800 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="px-4 py-2 text-sm font-bold bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-lg shadow-rose-500/20 transition-all hover:scale-105">
                Start Learning Free
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};
