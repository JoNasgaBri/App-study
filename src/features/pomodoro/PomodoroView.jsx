import { useCallback, useEffect, useState } from 'react';
import { Pause, Play, RotateCcw, Settings, Volume2, VolumeX } from 'lucide-react';
import { storage } from '../../shared/lib/storage';
import { playNotificationSound } from '../../shared/lib/audio';
import { clampNumber } from '../../shared/lib/validation';
import { Modal } from '../../shared/components/Modal';

const WORK_KEY = 'pomodoro_work';
const BREAK_KEY = 'pomodoro_break';
const SOUND_KEY = 'pomodoro_sound';
const CYCLES_KEY = 'pomodoro_cycles';
const TIME_LEFT_KEY = 'pomodoro_timeLeft';
const IS_ACTIVE_KEY = 'pomodoro_isActive';
const IS_BREAK_KEY = 'pomodoro_isBreak';

export function PomodoroView({ theme, hasVideo, darkMode }) {
  const [workMins, setWorkMins] = useState(() => storage.get(WORK_KEY, 30, (v) => clampNumber(v, 1, 120, 30)));
  const [breakMins, setBreakMins] = useState(() => storage.get(BREAK_KEY, 5, (v) => clampNumber(v, 1, 60, 5)));
  const [soundEnabled, setSoundEnabled] = useState(() => storage.get(SOUND_KEY, true, (v) => Boolean(v)));
  const [showSettings, setShowSettings] = useState(false);
  const [cycles, setCycles] = useState(() => storage.get(CYCLES_KEY, 0, (v) => clampNumber(v, 0, 999, 0)));

  const [timeLeft, setTimeLeft] = useState(() =>
    storage.get(TIME_LEFT_KEY, workMins * 60, (v) => clampNumber(v, 0, 60 * 120, workMins * 60)),
  );
  const [isActive, setIsActive] = useState(() => storage.get(IS_ACTIVE_KEY, false, (v) => Boolean(v)));
  const [isBreak, setIsBreak] = useState(() => storage.get(IS_BREAK_KEY, false, (v) => Boolean(v)));

  useEffect(() => {
    storage.set(TIME_LEFT_KEY, timeLeft);
    storage.set(IS_ACTIVE_KEY, isActive);
    storage.set(IS_BREAK_KEY, isBreak);
  }, [timeLeft, isActive, isBreak]);

  useEffect(() => {
    let interval;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);

      if (soundEnabled) {
        playNotificationSound();
      }

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(isBreak ? '✅ Pausa terminada!' : '🎉 Pomodoro completo!', {
          body: isBreak ? 'Clique Play para começar próximo ciclo!' : `Pausa de ${breakMins} min disponível. Clique Play quando estiver pronto!`,
          icon: '/vite.svg',
          tag: 'pomodoro',
        });
      }

      if (!isBreak) {
        const nextCycles = cycles + 1;
        setCycles(nextCycles);
        storage.set(CYCLES_KEY, nextCycles);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak, cycles, breakMins, soundEnabled]);

  const toggleTimer = useCallback(() => {
    if (!isActive && timeLeft === 0) {
      if (!isBreak) {
        setIsBreak(true);
        setTimeLeft(breakMins * 60);
      } else {
        setIsBreak(false);
        setTimeLeft(workMins * 60);
      }
    }

    setIsActive(!isActive);
  }, [isActive, timeLeft, isBreak, breakMins, workMins]);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(workMins * 60);
  }, [workMins]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      const targetTag = event.target?.tagName;
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA') {
        return;
      }

      if (event.key === ' ' || event.key.toLowerCase() === 'p') {
        event.preventDefault();
        toggleTimer();
      }

      if (event.key.toLowerCase() === 'r') {
        event.preventDefault();
        resetTimer();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleTimer, resetTimer]);

  const saveSettings = () => {
    const safeWork = clampNumber(workMins, 1, 120, 30);
    const safeBreak = clampNumber(breakMins, 1, 60, 5);

    setWorkMins(safeWork);
    setBreakMins(safeBreak);
    storage.set(WORK_KEY, safeWork);
    storage.set(BREAK_KEY, safeBreak);
    storage.set(SOUND_KEY, soundEnabled);

    setShowSettings(false);
    setIsBreak(false);
    setIsActive(false);
    setTimeLeft(safeWork * 60);
  };

  const cancelSettings = useCallback(() => {
    setWorkMins(storage.get(WORK_KEY, 30, (v) => clampNumber(v, 1, 120, 30)));
    setBreakMins(storage.get(BREAK_KEY, 5, (v) => clampNumber(v, 1, 60, 5)));
    setSoundEnabled(storage.get(SOUND_KEY, true, (v) => Boolean(v)));
    setShowSettings(false);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // ── Derived dark-mode styles ──
  const iconBtnBase = hasVideo
    ? 'bg-white/70 hover:bg-white/90 shadow-sm'
    : darkMode
      ? 'bg-zinc-800 hover:bg-zinc-700'
      : 'bg-stone-100 hover:bg-stone-200';

  const textColor = hasVideo
    ? 'text-stone-900 drop-shadow-md'
    : darkMode
      ? 'text-zinc-100'
      : 'text-stone-900';

  const subTextColor = hasVideo
    ? 'text-stone-800 font-bold drop-shadow-sm'
    : darkMode
      ? 'text-zinc-500'
      : 'text-stone-400';

  const dotEmpty = hasVideo
    ? 'bg-white/60 border border-stone-300'
    : darkMode
      ? 'bg-zinc-700'
      : 'bg-stone-200';

  const kbdClass = darkMode
    ? 'bg-zinc-700/80 rounded text-zinc-300 font-mono'
    : 'bg-stone-200/80 rounded text-stone-800 font-mono';

  const labelInput = darkMode ? 'text-zinc-400' : 'text-stone-500';
  const inputClass = darkMode ? 'bg-zinc-800 border-zinc-600 text-zinc-100' : 'bg-stone-50 border-stone-200 text-stone-800';

  if (showSettings) {
    return (
      <Modal open={showSettings} onClose={cancelSettings} title="Configurar Tempos" darkMode={darkMode} size="sm">
        <div className="space-y-5 mb-6">
          <div>
            <label className={`text-xs font-bold uppercase tracking-widest block mb-2 ${labelInput}`}>Foco (minutos)</label>
            <input type="number" min="1" max="120" value={workMins} onChange={(e) => setWorkMins(clampNumber(e.target.value, 1, 120, 30))} className={`w-full border-b-2 py-2 px-3 text-lg font-medium focus:outline-none transition-colors rounded-t-lg ${inputClass} ${theme.borderFocus}`} />
          </div>
          <div>
            <label className={`text-xs font-bold uppercase tracking-widest block mb-2 ${labelInput}`}>Pausa (minutos)</label>
            <input type="number" min="1" max="60" value={breakMins} onChange={(e) => setBreakMins(clampNumber(e.target.value, 1, 60, 5))} className={`w-full border-b-2 py-2 px-3 text-lg font-medium focus:outline-none transition-colors rounded-t-lg ${inputClass} ${theme.borderFocus}`} />
          </div>
          <div className="flex items-center justify-between pt-1">
            <label className={`text-xs font-bold uppercase tracking-widest ${labelInput}`}>Som de Alarme</label>
            <button onClick={() => setSoundEnabled(!soundEnabled)} className={`p-2 rounded-xl transition-colors ${soundEnabled ? `${theme.bgLight} ${theme.text}` : darkMode ? 'bg-zinc-800 text-zinc-500' : 'bg-stone-100 text-stone-400'}`}>{soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}</button>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={cancelSettings} className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${darkMode ? 'border-zinc-700 text-zinc-400 hover:bg-zinc-800' : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}>Cancelar</button>
          <button onClick={saveSettings} className={`flex-1 py-3 rounded-xl text-white font-bold transition-transform hover:scale-[1.02] shadow-lg ${theme.accent}`}>Guardar</button>
        </div>
      </Modal>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] relative animate-in fade-in duration-500">
      <div className="absolute top-0 right-0 flex gap-2">
        <button onClick={() => setSoundEnabled(!soundEnabled)} className={`p-2.5 rounded-full transition-all ${iconBtnBase} ${soundEnabled ? theme.text : darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>
          {soundEnabled ? <Volume2 className="w-5 h-5" strokeWidth={1.5} /> : <VolumeX className="w-5 h-5" strokeWidth={1.5} />}
        </button>
        <button onClick={() => setShowSettings(true)} className={`p-2.5 rounded-full transition-all ${iconBtnBase} ${darkMode ? 'text-zinc-400' : 'text-stone-600'}`}>
          <Settings className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>

      <div className={`text-xs font-bold tracking-widest uppercase mb-8 transition-colors ${
        isBreak
          ? darkMode ? 'text-zinc-500 drop-shadow-sm' : 'text-stone-500 drop-shadow-sm'
          : hasVideo
            ? `${theme.text} drop-shadow-sm`
            : theme.textLight
      }`}>
        {timeLeft === 0
          ? (isBreak ? '✅ Pausa terminada! Clique Play para continuar' : '🎉 Pomodoro completo! Clique Play para pausar')
          : isBreak
            ? 'Pausa / Recuperação Mental'
            : 'Foco Profundo / Estudo Ativo'}
      </div>

      <div className={`text-9xl md:text-[13rem] font-light tracking-tighter mb-16 transition-colors ${textColor} ${timeLeft === 0 ? 'animate-pulse' : ''}`}>
        {formatTime(timeLeft)}
      </div>

      <div className="flex items-center gap-6 mb-16">
        <button onClick={toggleTimer} className={`flex items-center justify-center w-24 h-24 rounded-full text-white transition-all transform hover:scale-105 shadow-2xl ${timeLeft === 0 ? `${theme.bg} animate-bounce` : isBreak ? 'bg-stone-800 hover:bg-stone-900' : theme.accent}`}>
          {isActive ? <Pause className="w-10 h-10" fill="currentColor" /> : <Play className="w-10 h-10 ml-2" fill="currentColor" />}
        </button>
        <button onClick={resetTimer} className={`flex items-center justify-center w-14 h-14 rounded-full border transition-colors ${
          hasVideo
            ? 'bg-white/80 hover:bg-white backdrop-blur-md shadow-sm border-stone-300 text-stone-700'
            : darkMode
              ? 'border-zinc-700 text-zinc-400 hover:bg-zinc-800'
              : 'border-stone-300 text-stone-700 hover:bg-stone-100'
        }`}>
          <RotateCcw className="w-6 h-6" strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex flex-col items-center gap-3">
        <p className={`text-xs uppercase tracking-widest ${subTextColor}`}>Ciclos ({workMins}m)</p>
        <div className="flex gap-2">
          {[...Array(Math.max(5, cycles))].map((_, index) => (
            <div key={index} className={`w-3 h-3 rounded-full transition-colors ${index < cycles ? `${theme.bg} shadow-md` : dotEmpty}`} />
          ))}
        </div>
      </div>

      <div className={`mt-12 flex gap-4 text-[10px] uppercase tracking-widest ${darkMode ? 'text-zinc-600' : hasVideo ? 'text-stone-600 drop-shadow-sm' : 'text-stone-400'}`}>
        <span className="flex items-center gap-1.5"><kbd className={`px-2 py-1 ${kbdClass}`}>Space</kbd> Play/Pause</span>
        <span className="flex items-center gap-1.5"><kbd className={`px-2 py-1 ${kbdClass}`}>R</kbd> Reset</span>
      </div>
    </div>
  );
}
