import { GameState } from '../state/game';
import { StatRecord } from '../stats/stats';

const GAME_KEY = 'sudoku.currentGame.v1';
const STATS_KEY = 'sudoku.stats.v1';
const read = <T,>(key: string, fallback: T): T => { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; } };
export const loadCurrentGame = (): GameState | null => read<GameState | null>(GAME_KEY, null);
export const saveCurrentGame = (game: GameState): void => localStorage.setItem(GAME_KEY, JSON.stringify(game));
export const clearCurrentGame = (): void => localStorage.removeItem(GAME_KEY);
export const loadStats = (): StatRecord[] => read<StatRecord[]>(STATS_KEY, []);
export const saveStats = (records: StatRecord[]): void => localStorage.setItem(STATS_KEY, JSON.stringify(records));
