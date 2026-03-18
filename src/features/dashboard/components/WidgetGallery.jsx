import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { WIDGET_TYPES, WIDGET_REGISTRY } from '../constants';

const SYSTEM_TYPES = Object.values(WIDGET_TYPES).filter(
  (t) => WIDGET_REGISTRY[t]?.category === 'sistema',
);
const CUSTOM_TYPES = Object.values(WIDGET_TYPES).filter(
  (t) => WIDGET_REGISTRY[t]?.category === 'custom',
);

/**
 * Dropdown gallery to browse and add widgets to the active canvas page.
 */
export function WidgetGallery({ onAdd, theme, darkMode }) {
  const [open, setOpen] = useState(false);

  const handleAdd = (type) => {
    onAdd(type);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
          open
            ? `${theme.accent} text-white`
            : darkMode
              ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
              : 'bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700'
        }`}
      >
        <Plus className="w-3.5 h-3.5" />
        Adicionar Widget
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />

          {/* Panel */}
          <div
            className={`absolute right-0 top-full mt-2 z-40 w-80 max-h-[70vh] overflow-y-auto rounded-2xl border shadow-xl animate-popover-up ${
              darkMode
                ? 'bg-zinc-900 border-zinc-700'
                : 'bg-white border-stone-200'
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-4 py-3 border-b ${darkMode ? 'border-zinc-800' : 'border-stone-100'}`}>
              <span className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-zinc-400' : 'text-stone-500'}`}>
                Galeria de Widgets
              </span>
              <button onClick={() => setOpen(false)} className={`p-1 rounded-lg ${darkMode ? 'hover:bg-zinc-800 text-zinc-500' : 'hover:bg-stone-100 text-stone-400'}`}>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* System widgets */}
            <div className="px-3 py-2">
              <p className={`text-[10px] font-bold uppercase tracking-widest px-1 mb-2 ${darkMode ? 'text-zinc-600' : 'text-stone-300'}`}>
                Sistema
              </p>
              <div className="space-y-1">
                {SYSTEM_TYPES.map((type) => {
                  const reg = WIDGET_REGISTRY[type];
                  const Icon = reg.icon;
                  return (
                    <button
                      key={type}
                      onClick={() => handleAdd(type)}
                      className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-all group ${
                        darkMode
                          ? 'hover:bg-zinc-800'
                          : 'hover:bg-stone-50'
                      }`}
                    >
                      <div className={`mt-0.5 p-1.5 rounded-lg ${theme.bgLight} transition-transform group-hover:scale-110`}>
                        <Icon className={`w-4 h-4 ${theme.text}`} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${darkMode ? 'text-zinc-200' : 'text-stone-700'}`}>
                          {reg.label}
                        </p>
                        <p className={`text-xs mt-0.5 ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>
                          {reg.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom widgets */}
            <div className={`px-3 py-2 border-t ${darkMode ? 'border-zinc-800' : 'border-stone-100'}`}>
              <p className={`text-[10px] font-bold uppercase tracking-widest px-1 mb-2 ${darkMode ? 'text-zinc-600' : 'text-stone-300'}`}>
                Custom
              </p>
              <div className="space-y-1">
                {CUSTOM_TYPES.map((type) => {
                  const reg = WIDGET_REGISTRY[type];
                  const Icon = reg.icon;
                  return (
                    <button
                      key={type}
                      onClick={() => handleAdd(type)}
                      className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-all group ${
                        darkMode
                          ? 'hover:bg-zinc-800'
                          : 'hover:bg-stone-50'
                      }`}
                    >
                      <div className={`mt-0.5 p-1.5 rounded-lg ${theme.bgLight} transition-transform group-hover:scale-110`}>
                        <Icon className={`w-4 h-4 ${theme.text}`} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${darkMode ? 'text-zinc-200' : 'text-stone-700'}`}>
                          {reg.label}
                        </p>
                        <p className={`text-xs mt-0.5 ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>
                          {reg.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
