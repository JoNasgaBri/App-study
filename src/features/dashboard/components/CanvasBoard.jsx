import { useState } from 'react';
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CanvasCard } from './CanvasCard';

/**
 * Masonry-style sortable canvas grid.
 */
export function CanvasBoard({ cards, onUpdate, onRemove, onReorder, theme }) {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (over && active.id !== over.id) {
      onReorder(active.id, over.id);
    }
  };

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-stone-300 text-sm font-medium">Nenhum bloco ainda.</p>
        <p className="text-stone-300 text-xs mt-1">Use o botão acima para criar seu primeiro card.</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={cards.map((c) => c.id)} strategy={rectSortingStrategy}>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {cards.map((card) => (
            <div key={card.id} className="break-inside-avoid">
              <CanvasCard
                card={card}
                onUpdate={onUpdate}
                onRemove={onRemove}
                theme={theme}
                isDragging={activeId === card.id}
              />
            </div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
