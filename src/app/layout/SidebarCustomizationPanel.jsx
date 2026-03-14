import { useRef, useState } from 'react';
import { Download, Moon, Palette, Pipette, Sliders, Sun, Upload, Video } from 'lucide-react';
import { THEMES, GRADIENT_PRESETS } from '../../shared/constants/themes';
import { VIDEOS } from '../../shared/constants/videos';
import { exportData, importData, triggerDownload } from '../../shared/lib/backup';

const SHADOW_LABELS = ['Nenhum', 'Suave', 'Médio', 'Intenso'];

export function SidebarCustomizationPanel({
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
  const [backupMsg, setBackupMsg] = useState('');
  const fileInputRef = useRef(null);

  const handleExport = () => {
    try {
      const json = exportData();
      const date = new Date().toISOString().slice(0, 10);
      triggerDownload(json, `app-study-backup-${date}.json`);
      setBackupMsg('Exportado!');
    } catch {
      setBackupMsg('Erro ao exportar');
    }
    setTimeout(() => setBackupMsg(''), 3000);
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const count = importData(ev.target.result);
        setBackupMsg(`${count} itens restaurados`);
        setTimeout(() => window.location.reload(), 1200);
      } catch (err) {
        setBackupMsg(err.message ?? 'Erro ao importar');
      }
      setTimeout(() => setBackupMsg(''), 4000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const labelClass = `text-[10px] font-bold mb-2.5 flex items-center gap-2 uppercase tracking-widest ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`;
  const dividerClass = `pt-3 border-t ${darkMode ? 'border-zinc-800' : 'border-stone-200/30'}`;

  return (
    <>
      {/* ① Cor do tema */}
      <div>
        <p className={labelClass}><Palette className="w-3.5 h-3.5" strokeWidth={2} /> Tema de Cor</p>
        <div className="flex gap-2 flex-wrap">
          {Object.values(THEMES).map((t) => (
            <button
              key={t.id}
              onClick={() => onSavePreferences(t.id, videoId)}
              title={t.name}
              className={`w-6 h-6 rounded-full border-2 transition-transform ${themeKey === t.id ? `scale-110 ${darkMode ? 'border-white/70' : 'border-stone-900'}` : 'border-transparent hover:scale-110 shadow-sm'}`}
              style={{ backgroundColor: t.hex }}
            />
          ))}
        </div>
      </div>

      {/* ② Gradiente de destaque */}
      <div>
        <p className={labelClass}><Sliders className="w-3.5 h-3.5" strokeWidth={2} /> Gradiente de Destaque</p>
        <div className="flex gap-2 flex-wrap items-center">
          {Object.values(GRADIENT_PRESETS).map((g) => {
            const active = accentGradient === g.id && !customAccent;
            return (
              <button
                key={g.id}
                onClick={() => onSaveAccentGradient(active ? '' : g.id)}
                title={g.name}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${active ? `scale-110 ${darkMode ? 'border-white/70' : 'border-stone-800'}` : 'border-transparent hover:scale-110'}`}
                style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}
              />
            );
          })}
          {(accentGradient || customAccent) && (
            <button
              onClick={() => { onSaveAccentGradient(''); onSaveCustomAccent(''); }}
              title="Remover destaque personalizado"
              className={`w-5 h-5 flex items-center justify-center rounded-full text-xs transition-colors ${darkMode ? 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600' : 'bg-stone-100 text-stone-400 hover:bg-stone-200'}`}
            >×</button>
          )}
        </div>
      </div>

      {/* ③ Cor personalizada */}
      <div>
        <p className={labelClass}><Pipette className="w-3.5 h-3.5" strokeWidth={2} /> Cor Personalizada</p>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={customAccent || '#7c3aed'}
            onChange={(e) => onSaveCustomAccent(e.target.value)}
            className="w-8 h-8 rounded-full cursor-pointer border-0 bg-transparent p-0"
            title="Escolher cor de destaque"
          />
          <span className={`text-xs font-mono ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>
            {customAccent || 'padrão do tema'}
          </span>
        </div>
      </div>

      {/* ④ Relevo */}
      <div>
        <p className={`text-[10px] font-bold mb-2 flex items-center justify-between uppercase tracking-widest ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>
          <span>Relevo</span>
          <span className={`font-normal normal-case text-[10px] ${darkMode ? 'text-zinc-600' : 'text-stone-400'}`}>{SHADOW_LABELS[shadowLevel]}</span>
        </p>
        <input
          type="range" min="0" max="3" step="1" value={shadowLevel}
          onChange={(e) => onSaveShadowLevel(Number(e.target.value))}
          className="w-full h-1.5 cursor-pointer rounded-full"
          style={{ accentColor: customAccent || (accentGradient ? GRADIENT_PRESETS[accentGradient]?.from : undefined) }}
        />
      </div>

      {/* ⑤ Ambiente visual */}
      <div>
        <p className={`text-[10px] font-bold mb-2 flex items-center gap-2 uppercase tracking-widest ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>
          <Video className="w-3.5 h-3.5" strokeWidth={2} /> Ambiente Visual
        </p>
        <select
          className={`w-full text-xs border rounded-lg py-2 px-2 font-medium focus:outline-none ${theme.borderFocus} ${darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-white/70 border-stone-200/50 text-stone-700'}`}
          value={videoId}
          onChange={(e) => onSavePreferences(themeKey, e.target.value)}
        >
          {VIDEOS.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>
      </div>

      {/* ⑥ Modo claro / escuro */}
      <div className={dividerClass}>
        <button
          onClick={onToggleDarkMode}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${darkMode ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
        >
          {darkMode ? <><Sun className="w-3.5 h-3.5" /> Modo Claro (D)</> : <><Moon className="w-3.5 h-3.5" /> Modo Escuro (D)</>}
        </button>
      </div>

      {/* ⑦ Backup / Restauração */}
      <div className={dividerClass}>
        <p className={`text-[10px] font-bold mb-2 uppercase tracking-widest ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>Dados</p>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            title="Exportar todos os dados como JSON"
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${darkMode ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
          >
            <Download className="w-3 h-3" /> Exportar
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Restaurar backup JSON"
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${darkMode ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
          >
            <Upload className="w-3 h-3" /> Importar
          </button>
          <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImportFile} />
        </div>
        {backupMsg && (
          <p className={`mt-1.5 text-[10px] text-center font-medium ${backupMsg.startsWith('Erro') ? 'text-red-400' : darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
            {backupMsg}
          </p>
        )}
      </div>
    </>
  );
}
