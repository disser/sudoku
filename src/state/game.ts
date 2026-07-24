import { Difficulty, Digit, Grid, peers } from '../sudoku/types';

export type Snapshot = { values: number[]; notes: number[][] };
export type GameState = {
  id: string; difficulty: Difficulty; puzzle: Grid; solution: Grid; givens: number[];
  values: number[]; notes: number[][]; history: Snapshot[]; elapsedMs: number; status: 'playing'|'solved'; showErrors: boolean;
};

type Generated = { puzzle: Grid; solution: Grid; givens: number; id: string };
const emptyNotes = () => Array.from({length:81}, () => [] as number[]);
const snap = (g: GameState): Snapshot => ({ values: [...g.values], notes: g.notes.map(n=>[...n]) });
const withHistory = (g: GameState): GameState => ({ ...g, history: [...g.history, snap(g)] });

export function createGame(difficulty: Difficulty, generated: Generated): GameState {
  return { id: generated.id, difficulty, puzzle: generated.puzzle, solution: generated.solution, givens: generated.puzzle.map((v,i)=>v?i:-1).filter(i=>i>=0), values: Array(81).fill(0), notes: emptyNotes(), history: [], elapsedMs: 0, status: 'playing', showErrors: false };
}
export const isGiven = (g: GameState, cell: number) => g.puzzle[cell] !== 0;
export const visibleValue = (g: GameState, cell: number) => g.puzzle[cell] || g.values[cell] || 0;

function updateStatus(g: GameState): GameState { return isSolved(g) ? { ...g, status: 'solved' } : g; }

export function enterValue(g: GameState, cell: number, value: Digit): GameState {
  if (isGiven(g, cell) || g.status !== 'playing') return g;
  const next = withHistory(g);
  const values = [...next.values];
  const notes = next.notes.map(n=>[...n]);
  if (values[cell] === value) values[cell] = 0; else { values[cell] = value; notes[cell] = []; if (g.solution[cell] === value) for (const p of peers(cell)) notes[p] = notes[p].filter(n=>n!==value); }
  return updateStatus({ ...next, values, notes });
}

export function toggleNote(g: GameState, cell: number, value: Digit): GameState {
  if (isGiven(g, cell) || visibleValue(g, cell) || g.status !== 'playing') return g;
  const next = withHistory(g); const notes = next.notes.map(n=>[...n]);
  notes[cell] = notes[cell].includes(value) ? notes[cell].filter(n=>n!==value) : [...notes[cell], value].sort();
  return { ...next, notes };
}

export function eraseCell(g: GameState, cell: number): GameState {
  if (isGiven(g, cell) || g.status !== 'playing') return g;
  const next = withHistory(g); const values = [...next.values]; const notes = next.notes.map(n=>[...n]);
  values[cell] = 0; notes[cell] = [];
  return { ...next, values, notes };
}
export function undo(g: GameState): GameState {
  const prev = g.history.at(-1); if (!prev) return g;
  return { ...g, values: prev.values, notes: prev.notes, history: g.history.slice(0,-1), status: 'playing' };
}
export function resetGame(g: GameState): GameState { return { ...g, values: Array(81).fill(0), notes: emptyNotes(), history: [], status: 'playing' }; }
export const isComplete = (g: GameState): boolean => [...Array(81)].every((_,i)=>visibleValue(g,i) !== 0);
export const isSolved = (g: GameState): boolean => isComplete(g) && [...Array(81)].every((_,i)=>visibleValue(g,i) === g.solution[i]);
export function getCellDisplay(g: GameState, cell: number) { const given = isGiven(g, cell); const value = visibleValue(g, cell); return { given, value, notes: g.notes[cell], incorrect: !given && g.showErrors && value !== 0 && value !== g.solution[cell] }; }
