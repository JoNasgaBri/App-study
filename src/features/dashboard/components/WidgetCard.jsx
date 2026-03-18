import { GripVertical, Trash2 } from 'lucide-react';
import { WIDGET_REGISTRY } from '../constants';

/* ── Widget inner renderers ─────────────────────────────────────────────── */
import { TextCard } from './cards/TextCard';
import { ChecklistCard } from './cards/ChecklistCard';
import { LinkCard } from './cards/LinkCard';
import { GreetingWidget } from './widgets/GreetingWidget';
import { StatsOverviewWidget } from './widgets/StatsOverviewWidget';
import { PomodoroMiniWidget } from './widgets/PomodoroMiniWidget';
import { StreakWidget } from './widgets/StreakWidget';
import { NextStepWidget } from './widgets/NextStepWidget';
import { ErrorChartWidget } from './widgets/ErrorChartWidget';
import { EssayChartWidget } from './widgets/EssayChartWidget';
import { SyllabusRingWidget } from './widgets/SyllabusRingWidget';
import { WeekHeatmapWidget } from './widgets/WeekHeatmapWidget';
import { ActivityFeedWidget } from './widgets/ActivityFeedWidget';

const INNER_MAP = {
  text: (props) => <TextCard card={props.widget} onUpdate={props.onUpdate} darkMode={props.darkMode} />,
  checklist: (props) => <ChecklistCard card={props.widget} onUpdate={props.onUpdate} theme={props.theme} darkMode={props.darkMode} />,
  link: (props) => <LinkCard card={props.widget} onUpdate={props.onUpdate} darkMode={props.darkMode} />,
  greeting: (props) => <GreetingWidget theme={props.theme} darkMode={props.darkMode} onTabChange={props.onTabChange} />,
  stats_overview: (props) => <StatsOverviewWidget theme={props.theme} darkMode={props.darkMode} />,
  pomodoro_mini: (props) => <PomodoroMiniWidget theme={props.theme} darkMode={props.darkMode} />,
  streak: (props) => <StreakWidget theme={props.theme} darkMode={props.darkMode} />,
  next_step: (props) => <NextStepWidget theme={props.theme} darkMode={props.darkMode} onTabChange={props.onTabChange} />,
  error_chart: (props) => <ErrorChartWidget theme={props.theme} darkMode={props.darkMode} />,
  essay_chart: (props) => <EssayChartWidget theme={props.theme} darkMode={props.darkMode} />,
  syllabus_ring: (props) => <SyllabusRingWidget theme={props.theme} darkMode={props.darkMode} />,
  week_heatmap: (props) => <WeekHeatmapWidget theme={props.theme} darkMode={props.darkMode} />,
  activity_feed: (props) => <ActivityFeedWidget theme={props.theme} darkMode={props.darkMode} />,
};

/**
 * Universal widget shell — header with drag handle + type badge + remove, body with the inner widget.
 */
export function WidgetCard({ widget, onRemove, onUpdate, onTabChange, theme, darkMode }) {
  const reg = WIDGET_REGISTRY[widget.type];
  const renderInner = INNER_MAP[widget.type];

  return (
    <div
      className={`h-full flex flex-col rounded-2xl border transition-all overflow-hidden ${
        darkMode
          ? 'bg-zinc-800/80 border-zinc-700 hover:border-zinc-600'
          : 'bg-white border-stone-100 hover:border-stone-200 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Header */}
      <div className={`flex items-center gap-1.5 px-3 py-2 border-b ${darkMode ? 'border-zinc-700/50' : 'border-stone-50'}`}>
        <button
          className={`widget-drag-handle cursor-grab active:cursor-grabbing transition-colors ${
            darkMode ? 'text-zinc-600 hover:text-zinc-400' : 'text-stone-200 hover:text-stone-400'
          }`}
          aria-label="Arrastar widget"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <span className={`text-[10px] font-semibold uppercase tracking-widest select-none ${
          darkMode ? 'text-zinc-600' : 'text-stone-300'
        }`}>
          {reg?.label ?? widget.type}
        </span>

        <button
          onClick={onRemove}
          className={`ml-auto opacity-0 group-hover:opacity-100 transition-opacity ${
            darkMode ? 'text-zinc-600 hover:text-rose-400' : 'text-stone-200 hover:text-rose-400'
          }`}
          aria-label="Remover widget"
          style={{ opacity: undefined }} // let CSS handle on container hover
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-3 group">
        {renderInner
          ? renderInner({ widget, onUpdate: (patch) => onUpdate(patch), theme, darkMode, onTabChange })
          : <p className="text-xs text-stone-400">Widget desconhecido</p>}
      </div>
    </div>
  );
}
