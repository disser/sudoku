import { expect, test } from 'vitest';
import { DIFFICULTY_GIVENS } from './types';
import { generatePuzzle, generateSolution } from './generator';
import { hasUniqueSolution, isValidGrid } from './solver';
test('generates a complete valid solution',()=>{const s=generateSolution(); expect(s.every(Boolean)).toBe(true); expect(isValidGrid(s)).toBe(true);});
test('generates unique puzzles with configured givens',()=>{const g=generatePuzzle('easy'); expect(g.puzzle.filter(Boolean)).toHaveLength(DIFFICULTY_GIVENS.easy); expect(hasUniqueSolution(g.puzzle)).toBe(true); expect(g.solution.every((v,i)=>g.puzzle[i]===0||g.puzzle[i]===v)).toBe(true);});
