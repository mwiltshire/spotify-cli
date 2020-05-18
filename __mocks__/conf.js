const mock = jest.fn().mockImplementation(() => {
  return {
    set: jest.fn(),
    get: jest.fn()
  };
});

module.exports = mock;
