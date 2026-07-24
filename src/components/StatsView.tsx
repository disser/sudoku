import { useState } from 'react';
import { DIFFICULTIES, Difficulty } from '../sudoku/types';
import { StatRecord, summarizeStats } from '../stats/stats';
import { formatElapsed } from '../state/timer';
export function StatsView({ records, onClose }: { records: StatRecord[]; onClose:()=>void }) { const [filter,setFilter]=useState<Difficulty|'all'>('all'); const s=summarizeStats(records, filter); return <div className="overlay"><div className="dialog stats"><h2>Stats</h2><select value={filter} onChange={e=>setFilter(e.target.value as Difficulty|'all')}><option value="all">all</option>{DIFFICULTIES.map(d=><option key={d}>{d}</option>)}</select><p>Solved: {s.solvedCount}</p><p>Abandoned: {s.abandonedCount}</p><p>Best: {s.bestMs==null?'—':formatElapsed(s.bestMs)}</p><p>Average: {s.averageMs==null?'—':formatElapsed(s.averageMs)}</p><button onClick={onClose}>Close</button></div></div>; }
