import { useCallback, useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { storage } from '../../../shared/lib/storage';
import { CANVAS_STORAGE_KEY } from '../constants';

const loadCards = () =>
  storage.get(CANVAS_STORAGE_KEY, [], (v, fallback) => (Array.isArray(v) ? v : fallback));

const persist = (cards) => storage.set(CANVAS_STORAGE_KEY, cards);

export function useCanvas() {
  const [cards, setCards] = useState(loadCards);

  const mutate = useCallback((updater) => {
    setCards((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      persist(next);
      return next;
    });
  }, []);

  /** Add a pre-built card skeleton */
  const addCard = useCallback(
    (card) => mutate((prev) => [card, ...prev]),
    [mutate],
  );

  /** Update any field(s) on a single card by id */
  const updateCard = useCallback(
    (id, patch) =>
      mutate((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      ),
    [mutate],
  );

  /** Remove a card by id */
  const removeCard = useCallback(
    (id) => mutate((prev) => prev.filter((c) => c.id !== id)),
    [mutate],
  );

  /** Reorder after a successful drag */
  const reorderCards = useCallback(
    (activeId, overId) => {
      setCards((prev) => {
        const from = prev.findIndex((c) => c.id === activeId);
        const to = prev.findIndex((c) => c.id === overId);
        if (from === -1 || to === -1 || from === to) return prev;
        const next = arrayMove(prev, from, to);
        persist(next);
        return next;
      });
    },
    [],
  );

  return { cards, addCard, updateCard, removeCard, reorderCards };
}
