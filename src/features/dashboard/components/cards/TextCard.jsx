import { useState } from 'react';

/**
 * Inner content for a "text note" card.
 * Renders a title + body, both editable inline.
 */
export function TextCard({ card, onUpdate }) {
  const [editingTitle, setEditingTitle] = useState(!card.title);

  return (
    <div className="flex flex-col gap-2 min-h-[5rem]">
      <input
        value={card.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
        onFocus={() => setEditingTitle(true)}
        onBlur={() => setEditingTitle(false)}
        placeholder="Título..."
        className={`w-full bg-transparent text-sm font-semibold placeholder-stone-300 focus:outline-none border-b transition-colors ${
          editingTitle ? 'border-stone-300' : 'border-transparent'
        } text-stone-700 pb-0.5`}
      />
      <textarea
        value={card.body}
        onChange={(e) => onUpdate({ body: e.target.value })}
        placeholder="Escreva aqui..."
        rows={3}
        className="w-full bg-transparent text-sm text-stone-600 placeholder-stone-300 focus:outline-none resize-none leading-relaxed"
      />
    </div>
  );
}
