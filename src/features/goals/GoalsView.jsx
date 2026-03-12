import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useGoals } from './hooks/useGoals';
import { GoalItem } from './components/GoalItem';
import { StreakBadge } from './components/StreakBadge';

const CATEGORIES = [
  { id: 'geral', label: 'Geral' },
  { id: 'estudo', label: 'Estudo' },
  { id: 'revisao', label: 'Revisão' },
  { id: 'redacao', label: 'Redação' },
  { id: 'pomodoro', label: 'Foco' },
];

const buildDayLabel = () => {
  const now = new Date();
  return now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
};

export function GoalsView({ theme, darkMode }) {
  const { goals, addGoal, toggleGoal, removeGoal, streak, doneCount, allDone, weekHistory } = useGoals();
  const [draft, setDraft] = useState('');
  const [category, setCategory] = useState('geral');
  // Stable on mount — avoids calling new Date() on every re-render
  const [dayLabel] = useState(buildDayLabel);

  const handleAdd = (e) => {
    e.preventDefault();
    addGoal(draft, category);
    setDraft('');
  };

  const pending = goals.filter((g) => !g.done);
  const done = goals.filter((g) => g.done);

  const inputBase = darkMode
    ? 'bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:border-zinc-500'
    : 'bg-white border-stone-200 text-stone-800 placeholder-stone-300';

  return (
    <div className="max-w-2xl mx-auto space-y-8">

      {/* ── Header ── */}
      <div className={`flex items-start justify-between gap-4 flex-wrap pb-6 border-b ${darkMode ? 'border-zinc-800' : 'border-stone-100'}`}>
        <div>
          <p className={`text-xs font-semibold uppercase tracking-widest mb-0.5 capitalize ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>{dayLabel}</p>
          <h2 className={`text-3xl font-light tracking-tight ${darkMode ? 'text-zinc-100' : 'text-stone-800'}`}>Metas do Dia</h2>
          {goals.length > 0 && (
            <p className={`text-sm mt-1 ${darkMode ? 'text-zinc-400' : 'text-stone-400'}`}>
              {doneCount} de {goals.length} concluída{goals.length !== 1 ? 's' : ''}
              {allDone && <span className={`ml-2 font-semibold ${theme.text}`}>— Dia completo! 🎉</span>}
            </p>
          )}
        </div>
        <StreakBadge streak={streak} allDone={allDone} theme={theme} darkMode={darkMode} />
      </div>

      {/* ── Week grid ── */}
      <div className="flex gap-2 justify-between">
        {weekHistory.map((day) => (
          <div key={day.key} className="flex flex-col items-center gap-1.5 flex-1">
            <span className={`text-[10px] font-semibold uppercase ${darkMode ? 'text-zinc-600' : 'text-stone-400'}`}>{day.label}</span>
            <div
              className={`w-7 h-7 rounded-lg transition-all ${
                day.completed
                  ? `${theme.bg}`
                  : day.partial
                    ? `${theme.bgLight} border-2 ${theme.border}`
                    : day.isToday
                      ? darkMode ? 'bg-zinc-700 border-2 border-zinc-600' : 'bg-stone-100 border-2 border-stone-200'
                      : darkMode ? 'bg-zinc-800' : 'bg-stone-100'
              }`}
            />
          </div>
        ))}
      </div>

      {/* ── Progress bar ── */}
      {goals.length > 0 && (
        <div className={`h-1.5 rounded-full overflow-hidden -mt-2 ${darkMode ? 'bg-zinc-800' : 'bg-stone-100'}`}>
          <div
            className={`h-full transition-all duration-700 ${theme.bg}`}
            style={{ width: `${(doneCount / goals.length) * 100}%` }}
          />
        </div>
      )}

      {/* ── Add goal form ── */}
      <form onSubmit={handleAdd} className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                category === cat.id
                  ? `${theme.accent} text-white`
                  : darkMode ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={120}
            placeholder="Nova meta para hoje..."
            className={`flex-1 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-transparent transition-all ${inputBase} ${theme.borderFocus}`}
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className={`px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-all flex items-center gap-1.5 ${
              draft.trim() ? theme.accent : darkMode ? 'bg-zinc-700 cursor-not-allowed text-zinc-500' : 'bg-stone-200 cursor-not-allowed text-stone-400'
            }`}
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        </div>
      </form>

      {/* ── Pending goals ── */}
      {pending.length > 0 && (
        <div className="space-y-2">
          {pending.map((goal) => (
            <GoalItem key={goal.id} goal={goal} onToggle={toggleGoal} onRemove={removeGoal} theme={theme} darkMode={darkMode} />
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {goals.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-stone-200 text-5xl mb-4">🎯</p>
          <p className={`text-sm font-medium ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>Nenhuma meta para hoje ainda.</p>
          <p className={`text-xs mt-1 ${darkMode ? 'text-zinc-600' : 'text-stone-300'}`}>Adicione sua primeira meta acima.</p>
        </div>
      )}

      {/* ── Completed ── */}
      {done.length > 0 && (
        <div className="space-y-2">
          <p className={`text-xs font-semibold uppercase tracking-widest py-1 ${darkMode ? 'text-zinc-600' : 'text-stone-300'}`}>Concluídas</p>
          {done.map((goal) => (
            <GoalItem key={goal.id} goal={goal} onToggle={toggleGoal} onRemove={removeGoal} theme={theme} darkMode={darkMode} />
          ))}
        </div>
      )}
    </div>
  );
}
