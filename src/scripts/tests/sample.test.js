/*eslint-env es6*/
const { test } = require("@jest/globals");
const functions = require('./sample');

test('Adds 2 and 2 to equal 4', () => {
    expect(functions.addNums(2,2)).toBe(4);
});
