# Digit Highlight Interaction Design

## Overview

Add a transient digit-highlighting mode for the Sudoku board when no cell is selected.

## Behavior

- The app tracks `selectedCell: number | null` instead of always having a selected cell.
- Clicking a board cell selects that cell and clears any active digit highlight.
- Clicking outside the board clears both the selected cell and any active digit highlight.
- When no cell is selected, tapping a number in the entry pad toggles highlighting for that digit.
- Tapping the same highlighted digit clears the highlight.
- Tapping a different digit switches the highlight to that digit.
- Highlighting applies to cells whose visible final value matches the digit and to empty cells whose notes include the digit.
- Final-value matches and note matches use the same highlight style.
- When a cell is selected, number pad behavior remains unchanged: tap enters or clears the value, and long-press toggles a note.
- Long-pressing a number with no selected cell does nothing.
- Digit highlighting is transient UI state and is not saved to localStorage.

## Testing

Add UI tests for:

- Starting with no selected cell.
- Tapping a digit with no selected cell highlights matching final values and notes.
- Tapping the same digit clears the highlight.
- Tapping a different digit switches the highlight.
- Clicking outside the board clears selection and highlight.
- Selecting a cell clears highlight and restores number-entry behavior.
