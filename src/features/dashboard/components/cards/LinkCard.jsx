import { ExternalLink } from 'lucide-react';

/**
 * Inner content for a "link" card.
 * Shows editable fields in edit mode, a rich preview in display mode.
 */
export function LinkCard({ card, onUpdate }) {
  const hasUrl = card.url?.trim().length > 0;

  const safeHref = () => {
    try {
      const u = card.url.trim();
      return u.startsWith('http') ? u : `https://${u}`;
    } catch {
      return '#';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        value={card.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
        placeholder="Título do link..."
        className="w-full bg-transparent text-sm font-semibold placeholder-stone-300 focus:outline-none text-stone-700 border-b border-transparent focus:border-stone-300 pb-0.5 transition-colors"
      />

      <input
        value={card.url}
        onChange={(e) => onUpdate({ url: e.target.value })}
        placeholder="https://..."
        type="url"
        className="w-full bg-transparent text-xs placeholder-stone-300 focus:outline-none text-stone-400 font-mono border-b border-transparent focus:border-stone-200 pb-0.5 transition-colors"
      />

      <textarea
        value={card.description}
        onChange={(e) => onUpdate({ description: e.target.value })}
        placeholder="Descrição opcional..."
        rows={2}
        className="w-full bg-transparent text-sm text-stone-500 placeholder-stone-300 focus:outline-none resize-none leading-relaxed"
      />

      {hasUrl && (
        <a
          href={safeHref()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-stone-700 transition-colors mt-1 group"
        >
          <ExternalLink className="w-3 h-3" />
          <span className="group-hover:underline truncate max-w-[14rem]">{card.url}</span>
        </a>
      )}
    </div>
  );
}
