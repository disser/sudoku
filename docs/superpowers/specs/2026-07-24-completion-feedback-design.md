# Completion Feedback Design

## Overview

Improve full-board completion feedback for both incorrect and correctly solved puzzles.

## Full but incorrect behavior

- When the board becomes full but does not match the solution, show a popup.
- The popup title should indicate that something is wrong.
- The popup should explain that the board is full but not solved yet.
- The popup includes a `Check for errors` button.
- Clicking `Check for errors` enables existing error highlighting by setting `showErrors` to true and closes the popup.
- The popup also includes a way to keep playing without enabling errors.
- A full-but-incorrect board must not record solved stats.
- Avoid showing the same wrong-board popup repeatedly without a board change.

## Correct solve behavior

- When the puzzle is solved correctly, show a short, fun CSS-based celebration animation before the finished dialog.
- The celebration should be brief, around 1 to 1.5 seconds.
- After the animation finishes, show the existing finished dialog with options to start a new puzzle at the same difficulty, pick a new difficulty, or view stats.
- Solved stats should still be recorded once per puzzle.
- The celebration should not require an external animation dependency.

## Testing

Add tests for:

- Full but incorrect board shows a wrong-board popup.
- `Check for errors` enables error highlighting and closes the popup.
- Full but incorrect board does not show the finished dialog or record solved stats.
- Correct solve shows a celebration first, then the finished dialog after timers advance.
- Solved stats are recorded once.
