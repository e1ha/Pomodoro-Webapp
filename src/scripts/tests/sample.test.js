const { test } = require("@jest/globals");

const functions = {
    returnNull: () => null
};

test('Sample test: ', () => {
    expect(functions.returnNull()).toBe(null)
});