function getSum(a, b) {
  return a + b;
}

test('Checking if 2+2=4', () => expect(getSum(2, 3)).toBe(5));
