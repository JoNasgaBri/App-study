import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const SIZE_MAP = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

/**
 * Modern 2026-pattern modal dialog.
 *
 * Features:
 *  - Backdrop click to close
 *  - Escape key to close
 *  - Smooth fade + scale animation
 *  - Full dark-mode support
 *  - Focus management (auto-focus first focusable child)
 *
 * Usage:
 *   <Modal open={open} onClose={() => setOpen(false)} title="Meu Título" darkMode={darkMode}>
 *     {children}
 *   </Modal>
 */
export function Modal({ open, onClose, title, children, darkMode, size = 'md', hideHeader = false }) {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const handle = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [open, onClose]);

  // Lock scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const sizeClass = SIZE_MAP[size] ?? SIZE_MAP.md;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`
          relative w-full ${sizeClass} rounded-2xl shadow-2xl
          animate-in fade-in zoom-in-95 duration-200
          ${darkMode
            ? 'bg-zinc-900 border border-zinc-800 text-zinc-100'
            : 'bg-white border border-stone-100 text-stone-900'}
        `}
      >
        {/* ── Header ── */}
        {!hideHeader && (
          <div className={`flex items-center justify-between px-6 py-4 border-b ${darkMode ? 'border-zinc-800' : 'border-stone-100'}`}>
            <h3 className={`text-sm font-semibold uppercase tracking-widest ${darkMode ? 'text-zinc-300' : 'text-stone-600'}`}>
              {title}
            </h3>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300' : 'hover:bg-stone-100 text-stone-400 hover:text-stone-700'}`}
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── Body ── */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
