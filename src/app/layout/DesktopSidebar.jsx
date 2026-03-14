import { useState } from 'react';
import { Brain, Moon, PanelLeftClose, PanelLeftOpen, Sun } from 'lucide-react';
import { NAV_ITEMS } from '../../shared/constants/navigation';
import { SidebarCustomizationPanel } from './SidebarCustomizationPanel';

export function DesktopSidebar({
  daysLeft,
  theme,
  themeKey,
  videoId,
  darkMode,
  glassStyle,
  activeTab,
  onTabChange,
  onSavePreferences,
  onToggleDarkMode,
  sidebarCollapsed,
  onToggleCollapsed,
  accentGradient,
  onSaveAccentGradient,
  customAccent,
  onSaveCustomAccent,
  shadowLevel,
  onSaveShadowLevel,
  accentStyle,
}) {
  const [hovering, setHovering] = useState(false);
  const isExpanded = !sidebarCollapsed || hovering;

  return (
    <aside
      className={`hidden md:flex flex-col border-r z-20 overflow-hidden transition-[width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${glassStyle} ${isExpanded ? 'w-64' : 'w-14'}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* ── Header ── */}
      <div className={`flex items-center gap-3 border-b transition-all duration-200 ${darkMode ? 'border-zinc-800' : 'border-stone-100/60'} ${isExpanded ? 'px-5 py-4' : 'py-4 justify-center'}`}>
        <button
          onClick={onToggleCollapsed}
          title={sidebarCollapsed ? 'Fixar barra lateral' : 'Retrair barra lateral'}
          className="flex-shrink-0 group"
        >
          <Brain className={`w-6 h-6 transition-opacity group-hover:opacity-60 ${theme.text}`} strokeWidth={1.5} />
        </button>

        <div className={`flex-1 min-w-0 flex items-center justify-between transition-[opacity,max-width] duration-200 ${isExpanded ? 'opacity-100' : 'max-w-0 opacity-0 pointer-events-none'}`}>
          <div className="overflow-hidden">
            <h1 className={`text-sm font-bold tracking-tight whitespace-nowrap ${darkMode ? 'text-zinc-100' : 'text-stone-800'}`}>Estatística UFU</h1>
            <p className={`text-[10px] font-semibold uppercase tracking-widest ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>{daysLeft} dias</p>
          </div>
          <button
            onClick={onToggleCollapsed}
            title={sidebarCollapsed ? 'Fixar' : 'Retrair'}
            className={`ml-2 flex-shrink-0 p-1 rounded-lg transition-colors ${darkMode ? 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800' : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'}`}
          >
            {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className={`flex-1 overflow-y-auto scrollbar-hide py-3 space-y-0.5 ${isExpanded ? 'px-3' : 'px-2'}`}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={!isExpanded ? item.label : undefined}
              className={`w-full flex items-center rounded-xl text-sm font-medium transition-all duration-200 ${isExpanded ? 'gap-3 px-4 py-2.5' : 'justify-center py-3'} ${
                isActive
                  ? `${theme.bgLight} ${theme.text} shadow-sm border ${darkMode ? 'border-zinc-700' : 'border-white/50'}`
                  : `${darkMode ? 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200' : 'text-stone-600 hover:bg-white/50 hover:text-stone-900'}`
              }`}
              style={isActive && accentStyle ? { ...accentStyle, color: 'white', border: 'none' } : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
              <span className={`flex-1 text-left whitespace-nowrap overflow-hidden transition-[opacity,max-width] duration-200 ${isExpanded ? 'opacity-100' : 'max-w-0 opacity-0'}`}>
                {item.label}
              </span>
              <span className={`text-[10px] font-mono flex-shrink-0 transition-[opacity,max-width] duration-200 ${darkMode ? 'text-zinc-600' : 'text-stone-300'} ${isExpanded ? 'opacity-100' : 'max-w-0 opacity-0'}`}>
                {item.key}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ── Footer ── */}
      <div className={`border-t ${darkMode ? 'border-zinc-800 bg-zinc-900/50' : 'border-stone-200/50 bg-white/30'} ${isExpanded ? 'p-5 space-y-5' : 'py-4 px-2'}`}>

        {/* Collapsed: only dark-mode icon */}
        {!isExpanded && (
          <button
            onClick={onToggleDarkMode}
            title={darkMode ? 'Modo Claro (D)' : 'Modo Escuro (D)'}
            className={`w-full flex justify-center p-2 rounded-lg transition-colors ${darkMode ? 'text-zinc-400 hover:bg-zinc-800' : 'text-stone-500 hover:bg-stone-100'}`}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        )}

        {/* Expanded: full customisation panel */}
        {isExpanded && (
          <SidebarCustomizationPanel
            darkMode={darkMode}
            theme={theme}
            themeKey={themeKey}
            videoId={videoId}
            onSavePreferences={onSavePreferences}
            accentGradient={accentGradient}
            onSaveAccentGradient={onSaveAccentGradient}
            customAccent={customAccent}
            onSaveCustomAccent={onSaveCustomAccent}
            shadowLevel={shadowLevel}
            onSaveShadowLevel={onSaveShadowLevel}
            onToggleDarkMode={onToggleDarkMode}
          />
        )}
      </div>
    </aside>
  );
}
