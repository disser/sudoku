import { describe, expect, test } from 'vitest';
import { hasUniqueSolution, isValidGrid, solveGrid } from './solver';
const puzzle = [5,3,0,0,7,0,0,0,0,6,0,0,1,9,5,0,0,0,0,9,8,0,0,0,0,6,0,8,0,0,0,6,0,0,0,3,4,0,0,8,0,3,0,0,1,7,0,0,0,2,0,0,0,6,0,6,0,0,0,0,2,8,0,0,0,0,4,1,9,0,0,5,0,0,0,0,8,0,0,7,9] as any;
describe('solver',()=>{test('solves known puzzle',()=>{const s=solveGrid(puzzle)!; expect(s[0]).toBe(5); expect(s.every(Boolean)).toBe(true); expect(isValidGrid(s)).toBe(true);}); test('detects uniqueness',()=>{expect(hasUniqueSolution(puzzle)).toBe(true); expect(hasUniqueSolution(Array(81).fill(0) as any)).toBe(false);});});
