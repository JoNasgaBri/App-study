import { storage } from '../../../../shared/lib/storage';

const DAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function getDayActivity(dateStr) {
  const errors = storage.get('errors', [], (v, fb) => (Array.isArray(v) ? v : fb));
  const essays = storage.get('essays', [], (v, fb) => (Array.isArray(v) ? v : fb));

  const dayErrors = errors.filter((e) => e.timestamp && new Date(e.timestamp).toISOString().slice(0, 10) === dateStr).length;
  const dayEssays = essays.filter((e) => e.timestamp && new Date(e.timestamp).toISOString().slice(0, 10) === dateStr).length;

  return dayErrors + dayEssays;
}

export function WeekHeatmapWidget({ theme, darkMode }) {
  const today = new Date();
  const days = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const activity = getDayActivity(dateStr);
    days.push({
      key: dateStr,
      label: DAY_LABELS[d.getDay()],
      isToday: i === 0,
      activity,
    });
  }

  const maxActivity = Math.max(1, ...days.map((d) => d.activity));

  const getLevel = (count) => {
    if (count === 0) return 0;
    const ratio = count / maxActivity;
    if (ratio <= 0.33) return 1;
    if (ratio <= 0.66) return 2;
    return 3;
  };

  const levelStyles = darkMode
    ? ['bg-zinc-800', 'opacity-30', 'opacity-60', 'opacity-100']
    : ['bg-stone-100', 'opacity-30', 'opacity-60', 'opacity-100'];

  return (
    <div className="flex flex-col h-full gap-3 justify-center">
      <div className="flex items-end gap-2 justify-between px-1">
        {days.map((day) => {
          const level = getLevel(day.activity);
          return (
            <div key={day.key} className="flex flex-col items-center gap-1.5 flex-1">
              <span className={`text-[9px] font-semibold uppercase ${
                day.isToday
                  ? theme.text
                  : darkMode ? 'text-zinc-600' : 'text-stone-400'
              }`}>
                {day.label}
              </span>
              <div className="flex flex-col gap-1">
                {[2, 1, 0].map((row) => (
                  <div
                    key={row}
                    className={`w-6 h-4 rounded-sm transition-all ${
                      row < level
                        ? darkMode ? levelStyles[level] : levelStyles[level]
                        : darkMode ? 'bg-zinc-800' : 'bg-stone-100'
                    }`}
                    style={row < level ? { backgroundColor: theme.hex } : undefined}
                    title={`${day.key}: ${day.activity} atividades`}
                  />
                ))}
              </div>
              <span className={`text-[8px] tabular-nums ${darkMode ? 'text-zinc-600' : 'text-stone-300'}`}>
                {day.activity}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
