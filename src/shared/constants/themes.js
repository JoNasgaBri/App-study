export const THEMES = {
  zinc: {
    id: 'zinc',
    name: 'Zen',
    hex: '#18181b',
    bg: 'bg-zinc-700',
    text: 'text-zinc-900',
    textLight: 'text-zinc-500',
    bgLight: 'bg-zinc-100',
    border: 'border-zinc-200',
    borderFocus: 'focus:border-zinc-700',
    accent: 'bg-zinc-900 hover:bg-zinc-800',
    dark: {
      text: 'text-zinc-200',
      textLight: 'text-zinc-400',
      bgLight: 'bg-zinc-800',
      border: 'border-zinc-600',
      borderFocus: 'focus:border-zinc-400',
    },
  },
  violet: {
    id: 'violet',
    name: 'Foco',
    hex: '#7c3aed',
    bg: 'bg-violet-600',
    text: 'text-violet-700',
    textLight: 'text-violet-500',
    bgLight: 'bg-violet-50',
    border: 'border-violet-200',
    borderFocus: 'focus:border-violet-600',
    accent: 'bg-violet-600 hover:bg-violet-700',
    dark: {
      text: 'text-violet-400',
      textLight: 'text-violet-500',
      bgLight: 'bg-violet-900/30',
      border: 'border-violet-800',
      borderFocus: 'focus:border-violet-500',
    },
  },
  blue: {
    id: 'blue',
    name: 'Lógica',
    hex: '#2563eb',
    bg: 'bg-blue-600',
    text: 'text-blue-700',
    textLight: 'text-blue-500',
    bgLight: 'bg-blue-50',
    border: 'border-blue-200',
    borderFocus: 'focus:border-blue-600',
    accent: 'bg-blue-600 hover:bg-blue-700',
    dark: {
      text: 'text-blue-400',
      textLight: 'text-blue-400',
      bgLight: 'bg-blue-900/30',
      border: 'border-blue-800',
      borderFocus: 'focus:border-blue-500',
    },
  },
  emerald: {
    id: 'emerald',
    name: 'Equilíbrio',
    hex: '#059669',
    bg: 'bg-emerald-600',
    text: 'text-emerald-700',
    textLight: 'text-emerald-500',
    bgLight: 'bg-emerald-50',
    border: 'border-emerald-200',
    borderFocus: 'focus:border-emerald-600',
    accent: 'bg-emerald-600 hover:bg-emerald-700',
    dark: {
      text: 'text-emerald-400',
      textLight: 'text-emerald-500',
      bgLight: 'bg-emerald-900/30',
      border: 'border-emerald-800',
      borderFocus: 'focus:border-emerald-500',
    },
  },
};

export const DEFAULT_THEME_KEY = 'zinc';

/** Gradient accent presets (Zen Browser-style palette). */
export const GRADIENT_PRESETS = {
  aurora:  { id: 'aurora',  name: 'Aurora',      from: '#8b5cf6', to: '#06b6d4' },
  sunset:  { id: 'sunset',  name: 'Pôr do Sol',  from: '#f97316', to: '#ec4899' },
  ocean:   { id: 'ocean',   name: 'Oceano',       from: '#0ea5e9', to: '#10b981' },
  fire:    { id: 'fire',    name: 'Fogo',         from: '#ef4444', to: '#f59e0b' },
  night:   { id: 'night',   name: 'Noite',        from: '#6366f1', to: '#a855f7' },
  forest:  { id: 'forest',  name: 'Floresta',     from: '#059669', to: '#65a30d' },
};

/**
 * Returns an inline React style object for accent colour (gradient > custom > null).
 * Pass the result to `style` on buttons / active indicators.
 */
export function getAccentStyle(accentGradient, customAccent) {
  if (accentGradient && GRADIENT_PRESETS[accentGradient]) {
    const { from, to } = GRADIENT_PRESETS[accentGradient];
    return { background: `linear-gradient(135deg, ${from}, ${to})` };
  }
  if (customAccent) return { backgroundColor: customAccent };
  return null;
}

/** Returns the theme merged with its dark overrides when darkMode is active. */
export function resolveTheme(themeObj, darkMode) {
  if (darkMode && themeObj.dark) return { ...themeObj, ...themeObj.dark };
  return themeObj;
}
