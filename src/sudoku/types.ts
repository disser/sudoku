export type CellValue = 0|1|2|3|4|5|6|7|8|9;
export type Digit = 1|2|3|4|5|6|7|8|9;
export type Grid = CellValue[];
export type Difficulty = 'easy' | 'moderate' | 'challenging';

export const DIGITS: Digit[] = [1,2,3,4,5,6,7,8,9];
export const DIFFICULTIES: Difficulty[] = ['easy', 'moderate', 'challenging'];
export const DIFFICULTY_GIVENS: Record<Difficulty, number> = { easy: 40, moderate: 34, challenging: 28 };
export const rowOf = (cell: number) => Math.floor(cell / 9);
export const colOf = (cell: number) => cell % 9;
export const boxOf = (cell: number) => Math.floor(rowOf(cell) / 3) * 3 + Math.floor(colOf(cell) / 3);
export function peers(cell: number): number[] {
  const row = rowOf(cell), col = colOf(cell), box = boxOf(cell);
  const out = new Set<number>();
  for (let i=0;i<81;i++) if (i !== cell && (rowOf(i) === row || colOf(i) === col || boxOf(i) === box)) out.add(i);
  return [...out];
}
