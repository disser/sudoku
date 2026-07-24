import { Difficulty } from '../sudoku/types';
import { GameState } from '../state/game';

export type StatRecord = { kind: 'solved'|'abandoned'; difficulty: Difficulty; elapsedMs: number; timestamp: string; puzzleId: string };
export type StatsSummary = { solvedCount: number; abandonedCount: number; bestMs: number|null; averageMs: number|null };
export const recordSolved = (records: StatRecord[], game: GameState): StatRecord[] => [...records, { kind:'solved', difficulty: game.difficulty, elapsedMs: game.elapsedMs, timestamp: new Date().toISOString(), puzzleId: game.id }];
export const recordAbandoned = (records: StatRecord[], game: GameState): StatRecord[] => [...records, { kind:'abandoned', difficulty: game.difficulty, elapsedMs: game.elapsedMs, timestamp: new Date().toISOString(), puzzleId: game.id }];
export function summarizeStats(records: StatRecord[], difficulty: Difficulty|'all' = 'all'): StatsSummary {
  const filtered = difficulty === 'all' ? records : records.filter(r=>r.difficulty===difficulty);
  const solved = filtered.filter(r=>r.kind==='solved');
  const abandoned = filtered.filter(r=>r.kind==='abandoned');
  return { solvedCount: solved.length, abandonedCount: abandoned.length, bestMs: solved.length ? Math.min(...solved.map(r=>r.elapsedMs)) : null, averageMs: solved.length ? Math.round(solved.reduce((a,r)=>a+r.elapsedMs,0)/solved.length) : null };
}
