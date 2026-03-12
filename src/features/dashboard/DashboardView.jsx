import { useEffect, useState } from 'react';
import { storage } from '../../shared/lib/storage';

const todayStr = () => new Date().toLocaleDateString('pt-PT');
const isToday = (ts) => new Date(ts).toLocaleDateString('pt-PT') === todayStr();

const readAll = () => {
  const cycles = storage.get('pomodoro_cycles', 0, (v) => (Number.isFinite(Number(v)) ? Number(v) : 0));
  const topics = storage.get('syllabus_topics', [], (v, fb) => (Array.isArray(v) ? v : fb));
  const checked = storage.get('syllabus_checked', [], (v, fb) => (Array.isArray(v) ? v : fb));
  const errors = storage.get('errors', [], (v, fb) => (Array.isArray(v) ? v : fb));
  const essays = storage.get('essays', [], (v, fb) => (Array.isArray(v) ? v : fb));
  const profile = storage.get('onboarding:profile', null, (v, fb) => (v && typeof v === 'object' ? v : fb));
  return { cycles, topics, checked, errors, essays, profile };
};

function StatCard({ label, value, sub, accent, darkMode }) {
  return (
    <div className={`flex flex-col gap-1 p-5 rounded-2xl shadow-sm border ${
      darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-stone-100'
    }`}>
      <span className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? 'text-zinc-400' : 'text-stone-400'}`}>{label}</span>
      <span className={`text-4xl font-light tabular-nums ${accent}`}>{value}</span>
      {sub && <span className={`text-xs mt-0.5 ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>{sub}</span>}
    </div>
  );
}

function Bar({ label, value, total, theme, darkMode }) {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100);
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className={`font-medium ${darkMode ? 'text-zinc-300' : 'text-stone-600'}`}>{label}</span>
        <span className={`tabular-nums ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>{pct}%</span>
      </div>
      <div className={`h-1 rounded-full overflow-hidden ${darkMode ? 'bg-zinc-700' : 'bg-stone-100'}`}>
        <div className={`h-full transition-all duration-700 ${theme.bg}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function DashboardView({ theme, darkMode }) {
  const [data, setData] = useState(readAll);
  const [daysLeft, setDaysLeft] = useState(null);

  // Refresh when tab becomes visible (user may have changed data elsewhere)
  useEffect(() => {
    const refresh = () => setData(readAll());
    document.addEventListener('visibilitychange', refresh);
    return () => document.removeEventListener('visibilitychange', refresh);
  }, []);

  useEffect(() => {
    const profile = data.profile;
    if (!profile?.examDate) return;
    const ms = new Date(profile.examDate).getTime() - Date.now();
    setDaysLeft(Math.max(0, Math.ceil(ms / 86_400_000)));
  }, [data.profile]);

  const { cycles, topics, checked, errors, essays, profile } = data;

  const totalTopics = topics.reduce((s, g) => s + g.items.length, 0);
  const syllabusProgress = totalTopics > 0 ? Math.round((checked.length / totalTopics) * 100) : 0;

  const errStats = errors.reduce(
    (a, e) => {
      if (e.type === 'base') a.base += 1;
      if (e.type === 'interpretacao') a.int += 1;
      if (e.type === 'calculo') a.calc += 1;
      a.total += 1;
      return a;
    },
    { base: 0, int: 0, calc: 0, total: 0 },
  );

  const gradedEssays = essays.filter((e) => e.selfGrade !== '' && e.selfGrade !== null);
  const avgGrade =
    gradedEssays.length > 0
      ? Math.round(gradedEssays.reduce((s, e) => s + Number(e.selfGrade), 0) / gradedEssays.length)
      : null;

  const todayErrors = errors.filter((e) => isToday(e.timestamp)).length;
  const todayEssays = essays.filter((e) => isToday(e.timestamp)).length;

  return (
    <div className="max-w-4xl mx-auto space-y-10">

      {/* ── Student Profile ── */}
      {profile && (
        <div className={`flex items-end justify-between gap-4 flex-wrap border-b pb-7 ${darkMode ? 'border-zinc-800' : 'border-stone-100'}`}>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-widest mb-0.5 ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>Painel de</p>
            <h2 className={`text-3xl font-light tracking-tight ${darkMode ? 'text-zinc-100' : 'text-stone-800'}`}>{profile.name || 'Estudante'}</h2>
            {Array.isArray(profile.subjects) && profile.subjects.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {profile.subjects.map((s) => (
                  <span key={s} className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-widest ${theme.bgLight} ${theme.text}`}>
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
          {daysLeft !== null && (
            <div className="text-right shrink-0">
              <p className={`text-5xl font-light ${theme.text} tabular-nums`}>{daysLeft}</p>
              <p className={`text-xs font-medium uppercase tracking-widest mt-0.5 ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>dias restantes</p>
            </div>
          )}
        </div>
      )}

      {/* ── Key Metrics ── */}
      <div>
        <h3 className={`text-xs font-semibold uppercase tracking-widest mb-4 ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>Resumo Geral</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Pomodoros" value={cycles} sub="ciclos concluídos" accent={theme.text} darkMode={darkMode} />
          <StatCard label="Edital" value={`${syllabusProgress}%`} sub={`${checked.length}/${totalTopics} tópicos`} accent={theme.text} darkMode={darkMode} />
          <StatCard label="Redações" value={essays.length} sub={avgGrade !== null ? `Média ${avgGrade}/80` : 'sem notas'} accent={theme.text} darkMode={darkMode} />
          <StatCard label="Erros" value={errStats.total} sub={`${todayErrors} hoje`} accent={theme.text} darkMode={darkMode} />
        </div>
      </div>

      {/* ── Today's Activity ── */}
      <div>
        <h3 className={`text-xs font-semibold uppercase tracking-widest mb-4 ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>Atividade de Hoje</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-4 rounded-2xl shadow-sm flex items-center gap-4 border ${
            darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-stone-100'
          }`}>
            <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${theme.bgLight}`}>✍️</span>
            <div>
              <p className={`text-2xl font-light tabular-nums ${darkMode ? 'text-zinc-100' : 'text-stone-800'}`}>{todayEssays}</p>
              <p className={`text-xs font-medium ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>redaç{todayEssays === 1 ? 'ão' : 'ões'} hoje</p>
            </div>
          </div>
          <div className={`p-4 rounded-2xl shadow-sm flex items-center gap-4 border ${
            darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-stone-100'
          }`}>
            <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${theme.bgLight}`}>🔴</span>
            <div>
              <p className={`text-2xl font-light tabular-nums ${darkMode ? 'text-zinc-100' : 'text-stone-800'}`}>{todayErrors}</p>
              <p className={`text-xs font-medium ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>erro{todayErrors === 1 ? '' : 's'} registrado{todayErrors === 1 ? '' : 's'} hoje</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Error Analysis ── */}
      {errStats.total > 0 && (
        <div>
          <h3 className={`text-xs font-semibold uppercase tracking-widest mb-4 ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>Distribuição de Erros</h3>
          <div className={`rounded-2xl p-5 shadow-sm space-y-5 border ${
            darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-stone-100'
          }`}>
            <Bar label="Falta de Base Teórica" value={errStats.base} total={errStats.total} theme={theme} darkMode={darkMode} />
            <Bar label="Interpretação de Texto" value={errStats.int} total={errStats.total} theme={theme} darkMode={darkMode} />
            <Bar label="Cálculo / Atenção" value={errStats.calc} total={errStats.total} theme={theme} darkMode={darkMode} />
          </div>
        </div>
      )}

      {/* ── Syllabus Progress ── */}
      <div>
        <h3 className={`text-xs font-semibold uppercase tracking-widest mb-4 ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>Progresso no Edital</h3>
        <div className={`rounded-2xl p-5 shadow-sm border ${
          darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-stone-100'
        }`}>
          <div className="flex justify-between items-end mb-3">
            <span className={`text-sm font-medium ${darkMode ? 'text-zinc-300' : 'text-stone-600'}`}>{checked.length} de {totalTopics} tópicos concluídos</span>
            <span className={`text-2xl font-light ${theme.text} tabular-nums`}>{syllabusProgress}%</span>
          </div>
          <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-zinc-700' : 'bg-stone-100'}`}>
            <div className={`h-full transition-all duration-700 ${theme.bg}`} style={{ width: `${syllabusProgress}%` }} />
          </div>
          {topics.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-5">
              {topics.map((group) => {
                const groupChecked = group.items.filter((i) => checked.includes(i)).length;
                const groupPct = group.items.length > 0 ? Math.round((groupChecked / group.items.length) * 100) : 0;
                return (
                  <div key={group.area} className="flex flex-col gap-1">
                    <span className={`text-[11px] font-semibold truncate ${darkMode ? 'text-zinc-400' : 'text-stone-500'}`}>{group.area}</span>
                    <div className={`h-0.5 rounded-full overflow-hidden ${darkMode ? 'bg-zinc-700' : 'bg-stone-100'}`}>
                      <div className={`h-full ${theme.bg} transition-all duration-500`} style={{ width: `${groupPct}%` }} />
                    </div>
                    <span className={`text-[10px] tabular-nums ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>{groupChecked}/{group.items.length}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Writing Stats ── */}
      {essays.length > 0 && (
        <div>
          <h3 className={`text-xs font-semibold uppercase tracking-widest mb-4 ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>Redação — Histórico</h3>
          <div className={`rounded-2xl p-5 shadow-sm border ${
            darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-stone-100'
          }`}>
            <div className="grid grid-cols-3 gap-4 mb-5">
              <div className="flex flex-col gap-0.5">
                <span className={`text-xs font-medium ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>Total</span>
                <span className={`text-3xl font-light ${theme.text} tabular-nums`}>{essays.length}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className={`text-xs font-medium ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>Média</span>
                <span className={`text-3xl font-light ${theme.text} tabular-nums`}>{avgGrade ?? '—'}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className={`text-xs font-medium ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>Melhor</span>
                <span className={`text-3xl font-light ${theme.text} tabular-nums`}>
                  {gradedEssays.length > 0 ? Math.max(...gradedEssays.map((e) => Number(e.selfGrade))) : '—'}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              {essays.slice(0, 4).map((e) => (
                <div key={e.id} className={`flex items-center justify-between text-sm py-2 border-t ${
                  darkMode ? 'border-zinc-700' : 'border-stone-50'
                }`}>
                  <div>
                    <span className={`font-medium ${darkMode ? 'text-zinc-200' : 'text-stone-700'}`}>{e.topic}</span>
                    <span className={`ml-2 text-xs ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>{e.genre}</span>
                  </div>
                  {e.selfGrade !== '' && (
                    <span className={`text-xs font-semibold ${theme.text} tabular-nums`}>{e.selfGrade}/80</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
