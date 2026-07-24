import { CellValue, DIGITS, Grid } from './types';

export function isValidGrid(grid: Grid): boolean {
  if (grid.length !== 81) return false;
  const units: number[][] = [];
  for (let r=0;r<9;r++) units.push([...Array(9)].map((_,c)=>r*9+c));
  for (let c=0;c<9;c++) units.push([...Array(9)].map((_,r)=>r*9+c));
  for (let br=0;br<3;br++) for (let bc=0;bc<3;bc++) units.push([...Array(9)].map((_,i)=>(br*3+Math.floor(i/3))*9+bc*3+i%3));
  return units.every(unit => {
    const seen = new Set<number>();
    for (const i of unit) {
      const v = grid[i];
      if (v < 0 || v > 9) return false;
      if (v && seen.has(v)) return false;
      if (v) seen.add(v);
    }
    return true;
  });
}

function candidates(grid: Grid, cell: number): CellValue[] {
  const used = new Set<number>();
  const r = Math.floor(cell/9), c = cell%9, br = Math.floor(r/3)*3, bc = Math.floor(c/3)*3;
  for (let i=0;i<9;i++) { used.add(grid[r*9+i]); used.add(grid[i*9+c]); }
  for (let rr=br;rr<br+3;rr++) for (let cc=bc;cc<bc+3;cc++) used.add(grid[rr*9+cc]);
  return DIGITS.filter(d => !used.has(d));
}

function nextCell(grid: Grid): number {
  let best = -1, count = 10;
  for (let i=0;i<81;i++) if (grid[i] === 0) {
    const n = candidates(grid, i).length;
    if (n < count) { best = i; count = n; }
  }
  return best;
}

export function countSolutions(grid: Grid, limit = 2): number {
  if (!isValidGrid(grid)) return 0;
  let count = 0;
  const work = [...grid];
  const search = (): void => {
    if (count >= limit) return;
    const cell = nextCell(work);
    if (cell < 0) { count++; return; }
    for (const d of candidates(work, cell)) {
      work[cell] = d;
      search();
      work[cell] = 0;
      if (count >= limit) return;
    }
  };
  search();
  return count;
}

export function solveGrid(grid: Grid): Grid | null {
  if (!isValidGrid(grid)) return null;
  const work = [...grid];
  const search = (): boolean => {
    const cell = nextCell(work);
    if (cell < 0) return true;
    for (const d of candidates(work, cell)) {
      work[cell] = d;
      if (search()) return true;
      work[cell] = 0;
    }
    return false;
  };
  return search() ? work : null;
}

export const hasUniqueSolution = (grid: Grid): boolean => countSolutions(grid, 2) === 1;
