import { useEffect, useState, useRef } from 'react';
import { storage } from '../../../../shared/lib/storage';

function AnimatedNumber({ value, duration = 1000, className }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const to = typeof value === 'number' ? value : parseInt(value, 10) || 0;

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return <span className={className}>{display}</span>;
}

export function StatsOverviewWidget({ theme, darkMode }) {
  const cycles = storage.get('pomodoro_cycles', 0, (v) => (Number.isFinite(Number(v)) ? Number(v) : 0));
  const topics = storage.get('syllabus_topics', [], (v, fb) => (Array.isArray(v) ? v : fb));
  const checked = storage.get('syllabus_checked', [], (v, fb) => (Array.isArray(v) ? v : fb));
  const errors = storage.get('errors', [], (v, fb) => (Array.isArray(v) ? v : fb));
  const essays = storage.get('essays', [], (v, fb) => (Array.isArray(v) ? v : fb));

  const totalTopics = topics.reduce((s, g) => s + g.items.length, 0);
  const syllabusProgress = totalTopics > 0 ? Math.round((checked.length / totalTopics) * 100) : 0;

  const stats = [
    { label: 'Pomodoros', value: cycles, sub: 'ciclos' },
    { label: 'Edital', value: syllabusProgress, sub: `${checked.length}/${totalTopics}`, suffix: '%' },
    { label: 'Redações', value: essays.length, sub: 'total' },
    { label: 'Erros', value: errors.length, sub: 'registrados' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 h-full content-center">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`flex flex-col gap-0.5 p-3 rounded-xl transition-all ${
            darkMode ? 'bg-zinc-700/30 hover:bg-zinc-700/50' : 'bg-stone-50 hover:bg-stone-100/80'
          }`}
        >
          <span className={`text-[10px] font-semibold uppercase tracking-widest ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>
            {stat.label}
          </span>
          <div className="flex items-baseline gap-0.5">
            <AnimatedNumber
              value={stat.value}
              className={`text-2xl font-light tabular-nums ${theme.text}`}
            />
            {stat.suffix && <span className={`text-lg font-light ${theme.text}`}>{stat.suffix}</span>}
          </div>
          <span className={`text-[10px] ${darkMode ? 'text-zinc-600' : 'text-stone-300'}`}>{stat.sub}</span>
        </div>
      ))}
    </div>
  );
}
