# Sudoku Browser App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static mobile-first Sudoku browser app with dynamic puzzles, local persistence, stats, undo, and GitHub Pages deployment.

**Architecture:** Use Vite + React + TypeScript. Keep Sudoku logic, game state, storage, stats, and UI components in separate focused modules with tests around each layer.

**Tech Stack:** Vite, React, TypeScript, Vitest, Testing Library, localStorage, GitHub Actions Pages deployment.

## Global Constraints

- The app must run entirely in the browser with no active server-side components.
- Current in-progress game and historical stats must persist in browser `localStorage`.
- Difficulties are `easy`, `moderate`, and `challenging` and are controlled by number of givens.
- Puzzles must be generated dynamically and have unique solutions.
- UI must be mobile-first with header, board near top, and number pad near bottom.
- Long-press threshold for notes is more than 500 ms.
- Notes are never validated or highlighted as errors.
- Error display is off by default and highlights only incorrect user-entered final values.
- Givens are immutable and visually distinct.
- Undo must work repeatedly back to the starting puzzle.
- Timer counts active visible play time only.
- Stats include solved and abandoned puzzles; solve-time summaries exclude abandoned puzzles.
- Deployment must publish static `dist/` to GitHub Pages.

---

## File Structure

- Create: `package.json`, `index.html`, `vite.config.ts`, `tsconfig*.json`, `vitest.config.ts`, `.gitignore`
- Create: `.github/workflows/pages.yml` for GitHub Pages deployment.
- Create: `src/main.tsx`, `src/App.tsx`, `src/App.test.tsx`, `src/styles.css`.
- Create: `src/sudoku/types.ts` for core Sudoku types.
- Create: `src/sudoku/solver.ts`, `src/sudoku/solver.test.ts` for solving and uniqueness.
- Create: `src/sudoku/generator.ts`, `src/sudoku/generator.test.ts` for solution/puzzle generation.
- Create: `src/state/game.ts`, `src/state/game.test.ts` for game model and moves.
- Create: `src/state/timer.ts`, `src/state/timer.test.ts` for active elapsed time helpers.
- Create: `src/storage/storage.ts`, `src/storage/storage.test.ts` for versioned localStorage.
- Create: `src/stats/stats.ts`, `src/stats/stats.test.ts` for stats records and summaries.
- Create: `src/components/Board.tsx`, `Header.tsx`, `NumberPad.tsx`, `MenuDialog.tsx`, `FinishedDialog.tsx`, `StatsView.tsx`, `DifficultyDialog.tsx`.

---

### Task 1: Project scaffold and test/build tooling

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vitest.config.ts`
- Create: `.gitignore`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/App.test.tsx`
- Create: `src/styles.css`

**Interfaces:**
- Produces: React app root and scripts `npm test`, `npm run build`, `npm run dev`.

- [ ] **Step 1: Create scaffold files**

Write `package.json`:

```json
{
  "name": "sudoku-browser-app",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest run",
    "test:watch": "vitest",
    "preview": "vite preview"
  },
  "dependencies": {
    "@vitejs/plugin-react": "latest",
    "vite": "latest",
    "typescript": "latest",
    "react": "latest",
    "react-dom": "latest"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "latest",
    "@testing-library/react": "latest",
    "@testing-library/user-event": "latest",
    "jsdom": "latest",
    "vitest": "latest"
  }
}
```

Write `index.html`, `src/main.tsx`, and a minimal `src/App.tsx` that renders `<h1>Sudoku</h1>`.

- [ ] **Step 2: Add smoke test**

Write `src/App.test.tsx`:

```tsx
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App';

test('renders the app title', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /sudoku/i })).toBeInTheDocument();
});
```

- [ ] **Step 3: Run tests and build**

Run: `npm install && npm test && npm run build`

Expected: tests pass and Vite writes `dist/`.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "chore: scaffold Vite React app"
```

---

### Task 2: Sudoku solver and uniqueness checker

**Files:**
- Create: `src/sudoku/types.ts`
- Create: `src/sudoku/solver.ts`
- Create: `src/sudoku/solver.test.ts`

**Interfaces:**
- Produces: `type CellValue = 0|1|2|3|4|5|6|7|8|9`, `type Grid = CellValue[]`, `isValidGrid(grid: Grid): boolean`, `solveGrid(grid: Grid): Grid | null`, `countSolutions(grid: Grid, limit?: number): number`, `hasUniqueSolution(grid: Grid): boolean`.

- [ ] **Step 1: Write failing solver tests**

Test that `solveGrid` solves a known puzzle, returns null for contradictory givens, and `hasUniqueSolution` distinguishes a known unique puzzle from an empty grid.

- [ ] **Step 2: Run test to verify failure**

Run: `npm test -- src/sudoku/solver.test.ts`

Expected: FAIL because module is missing.

- [ ] **Step 3: Implement solver**

Implement backtracking over 81 cells. Use `0` for empty cells. `countSolutions` must stop when it reaches `limit` to keep generation fast. `isValidGrid` must reject duplicate nonzero values in any row, column, or 3x3 box.

- [ ] **Step 4: Run tests**

Run: `npm test -- src/sudoku/solver.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/sudoku
git commit -m "feat: add Sudoku solver"
```

---

### Task 3: Dynamic puzzle generator

**Files:**
- Create: `src/sudoku/generator.ts`
- Create: `src/sudoku/generator.test.ts`

**Interfaces:**
- Consumes: `Grid`, `solveGrid`, `hasUniqueSolution`.
- Produces: `type Difficulty = 'easy' | 'moderate' | 'challenging'`, `DIFFICULTY_GIVENS: Record<Difficulty, number>`, `generateSolution(): Grid`, `generatePuzzle(difficulty: Difficulty): { puzzle: Grid; solution: Grid; givens: number; id: string }`.

- [ ] **Step 1: Write generator tests**

Test that generated solutions are valid complete grids, generated puzzles have the configured given count, each generated puzzle has a unique solution, and the stored solution solves the puzzle.

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- src/sudoku/generator.test.ts`

Expected: FAIL because generator is missing.

- [ ] **Step 3: Implement generator**

Use randomized backtracking to fill a complete solution. Remove shuffled cell positions until target givens remain, keeping a removal only when `hasUniqueSolution(candidate)` remains true. Use givens: easy 40, moderate 34, challenging 28.

- [ ] **Step 4: Run tests**

Run: `npm test -- src/sudoku/generator.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/sudoku/generator.ts src/sudoku/generator.test.ts
git commit -m "feat: generate unique Sudoku puzzles"
```

---

### Task 4: Game state, moves, undo, reset, and completion

**Files:**
- Create: `src/state/game.ts`
- Create: `src/state/game.test.ts`

**Interfaces:**
- Consumes: `Grid`, `Difficulty`.
- Produces: `type GameState`, `createGame(difficulty, generatedPuzzle): GameState`, `enterValue(game, cell, value): GameState`, `toggleNote(game, cell, value): GameState`, `eraseCell(game, cell): GameState`, `undo(game): GameState`, `resetGame(game): GameState`, `isComplete(game): boolean`, `isSolved(game): boolean`, `getCellDisplay(game, cell): { given: boolean; value: number; notes: number[]; incorrect: boolean }`.

- [ ] **Step 1: Write failing state tests**

Cover immutable givens, entering values, tapping same value clears, erase clears value and notes, long-press note toggles, entering correct value removes peer notes, incorrect values do not remove peer notes, undo returns through all prior states, reset restores starting puzzle, `isSolved` only returns true when all entries match the solution.

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- src/state/game.test.ts`

Expected: FAIL because game module is missing.

- [ ] **Step 3: Implement immutable reducer-style state helpers**

Represent user values as an 81-number array, notes as an 81-array of number arrays, and undo history as snapshots of user values and notes. Push history before each user-visible change. Do not mutate input state.

- [ ] **Step 4: Run tests**

Run: `npm test -- src/state/game.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/state/game.ts src/state/game.test.ts
git commit -m "feat: add Sudoku game state"
```

---

### Task 5: Timer, storage, and stats modules

**Files:**
- Create: `src/state/timer.ts`
- Create: `src/state/timer.test.ts`
- Create: `src/storage/storage.ts`
- Create: `src/storage/storage.test.ts`
- Create: `src/stats/stats.ts`
- Create: `src/stats/stats.test.ts`

**Interfaces:**
- Produces: `formatElapsed(ms: number): string`, `loadCurrentGame(): GameState | null`, `saveCurrentGame(game: GameState): void`, `clearCurrentGame(): void`, `loadStats(): StatRecord[]`, `saveStats(records: StatRecord[]): void`, `recordSolved(records, game): StatRecord[]`, `recordAbandoned(records, game): StatRecord[]`, `summarizeStats(records, difficulty): StatsSummary`.

- [ ] **Step 1: Write failing tests**

Test mm:ss and h:mm:ss formatting, versioned storage round trip, invalid storage returning safe defaults, solved/abandoned records, difficulty filtering, and solve-time averages excluding abandoned records.

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- src/state/timer.test.ts src/storage/storage.test.ts src/stats/stats.test.ts`

Expected: FAIL because modules are missing.

- [ ] **Step 3: Implement modules**

Use localStorage keys `sudoku.currentGame.v1` and `sudoku.stats.v1`. Wrap JSON parsing in try/catch. Store records with `kind: 'solved' | 'abandoned'`, `difficulty`, `elapsedMs`, `timestamp`, and `puzzleId`.

- [ ] **Step 4: Run tests**

Run: `npm test -- src/state/timer.test.ts src/storage/storage.test.ts src/stats/stats.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/state/timer.ts src/state/timer.test.ts src/storage src/stats
git commit -m "feat: persist games and stats"
```

---

### Task 6: React UI components and app integration

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/styles.css`
- Create: `src/components/Board.tsx`
- Create: `src/components/Header.tsx`
- Create: `src/components/NumberPad.tsx`
- Create: `src/components/MenuDialog.tsx`
- Create: `src/components/FinishedDialog.tsx`
- Create: `src/components/StatsView.tsx`
- Create: `src/components/DifficultyDialog.tsx`

**Interfaces:**
- Consumes all generator, game, timer, storage, and stats APIs.
- Produces: playable browser app.

- [ ] **Step 1: Write integration tests**

Test initial difficulty selection/new game, cell selection and number entry, long-press note via fake timers/pointer events, undo button, erase button, show-errors toggle, saved-game restore, completion dialog, stats filtering, and abandon confirmation.

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- src/App.test.tsx`

Expected: FAIL because UI does not implement flows.

- [ ] **Step 3: Implement UI**

Build mobile-first components. In `NumberPad`, start a timeout on pointer down and call `onLongPress(value)` after 500 ms; if pointer up occurs before timeout, call `onTap(value)`. In `App`, update elapsed active time from `document.visibilityState`, save game after changes, and append stats on solved/abandoned games.

- [ ] **Step 4: Style app**

Use CSS grid for the 9x9 board and 3x3 note layout. Add thicker borders around boxes, selected-cell styling, given styling, incorrect styling only when errors are enabled, sticky-ish bottom number pad suitable for mobile, and accessible buttons/dialogs.

- [ ] **Step 5: Run tests**

Run: `npm test -- src/App.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/App.test.tsx src/styles.css src/components
git commit -m "feat: build Sudoku user interface"
```

---

### Task 7: GitHub Pages deployment and final verification

**Files:**
- Modify: `vite.config.ts`
- Create: `.github/workflows/pages.yml`
- Modify: `README.md`

**Interfaces:**
- Produces: static build and GitHub Pages workflow.

- [ ] **Step 1: Configure Vite base**

Set `base: process.env.GITHUB_REPOSITORY ? '/sudoku/' : '/'` in `vite.config.ts` unless the repository name differs; if it differs, use that repository basename.

- [ ] **Step 2: Add workflow**

Create `.github/workflows/pages.yml` using `actions/checkout`, `actions/setup-node`, `actions/configure-pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages-artifact`. Run `npm ci`, `npm test`, and `npm run build` before upload.

- [ ] **Step 3: Add README**

Document local commands: `npm install`, `npm run dev`, `npm test`, `npm run build`, and GitHub Pages setup instructions.

- [ ] **Step 4: Run final verification**

Run: `npm test && npm run build`

Expected: PASS and `dist/` created.

- [ ] **Step 5: Commit**

```bash
git add vite.config.ts .github/workflows/pages.yml README.md
git commit -m "chore: configure GitHub Pages deployment"
```

---

## Self-Review

- Spec coverage: tasks cover static browser architecture, generation, localStorage current game and stats, mobile UI, gameplay interactions, validation, timer behavior, stats filtering, testing, and GitHub Pages deployment.
- Placeholder scan: no TBD/TODO placeholders are intentionally present; implementation notes include concrete file names, APIs, commands, and expected results.
- Type consistency: core shared types are defined in Tasks 2–4 and consumed by later tasks with consistent names.
