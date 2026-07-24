import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, expect, test } from 'vitest';
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

const tapPad = (name: string) => {
  const button = screen.getByRole('button', { name });
  fireEvent.pointerDown(button);
  fireEvent.pointerUp(button);
};

beforeEach(() => localStorage.clear());

test('renders difficulty choices', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /sudoku/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /easy/i })).toBeInTheDocument();
});

test('when no cell is selected, number pad toggles matching value and note highlights', () => {
  localStorage.setItem('sudoku.currentGame.v1', JSON.stringify(baseGame));
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

test('outside clicks clear selection and highlight, and selecting a cell clears highlight', () => {
  localStorage.setItem('sudoku.currentGame.v1', JSON.stringify(baseGame));
  render(<App />);

  tapPad('1');
  expect(screen.getByRole('button', { name: 'cell 1' })).toHaveClass('highlight');

  fireEvent.click(screen.getByRole('button', { name: 'cell 6' }));
  expect(screen.getByRole('button', { name: 'cell 6' })).toHaveClass('selected');
  expect(screen.getByRole('button', { name: 'cell 1' })).not.toHaveClass('highlight');

  fireEvent.click(screen.getByRole('main'));
  expect(screen.getByRole('button', { name: 'cell 6' })).not.toHaveClass('selected');

  tapPad('1');
  expect(screen.getByRole('button', { name: 'cell 1' })).toHaveClass('highlight');
  fireEvent.click(screen.getByRole('main'));
  expect(screen.getByRole('button', { name: 'cell 1' })).not.toHaveClass('highlight');
});
