import React from 'react';
import { NavLink } from 'react-router-dom';

import {
  LayoutDashboard,
  Map,
  Type,
  BookOpen,
  Layers,
  Sparkles,
  RotateCw,
  Volume2,
  Mic,
  FileText,
  Trophy,
  Search,
  Bot,
  AlertTriangle,
  Library,
  Settings,
  Award,
  ChevronRight,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

type Item = {
  label: string;
  path: string;
  icon: React.ElementType;
};

const Section = ({
  title,
  items,
}: {
  title: string;
  items: Item[];
}) => (
  <div className="mb-6">

    <div className="
      px-3 mb-2
      text-[9px]
      uppercase
      tracking-[0.18em]
      font-black
      text-slate-600
    ">
      {title}
    </div>

    <div className="space-y-1">

      {items.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              group relative
              flex items-center gap-3
              px-3 py-2.5
              rounded-xl
              text-[12px]
              font-bold
              transition-all duration-200

              ${
                isActive
                  ? `
                    bg-gradient-to-r
                    from-rose-500/15
                    to-transparent
                    text-rose-300
                  `
                  : `
                    text-slate-500
                    hover:text-slate-200
                    hover:bg-white/[0.035]
                  `
              }
            `}
          >

            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="
                    absolute left-0
                    top-2 bottom-2
                    w-[3px]
                    rounded-full
                    bg-rose-400
                  " />
                )}

                <Icon
                  className={`
                    w-[16px] h-[16px]
                    shrink-0
                    ${
                      isActive
                        ? 'text-rose-400'
                        : 'text-slate-600 group-hover:text-slate-300'
                    }
                  `}
                />

                <span className="flex-1">
                  {item.label}
                </span>

                {isActive && (
                  <ChevronRight className="w-3 h-3 text-rose-400" />
                )}
              </>
            )}
          </NavLink>
        );
      })}

    </div>
  </div>
);

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const foundation: Item[] = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Learning Roadmap',
      path: '/roadmap',
      icon: Map,
    },
  ];

  const core: Item[] = [
    {
      label: 'Hiragana',
      path: '/hiragana',
      icon: Type,
    },
    {
      label: 'Katakana',
      path: '/katakana',
      icon: Type,
    },
    {
      label: 'Vocabulary',
      path: '/vocabulary',
      icon: BookOpen,
    },
    {
      label: 'Kanji Studio',
      path: '/kanji',
      icon: Layers,
    },
    {
      label: 'Grammar',
      path: '/grammar',
      icon: Sparkles,
    },
    {
      label: 'Verb Conjugator',
      path: '/verbs',
      icon: RotateCw,
    },
  ];

  const practice: Item[] = [
    {
      label: 'Flashcard SRS',
      path: '/flashcards',
      icon: Layers,
    },
    {
      label: 'Listening',
      path: '/listening',
      icon: Volume2,
    },
    {
      label: 'Reading',
      path: '/reading',
      icon: FileText,
    },
    {
      label: 'Speaking',
      path: '/speaking',
      icon: Mic,
    },
  ];

  const tools: Item[] = [
    {
      label: 'JLPT Prep',
      path: '/jlpt',
      icon: Trophy,
    },
    {
      label: 'Mistakes',
      path: '/mistakes',
      icon: AlertTriangle,
    },
    {
      label: 'Dictionary',
      path: '/dictionary',
      icon: Search,
    },
    {
      label: 'AI Tutor',
      path: '/ai-tutor',
      icon: Bot,
    },
    {
      label: 'Resources',
      path: '/resources',
      icon: Library,
    },
  ];

  const progress: Item[] = [
    {
      label: 'Achievements',
      path: '/achievements',
      icon: Award,
    },
    {
      label: 'Leaderboard',
      path: '/leaderboard',
      icon: Trophy,
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="
      hidden md:flex
      flex-col
      w-[250px]
      shrink-0
      min-h-[calc(100vh-72px)]
      border-r border-white/[0.06]
      bg-[#070b18]
    ">

      <div className="p-4 overflow-y-auto">

        <Section
          title="Journey"
          items={foundation}
        />

        <Section
          title="Build Your Japanese"
          items={core}
        />

        <Section
          title="Practice"
          items={practice}
        />

        <Section
          title="Tools"
          items={tools}
        />

        <Section
          title="Progress"
          items={progress}
        />

        {user?.role === 'admin' && (
          <div className="mt-4 pt-4 border-t border-white/[0.06]">

            <NavLink
              to="/admin"
              className={({ isActive }) => `
                flex items-center gap-3
                px-3 py-2.5
                rounded-xl
                text-xs font-bold
                ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-300'
                    : 'text-slate-500 hover:text-amber-300 hover:bg-white/[0.03]'
                }
              `}
            >
              <Settings className="w-4 h-4" />
              Admin Management
            </NavLink>

          </div>
        )}

      </div>

      {/* Bottom journey reminder */}
      <div className="mt-auto p-4">

        <div className="
          relative overflow-hidden
          rounded-2xl
          p-4
          bg-gradient-to-br
          from-rose-500/10
          via-purple-500/5
          to-transparent
          border border-rose-400/10
        ">

          <div className="text-lg mb-2">
            🌸
          </div>

          <div className="text-xs font-black text-white">
            Keep moving forward
          </div>

          <div className="text-[10px] text-slate-500 mt-1 leading-relaxed">
            Small progress every day
            becomes fluent Japanese.
          </div>

        </div>

      </div>

    </aside>
  );
};