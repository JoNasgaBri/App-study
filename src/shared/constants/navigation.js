import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  ListChecks,
  PenTool,
  PieChart,
  Target,
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'raiox', icon: CheckCircle2, label: 'Trilha de Estudo', key: '1' },
  { id: 'cronograma', icon: Calendar, label: 'Matriz Semanal', key: '2' },
  { id: 'pomodoro', icon: Clock, label: 'Foco', key: '3' },
  { id: 'redacao', icon: PenTool, label: 'Redação UFU', key: '4' },
  { id: 'erros', icon: AlertCircle, label: 'Diário de Erros', key: '5' },
  { id: 'metas', icon: Target, label: 'Metas Diárias', key: '6' },
  { id: 'estatisticas', icon: PieChart, label: 'Desempenho', key: '7' },
  { id: 'checklist', icon: ListChecks, label: 'Dia da Prova', key: '8' },
];

export const TAB_BY_KEY = NAV_ITEMS.reduce((acc, item) => {
  acc[item.key] = item.id;
  return acc;
}, {});
