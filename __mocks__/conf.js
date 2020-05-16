const mock = jest.fn().mockImplementation(() => {
  return {
    set: jest.fn(),
    get: jest.fn(() => ({
      client_id: '1234',
      client_secret: '5678',
      accessToken: '1234',
      refreshToken: '1234',
      tokenRetrievedAt: 1589644712
    }))
  };
});

module.exports = mock;
