import { useState } from 'react';
import { Plus, X } from 'lucide-react';

/**
 * Horizontal tab bar for canvas pages — inspired by Zen Browser workspaces.
 */
export function PageTabs({
  pageList,
  activePageId,
  onSelect,
  onAdd,
  onRename,
  onRemove,
  theme,
  darkMode,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editVal, setEditVal] = useState('');

  const startRename = (page) => {
    setEditingId(page.id);
    setEditVal(page.name);
  };

  const commitRename = () => {
    if (editVal.trim() && editingId) {
      onRename(editingId, editVal.trim());
    }
    setEditingId(null);
  };

  const handleAdd = () => {
    const name = `Página ${pageList.length + 1}`;
    onAdd(name);
  };

  return (
    <div className={`flex items-center gap-1 overflow-x-auto scrollbar-hide pb-1 ${darkMode ? 'border-zinc-800' : 'border-stone-200'}`}>
      {pageList.map((page) => {
        const isActive = page.id === activePageId;
        const isEditing = editingId === page.id;
        return (
          <div
            key={page.id}
            className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer select-none whitespace-nowrap ${
              isActive
                ? `${theme.bgLight} ${theme.text} shadow-sm`
                : darkMode
                  ? 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60'
                  : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100/60'
            }`}
            onClick={() => !isEditing && onSelect(page.id)}
            onDoubleClick={() => startRename(page)}
          >
            {isEditing ? (
              <input
                value={editVal}
                onChange={(e) => setEditVal(e.target.value)}
                onBlur={commitRename}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitRename();
                  if (e.key === 'Escape') setEditingId(null);
                }}
                autoFocus
                className={`w-20 bg-transparent text-xs font-medium focus:outline-none ${
                  darkMode ? 'text-zinc-200' : 'text-stone-700'
                }`}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span>{page.name}</span>
            )}

            {/* Delete button — only visible on hover, not for last page */}
            {pageList.length > 1 && !isEditing && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(page.id);
                }}
                className={`opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded ${
                  darkMode ? 'hover:bg-zinc-700 text-zinc-500' : 'hover:bg-stone-200 text-stone-400'
                }`}
                title="Remover página"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        );
      })}

      {/* Add page button */}
      <button
        onClick={handleAdd}
        className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
          darkMode
            ? 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800/60'
            : 'text-stone-300 hover:text-stone-500 hover:bg-stone-100/60'
        }`}
        title="Nova página"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
