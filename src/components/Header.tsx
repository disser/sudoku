import { Difficulty } from '../sudoku/types';
import { formatElapsed } from '../state/timer';
export function Header({ difficulty, elapsedMs, onMenu, onUndo }: { difficulty: Difficulty; elapsedMs: number; onMenu:()=>void; onUndo:()=>void }) {
  return <header><strong>{difficulty}</strong><span>{formatElapsed(elapsedMs)}</span><button onClick={onUndo}>Undo</button><button onClick={onMenu}>Menu</button></header>;
}
