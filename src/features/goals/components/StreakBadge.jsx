import { Flame } from 'lucide-react';

export function StreakBadge({ streak, allDone, theme, darkMode }) {
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all ${
      allDone
        ? `${theme.bgLight} ${theme.border}`
        : darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-stone-50 border-stone-100'
    }`}>
      <Flame className={`w-4 h-4 ${allDone ? theme.text : darkMode ? 'text-zinc-600' : 'text-stone-300'}`} />
      <div className="flex items-baseline gap-1.5">
        <span className={`text-2xl font-light tabular-nums ${allDone ? theme.text : darkMode ? 'text-zinc-300' : 'text-stone-400'}`}>
          {streak}
        </span>
        <span className={`text-xs font-medium ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>
          {streak === 1 ? 'dia' : 'dias'} seguido{streak !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
}
