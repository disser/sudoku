import { GameState } from '../state/game';
import { StatRecord } from '../stats/stats';

const GAME_KEY = 'sudoku.currentGame.v1';
const STATS_KEY = 'sudoku.stats.v1';
const read = <T,>(key: string, fallback: T): T => { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; } };
const write = (key: string, value: string): void => { try { localStorage.setItem(key, value); } catch { /* ignore unavailable storage */ } };
const remove = (key: string): void => { try { localStorage.removeItem(key); } catch { /* ignore unavailable storage */ } };
export const loadCurrentGame = (): GameState | null => read<GameState | null>(GAME_KEY, null);
export const saveCurrentGame = (game: GameState): void => write(GAME_KEY, JSON.stringify(game));
export const clearCurrentGame = (): void => remove(GAME_KEY);
export const loadStats = (): StatRecord[] => read<StatRecord[]>(STATS_KEY, []);
export const saveStats = (records: StatRecord[]): void => write(STATS_KEY, JSON.stringify(records));
