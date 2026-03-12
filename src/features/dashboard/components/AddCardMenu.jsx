import { useRef, useState } from 'react';
import { FileText, Link, ListChecks, Plus } from 'lucide-react';
import { useOnClickOutside } from '../../../shared/lib/useOnClickOutside';
import { CARD_TYPES } from '../constants';

const MENU_ITEMS = [
  { type: CARD_TYPES.TEXT, icon: FileText, label: 'Nota de texto' },
  { type: CARD_TYPES.CHECKLIST, icon: ListChecks, label: 'Checklist' },
  { type: CARD_TYPES.LINK, icon: Link, label: 'Link' },
];

/**
 * Floating "+" button that expands to a mini-menu of card types.
 */
export function AddCardMenu({ onAdd, theme }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useOnClickOutside(ref, () => setOpen(false));

  const handleAdd = (type) => {
    onAdd(type);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-white transition-all ${theme.accent} shadow-sm`}
      >
        <Plus className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-45' : ''}`} />
        <span>Novo bloco</span>
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 bg-white border border-stone-100 rounded-2xl shadow-xl overflow-hidden z-30 min-w-[160px]">
          {MENU_ITEMS.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => handleAdd(type)}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 transition-colors text-left"
            >
              <Icon className="w-4 h-4 text-stone-400" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
