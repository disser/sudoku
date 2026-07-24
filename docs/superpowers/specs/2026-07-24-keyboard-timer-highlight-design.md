# Keyboard, Timer, and Highlight Refinement Design

## Overview

Refine timer reliability, add desktop keyboard input, and allow board-wide digit highlights to persist while entering the same highlighted digit.

## Timer behavior

- Timer counts active visible play time only.
- Timer should continue updating reliably on desktop while the page remains visible.
- Timer should pause while the page is hidden and resume when visible.
- Timer implementation should avoid recreating its interval on every tick.
- Current game persistence should continue saving elapsed time, but timer mechanics should not depend on frequent component remounts or interval recreation.

## Keyboard input

- If a cell is selected, pressing `1` through `9` enters or toggles that final value in the selected cell.
- If a cell is selected, pressing `Shift+1` through `Shift+9` toggles that candidate note in the selected cell.
- If a cell is selected, pressing `Backspace`, `Delete`, or `0` erases the selected cell.
- If no cell is selected, pressing `1` through `9` toggles board-wide digit highlighting, matching number-pad behavior.
- Keyboard shortcuts should be ignored while a dialog, menu, select, input, or textarea has focus.

## Digit highlight behavior

- Board-wide digit highlighting may remain active while a cell is selected.
- Selecting a cell does not clear an active digit highlight.
- If a digit is highlighted and the user enters or toggles that same digit as a final value or note, the highlight remains active.
- If a digit is highlighted and the user enters or toggles a different digit, the highlight clears.
- Clicking outside the board clears both selected cell and highlight.
- With no selected cell, tapping or typing the same highlighted number clears the highlight; tapping or typing a different number switches the highlight.

## Testing

Add tests for:

- Timer advances over repeated ticks while visible.
- Timer pauses while hidden and resumes while visible.
- Keyboard final value entry, note entry, and erase.
- Keyboard highlight toggle when no cell is selected.
- Highlight remains when entering/toggling the highlighted digit.
- Highlight clears when entering/toggling a different digit.
