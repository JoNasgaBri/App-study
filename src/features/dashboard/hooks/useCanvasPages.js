import { useCallback, useState } from 'react';
import { storage } from '../../../shared/lib/storage';
import {
  PAGES_STORAGE_KEY,
  CANVAS_STORAGE_KEY,
  buildWidget,
  buildLayoutItem,
  buildDefaultPage,
} from '../constants';

/* ─── Migration helper ────────────────────────────────────────────────────── */
function migrateFromLegacy() {
  const legacy = storage.get(CANVAS_STORAGE_KEY, null, (v) =>
    Array.isArray(v) && v.length > 0 ? v : null,
  );
  if (!legacy) return null;

  // Convert old cards into new page shape
  const widgets = legacy.map((card) => ({
    ...card,
    id: card.id || `w-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  }));
  const layout = widgets.map((w, i) => ({
    i: w.id,
    x: (i % 3) * 4,
    y: Math.floor(i / 3) * 3,
    w: 4,
    h: 3,
    minW: 2,
    minH: 2,
  }));

  const pages = {
    activePage: 'principal',
    order: ['principal'],
    pages: {
      principal: { name: 'Principal', widgets, layout },
    },
  };

  storage.set(PAGES_STORAGE_KEY, pages);
  storage.remove(CANVAS_STORAGE_KEY);
  return pages;
}

/* ─── Loader ──────────────────────────────────────────────────────────────── */
function loadPages() {
  const saved = storage.get(PAGES_STORAGE_KEY, null, (v) =>
    v && typeof v === 'object' && v.pages ? v : null,
  );
  if (saved) return saved;

  // Try legacy migration
  const migrated = migrateFromLegacy();
  if (migrated) return migrated;

  // Fresh start
  const fresh = {
    activePage: 'principal',
    order: ['principal'],
    pages: { principal: buildDefaultPage() },
  };
  storage.set(PAGES_STORAGE_KEY, fresh);
  return fresh;
}

const persist = (data) => storage.set(PAGES_STORAGE_KEY, data);

/* ─── Hook ────────────────────────────────────────────────────────────────── */
export function useCanvasPages() {
  const [state, setState] = useState(loadPages);

  const mutate = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      persist(next);
      return next;
    });
  }, []);

  /* ── Page operations ─────────────────────────────────── */
  const setActivePage = useCallback(
    (pageId) => mutate((s) => ({ ...s, activePage: pageId })),
    [mutate],
  );

  const addPage = useCallback(
    (name) => {
      const id = `page-${Date.now()}`;
      mutate((s) => ({
        ...s,
        activePage: id,
        order: [...s.order, id],
        pages: { ...s.pages, [id]: { ...buildDefaultPage(), name } },
      }));
      return id;
    },
    [mutate],
  );

  const renamePage = useCallback(
    (pageId, name) =>
      mutate((s) => ({
        ...s,
        pages: {
          ...s.pages,
          [pageId]: { ...s.pages[pageId], name },
        },
      })),
    [mutate],
  );

  const removePage = useCallback(
    (pageId) =>
      mutate((s) => {
        const newOrder = s.order.filter((id) => id !== pageId);
        if (newOrder.length === 0) return s; // can't delete last page
        const newPages = { ...s.pages };
        delete newPages[pageId];
        return {
          ...s,
          activePage: s.activePage === pageId ? newOrder[0] : s.activePage,
          order: newOrder,
          pages: newPages,
        };
      }),
    [mutate],
  );

  /* ── Widget operations ───────────────────────────────── */
  const addWidget = useCallback(
    (type) => {
      const widget = buildWidget(type);
      const layoutItem = buildLayoutItem(widget.id, type);
      mutate((s) => {
        const page = s.pages[s.activePage];
        return {
          ...s,
          pages: {
            ...s.pages,
            [s.activePage]: {
              ...page,
              widgets: [...page.widgets, widget],
              layout: [...page.layout, layoutItem],
            },
          },
        };
      });
    },
    [mutate],
  );

  const removeWidget = useCallback(
    (widgetId) =>
      mutate((s) => {
        const page = s.pages[s.activePage];
        return {
          ...s,
          pages: {
            ...s.pages,
            [s.activePage]: {
              ...page,
              widgets: page.widgets.filter((w) => w.id !== widgetId),
              layout: page.layout.filter((l) => l.i !== widgetId),
            },
          },
        };
      }),
    [mutate],
  );

  const updateWidget = useCallback(
    (widgetId, patch) =>
      mutate((s) => {
        const page = s.pages[s.activePage];
        return {
          ...s,
          pages: {
            ...s.pages,
            [s.activePage]: {
              ...page,
              widgets: page.widgets.map((w) =>
                w.id === widgetId ? { ...w, ...patch } : w,
              ),
            },
          },
        };
      }),
    [mutate],
  );

  const updateLayout = useCallback(
    (newLayout) =>
      mutate((s) => {
        const page = s.pages[s.activePage];
        return {
          ...s,
          pages: {
            ...s.pages,
            [s.activePage]: { ...page, layout: newLayout },
          },
        };
      }),
    [mutate],
  );

  /* ── Derived ─────────────────────────────────────────── */
  const activePage = state.pages[state.activePage] || buildDefaultPage();
  const pageList = state.order.map((id) => ({
    id,
    name: state.pages[id]?.name || id,
  }));

  return {
    activePageId: state.activePage,
    activePage,
    pageList,
    setActivePage,
    addPage,
    renamePage,
    removePage,
    addWidget,
    removeWidget,
    updateWidget,
    updateLayout,
  };
}
