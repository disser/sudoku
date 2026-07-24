# Digit Highlight Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add transient digit highlighting when no Sudoku cell is selected.

**Architecture:** Keep highlight as UI-only state in `App.tsx`. Pass `highlightDigit` to `Board.tsx`, and apply one CSS class to cells whose value or notes match.

**Tech Stack:** React, TypeScript, Vitest, Testing Library.

## Global Constraints

- Highlighting is only available when no cell is selected.
- Tapping a matching number toggles/switches highlight.
- Clicking outside the board clears selection and highlight.
- Selecting a cell clears highlight and preserves existing entry/note behavior.
- Highlight state is not persisted.

---

### Task 1: Add digit highlight UI state and tests

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/Board.tsx`
- Modify: `src/components/NumberPad.tsx`
- Modify: `src/styles.css`
- Modify: `src/App.test.tsx`

**Interfaces:**
- `Board` accepts `selected: number | null` and `highlightDigit: Digit | null`.
- `NumberPad` tap handler remains `onTap(digit)`; `App` decides whether that tap enters a value or toggles highlight.

- [ ] **Step 1: Write failing UI tests**

Add tests in `src/App.test.tsx` that mock puzzle generation, start an easy puzzle, click outside the board to clear selection, tap number `1`, verify matching value/note cells get a `highlight` class, tap `1` again to clear, tap `2` to switch, and select a cell to clear highlight.

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- src/App.test.tsx`

Expected: FAIL because highlight behavior is missing.

- [ ] **Step 3: Implement UI state**

In `App.tsx`, change selected state to `number | null`. Add `highlightDigit: Digit | null`. Board cell click sets selected and clears highlight. Main background click clears both. Number pad tap toggles highlight when selected is null; otherwise it enters a value. Long press does nothing when selected is null.

- [ ] **Step 4: Implement board highlight class**

In `Board.tsx`, apply `highlight` when `highlightDigit` matches a cell's visible value or an empty cell's notes. Accept nullable selection.

- [ ] **Step 5: Add CSS**

In `src/styles.css`, add `.highlight` styling that is visible for both values and note cells without overriding `.incorrect` too aggressively.

- [ ] **Step 6: Verify**

Run: `npm test && npm run build`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx src/App.test.tsx src/components/Board.tsx src/components/NumberPad.tsx src/styles.css docs/superpowers/plans/2026-07-24-digit-highlight-implementation.md
git commit -m "Add digit highlighting when no cell is selected"
```
