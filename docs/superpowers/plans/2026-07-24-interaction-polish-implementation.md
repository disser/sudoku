# Interaction Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish Sudoku interactions for clearer selection, desktop deselection, keyboard erase/undo, final-entry deselection, and reliable long-press notes.

**Architecture:** Keep app interaction orchestration in `App.tsx`, fix pointer timing in `NumberPad.tsx` using refs, and adjust CSS in `styles.css`.

**Tech Stack:** React, TypeScript, Vitest, Testing Library.

## Global Constraints

- Final value entry deselects the cell.
- Note entry keeps the cell selected.
- Space, Backspace, Delete, and 0 erase the selected cell.
- Cmd-Z and Ctrl-Z undo.
- Long-press note must not also trigger final entry on release.
- Desktop side clicks outside centered content clear selection/highlight.

---

### Task 1: Interaction polish

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/components/NumberPad.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Add failing tests**

Add tests covering final-entry deselection, note-entry retaining selection, Space erase, Cmd/Ctrl-Z undo, outer shell click clearing selection/highlight, and long-press note not becoming final value.

- [ ] **Step 2: Run targeted tests**

Run: `npm test -- src/App.test.tsx`

Expected: FAIL before implementation.

- [ ] **Step 3: Implement App interaction changes**

Add an outer `.app-shell` click target, deselect after final digit entry, keep selected after note entry, add Space erase, and add meta/ctrl-Z undo.

- [ ] **Step 4: Fix NumberPad long press**

Use `useRef` for timer and long-press-fired tracking. Clear timers on pointer leave/cancel. Pointer-up should call tap only when long press has not fired.

- [ ] **Step 5: Improve selected CSS**

Make `.selected` visibly stronger with a clear blue inset outline/ring and background.

- [ ] **Step 6: Verify**

Run: `npm test && npm run build`.

- [ ] **Step 7: Commit**

```bash
git add docs/superpowers/plans/2026-07-24-interaction-polish-implementation.md src/App.tsx src/App.test.tsx src/components/NumberPad.tsx src/styles.css
git commit -m "Polish Sudoku interactions"
```
