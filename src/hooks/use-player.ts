import { useEffect, useRef, useState } from "react";

export function usePlayer(total: number, delay: number) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!playing) return;
    if (index >= total - 1) { setPlaying(false); return; }
    timer.current = setTimeout(() => setIndex((i) => i + 1), delay);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [playing, index, total, delay]);

  return {
    index,
    playing,
    started: index > 0 || playing,
    finished: total > 0 && index >= total - 1,
    start: () => { setIndex(0); setPlaying(true); },
    pause: () => setPlaying(false),
    resume: () => setPlaying(true),
    next: () => { setPlaying(false); setIndex((i) => Math.min(i + 1, Math.max(total - 1, 0))); },
    reset: () => { setPlaying(false); setIndex(0); },
  };
}
