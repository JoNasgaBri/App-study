import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { storage } from '../../shared/lib/storage';
import { EXAM_CHECKLIST } from './checklistData';

const CHECKLIST_KEY = 'exam_checklist';

const formatExamDate = (dateStr) => {
  if (!dateStr) return 'Dia da Prova';
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
  } catch {
    return 'Dia da Prova';
  }
};

export function ExamChecklistView({ theme, darkMode }) {
  const [checkedItems, setCheckedItems] = useState(() =>
    storage.get(CHECKLIST_KEY, [], (value, fallback) => (Array.isArray(value) ? value : fallback)),
  );

  const profile = storage.get('onboarding:profile', null, (v, fb) => (v && typeof v === 'object' ? v : fb));
  const examDateLabel = formatExamDate(profile?.examDate);

  const toggleCheck = (item) => {
    const newChecked = checkedItems.includes(item)
      ? checkedItems.filter((existingItem) => existingItem !== item)
      : [...checkedItems, item];

    setCheckedItems(newChecked);
    storage.set(CHECKLIST_KEY, newChecked);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-light tracking-tight mb-2">Checklist — {examDateLabel}</h2>
<p className={`text-sm mb-10 ${darkMode ? 'text-zinc-500' : 'text-stone-500'}`}>Baseado no Edital Item 7 - Regras de Segurança</p>

        <div className={`flex flex-col md:flex-row justify-between mb-12 border rounded-2xl p-6 relative overflow-hidden ${
          darkMode ? 'border-zinc-700 bg-zinc-800/60' : 'border-stone-200 bg-white/60'
        }`}>
          <div className={`absolute top-0 left-0 w-full h-1 ${theme.bg}`}></div>
          <div className="text-center mb-4 md:mb-0"><p className={`text-xl font-bold ${darkMode ? 'text-zinc-100' : 'text-stone-800'}`}>08:30</p><p className={`text-xs uppercase tracking-widest mt-1 ${darkMode ? 'text-zinc-500' : 'text-stone-500'}`}>Chegada ideal</p></div>
          <div className="text-center mb-4 md:mb-0"><p className={`text-xl font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>09:45</p><p className={`text-xs uppercase tracking-widest mt-1 ${darkMode ? 'text-zinc-500' : 'text-stone-500'}`}>Fecho portões</p></div>
          <div className="text-center mb-4 md:mb-0"><p className={`text-xl font-bold ${darkMode ? 'text-zinc-100' : 'text-stone-800'}`}>10:00</p><p className={`text-xs uppercase tracking-widest mt-1 ${darkMode ? 'text-zinc-500' : 'text-stone-500'}`}>Início Prova</p></div>
          <div className="text-center mb-4 md:mb-0"><p className={`text-xl font-bold ${darkMode ? 'text-zinc-100' : 'text-stone-800'}`}>13:00</p><p className={`text-xs uppercase tracking-widest mt-1 ${darkMode ? 'text-zinc-500' : 'text-stone-500'}`}>Fim Sigilo</p></div>
          <div className="text-center"><p className={`text-xl font-bold ${darkMode ? 'text-zinc-100' : 'text-stone-800'}`}>15:30</p><p className={`text-xs uppercase tracking-widest mt-1 ${darkMode ? 'text-zinc-500' : 'text-stone-500'}`}>Término Final</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {EXAM_CHECKLIST.map((group) => (
          <div
            key={group.title}
            className={`p-6 rounded-2xl border ${
              group.type === 'mandatory'
                ? 'border-blue-200 bg-blue-50/50'
                : group.type === 'prohibited'
                  ? 'border-red-200 bg-red-50/50'
                  : 'border-emerald-200 bg-emerald-50/50'
            }`}
          >
            <h4
              className={`font-bold text-sm mb-4 uppercase tracking-wider ${
                group.type === 'mandatory'
                  ? 'text-blue-700'
                  : group.type === 'prohibited'
                    ? 'text-red-700'
                    : 'text-emerald-700'
              }`}
            >
              {group.title}
            </h4>
            <div className="space-y-3">
              {group.items.map((item) => {
                const isChecked = checkedItems.includes(item);
                return (
                  <label key={item} className="flex items-start gap-3 cursor-pointer group/item" onClick={() => toggleCheck(item)}>
                      <div className={`mt-0.5 w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                        isChecked
                          ? (group.type === 'prohibited' ? 'bg-red-500 border-red-500' : `${theme.bg} border-transparent`)
                          : darkMode ? 'border-zinc-600 bg-zinc-800' : 'border-stone-300 bg-white'
                      }`}>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                    </div>
                      <span className={`text-sm leading-snug transition-colors ${
                        isChecked
                          ? darkMode ? 'text-zinc-600 line-through' : 'text-stone-400 line-through'
                          : darkMode ? 'text-zinc-300' : 'text-stone-800'
                      }`}>
                      {item}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
