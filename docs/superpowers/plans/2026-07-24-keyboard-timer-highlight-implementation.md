# Keyboard Timer Highlight Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix desktop timer reliability, add keyboard entry, and refine digit-highlight persistence.

**Architecture:** Keep changes in `App.tsx` and tests. Use stable refs for timer state and action handlers to avoid interval recreation/stale closures. Keep highlighting transient UI state.

**Tech Stack:** React, TypeScript, Vitest, Testing Library.

## Global Constraints

- Timer counts active visible play time only.
- Keyboard final entry uses `1` through `9`; notes use `Shift+1` through `Shift+9`; erase uses `Backspace`, `Delete`, or `0`.
- Keyboard shortcuts are ignored while a dialog, menu, select, input, or textarea has focus.
- Highlight may remain active while a cell is selected.
- Entering/toggling the highlighted digit preserves highlight; entering/toggling a different digit clears highlight.

---

### Task 1: Timer reliability

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Timer remains internal to `App`.

- [ ] **Step 1: Add failing timer tests**

Use fake timers with a saved game in localStorage. Render `App`, advance timers by several seconds while visible, assert elapsed display advances. Mock `document.visibilityState` to hidden, advance timers, assert display does not advance; restore visible, advance, assert it resumes.

- [ ] **Step 2: Run targeted tests**

Run: `npm test -- src/App.test.tsx`

Expected: FAIL until timer is refactored.

- [ ] **Step 3: Refactor timer**

Use a single interval per game id/status. Store `lastTickRef`. On each tick, update elapsed by `now - lastTickRef.current` only if visible; always reset `lastTickRef.current = now`. Do not include elapsed time in the effect dependencies.

- [ ] **Step 4: Verify targeted tests**

Run: `npm test -- src/App.test.tsx`

Expected: PASS.

---

### Task 2: Keyboard and highlight persistence

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/components/Board.tsx`

**Interfaces:**
- Board still receives `highlightDigit` and nullable `selected`.

- [ ] **Step 1: Add failing keyboard/highlight tests**

Test digit key entry, Shift+digit note entry, Backspace erase, no-selected-cell digit highlight via keyboard, selecting a cell preserves existing highlight, entering same highlighted digit preserves it, entering different digit clears it.

- [ ] **Step 2: Run targeted tests**

Run: `npm test -- src/App.test.tsx`

Expected: FAIL until keyboard/highlight behavior is implemented.

- [ ] **Step 3: Implement shared action helpers**

In `App.tsx`, create helpers `handleDigit(digit, mode)`, `handleErase()`, and `shouldIgnoreKeyboard(target)`. Use them from number pad and keyboard listener. Preserve highlight when `highlightDigit === digit`; clear it when selected cell entry/note uses a different digit.

- [ ] **Step 4: Update board selection**

Selecting a cell should stop clearing highlight. Outside main click should still clear both selection and highlight.

- [ ] **Step 5: Verify targeted tests**

Run: `npm test -- src/App.test.tsx`

Expected: PASS.

---

### Task 3: Final verification and commit

**Files:**
- Modify: `docs/superpowers/plans/2026-07-24-keyboard-timer-highlight-implementation.md`
- Modify: files changed by Tasks 1–2.

- [ ] **Step 1: Run full verification**

Run: `npm test && npm run build`

Expected: PASS.

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/plans/2026-07-24-keyboard-timer-highlight-implementation.md src/App.tsx src/App.test.tsx src/components/Board.tsx
git commit -m "Fix timer and add keyboard entry"
```
