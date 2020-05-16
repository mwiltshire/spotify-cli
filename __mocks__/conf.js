const mock = jest.fn().mockImplementation(() => {
  return {
    set: jest.fn(),
    get: jest.fn(() => ({
      client_id: '1234',
      client_secret: '5678'
    }))
  };
});

module.exports = mock;
