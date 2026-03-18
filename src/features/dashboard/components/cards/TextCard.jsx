import { useState } from 'react';

/**
 * Inner content for a "text note" widget.
 */
export function TextCard({ card, onUpdate, darkMode }) {
  const [editingTitle, setEditingTitle] = useState(!card.title);

  return (
    <div className="flex flex-col gap-2 min-h-[3rem]">
      <input
        value={card.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
        onFocus={() => setEditingTitle(true)}
        onBlur={() => setEditingTitle(false)}
        placeholder="Título..."
        className={`w-full bg-transparent text-sm font-semibold focus:outline-none border-b transition-colors pb-0.5 ${
          editingTitle
            ? darkMode ? 'border-zinc-600' : 'border-stone-300'
            : 'border-transparent'
        } ${darkMode ? 'text-zinc-200 placeholder-zinc-600' : 'text-stone-700 placeholder-stone-300'}`}
      />
      <textarea
        value={card.body}
        onChange={(e) => onUpdate({ body: e.target.value })}
        placeholder="Escreva aqui..."
        rows={3}
        className={`w-full bg-transparent text-sm focus:outline-none resize-none leading-relaxed ${
          darkMode ? 'text-zinc-300 placeholder-zinc-600' : 'text-stone-600 placeholder-stone-300'
        }`}
      />
    </div>
  );
}
