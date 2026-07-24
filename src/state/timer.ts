export function formatElapsed(ms: number): string {
  const total = Math.floor(ms / 1000), s = total % 60, m = Math.floor(total / 60) % 60, h = Math.floor(total / 3600);
  return h ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}` : `${m}:${String(s).padStart(2,'0')}`;
}
