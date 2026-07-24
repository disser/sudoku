import { DIFFICULTIES, Difficulty } from '../sudoku/types';
export function DifficultyDialog({ onChoose }: { onChoose:(d:Difficulty)=>void }) { return <div className="dialog"><h1>Sudoku</h1><p>Choose a difficulty</p>{DIFFICULTIES.map(d=><button key={d} onClick={()=>onChoose(d)}>{d}</button>)}</div>; }
