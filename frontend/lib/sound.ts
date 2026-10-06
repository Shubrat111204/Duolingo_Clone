export const soundOn = () => typeof window !== "undefined" && localStorage.getItem("sound") !== "off";
export const setSound = (v: boolean) => localStorage.setItem("sound", v ? "on" : "off");

let ctx: AudioContext | null = null;
function tone(freqs: number[], dur = 0.12) {
  if (!soundOn()) return;
  ctx = ctx || new (window.AudioContext || (window as any).webkitAudioContext)();
  freqs.forEach((f, i) => {
    const o = ctx!.createOscillator(), g = ctx!.createGain(), t = ctx!.currentTime + i * dur;
    o.type = "triangle"; o.frequency.value = f; o.connect(g); g.connect(ctx!.destination);
    g.gain.setValueAtTime(0.2, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.start(t); o.stop(t + dur);
  });
}
export const playCorrect = () => tone([660, 880]);
export const playWrong = () => tone([220, 160], 0.18);
export const playDone = () => tone([523, 659, 784, 1047], 0.14);

// Text-to-speech (browser Web Speech API, no API key needed)
export function speak(text: string, lang = "es-ES", rate = 0.9) {
  if (!text || typeof window === "undefined" || !("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang; u.rate = rate;
  const v = speechSynthesis.getVoices().find((x) => x.lang.startsWith("es"));
  if (v) u.voice = v;
  speechSynthesis.speak(u);
}
