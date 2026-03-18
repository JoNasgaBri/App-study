import { Clock, Target, PenTool } from 'lucide-react';
import { storage } from '../../../../shared/lib/storage';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
};

export function GreetingWidget({ theme, darkMode, onTabChange }) {
  const profile = storage.get('onboarding:profile', null, (v) =>
    v && typeof v === 'object' ? v : null,
  );
  const name = profile?.name || 'Estudante';

  let daysLeft = null;
  if (profile?.examDate) {
    const ms = new Date(profile.examDate).getTime() - Date.now();
    daysLeft = Math.max(0, Math.ceil(ms / 86_400_000));
  }

  const greeting = getGreeting();

  const quickActions = [
    { label: 'Pomodoro', icon: Clock, tab: 'pomodoro' },
    { label: 'Metas', icon: Target, tab: 'metas' },
    { label: 'Redação', icon: PenTool, tab: 'redacao' },
  ];

  return (
    <div className="flex flex-col justify-between h-full gap-3">
      <div>
        <p className={`text-xs font-semibold uppercase tracking-widest mb-0.5 ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>
          {greeting} 👋
        </p>
        <h2 className={`text-2xl font-light tracking-tight ${darkMode ? 'text-zinc-100' : 'text-stone-800'}`}>
          {name}
        </h2>
      </div>

      <div className="flex items-end justify-between gap-4 flex-wrap">
        {/* Quick Actions */}
        <div className="flex gap-2">
          {quickActions.map((action) => (
            <button
              key={action.tab}
              onClick={() => onTabChange?.(action.tab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                darkMode
                  ? 'bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-800'
              }`}
            >
              <action.icon className="w-3.5 h-3.5" strokeWidth={1.5} />
              {action.label}
            </button>
          ))}
        </div>

        {/* Days left */}
        {daysLeft !== null && (
          <div className="text-right shrink-0">
            <p className={`text-3xl font-light tabular-nums ${theme.text}`}>{daysLeft}</p>
            <p className={`text-[10px] font-semibold uppercase tracking-widest ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>
              dias restantes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
