import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { CARD_LABELS } from '../constants';
import { TextCard } from './cards/TextCard';
import { ChecklistCard } from './cards/ChecklistCard';
import { LinkCard } from './cards/LinkCard';

function CardInner({ card, onUpdate, theme }) {
  if (card.type === 'text') return <TextCard card={card} onUpdate={onUpdate} />;
  if (card.type === 'checklist') return <ChecklistCard card={card} onUpdate={onUpdate} theme={theme} />;
  if (card.type === 'link') return <LinkCard card={card} onUpdate={onUpdate} />;
  return null;
}

/**
 * Sortable card shell — drag handle, type badge, delete action, content.
 */
export function CanvasCard({ card, onUpdate, onRemove, theme }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative bg-white border border-stone-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-stone-200 transition-all duration-200 select-none"
    >
      {/* Header row: grip + badge + delete */}
      <div className="flex items-center gap-1.5 mb-3">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="text-stone-200 hover:text-stone-400 transition-colors cursor-grab active:cursor-grabbing touch-none"
          aria-label="Arrastar card"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Type badge */}
        <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-300 select-none">
          {CARD_LABELS[card.type] ?? card.type}
        </span>

        {/* Delete */}
        <button
          onClick={() => onRemove(card.id)}
          className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-stone-200 hover:text-rose-400"
          aria-label="Remover card"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Card body — not draggable */}
      <div onPointerDown={(e) => e.stopPropagation()}>
        <CardInner card={card} onUpdate={(patch) => onUpdate(card.id, patch)} theme={theme} />
      </div>
    </div>
  );
}
