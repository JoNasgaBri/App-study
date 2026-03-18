import { storage } from '../../../../shared/lib/storage';

export function SyllabusRingWidget({ theme, darkMode }) {
  const topics = storage.get('syllabus_topics', [], (v, fb) => (Array.isArray(v) ? v : fb));
  const checked = storage.get('syllabus_checked', [], (v, fb) => (Array.isArray(v) ? v : fb));

  const totalTopics = topics.reduce((s, g) => s + g.items.length, 0);
  const pct = totalTopics > 0 ? Math.round((checked.length / totalTopics) * 100) : 0;

  const r = 52, strokeW = 8;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - pct / 100);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      {/* Ring */}
      <div className="relative">
        <svg width="130" height="130" viewBox="0 0 130 130" className="-rotate-90">
          <circle
            cx="65" cy="65" r={r}
            fill="none"
            strokeWidth={strokeW}
            className={darkMode ? 'stroke-zinc-700' : 'stroke-stone-100'}
          />
          <circle
            cx="65" cy="65" r={r}
            fill="none"
            strokeWidth={strokeW}
            strokeLinecap="round"
            stroke={theme.hex}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-light tabular-nums ${theme.text}`}>{pct}%</span>
          <span className={`text-[9px] font-medium ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>
            concluído
          </span>
        </div>
      </div>

      <p className={`text-xs ${darkMode ? 'text-zinc-400' : 'text-stone-500'}`}>
        <span className="font-medium tabular-nums">{checked.length}</span> de{' '}
        <span className="tabular-nums">{totalTopics}</span> tópicos
      </p>

      {/* Mini bars by area — compact version */}
      {topics.length > 0 && (
        <div className="w-full grid grid-cols-2 gap-x-3 gap-y-1 px-1">
          {topics.slice(0, 6).map((group) => {
            const gc = group.items.filter((i) => checked.includes(i)).length;
            const gp = group.items.length > 0 ? Math.round((gc / group.items.length) * 100) : 0;
            return (
              <div key={group.area} className="flex flex-col gap-0.5">
                <span className={`text-[9px] font-medium truncate ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>
                  {group.area}
                </span>
                <div className={`h-1 rounded-full overflow-hidden ${darkMode ? 'bg-zinc-700' : 'bg-stone-100'}`}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${gp}%`, backgroundColor: theme.hex }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
