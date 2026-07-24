# Interaction Polish Design

## Overview

Improve selected-cell visibility, desktop deselection, final-entry flow, erase/undo keyboard shortcuts, and long-press note reliability.

## Behavior changes

- Selected cells must have a much more visible style than the current pale background.
- Clicking outside the board should clear selection and digit highlight even when the click is to the left or right of the centered app content on desktop.
- Entering a final value by number pad or keyboard should deselect the cell after the value is applied.
- Entering or toggling a note should not deselect the cell.
- `Space`, `Backspace`, `Delete`, and `0` should erase the selected cell.
- `Cmd+Z` on Mac and `Ctrl+Z` on other platforms should undo.
- Keyboard shortcuts should still be ignored while a dialog, input, textarea, or select has focus.
- Long-pressing a number on the number pad should toggle a note only. Releasing after a long press must not also enter the number as a final value.

## Implementation notes

- Move the outer click handler to a full-width app shell so desktop side clicks are captured.
- Keep board and pad click handlers stopping propagation so normal interactions do not count as outside clicks.
- Use refs in `NumberPad` for long-press timer and fired state so state is stable across React re-renders.
- Use a stronger `.selected` style, such as a blue inset ring and stronger background.

## Testing

Add tests for:

- Final value entry deselects the selected cell.
- Shift-number note entry keeps the selected cell selected.
- Space erases a selected cell.
- Cmd/Ctrl-Z undo restores the previous cell state.
- Clicking the outer shell clears selection/highlight.
- Long-pressing a pad number toggles a note without also entering a final value.
