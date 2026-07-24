import { useEffect, useRef, useState } from 'react';
import { Difficulty } from './sudoku/types';
import { generatePuzzle } from './sudoku/generator';
import { createGame, enterValue, eraseCell, GameState, isSolved, resetGame, toggleNote, undo } from './state/game';
import { clearCurrentGame, loadCurrentGame, loadStats, saveCurrentGame, saveStats } from './storage/storage';
import { recordAbandoned, recordSolved, StatRecord } from './stats/stats';
import { Board } from './components/Board';
import { Header } from './components/Header';
import { NumberPad } from './components/NumberPad';
import { DifficultyDialog } from './components/DifficultyDialog';
import { MenuDialog } from './components/MenuDialog';
import { FinishedDialog } from './components/FinishedDialog';
import { StatsView } from './components/StatsView';

const newGame = (d: Difficulty) => createGame(d, generatePuzzle(d));

export function App() {
  const [game, setGame] = useState<GameState | null>(() => loadCurrentGame());
  const [selected, setSelected] = useState(0);
  const [menu, setMenu] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [chooseDifficulty, setChooseDifficulty] = useState(!game);
  const [stats, setStats] = useState<StatRecord[]>(() => loadStats());
  const solvedRecorded = useRef<string | null>(null);

  useEffect(() => { if (!game || game.status !== 'playing') return; let last = Date.now(); const id = window.setInterval(()=>{ if (document.visibilityState === 'visible') { const now=Date.now(); setGame(g=>g && g.status==='playing' ? {...g, elapsedMs:g.elapsedMs + now-last} : g); last=now; } else last=Date.now(); }, 1000); return ()=>clearInterval(id); }, [game?.id, game?.status]);
  useEffect(() => { if (game) saveCurrentGame(game); }, [game]);
  useEffect(() => { saveStats(stats); }, [stats]);
  useEffect(() => { if (game && isSolved(game) && solvedRecorded.current !== game.id) { solvedRecorded.current = game.id; const records = recordSolved(stats, game); setStats(records); clearCurrentGame(); } }, [game, stats]);

  const start = (d: Difficulty) => { setGame(newGame(d)); solvedRecorded.current = null; setChooseDifficulty(false); setMenu(false); };
  const abandonAnd = (fn:()=>void) => { if (game?.status === 'playing' && !confirm('Abandon this puzzle?')) return; if (game?.status === 'playing') setStats(recordAbandoned(stats, game)); fn(); };
  if (chooseDifficulty) return <main><DifficultyDialog onChoose={start} />{statsOpen && <StatsView records={stats} onClose={()=>setStatsOpen(false)} />}</main>;
  if (!game) return <main><DifficultyDialog onChoose={start} /></main>;

  return <main>
    <Header difficulty={game.difficulty} elapsedMs={game.elapsedMs} onUndo={()=>setGame(undo(game))} onMenu={()=>setMenu(true)} />
    <Board game={game} selected={selected} onSelect={setSelected} />
    <NumberPad onTap={d=>setGame(enterValue(game, selected, d))} onLongPress={d=>setGame(toggleNote(game, selected, d))} onErase={()=>setGame(eraseCell(game, selected))} />
    {menu && <MenuDialog showErrors={game.showErrors} onToggleErrors={()=>setGame({...game, showErrors:!game.showErrors})} onReset={()=>{ if(confirm('Reset this puzzle?')) setGame(resetGame(game)); setMenu(false); }} onNew={()=>abandonAnd(()=>setChooseDifficulty(true))} onStats={()=>setStatsOpen(true)} onClose={()=>setMenu(false)} />}
    {statsOpen && <StatsView records={stats} onClose={()=>setStatsOpen(false)} />}
    {game.status === 'solved' && <FinishedDialog difficulty={game.difficulty} onSame={()=>start(game.difficulty)} onDifficulty={()=>setChooseDifficulty(true)} onStats={()=>setStatsOpen(true)} />}
  </main>;
}
