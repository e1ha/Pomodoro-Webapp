import { test } from '@jest/globals';

import { addNums } from './sample';

test('Adds 2 and 2 to equal 4', () => {
  return expect(addNums(2, 2)).toBe(4);
});
