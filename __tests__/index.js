/* eslint-env jest */
const Lib = require('../lib');

test('Hello World', async () => {
  const message = await Lib.hello();

  expect(message).toBe('Hello World');
});

