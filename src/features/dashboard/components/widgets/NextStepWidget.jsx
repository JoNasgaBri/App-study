import { ArrowRight, BookOpen } from 'lucide-react';
import { storage } from '../../../../shared/lib/storage';

export function NextStepWidget({ theme, darkMode, onTabChange }) {
  const topics = storage.get('syllabus_topics', [], (v, fb) => (Array.isArray(v) ? v : fb));
  const checked = storage.get('syllabus_checked', [], (v, fb) => (Array.isArray(v) ? v : fb));

  // Find the first unchecked topic
  let nextTopic = null;
  let nextArea = null;
  for (const group of topics) {
    for (const item of group.items) {
      if (!checked.includes(item)) {
        nextTopic = item;
        nextArea = group.area;
        break;
      }
    }
    if (nextTopic) break;
  }

  if (!nextTopic) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
        <span className="text-3xl">🎉</span>
        <p className={`text-sm font-medium ${darkMode ? 'text-zinc-300' : 'text-stone-600'}`}>
          Edital completo!
        </p>
        <p className={`text-xs ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>
          Todos os tópicos foram estudados.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between h-full gap-3">
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <BookOpen className={`w-4 h-4 ${theme.text}`} strokeWidth={1.5} />
          <span className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>
            {nextArea}
          </span>
        </div>
        <p className={`text-sm font-medium leading-snug ${darkMode ? 'text-zinc-200' : 'text-stone-700'}`}>
          {nextTopic}
        </p>
      </div>

      <button
        onClick={() => onTabChange?.('raiox')}
        className={`flex items-center gap-1.5 text-xs font-medium transition-all ${theme.text} hover:opacity-70`}
      >
        Ir para Trilha
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
