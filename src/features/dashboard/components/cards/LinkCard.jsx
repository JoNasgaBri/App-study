import { ExternalLink } from 'lucide-react';

/**
 * Inner content for a "link" widget.
 */
export function LinkCard({ card, onUpdate, darkMode }) {
  const hasUrl = card.url?.trim().length > 0;

  const safeHref = () => {
    try {
      const u = card.url.trim();
      return u.startsWith('http') ? u : `https://${u}`;
    } catch {
      return '#';
    }
  };

  const inputClass = `w-full bg-transparent text-sm font-semibold focus:outline-none border-b border-transparent pb-0.5 transition-colors ${
    darkMode
      ? 'text-zinc-200 placeholder-zinc-600 focus:border-zinc-600'
      : 'text-stone-700 placeholder-stone-300 focus:border-stone-300'
  }`;

  return (
    <div className="flex flex-col gap-2">
      <input
        value={card.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
        placeholder="Título do link..."
        className={inputClass}
      />

      <input
        value={card.url}
        onChange={(e) => onUpdate({ url: e.target.value })}
        placeholder="https://..."
        type="url"
        className={`w-full bg-transparent text-xs font-mono focus:outline-none border-b border-transparent pb-0.5 transition-colors ${
          darkMode
            ? 'text-zinc-500 placeholder-zinc-700 focus:border-zinc-700'
            : 'text-stone-400 placeholder-stone-300 focus:border-stone-200'
        }`}
      />

      <textarea
        value={card.description}
        onChange={(e) => onUpdate({ description: e.target.value })}
        placeholder="Descrição opcional..."
        rows={2}
        className={`w-full bg-transparent text-sm focus:outline-none resize-none leading-relaxed ${
          darkMode ? 'text-zinc-400 placeholder-zinc-600' : 'text-stone-500 placeholder-stone-300'
        }`}
      />

      {hasUrl && (
        <a
          href={safeHref()}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1 text-xs transition-colors mt-1 group ${
            darkMode ? 'text-zinc-500 hover:text-zinc-300' : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <ExternalLink className="w-3 h-3" />
          <span className="group-hover:underline truncate max-w-[14rem]">{card.url}</span>
        </a>
      )}
    </div>
  );
}
