import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Map, BookOpen, Layers, Type, Sparkles, 
  RotateCw, Volume2, Mic, FileText, Award, Trophy, 
  Search, Bot, AlertTriangle, Library, Settings, ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Learning Roadmap', path: '/roadmap', icon: Map },
    { label: 'Hiragana Course', path: '/hiragana', icon: Type },
    { label: 'Katakana Course', path: '/katakana', icon: Type },
    { label: 'Vocabulary (N5-N1)', path: '/vocabulary', icon: BookOpen },
    { label: 'Kanji Studio', path: '/kanji', icon: Layers },
    { label: 'Grammar Engine', path: '/grammar', icon: Sparkles },
    { label: 'Verb Conjugator', path: '/verbs', icon: RotateCw },
    { label: 'Flashcard SRS', path: '/flashcards', icon: Layers },
    { label: 'Listening Practice', path: '/listening', icon: Volume2 },
    { label: 'Reading Passages', path: '/reading', icon: FileText },
    { label: 'Speaking Practice', path: '/speaking', icon: Mic },
    { label: 'JLPT Prep & Exams', path: '/jlpt', icon: Trophy },
    { label: 'Your Mistakes Log', path: '/mistakes', icon: AlertTriangle },
    { label: 'Dictionary Search', path: '/dictionary', icon: Search },
    { label: 'AI Grammar Tutor', path: '/ai-tutor', icon: Bot },
    { label: 'Resource Library', path: '/resources', icon: Library },
    { label: 'Achievements', path: '/achievements', icon: Award },
    { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  if (user?.role === 'admin') {
    navItems.push({ label: 'Admin Management', path: '/admin', icon: ShieldAlert });
  }

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 shrink-0 hidden md:block min-h-[calc(100vh-65px)] p-3">
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};
