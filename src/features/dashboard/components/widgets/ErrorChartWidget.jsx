import { storage } from '../../../../shared/lib/storage';

const COLORS_LIGHT = ['#f97316', '#3b82f6', '#8b5cf6'];
const COLORS_DARK = ['#fb923c', '#60a5fa', '#a78bfa'];
const LABELS = ['Falta de Base', 'Interpretação', 'Cálculo'];

export function ErrorChartWidget({ theme, darkMode }) {
  const errors = storage.get('errors', [], (v, fb) => (Array.isArray(v) ? v : fb));

  const counts = errors.reduce(
    (a, e) => {
      if (e.type === 'base') a[0]++;
      if (e.type === 'interpretacao') a[1]++;
      if (e.type === 'calculo') a[2]++;
      return a;
    },
    [0, 0, 0],
  );
  const total = counts.reduce((s, c) => s + c, 0);

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
        <span className="text-3xl">✅</span>
        <p className={`text-xs ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>
          Nenhum erro registrado.
        </p>
      </div>
    );
  }

  const colors = darkMode ? COLORS_DARK : COLORS_LIGHT;
  const cx = 50, cy = 50, r = 38;
  const circumference = 2 * Math.PI * r;

  // Build arcs
  let offset = 0;
  const arcs = counts.map((count, i) => {
    const pct = count / total;
    const dash = circumference * pct;
    const gap = circumference - dash;
    const arc = (
      <circle
        key={i}
        cx={cx} cy={cy} r={r}
        fill="none"
        strokeWidth="10"
        stroke={colors[i]}
        strokeDasharray={`${dash} ${gap}`}
        strokeDashoffset={-offset}
        className="transition-all duration-700"
      />
    );
    offset += dash;
    return arc;
  });

  return (
    <div className="flex items-center justify-center gap-4 h-full">
      {/* Donut */}
      <div className="relative shrink-0">
        <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
          <circle cx={cx} cy={cy} r={r} fill="none" strokeWidth="10"
            className={darkMode ? 'stroke-zinc-700' : 'stroke-stone-100'} />
          {arcs}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-light tabular-nums ${darkMode ? 'text-zinc-200' : 'text-stone-700'}`}>
            {total}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2">
        {LABELS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: colors[i] }} />
            <div>
              <p className={`text-xs font-medium ${darkMode ? 'text-zinc-300' : 'text-stone-600'}`}>
                {label}
              </p>
              <p className={`text-[10px] tabular-nums ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>
                {counts[i]} ({total > 0 ? Math.round((counts[i] / total) * 100) : 0}%)
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
