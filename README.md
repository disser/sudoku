# Sudoku

A static, mobile-first Sudoku app built with Vite, React, and TypeScript. It generates unique puzzles locally, saves in-progress games and historical stats in browser localStorage, and can deploy to GitHub Pages.

## Commands

```bash
npm install
npm run dev
npm test
npm run build
```

## GitHub Pages

Enable Pages for the repository using GitHub Actions as the source. Pushes to `main` run tests, build `dist/`, and deploy the static site.
