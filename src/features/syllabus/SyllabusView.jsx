import { useState } from 'react';
import { CheckCircle2, MonitorPlay, Plus, Trash2 } from 'lucide-react';
import { storage } from '../../shared/lib/storage';
import { sanitizeText } from '../../shared/lib/validation';
import { DEFAULT_TOPICS } from './defaultTopics';

const TOPICS_KEY = 'syllabus_topics';
const CHECKED_KEY = 'syllabus_checked';

export function SyllabusView({ theme, darkMode }) {
  const [topics, setTopics] = useState(() =>
    storage.get(TOPICS_KEY, DEFAULT_TOPICS, (value, fallback) => (Array.isArray(value) ? value : fallback)),
  );
  const [checkedItems, setCheckedItems] = useState(() =>
    storage.get(CHECKED_KEY, [], (value, fallback) => (Array.isArray(value) ? value : fallback)),
  );
  const [newItemText, setNewItemText] = useState({ areaIdx: null, text: '' });

  const saveData = (newTopics, newChecked) => {
    storage.set(TOPICS_KEY, newTopics);
    storage.set(CHECKED_KEY, newChecked);
  };

  const toggleCheck = (item) => {
    const newChecked = checkedItems.includes(item)
      ? checkedItems.filter((existingItem) => existingItem !== item)
      : [...checkedItems, item];

    setCheckedItems(newChecked);
    saveData(topics, newChecked);
  };

  const addItem = (areaIdx) => {
    const nextItem = sanitizeText(newItemText.text, 120);
    if (!nextItem) {
      return;
    }

    const updatedTopics = [...topics];
    if (!updatedTopics[areaIdx].items.includes(nextItem)) {
      updatedTopics[areaIdx].items.push(nextItem);
      setTopics(updatedTopics);
      saveData(updatedTopics, checkedItems);
    }

    setNewItemText({ areaIdx: null, text: '' });
  };

  const removeItem = (areaIdx, itemToRemove) => {
    const updatedTopics = [...topics];
    updatedTopics[areaIdx].items = updatedTopics[areaIdx].items.filter((item) => item !== itemToRemove);
    const newChecked = checkedItems.filter((item) => item !== itemToRemove);

    setTopics(updatedTopics);
    setCheckedItems(newChecked);
    saveData(updatedTopics, newChecked);
  };

  const totalItems = topics.reduce((sum, group) => sum + group.items.length, 0);
  const totalChecked = checkedItems.length;
  const overallProgress = totalItems > 0 ? Math.round((totalChecked / totalItems) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-light tracking-tight">Trilha de Estudo (Passo a Passo)</h2>
        <div className="flex items-center gap-3">
          <span className={`text-sm ${darkMode ? 'text-zinc-500' : 'text-stone-500'}`}>{totalChecked}/{totalItems} concluídos</span>
          <span className={`text-2xl font-bold ${theme.text}`}>{overallProgress}%</span>
        </div>
      </div>
      <p className={`text-sm mb-4 ${darkMode ? 'text-zinc-500' : 'text-stone-500'}`}>Base de Conhecimento ordenada logicamente. Siga a ordem dos passos.</p>

      <div className="mb-8">
        <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-zinc-800' : 'bg-stone-200/50'}`}>
          <div className={`h-full transition-all duration-500 ${theme.bg}`} style={{ width: `${overallProgress}%` }}></div>
        </div>
      </div>

      <div className={`mb-10 p-6 rounded-2xl border flex flex-col md:flex-row gap-6 items-start md:items-center ${theme.bgLight} ${theme.border}`}>
        <div className={`p-4 rounded-xl text-white ${theme.bg} shadow-lg shrink-0`}>
          <MonitorPlay className="w-8 h-8" />
        </div>
        <div>
          <h4 className={`font-bold text-lg mb-1 ${theme.text}`}>Como usar no QG Concursos?</h4>
          <p className={`text-sm leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-stone-600'}`}>
            Não tentes assistir a tudo. Copia o nome exato de cada <strong className="font-semibold">"Passo"</strong> abaixo e cola na barra de pesquisa da plataforma.
            Assiste <strong className="font-semibold">apenas à teoria (velocidade 1.5x)</strong> e vai direto para a resolução de questões.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {topics.map((group, idx) => {
          const groupCheckedCount = group.items.filter((item) => checkedItems.includes(item)).length;
          const groupProgress = group.items.length > 0 ? Math.round((groupCheckedCount / group.items.length) * 100) : 0;

          return (
            <div key={group.area} className={`p-6 rounded-2xl border ${darkMode ? 'bg-zinc-800/40 border-zinc-700' : 'bg-white/40 border-stone-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-semibold ${darkMode ? 'text-zinc-100' : 'text-stone-800'}`}>{group.area}</h4>
                <span className={`text-sm font-bold ${theme.text}`}>{groupProgress}%</span>
              </div>
              <div className="mb-4">
                <div className={`h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-zinc-700' : 'bg-stone-200/50'}`}>
                  <div className={`h-full transition-all duration-300 ${theme.bg}`} style={{ width: `${groupProgress}%` }}></div>
                </div>
              </div>
              <div className="space-y-3">
                {group.items.map((item) => {
                  const isChecked = checkedItems.includes(item);
                  return (
                    <div key={item} className="flex items-center justify-between group/item">
                      <label className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => toggleCheck(item)}>
                        <div className={`w-5 h-5 rounded-[6px] border-2 transition-colors flex items-center justify-center ${
                          isChecked
                            ? `${theme.bg} border-transparent`
                            : darkMode
                              ? 'border-zinc-600 bg-zinc-800 hover:border-zinc-400'
                              : 'border-stone-300 bg-white hover:border-stone-400'
                        }`}>
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                        </div>
                        <span className={`text-sm font-medium transition-colors ${
                          isChecked
                            ? darkMode ? 'text-zinc-600 line-through' : 'text-stone-400 line-through'
                            : darkMode ? 'text-zinc-300 hover:text-zinc-100' : 'text-stone-700 hover:text-stone-900'
                        }`}>
                          {item}
                        </span>
                      </label>
                      <button onClick={() => removeItem(idx, item)} className={`opacity-0 group-hover/item:opacity-100 transition-all p-1 ${darkMode ? 'text-zinc-600 hover:text-red-400' : 'text-stone-300 hover:text-red-500'}`}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className={`mt-4 pt-3 border-t ${darkMode ? 'border-zinc-700' : 'border-stone-100'}`}>
                {newItemText.areaIdx === idx ? (
                  <div className="flex gap-2">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Ex: Passo X: Assunto..."
                      className={`w-full border rounded-lg text-sm py-1.5 px-3 focus:outline-none transition-colors ${theme.borderFocus} ${
                        darkMode ? 'bg-zinc-800 border-zinc-600 text-zinc-200 placeholder-zinc-600' : 'bg-white/60 border-stone-200 text-stone-800'
                      }`}
                      value={newItemText.text}
                      onChange={(event) => setNewItemText({ areaIdx: idx, text: event.target.value })}
                      onKeyDown={(event) => event.key === 'Enter' && addItem(idx)}
                    />
                    <button onClick={() => addItem(idx)} className={`px-3 rounded-lg text-white font-medium text-xs ${theme.bg}`}>Add</button>
                  </div>
                ) : (
                  <button onClick={() => setNewItemText({ areaIdx: idx, text: '' })} className={`text-xs font-bold flex items-center gap-1 ${theme.textLight} transition-colors`}>
                    <Plus className="w-4 h-4" /> Adicionar Tópico
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
