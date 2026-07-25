import { useRef } from 'react';
import { Digit } from '../sudoku/types';
const digits: Digit[] = [1,2,3,4,5,6,7,8,9];
const haptic = () => navigator.vibrate?.(10);
export function NumberPad({ completedDigits, onTap, onLongPress, onErase }: { completedDigits: Digit[]; onTap:(d:Digit)=>void; onLongPress:(d:Digit)=>void; onErase:()=>void }) {
  const timerRef = useRef<number | null>(null);
  const longPressFiredRef = useRef(false);
  const clearTimer = () => { if (timerRef.current !== null) { window.clearTimeout(timerRef.current); timerRef.current = null; } };
  const down = (d: Digit) => {
    clearTimer();
    longPressFiredRef.current = false;
    timerRef.current = window.setTimeout(() => {
      longPressFiredRef.current = true;
      timerRef.current = null;
      haptic();
      onLongPress(d);
    }, 300);
  };
  const up = (d: Digit) => {
    clearTimer();
    if (!longPressFiredRef.current) { haptic(); onTap(d); }
    longPressFiredRef.current = false;
  };
  const cancel = () => {
    clearTimer();
    longPressFiredRef.current = false;
  };
  return <div className="pad" aria-label="Number pad" onClick={e => e.stopPropagation()}>{digits.map(d=><button className={completedDigits.includes(d) ? 'completed' : ''} key={d} onPointerDown={e=>{ e.preventDefault(); down(d); }} onPointerUp={()=>up(d)} onPointerCancel={cancel} onPointerLeave={cancel}>{d}</button>)}<button className="erase" onClick={()=>{ haptic(); onErase(); }}>Erase</button></div>;
}
