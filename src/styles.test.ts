import { expect, test } from 'vitest';
import css from './styles.css?raw';

test('number pad stays close to the board instead of being pushed to the viewport bottom', () => {
  expect(css).not.toMatch(/\.pad\{[^}]*margin-top:auto/);
});
