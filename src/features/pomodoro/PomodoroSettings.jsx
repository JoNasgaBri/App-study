import { Volume2, VolumeX } from 'lucide-react';
import { Modal } from '../../shared/components/Modal';
import { clampNumber } from '../../shared/lib/validation';

export function PomodoroSettings({
  open,
  onClose,
  onSave,
  theme,
  darkMode,
  workMins,
  setWorkMins,
  breakMins,
  setBreakMins,
  soundEnabled,
  setSoundEnabled,
}) {
  const labelInput = darkMode ? 'text-zinc-400' : 'text-stone-500';
  const inputClass = darkMode
    ? 'bg-zinc-800 border-zinc-600 text-zinc-100'
    : 'bg-stone-50 border-stone-200 text-stone-800';

  return (
    <Modal open={open} onClose={onClose} title="Configurar Tempos" darkMode={darkMode} size="sm">
      <div className="space-y-5 mb-6">
        <div>
          <label className={`text-xs font-bold uppercase tracking-widest block mb-2 ${labelInput}`}>
            Foco (minutos)
          </label>
          <input
            type="number"
            min="1"
            max="120"
            value={workMins}
            onChange={(e) => setWorkMins(clampNumber(e.target.value, 1, 120, 30))}
            className={`w-full border-b-2 py-2 px-3 text-lg font-medium focus:outline-none transition-colors rounded-t-lg ${inputClass} ${theme.borderFocus}`}
          />
        </div>
        <div>
          <label className={`text-xs font-bold uppercase tracking-widest block mb-2 ${labelInput}`}>
            Pausa (minutos)
          </label>
          <input
            type="number"
            min="1"
            max="60"
            value={breakMins}
            onChange={(e) => setBreakMins(clampNumber(e.target.value, 1, 60, 5))}
            className={`w-full border-b-2 py-2 px-3 text-lg font-medium focus:outline-none transition-colors rounded-t-lg ${inputClass} ${theme.borderFocus}`}
          />
        </div>
        <div className="flex items-center justify-between pt-1">
          <label className={`text-xs font-bold uppercase tracking-widest ${labelInput}`}>
            Som de Alarme
          </label>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl transition-colors ${
              soundEnabled
                ? `${theme.bgLight} ${theme.text}`
                : darkMode
                  ? 'bg-zinc-800 text-zinc-500'
                  : 'bg-stone-100 text-stone-400'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${
            darkMode
              ? 'border-zinc-700 text-zinc-400 hover:bg-zinc-800'
              : 'border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          Cancelar
        </button>
        <button
          onClick={onSave}
          className={`flex-1 py-3 rounded-xl text-white font-bold transition-transform hover:scale-[1.02] shadow-lg ${theme.accent}`}
        >
          Guardar
        </button>
      </div>
    </Modal>
  );
}
