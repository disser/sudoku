import { afterEach, beforeEach, expect, test } from 'vitest';
import { clearCurrentGame, loadCurrentGame, loadStats, saveCurrentGame, saveStats } from './storage';

const originalLocalStorage = globalThis.localStorage;

beforeEach(()=>localStorage.clear());
afterEach(()=>Object.defineProperty(globalThis, 'localStorage', { value: originalLocalStorage, configurable: true }));

test('round trips game and stats safely',()=>{expect(loadCurrentGame()).toBeNull(); const game:any={id:'x'}; saveCurrentGame(game); expect(loadCurrentGame()?.id).toBe('x'); clearCurrentGame(); expect(loadCurrentGame()).toBeNull(); saveStats([{kind:'solved',difficulty:'easy',elapsedMs:1,timestamp:'t',puzzleId:'p'}]); expect(loadStats()).toHaveLength(1); localStorage.setItem('sudoku.stats.v1','bad'); expect(loadStats()).toEqual([]);});

test('ignores localStorage write failures so restricted mobile storage does not crash the app', () => {
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: () => null,
      setItem: () => { throw new Error('QuotaExceededError'); },
      removeItem: () => { throw new Error('SecurityError'); },
    },
    configurable: true,
  });

  expect(() => saveCurrentGame({ id: 'x' } as any)).not.toThrow();
  expect(() => saveStats([{ kind: 'abandoned', difficulty: 'easy', elapsedMs: 1, timestamp: 't', puzzleId: 'p' }])).not.toThrow();
  expect(() => clearCurrentGame()).not.toThrow();
});
