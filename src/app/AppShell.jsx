import { useCallback, useEffect, useMemo, useState } from 'react';
import { TAB_BY_KEY } from '../shared/constants/navigation';
import { OnboardingWizard } from '../features/onboarding/OnboardingWizard';
import { ALLOWED_VIDEO_IDS } from '../shared/constants/videos';
import { DEFAULT_THEME_KEY, THEMES, resolveTheme, GRADIENT_PRESETS, getAccentStyle } from '../shared/constants/themes';
import { storage } from '../shared/lib/storage';
import { PomodoroView } from '../features/pomodoro/PomodoroView';
import { SyllabusView } from '../features/syllabus/SyllabusView';
import { ScheduleView } from '../features/schedule/ScheduleView';
import { WritingView } from '../features/writing/WritingView';
import { ErrorTrackerView } from '../features/errors/ErrorTrackerView';
import { DashboardView } from '../features/dashboard/DashboardView';
import { ExamChecklistView } from '../features/checklist/ExamChecklistView';
import { GoalsView } from '../features/goals/GoalsView';
import { BackgroundLayer } from './layout/BackgroundLayer';
import { DesktopSidebar } from './layout/DesktopSidebar';
import { ContentArea } from './layout/ContentArea';
import { MobileBottomNav } from './layout/MobileBottomNav';
// AUTH: imports kept for when auth is re-enabled
// import { AuthView } from '../features/auth/AuthView';
// import { useAuth } from '../features/auth/hooks/useAuth';

const THEME_KEY = 'themeKey';
const VIDEO_KEY = 'videoId';
const DARK_MODE_KEY = 'darkMode';
const ONBOARDING_COMPLETED_KEY = 'onboarding:completed';
const SIDEBAR_COLLAPSED_KEY = 'sidebar:collapsed';
const ACCENT_GRADIENT_KEY = 'accentGradient';
const CUSTOM_ACCENT_KEY = 'customAccent';
const SHADOW_LEVEL_KEY = 'shadowLevel';

export function AppShell() {
  // AUTH: disabled temporarily — re-enable by uncommenting useAuth and the guard below
  // const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('raiox');
  // TESTING: onboarding bypassed — change default from true → false to re-enable
  const [onboardingDone, setOnboardingDone] = useState(() =>
    storage.get(ONBOARDING_COMPLETED_KEY, true, (v) => Boolean(v)),
  );
  const [themeKey, setThemeKey] = useState(() =>
    storage.get(THEME_KEY, DEFAULT_THEME_KEY, (value, fallback) =>
      typeof value === 'string' && THEMES[value] ? value : fallback,
    ),
  );
  const [videoId, setVideoId] = useState(() =>
    storage.get(VIDEO_KEY, '', (value, fallback) => (typeof value === 'string' && ALLOWED_VIDEO_IDS.has(value) ? value : fallback)),
  );
  const [daysLeft, setDaysLeft] = useState(0);
  const [darkMode, setDarkMode] = useState(() => storage.get(DARK_MODE_KEY, false, (value) => Boolean(value)));
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => storage.get(SIDEBAR_COLLAPSED_KEY, false, Boolean));
  const [accentGradient, setAccentGradient] = useState(() =>
    storage.get(ACCENT_GRADIENT_KEY, '', (v) => (typeof v === 'string' && (v === '' || GRADIENT_PRESETS[v]) ? v : '')),
  );
  const [customAccent, setCustomAccent] = useState(() =>
    storage.get(CUSTOM_ACCENT_KEY, '', (v) => (typeof v === 'string' ? v : '')),
  );
  const [shadowLevel, setShadowLevel] = useState(() =>
    storage.get(SHADOW_LEVEL_KEY, 1, (v) => ([0, 1, 2, 3].includes(v) ? v : 1)),
  );

  const theme = THEMES[themeKey] ?? THEMES[DEFAULT_THEME_KEY];
  // Resolved theme automatically switches text/bgLight/border to dark-mode variants
  const effectiveTheme = resolveTheme(theme, darkMode);
  // Gradient / custom-colour accent style (null = use solid theme.accent className)
  const accentStyle = getAccentStyle(accentGradient, customAccent);

  const SHADOW_CLASS = ['shadow-none', 'shadow-sm', 'shadow-lg', 'shadow-2xl'][shadowLevel];

  const handleOnboardingComplete = useCallback(({ themeKey: newTheme, darkMode: newDark, profile }) => {
    setThemeKey(newTheme);
    storage.set(THEME_KEY, newTheme);
    setDarkMode(newDark);
    storage.set(DARK_MODE_KEY, newDark);
    if (profile?.examDate) {
      const ms = new Date(profile.examDate).getTime() - Date.now();
      setDaysLeft(Math.max(0, Math.ceil(ms / 86_400_000)));
    }
    setOnboardingDone(true);
  }, []);

  const savePreferences = useCallback((newTheme, newVideo) => {
    setThemeKey(newTheme);
    setVideoId(newVideo);
    storage.set(THEME_KEY, newTheme);
    storage.set(VIDEO_KEY, newVideo);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      storage.set(DARK_MODE_KEY, next);
      return next;
    });
  }, []);

  const toggleSidebarCollapsed = useCallback(() => {
    setSidebarCollapsed((prev) => {
      storage.set(SIDEBAR_COLLAPSED_KEY, !prev);
      return !prev;
    });
  }, []);

  const saveAccentGradient = useCallback((gradId) => {
    setAccentGradient(gradId);
    setCustomAccent('');
    storage.set(ACCENT_GRADIENT_KEY, gradId);
    storage.set(CUSTOM_ACCENT_KEY, '');
  }, []);

  const saveCustomAccent = useCallback((hex) => {
    setCustomAccent(hex);
    setAccentGradient('');
    storage.set(CUSTOM_ACCENT_KEY, hex);
    storage.set(ACCENT_GRADIENT_KEY, '');
  }, []);

  const saveShadowLevel = useCallback((level) => {
    setShadowLevel(level);
    storage.set(SHADOW_LEVEL_KEY, level);
  }, []);

  useEffect(() => {
    const profile = storage.get('onboarding:profile', null, (v, fb) => (v && typeof v === 'object' ? v : fb));
    if (profile?.examDate) {
      const ms = new Date(profile.examDate).getTime() - Date.now();
      setDaysLeft(Math.max(0, Math.ceil(ms / 86_400_000)));
    }
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      const targetTag = event.target?.tagName;
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA' || targetTag === 'SELECT') {
        return;
      }

      const key = event.key.toLowerCase();
      if (TAB_BY_KEY[key]) {
        setActiveTab(TAB_BY_KEY[key]);
      }

      if (key === 'd') {
        setDarkMode((previousMode) => {
          const nextMode = !previousMode;
          storage.set(DARK_MODE_KEY, nextMode);
          return nextMode;
        });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Lembrete diário — dispara uma vez por dia após as 07:00 se houver permissão
  useEffect(() => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const today = new Date().toISOString().slice(0, 10);
    const lastReminder = storage.get('daily:reminder:date', '', (v) => String(v));
    if (lastReminder === today) return;
    const hour = new Date().getHours();
    if (hour < 7) return;
    storage.set('daily:reminder:date', today);
    new Notification('📚 Bom dia, foco total!', {
      body: 'Abra suas metas do dia e comece com um Pomodoro.',
      icon: '/vite.svg',
      tag: 'daily-reminder',
    });
  }, []);

  const glassStyle = videoId
    ? 'bg-white/70 backdrop-blur-xl border-white/40 shadow-2xl'
    : darkMode
      ? 'bg-zinc-900 border-zinc-800'
      : 'bg-white border-stone-200';
  const mainGlassStyle = videoId ? 'bg-white/50 backdrop-blur-lg' : darkMode ? 'bg-zinc-900' : 'bg-white';
  const textColorClass = darkMode ? 'text-zinc-100' : 'text-stone-900';
  const bgColorClass = darkMode ? 'bg-zinc-950' : 'bg-stone-50';

  const activeView = useMemo(() => {
    const t = effectiveTheme;
    if (activeTab === 'pomodoro') return <PomodoroView theme={t} hasVideo={Boolean(videoId)} darkMode={darkMode} />;
    if (activeTab === 'raiox') return <SyllabusView theme={t} darkMode={darkMode} />;
    if (activeTab === 'cronograma') return <ScheduleView theme={t} darkMode={darkMode} />;
    if (activeTab === 'redacao') return <WritingView theme={t} darkMode={darkMode} />;
    if (activeTab === 'erros') return <ErrorTrackerView theme={t} darkMode={darkMode} />;
    if (activeTab === 'metas') return <GoalsView theme={t} darkMode={darkMode} />;
    if (activeTab === 'estatisticas') return <DashboardView theme={t} darkMode={darkMode} onTabChange={setActiveTab} />;
    if (activeTab === 'checklist') return <ExamChecklistView theme={t} darkMode={darkMode} />;
    return null;
  }, [activeTab, effectiveTheme, videoId, darkMode]);

  // AUTH GUARD (disabled) — uncomment to re-activate:
  // if (!isAuthenticated) {
  //   return <AuthView onLogin={() => {}} />;
  // }

  if (!onboardingDone) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  return (
    <>
      <BackgroundLayer videoId={videoId} bgColorClass={bgColorClass} />

      <div className={`flex h-screen font-sans ${textColorClass} overflow-hidden selection:bg-stone-200 relative z-10`}>
        <DesktopSidebar
          daysLeft={daysLeft}
          theme={effectiveTheme}
          themeKey={themeKey}
          videoId={videoId}
          darkMode={darkMode}
          glassStyle={`${glassStyle} ${SHADOW_CLASS}`}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSavePreferences={savePreferences}
          onToggleDarkMode={toggleDarkMode}
          sidebarCollapsed={sidebarCollapsed}
          onToggleCollapsed={toggleSidebarCollapsed}
          accentGradient={accentGradient}
          onSaveAccentGradient={saveAccentGradient}
          customAccent={customAccent}
          onSaveCustomAccent={saveCustomAccent}
          shadowLevel={shadowLevel}
          onSaveShadowLevel={saveShadowLevel}
          accentStyle={accentStyle}
        />

        <ContentArea activeTab={activeTab} activeView={activeView} videoId={videoId} mainGlassStyle={mainGlassStyle} darkMode={darkMode} />

        <MobileBottomNav
          activeTab={activeTab}
          theme={effectiveTheme}
          darkMode={darkMode}
          glassStyle={glassStyle}
          onTabChange={setActiveTab}
        />
      </div>
    </>
  );
}
