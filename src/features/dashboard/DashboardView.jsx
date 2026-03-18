import { useCanvasPages } from './hooks/useCanvasPages';
import { PageTabs } from './components/PageTabs';
import { WidgetGallery } from './components/WidgetGallery';
import { BentoBoard } from './components/BentoBoard';

/**
 * Fully widgetized dashboard — multi-page canvas with Bento Grid layout.
 */
export function DashboardView({ theme, darkMode, onTabChange }) {
  const {
    activePageId,
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
  } = useCanvasPages();

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Header row: Page tabs + Gallery button */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <PageTabs
          pageList={pageList}
          activePageId={activePageId}
          onSelect={setActivePage}
          onAdd={addPage}
          onRename={renamePage}
          onRemove={removePage}
          theme={theme}
          darkMode={darkMode}
        />
        <WidgetGallery onAdd={addWidget} theme={theme} darkMode={darkMode} />
      </div>

      {/* Bento Grid canvas */}
      <BentoBoard
        widgets={activePage.widgets}
        layout={activePage.layout}
        onLayoutChange={updateLayout}
        onRemoveWidget={removeWidget}
        onUpdateWidget={updateWidget}
        onTabChange={onTabChange}
        theme={theme}
        darkMode={darkMode}
      />
    </div>
  );
}
