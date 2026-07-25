import { expect, test } from 'vitest';

declare const require: (module: string) => { readFileSync: (path: string, encoding: string) => string };
const { readFileSync } = require('fs');
const css = readFileSync('src/styles.css', 'utf8');

test('number pad stays close to the board instead of being pushed to the viewport bottom', () => {
  expect(css).not.toMatch(/\.pad\{[^}]*margin-top:auto/);
});

test('number pad buttons prevent mobile text selection during long press', () => {
  expect(css).toMatch(/\.pad button\{[^}]*-webkit-user-select:none/);
  expect(css).toMatch(/\.pad button\{[^}]*user-select:none/);
  expect(css).toMatch(/\.pad button\{[^}]*touch-action:manipulation/);
});
