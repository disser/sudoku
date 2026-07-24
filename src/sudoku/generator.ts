import { CellValue, DIFFICULTY_GIVENS, Difficulty, DIGITS, Grid } from './types';
import { hasUniqueSolution } from './solver';

const shuffle = <T,>(items: T[]): T[] => {
  const a = [...items];
  for (let i=a.length-1;i>0;i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]] = [a[j],a[i]]; }
  return a;
};

function canPlace(grid: Grid, cell: number, value: number): boolean {
  const r = Math.floor(cell/9), c = cell%9, br = Math.floor(r/3)*3, bc = Math.floor(c/3)*3;
  for (let i=0;i<9;i++) if (grid[r*9+i] === value || grid[i*9+c] === value) return false;
  for (let rr=br;rr<br+3;rr++) for (let cc=bc;cc<bc+3;cc++) if (grid[rr*9+cc] === value) return false;
  return true;
}

export function generateSolution(): Grid {
  const grid: Grid = Array(81).fill(0) as Grid;
  const fill = (cell = 0): boolean => {
    if (cell === 81) return true;
    if (grid[cell] !== 0) return fill(cell+1);
    for (const d of shuffle(DIGITS)) {
      if (canPlace(grid, cell, d)) {
        grid[cell] = d as CellValue;
        if (fill(cell+1)) return true;
        grid[cell] = 0;
      }
    }
    return false;
  };
  fill();
  return grid;
}

export function generatePuzzle(difficulty: Difficulty): { puzzle: Grid; solution: Grid; givens: number; id: string } {
  const target = DIFFICULTY_GIVENS[difficulty];
  for (let attempt=0; attempt<20; attempt++) {
    const solution = generateSolution();
    const puzzle = [...solution] as Grid;
    let givens = 81;
    for (const cell of shuffle([...Array(81)].map((_,i)=>i))) {
      if (givens <= target) break;
      const old = puzzle[cell];
      puzzle[cell] = 0;
      if (hasUniqueSolution(puzzle)) givens--; else puzzle[cell] = old;
    }
    if (givens === target) return { puzzle, solution, givens, id: `${difficulty}-${Date.now()}-${Math.random().toString(36).slice(2)}` };
  }
  return generatePuzzle(difficulty);
}
