# Sudoku Browser App Design

## Overview

Build a static, mobile-first Sudoku application that runs entirely in the browser. It will use no active server-side components. Browser `localStorage` will persist both the current in-progress game and historical stats.

The app will support three selectable difficulties: easy, moderate, and challenging. Puzzles will be generated dynamically for unlimited replay variety, with difficulty controlled by the number of givens.

## Architecture

Use Vite + React + TypeScript for a static single-page application.

Organize the source into focused modules:

- `sudoku/`: puzzle generation, solving, uniqueness checking, solution representation, and difficulty/givens logic.
- `state/`: active game model, move application, undo stack, reset behavior, completion checks, and active-time accounting.
- `storage/`: versioned `localStorage` read/write for current game and historical stats.
- `components/`: board, number pad, header, menu, dialogs, difficulty picker, and stats view.
- `.github/workflows/`: GitHub Pages deployment workflow.

The current game state will include:

- Difficulty.
- Puzzle givens.
- Full solution.
- User-entered final values.
- Candidate notes.
- Undo history.
- Elapsed active play time.
- Game lifecycle state.
- Puzzle metadata needed for stats and debugging.

Stats will be stored as append-only solved and abandoned game records.

## Sudoku generation

The generator will:

1. Generate a valid complete Sudoku solution.
2. Remove cells according to the selected difficulty's target number of givens.
3. Check that the resulting puzzle has a unique solution.
4. Retry as needed until it produces a valid puzzle.

Difficulty will be based on givens rather than advanced solving-technique analysis. Exact givens ranges can be tuned during implementation, but the intended relative behavior is:

- Easy: more givens.
- Moderate: fewer givens.
- Challenging: fewest givens.

## Mobile-first user interface

The layout will prioritize mobile use:

- Header at the top showing difficulty, elapsed active time, and menu/actions.
- Sudoku board near the top, sized to fit the viewport.
- Controls below the board.
- Number entry pad near the bottom with digits 1–9 and an erase action.

Original givens must be visually distinct from user-entered values and immutable.

## Gameplay interactions

Core interactions:

- Tap a cell to select it.
- Tap a number to enter that value in the selected cell.
- Tap the same entered number again to clear that cell.
- Tap erase to clear the selected cell's user value and notes.
- Long-press a number for more than 500 ms to toggle that candidate note in the selected empty cell.
- Long-pressing the same note again removes it.
- Entering a final value clears notes in that cell.
- If the entered final value is correct, matching notes are removed from peer cells in the same row, column, and box.
- Notes are never validated and are not highlighted as errors.
- There is no hint feature.
- There is no cell background-color highlighting feature.

Undo:

- An undo button will reverse moves repeatedly all the way back to the starting puzzle.
- Undo should cover user-visible gameplay changes, including entered values, cleared values, notes, peer-note cleanup, erase actions, and reset/new-game-relevant state when applicable.

Reset:

- The user can reset the current puzzle to its starting point.
- Reset asks for confirmation when it would discard progress.

New game:

- Starting a new game while a puzzle is in progress asks for confirmation.
- If confirmed, the current puzzle is recorded as abandoned in stats.

## Validation and completion

Default behavior is paper-like: no errors are shown during normal play.

A menu option toggles "show errors":

- When enabled, only user-entered final values that do not match the solution are highlighted.
- Notes are never highlighted as errors.
- Givens are not error-highlighted.

Completion behavior:

- Completion is checked when all cells are filled.
- If the filled board matches the solution, the app records a solved stat and shows a finished dialog.
- The finished dialog offers: start a new puzzle at the same difficulty, choose a new difficulty, or view historical stats.
- If the board is full but incorrect, the game remains active. If error display is enabled, incorrect entries are highlighted.

## Timer and persistence

The timer measures elapsed active play time only.

- Active time accumulates while the app is visible and the game is in progress.
- When the page is hidden, closed, or reloaded, timing stops.
- When the user returns, timing resumes from the saved elapsed active time.

Persistence:

- Current game state is saved to `localStorage` after meaningful changes.
- On page load, the app restores the saved in-progress game if one exists.
- Storage will be versioned so future schema changes can migrate or safely reset incompatible data.

## Stats

Stats are stored locally in the browser and include both solved and abandoned puzzles.

Solved records include:

- Difficulty.
- Elapsed active solve time.
- Completion timestamp.
- Puzzle metadata.

Abandoned records include:

- Difficulty.
- Elapsed active time before abandonment.
- Abandonment timestamp.
- Puzzle metadata.

The stats view will:

- Filter by difficulty level.
- Show completed puzzle counts.
- Show abandoned puzzle counts.
- Show solve-time summaries using solved puzzles only.
- Exclude abandoned puzzles from solve-time calculations.

## Testing

Add tests for:

- Sudoku solver correctness.
- Puzzle uniqueness validation.
- Dynamic puzzle generation by difficulty.
- Move rules for entering, clearing, erasing, and note toggling.
- Peer-note cleanup after correct entries.
- Undo behavior back to the starting puzzle.
- Reset behavior.
- Timer active-time calculations.
- Storage serialization/restoration.
- Stats aggregation and filtering.
- Key UI flows: selecting cells, number entry, long-press notes, show-errors toggle, completion dialog, abandon confirmation, and saved-game restore.

Run a production build check before considering the implementation complete.

## Deployment

The project will deploy to GitHub Pages as a static site.

- Vite will build the app into `dist/`.
- Vite will be configured for a GitHub Pages-compatible base path.
- A GitHub Actions workflow will build and publish the static output.
- No server-side runtime is required.

## Non-goals

- No server-side storage or backend API.
- No login or user accounts.
- No hint system.
- No advanced solving-technique difficulty rating.
- No cell background-color highlighting.
