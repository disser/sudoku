# Completed Digits and Shift-Key Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Grey out completed number-pad digits and fix shifted keyboard note entry.

**Architecture:** Add a keyboard digit parser and visible-value counting in `App.tsx`, pass completed digits into `NumberPad.tsx`, and style completed pad buttons in CSS.

**Tech Stack:** React, TypeScript, Vitest, Testing Library.

## Global Constraints

- Completed digit count includes givens and user-entered final values.
- Notes do not count as completed digits.
- Completed pad buttons are visually greyed out but remain interactive.
- Shifted top-row keys like `%` with `code: Digit5` must toggle notes.

---

### Task 1: Completed digits and shifted keyboard parser

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/components/NumberPad.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Add failing tests**

Add tests for shifted `%`/`Digit5` note entry, completed digit pad styling, and completed digit clickability for highlighting.

- [ ] **Step 2: Run targeted tests**

Run: `npm test -- src/App.test.tsx`

Expected: FAIL before implementation.

- [ ] **Step 3: Implement keyboard digit parser**

In `App.tsx`, add `digitFromKeyboardEvent(event): Digit | null`. Check `event.key` for `1`-`9`, then `event.code` for `Digit1`-`Digit9` and `Numpad1`-`Numpad9`.

- [ ] **Step 4: Implement completed digit calculation**

In `App.tsx`, calculate digits whose visible final values appear 9 times. Count `game.puzzle[i] || game.values[i]`; ignore notes.

- [ ] **Step 5: Pass and style completed digits**

Update `NumberPad` to accept `completedDigits: Digit[]` and apply `completed` class to matching buttons. Add CSS greyed-out style without disabling pointer/keyboard interaction.

- [ ] **Step 6: Verify**

Run: `npm test && npm run build`.

- [ ] **Step 7: Commit**

```bash
git add docs/superpowers/plans/2026-07-24-completed-digits-shift-key-implementation.md src/App.tsx src/App.test.tsx src/components/NumberPad.tsx src/styles.css
git commit -m "Grey completed digits and fix shift note entry"
```
