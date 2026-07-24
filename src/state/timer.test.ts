import { expect, test } from 'vitest';
import { formatElapsed } from './timer';
test('formats elapsed time',()=>{expect(formatElapsed(65000)).toBe('1:05'); expect(formatElapsed(3661000)).toBe('1:01:01');});
