export const playNotificationSound = () => {
  try {
    const context = new (window.AudioContext || window.webkitAudioContext)();

    const playBeep = (frequency, startTime) => {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, startTime);

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.8);

      oscillator.start(startTime);
      oscillator.stop(startTime + 1);
    };

    const now = context.currentTime;
    playBeep(880, now);
    playBeep(1046.5, now + 0.2);
  } catch {
    if (import.meta.env.DEV) {
      console.info('Áudio indisponível no navegador atual.');
    }
  }
};
