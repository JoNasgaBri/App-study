import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { storage } from '../../shared/lib/storage';
import { sanitizeText } from '../../shared/lib/validation';

const ERRORS_KEY = 'errors';

export function ErrorTrackerView({ theme, darkMode }) {
  const [errors, setErrors] = useState(() =>
    storage.get(ERRORS_KEY, [], (value, fallback) => (Array.isArray(value) ? value : fallback)),
  );
  const [newError, setNewError] = useState({ subject: 'Matemática', topic: '', type: 'calculo' });

  const addError = (event) => {
    event.preventDefault();

    const topic = sanitizeText(newError.topic, 120);
    if (!topic) {
      return;
    }

    const errorData = {
      ...newError,
      topic,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('pt-PT'),
      timestamp: Date.now(),
    };

    const updatedErrors = [errorData, ...errors];
    setErrors(updatedErrors);
    storage.set(ERRORS_KEY, updatedErrors);
    setNewError({ ...newError, topic: '' });
  };

  const deleteError = (id) => {
    const updatedErrors = errors.filter((errorItem) => errorItem.id !== id);
    setErrors(updatedErrors);
    storage.set(ERRORS_KEY, updatedErrors);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-light tracking-tight mb-8">Registo de Erros</h2>
      <form onSubmit={addError} className="flex flex-col md:flex-row gap-4 mb-12 items-end">
        <div className="w-full md:w-1/4">
          <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>Disciplina</label>
          <select className={`w-full bg-transparent border-b py-2 focus:outline-none transition-colors ${theme.borderFocus} ${darkMode ? 'border-zinc-600 text-zinc-200' : 'border-stone-200 text-stone-800'}`} value={newError.subject} onChange={(event) => setNewError({ ...newError, subject: event.target.value })}>
            <option>Matemática</option><option>Física</option><option>Química</option><option>Biologia</option><option>Humanas</option><option>Linguagens</option>
          </select>
        </div>
        <div className="w-full md:w-2/4">
          <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>Tópico Específico</label>
          <input type="text" placeholder="Ex: Análise Combinatória" className={`w-full bg-transparent border-b py-2 placeholder-stone-400 focus:outline-none transition-colors ${theme.borderFocus} ${darkMode ? 'border-zinc-600 text-zinc-200 placeholder-zinc-600' : 'border-stone-200 text-stone-800'}`} value={newError.topic} onChange={(event) => setNewError({ ...newError, topic: event.target.value })} />
        </div>
        <div className="w-full md:w-1/4">
          <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>Motivo</label>
          <select className={`w-full bg-transparent border-b py-2 focus:outline-none transition-colors ${theme.borderFocus} ${darkMode ? 'border-zinc-600 text-zinc-200' : 'border-stone-200 text-stone-800'}`} value={newError.type} onChange={(event) => setNewError({ ...newError, type: event.target.value })}>
            <option value="base">Teoria</option><option value="interpretacao">Interpretação</option><option value="calculo">Cálculo/Atenção</option>
          </select>
        </div>
        <button type="submit" className={`p-2.5 rounded-xl text-white transition-colors flex-shrink-0 mb-1 ${theme.accent}`}><Plus strokeWidth={2} className="w-5 h-5" /></button>
      </form>
      <div className="space-y-2">
        {errors.length === 0 ? (
          <p className={`text-sm italic ${darkMode ? 'text-zinc-500' : 'text-stone-500'}`}>Histórico limpo. Foco no simulado!</p>
        ) : (
          errors.map((errorItem) => (
            <div key={errorItem.id} className={`group flex flex-col md:flex-row md:items-center justify-between py-4 border-b transition-colors px-3 rounded-xl -mx-3 ${
              darkMode ? 'border-zinc-800 hover:bg-zinc-800/50' : 'border-stone-200 hover:bg-stone-50/50'
            }`}>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className={`text-xs font-medium ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>{errorItem.date}</span>
                  <span className={`text-xs font-semibold uppercase tracking-wider ${theme.textLight}`}>{errorItem.subject}</span>
                </div>
                <p className={`font-medium ${darkMode ? 'text-zinc-200' : 'text-stone-800'}`}>{errorItem.topic}</p>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-6 mt-2 md:mt-0">
                <span className={`text-sm capitalize ${darkMode ? 'text-zinc-500' : 'text-stone-500'}`}>{errorItem.type === 'base' ? 'Falta de Base' : errorItem.type}</span>
                <button onClick={() => deleteError(errorItem.id)} className={`opacity-0 group-hover:opacity-100 transition-all p-1 ${darkMode ? 'text-zinc-600 hover:text-red-400' : 'text-stone-300 hover:text-red-500'}`}><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
