# Completion Feedback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add full-but-wrong feedback and a short solved celebration before the finished dialog.

**Architecture:** Add transient completion UI state in `App.tsx`, small dialog/overlay components, and CSS-only celebration styling.

**Tech Stack:** React, TypeScript, Vitest, Testing Library, CSS animations.

## Global Constraints

- Full incorrect boards show a popup and do not record solved stats.
- `Check for errors` enables existing `showErrors` highlighting.
- Correct solves show a short CSS-only celebration before the finished dialog.
- Solved stats are recorded once per puzzle.

---

### Task 1: Completion feedback

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/styles.css`
- Create: `src/components/WrongBoardDialog.tsx`
- Create: `src/components/CelebrationOverlay.tsx`

- [ ] **Step 1: Add failing tests**

Add tests for full incorrect popup, check-errors enabling highlighting, no finished dialog/stats on incorrect full board, correct solve celebration before finished dialog, and solved stat recorded once.

- [ ] **Step 2: Run targeted tests**

Run: `npm test -- src/App.test.tsx`

Expected: FAIL before implementation.

- [ ] **Step 3: Implement components**

Create `WrongBoardDialog` and `CelebrationOverlay`.

- [ ] **Step 4: Implement completion state**

In `App.tsx`, detect full incorrect vs solved. Show wrong popup once per board signature. Show celebration for solved, then finished dialog. Record solved stats once.

- [ ] **Step 5: Add CSS animation**

Add a simple sparkle/confetti-style celebration animation with no dependency.

- [ ] **Step 6: Verify**

Run: `npm test && npm run build`.

- [ ] **Step 7: Commit**

```bash
git add docs/superpowers/plans/2026-07-24-completion-feedback-implementation.md src/App.tsx src/App.test.tsx src/styles.css src/components/WrongBoardDialog.tsx src/components/CelebrationOverlay.tsx
git commit -m "Add completion feedback"
```
