const fn = require('../dist')

test('typeof', () => {
  expect(typeof fn).toBe('function')
})
