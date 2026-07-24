# Completed Digits and Shift-Key Note Entry Design

## Overview

Improve number pad visual feedback and fix shifted keyboard note entry on desktop keyboards.

## Completed digit behavior

- The app counts visible final values on the board, including original givens and user-entered final values.
- When a digit appears 9 times as a final value, that digit's number-pad button is visually greyed out.
- Greyed-out completed digit buttons remain interactive. They are not disabled, because users may still want to highlight that digit or correct mistakes.
- Notes do not count toward completed digits.

## Shift-key note entry

- Keyboard digit detection should support normal `1` through `9` entry.
- Keyboard digit detection should support shifted top-row digit keys such as `Shift+5`, where browsers may report `event.key` as `%` while `event.code` is `Digit5`.
- Keyboard digit detection should support numeric keypad digit keys where available.
- Shift plus a detected digit toggles a note in the selected cell.
- A detected digit without Shift enters/toggles a final value or toggles board-wide highlight when no cell is selected.

## Testing

Add tests for:

- `Shift+5` using `key: '%'` and `code: 'Digit5'` toggles note 5 in the selected cell.
- A digit whose visible final values appear 9 times gets a completed/greyed-out number-pad style.
- Completed digit buttons remain clickable for highlighting when no cell is selected.
