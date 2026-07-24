import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { App } from './App';
import { GameState } from './state/game';

const baseGame: GameState = {
  id: 'highlight-test',
  difficulty: 'easy',
  puzzle: [1, 0, 0, 0, 0, 0, 0, 0, 0, ...Array(72).fill(0)] as any,
  solution: [1, 2, 3, 4, 5, 6, 7, 8, 9, 4, 5, 6, 7, 8, 9, 1, 2, 3, 7, 8, 9, 1, 2, 3, 4, 5, 6, 2, 3, 4, 5, 6, 7, 8, 9, 1, 5, 6, 7, 8, 9, 1, 2, 3, 4, 8, 9, 1, 2, 3, 4, 5, 6, 7, 3, 4, 5, 6, 7, 8, 9, 1, 2, 6, 7, 8, 9, 1, 2, 3, 4, 5, 9, 1, 2, 3, 4, 5, 6, 7, 8] as any,
  givens: [0],
  values: [0, 1, 0, 2, ...Array(77).fill(0)],
  notes: Array.from({ length: 81 }, (_, i) => i === 2 ? [1] : i === 4 ? [2] : []),
  history: [],
  elapsedMs: 0,
  status: 'playing',
  showErrors: false,
};

const completedOnesGame: GameState = {
  ...baseGame,
  puzzle: [1, 0, 0, 0, 0, 0, 0, 0, 0, ...Array(72).fill(0)] as any,
  values: [0, 1, 1, 1, 1, 1, 1, 1, 1, ...Array(72).fill(0)],
  notes: Array.from({ length: 81 }, () => []),
};

const tapPad = (name: string) => {
  const button = screen.getByRole('button', { name });
  fireEvent.pointerDown(button);
  fireEvent.pointerUp(button);
};
const longPressPad = (name: string) => {
  vi.useFakeTimers();
  const button = screen.getByRole('button', { name });
  fireEvent.pointerDown(button);
  act(() => vi.advanceTimersByTime(550));
  fireEvent.pointerUp(button);
};

const saveGame = (game: GameState = baseGame) => localStorage.setItem('sudoku.currentGame.v1', JSON.stringify(game));
const setVisibility = (visibilityState: DocumentVisibilityState) => {
  Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => visibilityState });
};

beforeEach(() => {
  localStorage.clear();
  setVisibility('visible');
});

afterEach(() => {
  vi.useRealTimers();
  setVisibility('visible');
});

test('renders difficulty choices', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /sudoku/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /easy/i })).toBeInTheDocument();
});

test('timer keeps advancing while visible, pauses while hidden, and resumes when visible', () => {
  vi.useFakeTimers();
  vi.setSystemTime(0);
  saveGame({ ...baseGame, elapsedMs: 0 });
  render(<App />);

  expect(screen.getByText('0:00')).toBeInTheDocument();
  act(() => vi.advanceTimersByTime(3000));
  expect(screen.getByText('0:03')).toBeInTheDocument();

  setVisibility('hidden');
  act(() => vi.advanceTimersByTime(5000));
  expect(screen.getByText('0:03')).toBeInTheDocument();

  setVisibility('visible');
  act(() => vi.advanceTimersByTime(2000));
  expect(screen.getByText('0:05')).toBeInTheDocument();
});

test('when no cell is selected, number pad toggles matching value and note highlights', () => {
  saveGame();
  render(<App />);

  tapPad('1');
  expect(screen.getByRole('button', { name: 'cell 1' })).toHaveClass('highlight');
  expect(screen.getByRole('button', { name: 'cell 2' })).toHaveClass('highlight');
  expect(screen.getByRole('button', { name: 'cell 3' })).toHaveClass('highlight');

  tapPad('1');
  expect(screen.getByRole('button', { name: 'cell 1' })).not.toHaveClass('highlight');
  expect(screen.getByRole('button', { name: 'cell 3' })).not.toHaveClass('highlight');

  tapPad('2');
  expect(screen.getByRole('button', { name: 'cell 4' })).toHaveClass('highlight');
  expect(screen.getByRole('button', { name: 'cell 5' })).toHaveClass('highlight');
  expect(screen.getByRole('button', { name: 'cell 1' })).not.toHaveClass('highlight');
});

test('outside shell clicks clear selection and highlight, while selecting a cell preserves highlight', () => {
  saveGame();
  render(<App />);

  tapPad('1');
  expect(screen.getByRole('button', { name: 'cell 1' })).toHaveClass('highlight');

  fireEvent.click(screen.getByRole('button', { name: 'cell 6' }));
  expect(screen.getByRole('button', { name: 'cell 6' })).toHaveClass('selected');
  expect(screen.getByRole('button', { name: 'cell 1' })).toHaveClass('highlight');

  fireEvent.click(screen.getByTestId('app-shell'));
  expect(screen.getByRole('button', { name: 'cell 6' })).not.toHaveClass('selected');
  expect(screen.getByRole('button', { name: 'cell 1' })).not.toHaveClass('highlight');
});

test('keyboard enters values, shift-number notes, space erases, and keyboard toggles highlight without selection', () => {
  saveGame();
  render(<App />);

  fireEvent.keyDown(window, { key: '2' });
  expect(screen.getByRole('button', { name: 'cell 4' })).toHaveClass('highlight');

  fireEvent.click(screen.getByRole('button', { name: 'cell 6' }));
  fireEvent.keyDown(window, { key: '6' });
  expect(screen.getByRole('button', { name: 'cell 6' })).toHaveTextContent('6');
  expect(screen.getByRole('button', { name: 'cell 6' })).not.toHaveClass('selected');

  fireEvent.click(screen.getByRole('button', { name: 'cell 6' }));
  fireEvent.keyDown(window, { key: ' ' });
  expect(screen.getByRole('button', { name: 'cell 6' })).not.toHaveTextContent('6');

  fireEvent.keyDown(window, { key: '7', shiftKey: true });
  expect(screen.getByRole('button', { name: 'cell 6' })).toHaveTextContent('7');
  expect(screen.getByRole('button', { name: 'cell 6' })).toHaveClass('selected');
});

test('shifted top-row symbols use keyboard code for note entry', () => {
  saveGame();
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'cell 6' }));
  fireEvent.keyDown(window, { key: '%', code: 'Digit5', shiftKey: true });
  expect(screen.getByRole('button', { name: 'cell 6' })).toHaveTextContent('5');
  expect(screen.getByRole('button', { name: 'cell 6' }).querySelector('.value')).toBeNull();
  expect(screen.getByRole('button', { name: 'cell 6' })).toHaveClass('selected');
});

test('cmd-z and ctrl-z undo previous moves', () => {
  saveGame();
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'cell 6' }));
  fireEvent.keyDown(window, { key: '6' });
  expect(screen.getByRole('button', { name: 'cell 6' })).toHaveTextContent('6');

  fireEvent.keyDown(window, { key: 'z', metaKey: true });
  expect(screen.getByRole('button', { name: 'cell 6' })).not.toHaveTextContent('6');

  fireEvent.click(screen.getByRole('button', { name: 'cell 6' }));
  fireEvent.keyDown(window, { key: '6' });
  fireEvent.keyDown(window, { key: 'z', ctrlKey: true });
  expect(screen.getByRole('button', { name: 'cell 6' })).not.toHaveTextContent('6');
});

test('entering the highlighted digit preserves highlight, while entering another digit clears it', () => {
  saveGame();
  render(<App />);

  tapPad('2');
  expect(screen.getByRole('button', { name: 'cell 4' })).toHaveClass('highlight');

  fireEvent.click(screen.getByRole('button', { name: 'cell 6' }));
  tapPad('2');
  expect(screen.getByRole('button', { name: 'cell 4' })).toHaveClass('highlight');

  fireEvent.click(screen.getByRole('button', { name: 'cell 7' }));
  tapPad('7');
  expect(screen.getByRole('button', { name: 'cell 4' })).not.toHaveClass('highlight');
});

test('long-pressing a pad number creates only a note and does not enter a final value on release', () => {
  saveGame();
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'cell 6' }));
  longPressPad('8');
  expect(screen.getByRole('button', { name: 'cell 6' })).toHaveTextContent('8');
  expect(screen.getByRole('button', { name: 'cell 6' }).querySelector('.value')).toBeNull();
  expect(screen.getByRole('button', { name: 'cell 6' })).toHaveClass('selected');
});

test('completed final digits are greyed out but remain clickable for highlighting', () => {
  saveGame(completedOnesGame);
  render(<App />);

  const oneButton = screen.getByRole('button', { name: '1' });
  expect(oneButton).toHaveClass('completed');
  fireEvent.pointerDown(oneButton);
  fireEvent.pointerUp(oneButton);
  expect(screen.getByRole('button', { name: 'cell 1' })).toHaveClass('highlight');
});

const fullWrongGame: GameState = {
  ...baseGame,
  id: 'full-wrong',
  puzzle: Array(81).fill(0) as any,
  values: [...baseGame.solution.slice(0, 80), 9],
  notes: Array.from({ length: 81 }, () => []),
};

const solvedGame: GameState = {
  ...baseGame,
  id: 'solved-game',
  puzzle: Array(81).fill(0) as any,
  values: [...baseGame.solution],
  notes: Array.from({ length: 81 }, () => []),
};

test('full but incorrect board shows a popup and check errors highlights wrong values', () => {
  saveGame(fullWrongGame);
  render(<App />);

  expect(screen.getByRole('heading', { name: /something/i })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: /finished/i })).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /check for errors/i }));
  expect(screen.queryByRole('heading', { name: /something/i })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'cell 81' })).toHaveClass('incorrect');
  expect(JSON.parse(localStorage.getItem('sudoku.stats.v1') ?? '[]')).toEqual([]);
});

test('correct solve shows celebration before finished dialog and records solved stats once', () => {
  vi.useFakeTimers();
  saveGame(solvedGame);
  render(<App />);

  expect(screen.getByText(/solved/i)).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: /finished/i })).not.toBeInTheDocument();

  act(() => vi.advanceTimersByTime(1500));
  expect(screen.getByRole('heading', { name: /finished/i })).toBeInTheDocument();
  const records = JSON.parse(localStorage.getItem('sudoku.stats.v1') ?? '[]');
  expect(records.filter((record: { kind: string }) => record.kind === 'solved')).toHaveLength(1);
});
