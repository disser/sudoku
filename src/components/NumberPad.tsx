import { Digit } from '../sudoku/types';
const digits: Digit[] = [1,2,3,4,5,6,7,8,9];
export function NumberPad({ onTap, onLongPress, onErase }: { onTap:(d:Digit)=>void; onLongPress:(d:Digit)=>void; onErase:()=>void }) {
  let timer: number | undefined; let long = false;
  const down = (d: Digit) => { long = false; timer = window.setTimeout(()=>{ long = true; onLongPress(d); }, 501); };
  const up = (d: Digit) => { if (timer) clearTimeout(timer); if (!long) onTap(d); };
  return <div className="pad" aria-label="Number pad" onClick={e => e.stopPropagation()}>{digits.map(d=><button key={d} onPointerDown={()=>down(d)} onPointerUp={()=>up(d)} onPointerLeave={()=>timer&&clearTimeout(timer)}>{d}</button>)}<button className="erase" onClick={onErase}>Erase</button></div>;
}
