import {
  Clock,
  Flame,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  ArrowRight,
  Sun,
  CalendarDays,
  Activity,
  FileText,
  CheckSquare,
  Link2,
} from 'lucide-react';

/* ─── Legacy card types (kept for migration compat) ───────────────────────── */
export const CARD_TYPES = {
  TEXT: 'text',
  CHECKLIST: 'checklist',
  LINK: 'link',
};

export const CARD_LABELS = {
  [CARD_TYPES.TEXT]: 'Nota',
  [CARD_TYPES.CHECKLIST]: 'Checklist',
  [CARD_TYPES.LINK]: 'Link',
};

/* ─── Widget types ────────────────────────────────────────────────────────── */
export const WIDGET_TYPES = {
  // System widgets (read-only data from storage)
  GREETING: 'greeting',
  STATS_OVERVIEW: 'stats_overview',
  POMODORO_MINI: 'pomodoro_mini',
  STREAK: 'streak',
  NEXT_STEP: 'next_step',
  ERROR_CHART: 'error_chart',
  ESSAY_CHART: 'essay_chart',
  SYLLABUS_RING: 'syllabus_ring',
  WEEK_HEATMAP: 'week_heatmap',
  ACTIVITY_FEED: 'activity_feed',
  // Custom widgets (user editable)
  TEXT: 'text',
  CHECKLIST: 'checklist',
  LINK: 'link',
};

/** Metadata for each widget type — icon, label, description, default grid size. */
export const WIDGET_REGISTRY = {
  [WIDGET_TYPES.GREETING]: {
    label: 'Boas-vindas',
    description: 'Saudação dinâmica, dias restantes e atalhos rápidos',
    icon: Sun,
    category: 'sistema',
    defaultW: 12,
    defaultH: 3,
    minW: 6,
    minH: 2,
  },
  [WIDGET_TYPES.STATS_OVERVIEW]: {
    label: 'Resumo Geral',
    description: 'Pomodoros, edital, redações e erros com contagem animada',
    icon: BarChart3,
    category: 'sistema',
    defaultW: 12,
    defaultH: 3,
    minW: 6,
    minH: 2,
  },
  [WIDGET_TYPES.POMODORO_MINI]: {
    label: 'Mini Pomodoro',
    description: 'Timer minimalista que roda direto no card',
    icon: Clock,
    category: 'sistema',
    defaultW: 4,
    defaultH: 4,
    minW: 3,
    minH: 3,
  },
  [WIDGET_TYPES.STREAK]: {
    label: 'Streak',
    description: 'Contagem de dias seguidos com metas concluídas',
    icon: Flame,
    category: 'sistema',
    defaultW: 3,
    defaultH: 3,
    minW: 2,
    minH: 2,
  },
  [WIDGET_TYPES.NEXT_STEP]: {
    label: 'Próximo Passo',
    description: 'Próximo item pendente da sua Trilha de Estudo',
    icon: ArrowRight,
    category: 'sistema',
    defaultW: 4,
    defaultH: 3,
    minW: 3,
    minH: 2,
  },
  [WIDGET_TYPES.ERROR_CHART]: {
    label: 'Gráfico de Erros',
    description: 'Donut chart com distribuição de erros por tipo',
    icon: PieChart,
    category: 'sistema',
    defaultW: 4,
    defaultH: 4,
    minW: 3,
    minH: 3,
  },
  [WIDGET_TYPES.ESSAY_CHART]: {
    label: 'Evolução Redações',
    description: 'Mini gráfico de linhas com notas das últimas redações',
    icon: LineChart,
    category: 'sistema',
    defaultW: 6,
    defaultH: 4,
    minW: 4,
    minH: 3,
  },
  [WIDGET_TYPES.SYLLABUS_RING]: {
    label: 'Progresso Edital',
    description: 'Ring circular com porcentagem do edital concluído',
    icon: Target,
    category: 'sistema',
    defaultW: 4,
    defaultH: 4,
    minW: 3,
    minH: 3,
  },
  [WIDGET_TYPES.WEEK_HEATMAP]: {
    label: 'Heatmap Semanal',
    description: 'Mini heatmap de atividade dos últimos 7 dias',
    icon: CalendarDays,
    category: 'sistema',
    defaultW: 6,
    defaultH: 3,
    minW: 4,
    minH: 2,
  },
  [WIDGET_TYPES.ACTIVITY_FEED]: {
    label: 'Atividade Recente',
    description: 'Timeline das últimas ações registradas',
    icon: Activity,
    category: 'sistema',
    defaultW: 4,
    defaultH: 5,
    minW: 3,
    minH: 3,
  },
  [WIDGET_TYPES.TEXT]: {
    label: 'Nota',
    description: 'Bloco de texto livre para anotações',
    icon: FileText,
    category: 'custom',
    defaultW: 4,
    defaultH: 3,
    minW: 2,
    minH: 2,
  },
  [WIDGET_TYPES.CHECKLIST]: {
    label: 'Checklist',
    description: 'Lista de tarefas com checkbox',
    icon: CheckSquare,
    category: 'custom',
    defaultW: 4,
    defaultH: 4,
    minW: 2,
    minH: 2,
  },
  [WIDGET_TYPES.LINK]: {
    label: 'Link',
    description: 'Salve links úteis com descrição',
    icon: Link2,
    category: 'custom',
    defaultW: 4,
    defaultH: 3,
    minW: 2,
    minH: 2,
  },
};

/* ─── Storage keys ────────────────────────────────────────────────────────── */
export const PAGES_STORAGE_KEY = 'dashboard:pages';
export const CANVAS_STORAGE_KEY = 'dashboard:canvas'; // legacy, for migration
export const ONBOARDING_PROFILE_KEY = 'onboarding:profile';

export const SUBJECT_LABELS = {
  matematica: 'Matemática',
  portugues: 'Português',
  fisica: 'Física',
  quimica: 'Química',
  biologia: 'Biologia',
  historia: 'História',
  geografia: 'Geografia',
  filosofia: 'Filosofia',
  sociologia: 'Sociologia',
  ingles: 'Inglês',
  literatura: 'Literatura',
  artes: 'Artes',
};

/* ─── Factory ─────────────────────────────────────────────────────────────── */

/**
 * Build a fresh widget object.
 * @param {string} type - one of WIDGET_TYPES
 * @returns {{ id: string, type: string, title: string, createdAt: string, ... }}
 */
export const buildWidget = (type) => {
  const id = `w-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const base = { id, type, title: '', createdAt: new Date().toISOString() };

  if (type === WIDGET_TYPES.TEXT) return { ...base, body: '' };
  if (type === WIDGET_TYPES.CHECKLIST) return { ...base, items: [] };
  if (type === WIDGET_TYPES.LINK) return { ...base, url: '', label: '', description: '' };
  return base; // system widgets don't need extra fields
};

/**
 * Build a react-grid-layout item for a new widget.
 * @param {string} widgetId
 * @param {string} type - WIDGET_TYPES[...]
 * @returns {{ i: string, x: number, y: number, w: number, h: number, minW: number, minH: number }}
 */
export const buildLayoutItem = (widgetId, type) => {
  const reg = WIDGET_REGISTRY[type] || { defaultW: 4, defaultH: 3, minW: 2, minH: 2 };
  return {
    i: widgetId,
    x: 0,
    y: Infinity, // place at bottom
    w: reg.defaultW,
    h: reg.defaultH,
    minW: reg.minW,
    minH: reg.minH,
  };
};

/** Build the default page data for a brand-new user. */
export const buildDefaultPage = () => ({
  name: 'Principal',
  widgets: [],
  layout: [],
});
