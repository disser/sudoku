# Keyboard Shortcuts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `u` undo and `Tab` clear-selection shortcuts.

**Architecture:** Extend the existing keyboard handler in `App.tsx` and cover behavior in `App.test.tsx`.

**Tech Stack:** React, TypeScript, Vitest, Testing Library.

## Global Constraints

- `u` with no modifier performs undo.
- `Tab` clears selected cell and digit highlight.
- `Tab` prevents browser focus movement while handled.
- Dialog/input/select shortcut ignore behavior remains unchanged.

---

### Task 1: Keyboard shortcuts

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Add failing tests**

Add tests for `u` undo and `Tab` clearing selection/highlight.

- [ ] **Step 2: Run targeted tests**

Run: `npm test -- src/App.test.tsx`

Expected: FAIL before implementation.

- [ ] **Step 3: Implement shortcuts**

Add `u` and `Tab` branches to the existing keydown handler.

- [ ] **Step 4: Verify**

Run: `npm test && npm run build`.

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/plans/2026-07-24-keyboard-shortcuts-implementation.md src/App.tsx src/App.test.tsx
git commit -m "Add undo and unselect keyboard shortcuts"
```
