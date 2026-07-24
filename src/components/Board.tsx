import { GameState, getCellDisplay } from '../state/game';

export function Board({ game, selected, onSelect }: { game: GameState; selected: number; onSelect: (cell: number)=>void }) {
  return <div className="board" role="grid" aria-label="Sudoku board">
    {Array.from({length:81}, (_, cell) => {
      const d = getCellDisplay(game, cell);
      return <button key={cell} className={`cell ${selected===cell?'selected':''} ${d.given?'given':''} ${d.incorrect?'incorrect':''}`} onClick={()=>onSelect(cell)} aria-label={`cell ${cell+1}`}>
        {d.value ? <span className="value">{d.value}</span> : <span className="notes">{[1,2,3,4,5,6,7,8,9].map(n=><span key={n}>{d.notes.includes(n)?n:''}</span>)}</span>}
      </button>;
    })}
  </div>;
}
