import { Flame } from 'lucide-react';
import { storage } from '../../../../shared/lib/storage';

function computeStreak() {
  const raw = storage.get('goals:history', {}, (v) =>
    v && typeof v === 'object' && !Array.isArray(v) ? v : {},
  );

  let streak = 0;
  const now = new Date();
  const day = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  for (let i = 0; i < 365; i++) {
    const key = day.toISOString().slice(0, 10);
    const dayData = raw[key];
    if (dayData && dayData.allDone) {
      streak++;
    } else if (i > 0) {
      break; // today can be incomplete, but past days must be done
    }
    day.setDate(day.getDate() - 1);
  }
  return streak;
}

export function StreakWidget({ theme, darkMode }) {
  const streak = computeStreak();

  return (
    <div className="flex flex-col items-center justify-center h-full gap-2">
      <div className={`p-3 rounded-2xl transition-all ${
        streak > 0 ? theme.bgLight : darkMode ? 'bg-zinc-700/30' : 'bg-stone-50'
      }`}>
        <Flame
          className={`w-8 h-8 transition-all ${
            streak > 0 ? theme.text : darkMode ? 'text-zinc-600' : 'text-stone-300'
          }`}
          strokeWidth={1.5}
        />
      </div>

      <div className="text-center">
        <p className={`text-3xl font-light tabular-nums ${
          streak > 0 ? theme.text : darkMode ? 'text-zinc-400' : 'text-stone-400'
        }`}>
          {streak}
        </p>
        <p className={`text-[10px] font-semibold uppercase tracking-widest mt-0.5 ${
          darkMode ? 'text-zinc-500' : 'text-stone-400'
        }`}>
          {streak === 1 ? 'dia seguido' : 'dias seguidos'}
        </p>
      </div>
    </div>
  );
}
