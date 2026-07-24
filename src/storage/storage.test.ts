import { expect, test, beforeEach } from 'vitest';
import { clearCurrentGame, loadCurrentGame, loadStats, saveCurrentGame, saveStats } from './storage';
beforeEach(()=>localStorage.clear());
test('round trips game and stats safely',()=>{expect(loadCurrentGame()).toBeNull(); const game:any={id:'x'}; saveCurrentGame(game); expect(loadCurrentGame()?.id).toBe('x'); clearCurrentGame(); expect(loadCurrentGame()).toBeNull(); saveStats([{kind:'solved',difficulty:'easy',elapsedMs:1,timestamp:'t',puzzleId:'p'}]); expect(loadStats()).toHaveLength(1); localStorage.setItem('sudoku.stats.v1','bad'); expect(loadStats()).toEqual([]);});
