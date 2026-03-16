import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { SidebarCustomizationPanel } from './SidebarCustomizationPanel';

/**
 * Popover flutuante de aparência.
 * Fecha ao clicar fora — exceto no botão que o abre (triggerRef).
 */
export function ColorPopover({
  open,
  onClose,
  triggerRef,
  darkMode,
  theme,
  themeKey,
  videoId,
  onSavePreferences,
  accentGradient,
  onSaveAccentGradient,
  customAccent,
  onSaveCustomAccent,
  shadowLevel,
  onSaveShadowLevel,
  onToggleDarkMode,
}) {
  const popoverRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handler = (e) => {
      const clickedInsidePopover  = popoverRef.current?.contains(e.target);
      const clickedOnTrigger      = triggerRef?.current?.contains(e.target);
      if (!clickedInsidePopover && !clickedOnTrigger) {
        onClose();
      }
    };

    // Slight delay to avoid immediate close from the opening click
    const id = setTimeout(() => document.addEventListener('pointerdown', handler), 50);
    return () => {
      clearTimeout(id);
      document.removeEventListener('pointerdown', handler);
    };
  }, [open, onClose, triggerRef]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={popoverRef}
      className={`
        fixed bottom-[4.5rem] left-4 z-50 w-72 rounded-2xl border shadow-2xl
        animate-popover-up overflow-hidden
        ${darkMode
          ? 'bg-zinc-900/95 border-zinc-700/50 text-zinc-100'
          : 'bg-white/97 border-stone-200/70 text-stone-900'
        }
        backdrop-blur-2xl
      `}
      style={{ maxHeight: 'calc(100vh - 6rem)' }}
    >
      {/* Header fixo */}
      <div
        className={`flex items-center justify-between px-5 pt-4 pb-3 border-b sticky top-0 z-10 backdrop-blur-2xl
          ${darkMode ? 'bg-zinc-900/95 border-zinc-800' : 'bg-white/97 border-stone-100'}`}
      >
        <h3 className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-zinc-400' : 'text-stone-400'}`}>
          Aparência
        </h3>
        <button
          onClick={onClose}
          className={`p-1 rounded-lg transition-colors ${darkMode ? 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300' : 'text-stone-400 hover:bg-stone-100 hover:text-stone-600'}`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Conteúdo com scroll */}
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 9rem)' }}>
        <div className="p-5 space-y-5">
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
        </div>
      </div>
    </div>
  );
}
