import { render, screen } from '@testing-library/react';
import { App } from './App';
test('renders difficulty choices', () => { render(<App />); expect(screen.getByRole('heading', { name: /sudoku/i })).toBeInTheDocument(); expect(screen.getByRole('button', { name: /easy/i })).toBeInTheDocument(); });
