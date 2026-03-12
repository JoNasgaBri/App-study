import { useState } from 'react';
import { ShieldAlert, Trash2 } from 'lucide-react';
import { storage } from '../../shared/lib/storage';
import { sanitizeNumberInput, sanitizeText } from '../../shared/lib/validation';

const ESSAYS_KEY = 'essays';
const genres = ['Carta argumentativa', 'Artigo de opinião', 'Notícia', 'Resenha crítica', 'Relato'];

export function WritingView({ theme, darkMode }) {
  const [essays, setEssays] = useState(() =>
    storage.get(ESSAYS_KEY, [], (value, fallback) => (Array.isArray(value) ? value : fallback)),
  );
  const [newEssay, setNewEssay] = useState({ genre: 'Carta argumentativa', topic: '', selfGrade: '' });

  const addEssay = (event) => {
    event.preventDefault();

    const topic = sanitizeText(newEssay.topic, 120);
    if (!topic) {
      return;
    }

    const selfGrade = newEssay.selfGrade === '' ? '' : sanitizeNumberInput(newEssay.selfGrade, 0, 80, 0);

    const essayData = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('pt-PT'),
      timestamp: Date.now(),
      genre: newEssay.genre,
      topic,
      selfGrade,
    };

    const updatedEssays = [essayData, ...essays];
    setEssays(updatedEssays);
    storage.set(ESSAYS_KEY, updatedEssays);
    setNewEssay({ genre: 'Carta argumentativa', topic: '', selfGrade: '' });
  };

  const deleteEssay = (id) => {
    const updatedEssays = essays.filter((essay) => essay.id !== id);
    setEssays(updatedEssays);
    storage.set(ESSAYS_KEY, updatedEssays);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-light tracking-tight mb-8">Estratégia de Redação (80 Pontos)</h2>
      <div className={`rounded-2xl p-6 mb-10 border ${
        darkMode ? 'bg-red-950/20 border-red-900/40' : 'bg-red-50 border-red-100'
      }`}>
        <h3 className={`font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-red-400' : 'text-red-800'}`}><ShieldAlert className="w-5 h-5" /> Critérios de Nota ZERO (Edital Item 6.3.4)</h3>
        <ul className={`text-sm space-y-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
          <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5" /> Fuga ao tema ou género solicitado.</li>
          <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5" /> Texto com menos de 15 linhas.</li>
          <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5" /> Cópia total dos textos motivadores.</li>
          <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5" /> Assinaturas ou sinais de identificação.</li>
          <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5" /> Desrespeito aos direitos humanos.</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
<form onSubmit={addEssay} className={`lg:col-span-1 border p-6 rounded-2xl h-fit ${
            darkMode ? 'border-zinc-700 bg-zinc-800/40' : 'border-stone-200 bg-white/40'
          }`}>
            <h4 className={`font-semibold mb-4 ${darkMode ? 'text-zinc-100' : 'text-stone-800'}`}>Registar Treino</h4>
            <div className="space-y-4">
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-zinc-500' : 'text-stone-500'}`}>Género</label>
                <select className={`w-full bg-transparent border-b py-2 text-sm focus:outline-none transition-colors ${theme.borderFocus} ${darkMode ? 'border-zinc-600 text-zinc-200' : 'border-stone-200 text-stone-800'}`} value={newEssay.genre} onChange={(event) => setNewEssay({ ...newEssay, genre: event.target.value })}>{genres.map((genre) => <option key={genre} value={genre}>{genre}</option>)}</select>
              </div>
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-zinc-500' : 'text-stone-500'}`}>Tema abordado</label>
                <input type="text" placeholder="Ex: Mobilidade Urbana..." className={`w-full bg-transparent border-b py-2 text-sm focus:outline-none transition-colors ${theme.borderFocus} ${darkMode ? 'border-zinc-600 text-zinc-200 placeholder-zinc-600' : 'border-stone-200 text-stone-800'}`} value={newEssay.topic} onChange={(event) => setNewEssay({ ...newEssay, topic: event.target.value })} />
              </div>
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-zinc-500' : 'text-stone-500'}`}>Autoavaliação (0-80)</label>
                <input type="number" min="0" max="80" placeholder="Ex: 65" className={`w-full bg-transparent border-b py-2 text-sm focus:outline-none transition-colors ${theme.borderFocus} ${darkMode ? 'border-zinc-600 text-zinc-200 placeholder-zinc-600' : 'border-stone-200 text-stone-800'}`} value={newEssay.selfGrade} onChange={(event) => setNewEssay({ ...newEssay, selfGrade: event.target.value })} />
              </div>
            <button type="submit" className={`w-full mt-2 py-3 rounded-xl text-white font-medium text-sm transition-colors ${theme.accent}`}>Registar Redação</button>
          </div>
        </form>

        <div className="lg:col-span-2 space-y-3">
          <h4 className={`font-semibold mb-4 ${darkMode ? 'text-zinc-100' : 'text-stone-800'}`}>Histórico de Produção</h4>
          {essays.length === 0 ? (
            <p className={`text-sm italic ${darkMode ? 'text-zinc-500' : 'text-stone-500'}`}>Nenhuma redação registada. É crucial dominar os 5 géneros!</p>
          ) : (
            essays.map((essay) => (
              <div key={essay.id} className={`flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-xl transition-colors group ${
                darkMode ? 'border-zinc-700 bg-zinc-800/60 hover:bg-zinc-700/60' : 'border-stone-200 bg-white/60 hover:bg-stone-50/50'
              }`}>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`text-xs font-medium ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>{essay.date}</span>
                    <span className={`text-xs font-bold uppercase tracking-wider ${theme.textLight}`}>{essay.genre}</span>
                  </div>
                  <p className={`font-medium text-sm ${darkMode ? 'text-zinc-200' : 'text-stone-800'}`}>{essay.topic}</p>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-6 mt-3 md:mt-0">
                  <span className={`text-lg font-light ${darkMode ? 'text-zinc-400' : 'text-stone-600'}`}>{essay.selfGrade === '' ? '-' : `${essay.selfGrade}/80`}</span>
                  <button onClick={() => deleteEssay(essay.id)} className={`opacity-0 group-hover:opacity-100 transition-all p-1 ${darkMode ? 'text-zinc-600 hover:text-red-400' : 'text-stone-300 hover:text-red-500'}`}><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
