# Keyboard Shortcuts Design

## Overview

Add two convenience keyboard shortcuts for gameplay.

## Behavior

- Pressing `u` with no modifier performs undo, matching the Undo button.
- Pressing `Tab` clears the selected cell and clears any board-wide digit highlight.
- `Tab` should call `preventDefault()` while handled so browser focus does not jump away from the game.
- Existing `Cmd+Z` and `Ctrl+Z` undo behavior remains unchanged.
- Shortcuts are ignored while a dialog, input, textarea, or select has focus.

## Testing

Add tests for:

- `u` undoes the previous move.
- `Tab` clears selection and digit highlight.
