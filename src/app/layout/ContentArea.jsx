export function ContentArea({ activeTab, activeView, videoId, mainGlassStyle, darkMode }) {
  const videoGlassClass = videoId
    ? darkMode
      ? 'bg-zinc-900/85 backdrop-blur-2xl p-8 rounded-3xl border border-zinc-700/60 shadow-2xl'
      : 'bg-white/85 backdrop-blur-2xl p-8 rounded-3xl border border-white/60 shadow-2xl'
    : '';

  return (
    <main className={`flex-1 flex flex-col h-full relative overflow-y-auto pb-20 md:pb-0 transition-all duration-500 ${mainGlassStyle}`}>
      <div key={activeTab} className="max-w-5xl mx-auto w-full p-6 md:p-12 animate-fade-up">
        {activeTab === 'pomodoro' ? (
          activeView
        ) : (
          <div className={videoGlassClass}>{activeView}</div>
        )}
      </div>
    </main>
  );
}
