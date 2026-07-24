import { useCallback, useEffect, useRef, useState } from 'react';
import { Difficulty, Digit } from './sudoku/types';
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
  const [selected, setSelected] = useState<number | null>(null);
  const [highlightDigit, setHighlightDigit] = useState<Digit | null>(null);
  const [menu, setMenu] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [chooseDifficulty, setChooseDifficulty] = useState(!game);
  const [stats, setStats] = useState<StatRecord[]>(() => loadStats());
  const solvedRecorded = useRef<string | null>(null);
  const lastTickRef = useRef(Date.now());

  useEffect(() => {
    if (!game || game.status !== 'playing') return;
    lastTickRef.current = Date.now();
    const id = window.setInterval(() => {
      const now = Date.now();
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;
      if (document.visibilityState !== 'visible') return;
      setGame(current => current && current.id === game.id && current.status === 'playing' ? { ...current, elapsedMs: current.elapsedMs + delta } : current);
    }, 1000);
    return () => window.clearInterval(id);
  }, [game?.id, game?.status]);
  useEffect(() => { if (game) saveCurrentGame(game); }, [game]);
  useEffect(() => { saveStats(stats); }, [stats]);
  useEffect(() => { if (game && isSolved(game) && solvedRecorded.current !== game.id) { solvedRecorded.current = game.id; const records = recordSolved(stats, game); setStats(records); clearCurrentGame(); } }, [game, stats]);

  const start = (d: Difficulty) => { setGame(newGame(d)); setSelected(null); setHighlightDigit(null); solvedRecorded.current = null; setChooseDifficulty(false); setMenu(false); };
  const abandonAnd = (fn:()=>void) => { if (game?.status === 'playing' && !confirm('Abandon this puzzle?')) return; if (game?.status === 'playing') setStats(recordAbandoned(stats, game)); fn(); };
  const preserveOrClearHighlight = useCallback((digit: Digit) => setHighlightDigit(current => current === digit ? current : null), []);
  const handleDigit = useCallback((digit: Digit, note: boolean) => {
    if (selected === null) {
      if (!note) setHighlightDigit(current => current === digit ? null : digit);
      return;
    }
    preserveOrClearHighlight(digit);
    setGame(current => current ? (note ? toggleNote(current, selected, digit) : enterValue(current, selected, digit)) : current);
  }, [preserveOrClearHighlight, selected]);
  const handleErase = useCallback(() => {
    if (selected !== null) setGame(current => current ? eraseCell(current, selected) : current);
  }, [selected]);
  const shouldIgnoreKeyboard = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return false;
    return Boolean(target.closest('input, textarea, select, .dialog, .overlay'));
  };
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (shouldIgnoreKeyboard(event.target)) return;
      if (/^[1-9]$/.test(event.key)) {
        event.preventDefault();
        handleDigit(Number(event.key) as Digit, event.shiftKey);
      } else if (event.key === 'Backspace' || event.key === 'Delete' || event.key === '0') {
        event.preventDefault();
        handleErase();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleDigit, handleErase]);
  if (chooseDifficulty) return <main><DifficultyDialog onChoose={start} />{statsOpen && <StatsView records={stats} onClose={()=>setStatsOpen(false)} />}</main>;
  if (!game) return <main><DifficultyDialog onChoose={start} /></main>;

  return <main onClick={() => { setSelected(null); setHighlightDigit(null); }}>
    <Header difficulty={game.difficulty} elapsedMs={game.elapsedMs} onUndo={()=>setGame(undo(game))} onMenu={()=>setMenu(true)} />
    <Board game={game} selected={selected} highlightDigit={highlightDigit} onSelect={setSelected} />
    <NumberPad onTap={d=>handleDigit(d, false)} onLongPress={d=>handleDigit(d, true)} onErase={handleErase} />
    {menu && <MenuDialog showErrors={game.showErrors} onToggleErrors={()=>setGame({...game, showErrors:!game.showErrors})} onReset={()=>{ if(confirm('Reset this puzzle?')) setGame(resetGame(game)); setMenu(false); }} onNew={()=>abandonAnd(()=>setChooseDifficulty(true))} onStats={()=>setStatsOpen(true)} onClose={()=>setMenu(false)} />}
    {statsOpen && <StatsView records={stats} onClose={()=>setStatsOpen(false)} />}
    {game.status === 'solved' && <FinishedDialog difficulty={game.difficulty} onSame={()=>start(game.difficulty)} onDifficulty={()=>setChooseDifficulty(true)} onStats={()=>setStatsOpen(true)} />}
  </main>;
}
