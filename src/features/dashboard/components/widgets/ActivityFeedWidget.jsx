import { PenTool, AlertCircle, Clock } from 'lucide-react';
import { storage } from '../../../../shared/lib/storage';

function timeAgo(timestamp) {
  const ms = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return 'agora';
  if (mins < 60) return `${mins}min atrás`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h atrás`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'ontem';
  return `${days}d atrás`;
}

export function ActivityFeedWidget({ theme, darkMode }) {
  const errors = storage.get('errors', [], (v, fb) => (Array.isArray(v) ? v : fb));
  const essays = storage.get('essays', [], (v, fb) => (Array.isArray(v) ? v : fb));

  // Build activity items
  const activities = [
    ...errors.map((e) => ({
      type: 'error',
      label: `Erro: ${e.type === 'base' ? 'Base teórica' : e.type === 'interpretacao' ? 'Interpretação' : 'Cálculo'}`,
      sub: e.subject || '',
      icon: AlertCircle,
      timestamp: e.timestamp,
      color: 'text-orange-500',
    })),
    ...essays.map((e) => ({
      type: 'essay',
      label: `Redação: ${e.topic || 'Sem tema'}`,
      sub: e.genre || '',
      icon: PenTool,
      timestamp: e.timestamp,
      color: theme.text,
    })),
  ]
    .filter((a) => a.timestamp)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 8);

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
        <Clock className={`w-6 h-6 ${darkMode ? 'text-zinc-700' : 'text-stone-200'}`} />
        <p className={`text-xs ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>
          Nenhuma atividade recente.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="space-y-0.5">
        {activities.map((act, i) => {
          const Icon = act.icon;
          return (
            <div
              key={`${act.type}-${i}`}
              className={`flex items-start gap-2.5 px-1 py-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-zinc-700/30' : 'hover:bg-stone-50'
              }`}
            >
              <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${act.color}`} strokeWidth={1.5} />
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium truncate ${darkMode ? 'text-zinc-300' : 'text-stone-600'}`}>
                  {act.label}
                </p>
                {act.sub && (
                  <p className={`text-[10px] truncate ${darkMode ? 'text-zinc-600' : 'text-stone-400'}`}>
                    {act.sub}
                  </p>
                )}
              </div>
              <span className={`text-[9px] tabular-nums shrink-0 mt-0.5 ${darkMode ? 'text-zinc-600' : 'text-stone-300'}`}>
                {timeAgo(act.timestamp)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
