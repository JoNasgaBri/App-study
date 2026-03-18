import { useCallback, useEffect, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { storage } from '../../../../shared/lib/storage';
import { clampNumber } from '../../../../shared/lib/validation';

const WORK_KEY = 'pomodoro_work';
const CYCLES_KEY = 'pomodoro_cycles';

export function PomodoroMiniWidget({ theme, darkMode }) {
  const workMins = storage.get(WORK_KEY, 30, (v) => clampNumber(v, 1, 120, 30));
  const [timeLeft, setTimeLeft] = useState(workMins * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (isActive && timeLeft === 0) {
      setIsActive(false);
      const prev = storage.get(CYCLES_KEY, 0, (v) => clampNumber(v, 0, 999, 0));
      storage.set(CYCLES_KEY, prev + 1);
    }
  }, [isActive, timeLeft]);

  const toggle = useCallback(() => {
    if (!isActive && timeLeft === 0) setTimeLeft(workMins * 60);
    setIsActive((p) => !p);
  }, [isActive, timeLeft, workMins]);

  const reset = useCallback(() => {
    setIsActive(false);
    setTimeLeft(workMins * 60);
  }, [workMins]);

  const mm = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const ss = (timeLeft % 60).toString().padStart(2, '0');

  const total = workMins * 60;
  const pct = total > 0 ? ((total - timeLeft) / total) * 100 : 0;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      {/* Circular progress */}
      <div className="relative">
        <svg width="90" height="90" viewBox="0 0 90 90" className="-rotate-90">
          <circle
            cx="45" cy="45" r="38"
            fill="none"
            strokeWidth="4"
            className={darkMode ? 'stroke-zinc-700' : 'stroke-stone-100'}
          />
          <circle
            cx="45" cy="45" r="38"
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            stroke={theme.hex}
            strokeDasharray={`${2 * Math.PI * 38}`}
            strokeDashoffset={`${2 * Math.PI * 38 * (1 - pct / 100)}`}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xl font-light tabular-nums ${darkMode ? 'text-zinc-100' : 'text-stone-800'}`}>
            {mm}:{ss}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className={`p-2.5 rounded-full transition-all text-white ${
            isActive ? 'bg-stone-700 hover:bg-stone-800' : `${theme.accent}`
          }`}
        >
          {isActive
            ? <Pause className="w-4 h-4" fill="currentColor" />
            : <Play className="w-4 h-4 ml-0.5" fill="currentColor" />}
        </button>
        <button
          onClick={reset}
          className={`p-2 rounded-full border transition-colors ${
            darkMode
              ? 'border-zinc-700 text-zinc-400 hover:bg-zinc-700'
              : 'border-stone-200 text-stone-500 hover:bg-stone-100'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} />
        </button>
      </div>

      <span className={`text-[10px] font-semibold uppercase tracking-widest ${
        isActive ? theme.text : darkMode ? 'text-zinc-600' : 'text-stone-300'
      }`}>
        {timeLeft === 0 ? 'Concluído!' : isActive ? 'Focando...' : 'Pronto'}
      </span>
    </div>
  );
}
