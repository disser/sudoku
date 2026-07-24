import { expect, test } from 'vitest';
import { recordAbandoned, recordSolved, summarizeStats } from './stats';
const game:any={id:'p1',difficulty:'easy',elapsedMs:1000};
test('summarizes solved and abandoned stats',()=>{let r=recordSolved([],game); r=recordAbandoned(r,{...game,id:'p2'}); const s=summarizeStats(r,'easy'); expect(s.solvedCount).toBe(1); expect(s.abandonedCount).toBe(1); expect(s.averageMs).toBe(1000);});
