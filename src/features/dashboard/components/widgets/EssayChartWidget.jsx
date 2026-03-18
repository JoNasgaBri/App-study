import { storage } from '../../../../shared/lib/storage';

export function EssayChartWidget({ theme, darkMode }) {
  const essays = storage.get('essays', [], (v, fb) => (Array.isArray(v) ? v : fb));
  const graded = essays
    .filter((e) => e.selfGrade !== '' && e.selfGrade !== null)
    .slice(0, 10)
    .reverse(); // oldest first

  if (graded.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
        <span className="text-3xl">📝</span>
        <p className={`text-xs ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>
          Nenhuma redação com nota ainda.
        </p>
      </div>
    );
  }

  const grades = graded.map((e) => Number(e.selfGrade));
  const max = 80; // max score
  const min = 0;
  const avg = Math.round(grades.reduce((s, g) => s + g, 0) / grades.length);

  // SVG dimensions
  const W = 280, H = 140;
  const padX = 30, padY = 15;
  const chartW = W - padX * 2;
  const chartH = H - padY * 2;

  const points = grades.map((g, i) => {
    const x = padX + (grades.length > 1 ? (i / (grades.length - 1)) * chartW : chartW / 2);
    const y = padY + chartH - ((g - min) / (max - min)) * chartH;
    return { x, y, grade: g };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  // Average line Y
  const avgY = padY + chartH - ((avg - min) / (max - min)) * chartH;

  return (
    <div className="flex flex-col h-full gap-2">
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <span className={`text-xs font-medium ${darkMode ? 'text-zinc-400' : 'text-stone-500'}`}>
          Últimas {graded.length} notas
        </span>
        <span className={`text-sm font-medium tabular-nums ${theme.text}`}>
          Média: {avg}/80
        </span>
      </div>

      {/* Chart */}
      <div className="flex-1 flex items-center justify-center">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          {[0, 20, 40, 60, 80].map((v) => {
            const y = padY + chartH - ((v - min) / (max - min)) * chartH;
            return (
              <g key={v}>
                <line x1={padX} y1={y} x2={W - padX} y2={y}
                  className={darkMode ? 'stroke-zinc-700/50' : 'stroke-stone-100'}
                  strokeWidth="0.5" />
                <text x={padX - 4} y={y + 3} textAnchor="end"
                  className={`text-[8px] ${darkMode ? 'fill-zinc-600' : 'fill-stone-300'}`}>
                  {v}
                </text>
              </g>
            );
          })}

          {/* Average line */}
          <line
            x1={padX} y1={avgY} x2={W - padX} y2={avgY}
            strokeDasharray="4 4"
            stroke={theme.hex}
            strokeWidth="1"
            opacity="0.4"
          />

          {/* Line */}
          <path d={linePath} fill="none" stroke={theme.hex} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {/* Points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" fill={theme.hex} />
              <circle cx={p.x} cy={p.y} r="2" fill={darkMode ? '#18181b' : '#fff'} />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
