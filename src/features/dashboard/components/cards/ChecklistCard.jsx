import { useState } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';

const buildItem = (text = '') => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  text,
  done: false,
});

/**
 * Inner content for a "checklist" card.
 */
export function ChecklistCard({ card, onUpdate, theme }) {
  const [draft, setDraft] = useState('');

  const items = card.items ?? [];
  const done = items.filter((i) => i.done).length;

  const setItems = (next) => onUpdate({ items: next });

  const toggleItem = (id) =>
    setItems(items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));

  const removeItem = (id) => setItems(items.filter((i) => i.id !== id));

  const addItem = () => {
    const text = draft.trim();
    if (!text) return;
    setItems([...items, buildItem(text)]);
    setDraft('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 mb-1">
        <input
          value={card.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Título da lista..."
          className="flex-1 bg-transparent text-sm font-semibold placeholder-stone-300 focus:outline-none text-stone-700 border-b border-transparent focus:border-stone-300 pb-0.5 transition-colors"
        />
        {items.length > 0 && (
          <span className="text-xs text-stone-400 tabular-nums whitespace-nowrap">
            {done}/{items.length}
          </span>
        )}
      </div>

      {/* Progress bar */}
      {items.length > 0 && (
        <div className="h-0.5 bg-stone-100 rounded-full overflow-hidden mb-1">
          <div
            className={`h-full ${theme.bg} transition-all duration-500`}
            style={{ width: `${items.length ? (done / items.length) * 100 : 0}%` }}
          />
        </div>
      )}

      <ul className="space-y-1 max-h-44 overflow-y-auto">
        {items.map((item) => (
          <li key={item.id} className="group flex items-start gap-2">
            <button
              onClick={() => toggleItem(item.id)}
              className={`mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-all ${
                item.done ? `${theme.bg} border-transparent` : 'border-stone-300 hover:border-stone-400'
              }`}
            >
              {item.done && <Check className="w-2.5 h-2.5 text-white" />}
            </button>
            <span
              className={`flex-1 text-sm leading-5 break-words ${
                item.done ? 'line-through text-stone-400' : 'text-stone-700'
              }`}
            >
              {item.text}
            </span>
            <button
              onClick={() => removeItem(item.id)}
              className="opacity-0 group-hover:opacity-100 mt-0.5 transition-opacity text-stone-300 hover:text-rose-400"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </li>
        ))}
      </ul>

      {/* New item input */}
      <div className="flex items-center gap-1.5 mt-1 border-t border-stone-100 pt-2">
        <Plus className="w-3.5 h-3.5 text-stone-300 shrink-0" />
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Adicionar item..."
          className="flex-1 text-sm bg-transparent placeholder-stone-300 focus:outline-none text-stone-600"
        />
        {draft.trim() && (
          <button
            onClick={addItem}
            className="text-xs text-stone-400 hover:text-stone-700 transition-colors"
          >
            Add
          </button>
        )}
      </div>
    </div>
  );
}
