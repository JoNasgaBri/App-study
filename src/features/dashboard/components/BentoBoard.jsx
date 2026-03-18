import { useRef, useState, useEffect } from 'react';
import { Responsive } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { WidgetCard } from './WidgetCard';

const BREAKPOINTS = { lg: 1200, md: 900, sm: 600, xs: 0 };
const COLS = { lg: 12, md: 8, sm: 4, xs: 2 };

/**
 * Bento Grid board powered by react-grid-layout v2.
 * Manually measures container width since WidthProvider was removed in v2.
 */
export function BentoBoard({
  widgets,
  layout,
  onLayoutChange,
  onRemoveWidget,
  onUpdateWidget,
  onTabChange,
  theme,
  darkMode,
}) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (widgets.length === 0) {
    return (
      <div ref={containerRef} className="flex flex-col items-center justify-center py-24 text-center">
        <p className={`text-5xl mb-4 ${darkMode ? 'opacity-30' : 'opacity-20'}`}>📦</p>
        <p className={`text-sm font-medium ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>
          Nenhum widget ainda.
        </p>
        <p className={`text-xs mt-1 ${darkMode ? 'text-zinc-600' : 'text-stone-300'}`}>
          Use o botão &quot;Adicionar Widget&quot; para construir seu painel.
        </p>
      </div>
    );
  }

  const layouts = { lg: layout, md: layout, sm: layout, xs: layout };

  return (
    <div ref={containerRef}>
      <Responsive
        className="widget-grid"
        layouts={layouts}
        breakpoints={BREAKPOINTS}
        cols={COLS}
        rowHeight={60}
        width={width}
        margin={[12, 12]}
        containerPadding={[0, 0]}
        isDraggable
        isResizable
        draggableHandle=".widget-drag-handle"
        onLayoutChange={(currentLayout) => onLayoutChange(currentLayout)}
        useCSSTransforms
      >
        {widgets.map((widget) => (
          <div key={widget.id}>
            <WidgetCard
              widget={widget}
              onRemove={() => onRemoveWidget(widget.id)}
              onUpdate={(patch) => onUpdateWidget(widget.id, patch)}
              onTabChange={onTabChange}
              theme={theme}
              darkMode={darkMode}
            />
          </div>
        ))}
      </Responsive>
    </div>
  );
}
