import { useCallback, useState } from 'react';
import { storage } from '../../shared/lib/storage';
import { WEEKLY_SCHEDULE } from './scheduleData';

const STORAGE_KEY = 'schedule:week';

const DEFAULT_DATA = [
  ...WEEKLY_SCHEDULE,
  { day: 'Domingo', m: 'Descanso Mental Offline / Recuperação', t: 'Descanso Mental Offline / Recuperação', n: 'Planear Semana' },
];

function loadSchedule() {
  return storage.get(STORAGE_KEY, DEFAULT_DATA, (v, fb) => (Array.isArray(v) && v.length > 0 ? v : fb));
}

export function ScheduleView({ theme, darkMode }) {
  const [rows, setRows] = useState(loadSchedule);
  const [editing, setEditing] = useState(null); // { rowIdx, col }
  const [draft, setDraft] = useState('');

  const startEdit = useCallback((rowIdx, col, value) => {
    setEditing({ rowIdx, col });
    setDraft(value);
  }, []);

  const commit = useCallback(() => {
    if (!editing) return;
    const { rowIdx, col } = editing;
    setRows((prev) => {
      const next = prev.map((r, i) => (i === rowIdx ? { ...r, [col]: draft } : r));
      storage.set(STORAGE_KEY, next);
      return next;
    });
    setEditing(null);
  }, [editing, draft]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') commit();
      if (e.key === 'Escape') setEditing(null);
    },
    [commit],
  );

  const reset = useCallback(() => {
    storage.set(STORAGE_KEY, DEFAULT_DATA);
    setRows(DEFAULT_DATA);
    setEditing(null);
  }, []);

  const borderClass = darkMode ? 'border-zinc-700' : 'border-stone-200';
  const rowHoverClass = darkMode ? 'hover:bg-zinc-800/50' : 'hover:bg-stone-50/50';
  const cellTextClass = darkMode ? 'text-zinc-300' : 'text-stone-700';
  const headTextClass = darkMode ? 'text-zinc-500' : 'text-stone-500';
  const titleClass = darkMode ? 'text-zinc-100' : 'text-stone-800';

  function EditableCell({ rowIdx, col, value }) {
    const isEditing = editing?.rowIdx === rowIdx && editing?.col === col;
    if (isEditing) {
      return (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          className={`w-full bg-transparent border-b outline-none text-sm py-0.5 ${
            darkMode ? 'border-zinc-500 text-zinc-100' : 'border-stone-400 text-stone-800'
          }`}
        />
      );
    }
    return (
      <span
        role="button"
        tabIndex={0}
        onClick={() => startEdit(rowIdx, col, value)}
        onKeyDown={(e) => e.key === 'Enter' && startEdit(rowIdx, col, value)}
        className={`cursor-pointer block hover:underline hover:decoration-dotted ${cellTextClass}`}
        title="Clique para editar"
      >
        {value || <span className={`italic text-xs ${darkMode ? 'text-zinc-600' : 'text-stone-400'}`}>—</span>}
      </span>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <h2 className={`text-2xl font-light tracking-tight ${titleClass}`}>Planeamento de Execução</h2>
        <button
          onClick={reset}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
            darkMode
              ? 'border-zinc-700 text-zinc-400 hover:bg-zinc-800'
              : 'border-stone-200 text-stone-500 hover:bg-stone-50'
          }`}
        >
          Restaurar padrão
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr>
              <th className={`py-4 px-2 font-semibold text-xs uppercase tracking-widest border-b w-1/5 ${borderClass} ${headTextClass}`}>Dia</th>
              <th className={`py-4 px-2 font-semibold text-xs uppercase tracking-widest border-b ${borderClass} ${headTextClass}`}>Manhã</th>
              <th className={`py-4 px-2 font-semibold text-xs uppercase tracking-widest border-b ${borderClass} ${headTextClass}`}>Tarde</th>
              <th className={`py-4 px-2 font-semibold text-xs uppercase tracking-widest border-b ${borderClass} ${headTextClass}`}>Noite</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {rows.map((row, rowIdx) => (
              <tr key={row.day} className={`border-b transition-colors ${borderClass} ${rowHoverClass}`}>
                <td className={`py-4 px-2 font-medium ${theme.text}`}>{row.day}</td>
                <td className="py-4 px-2 min-w-[180px]">
                  <EditableCell rowIdx={rowIdx} col="m" value={row.m} />
                </td>
                <td className="py-4 px-2 min-w-[180px]">
                  <EditableCell rowIdx={rowIdx} col="t" value={row.t} />
                </td>
                <td className="py-4 px-2 min-w-[180px]">
                  <EditableCell rowIdx={rowIdx} col="n" value={row.n} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className={`mt-4 text-xs ${darkMode ? 'text-zinc-600' : 'text-stone-400'}`}>
        Clique em qualquer célula para editar. As alterações são guardadas automaticamente.
      </p>
    </div>
  );
}
