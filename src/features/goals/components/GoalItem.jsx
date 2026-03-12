import { Check, Trash2 } from 'lucide-react';

const CATEGORY_LABELS = {
  estudo: 'Estudo',
  revisao: 'Revisão',
  redacao: 'Redação',
  pomodoro: 'Foco',
  geral: 'Geral',
};

export function GoalItem({ goal, onToggle, onRemove, theme, darkMode }) {
  return (
    <div className={`group flex items-start gap-3 p-4 rounded-2xl border transition-all ${
      goal.done
        ? darkMode ? 'bg-zinc-800/60 border-zinc-700' : 'bg-stone-50/80 border-stone-100'
        : darkMode ? 'bg-zinc-800 border-zinc-700 hover:border-zinc-600 shadow-sm' : 'bg-white border-stone-100 hover:border-stone-200 shadow-sm'
    }`}>
      {/* Checkbox */}
      <button
        onClick={() => onToggle(goal.id)}
        aria-label={goal.done ? 'Desmarcar meta' : 'Marcar como feita'}
        className={`mt-0.5 w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
          goal.done
            ? `${theme.bg} border-transparent`
            : darkMode ? 'border-zinc-600 hover:border-zinc-400' : 'border-stone-200 hover:border-stone-400'
        }`}
      >
        {goal.done && <Check className="w-3 h-3 text-white" strokeWidth={2.5} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-5 break-words ${
          goal.done
            ? darkMode ? 'line-through text-zinc-500' : 'line-through text-stone-400'
            : darkMode ? 'text-zinc-200' : 'text-stone-700'
        }`}>
          {goal.text}
        </p>
        <span className={`text-[10px] font-semibold uppercase tracking-widest mt-0.5 block ${darkMode ? 'text-zinc-600' : 'text-stone-300'}`}>
          {CATEGORY_LABELS[goal.category] ?? goal.category}
        </span>
      </div>

      {/* Delete */}
      <button
        onClick={() => onRemove(goal.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-stone-200 hover:text-rose-400 shrink-0 mt-0.5"
        aria-label="Remover meta"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
