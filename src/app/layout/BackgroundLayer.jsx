export function BackgroundLayer({ videoId, bgColorClass }) {
  return (
    <div className={`fixed inset-0 -z-20 transition-colors duration-1000 ${videoId ? 'bg-black' : bgColorClass}`}>
      {videoId && (
        <>
          <div className="absolute inset-0 w-full h-full pointer-events-none opacity-80 overflow-hidden bg-stone-900">
            <iframe
              key={videoId}
              className="absolute top-1/2 left-1/2 w-[100vw] h-[100vh] min-w-[177.77vh] min-h-[56.25vw] -translate-x-1/2 -translate-y-1/2 scale-110 pointer-events-none"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${videoId}&playsinline=1&modestbranding=1&enablejsapi=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              title="Background Video"
            />
          </div>
          <div className="absolute inset-0 bg-white/40 mix-blend-overlay pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/30 to-white/70 backdrop-blur-[2px] pointer-events-none" />
        </>
      )}
    </div>
  );
}
