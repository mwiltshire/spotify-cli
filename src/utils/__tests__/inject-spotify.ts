import injectSpotify, { Action } from '../inject-spotify';
import config from '../../config';

jest.mock('../../config', () => ({
  set: jest.fn(),
  get: jest.fn(() => ({
    clientId: '1234',
    clientSecret: '5678',
    accessToken: '1234',
    refreshToken: '1234',
    tokenRetrievedAt: 1589644712
  }))
}));

const mockSetClientId = jest.fn();
const mockSetClientSecret = jest.fn();
const mockSetAccessToken = jest.fn();
const mockSetRefreshToken = jest.fn();
const mockRefreshAccessToken = jest.fn(() => ({
  body: { access_token: '1234' }
}));

jest.mock('spotify-web-api-node', () =>
  jest.fn().mockImplementation(() => {
    return {
      setAccessToken: mockSetAccessToken,
      setRefreshToken: mockSetRefreshToken,
      refreshAccessToken: mockRefreshAccessToken,
      setClientId: mockSetClientId,
      setClientSecret: mockSetClientSecret
    };
  })
);

const mockAction: Action = jest.fn(() => Promise.resolve());

test('handler is returned if token is valid without requesting new token', async () => {
  const originalDateNow = Date.now;
  // Simulate token being around 15 minutes old
  Date.now = jest.fn(() => 1589645712150);

  const handler = await injectSpotify(mockAction);
  await handler(['option']);

  expect(handler).toBeInstanceOf(Function);
  expect(mockSetAccessToken).toHaveBeenCalledTimes(1);
  expect(mockRefreshAccessToken).not.toHaveBeenCalled();

  Date.now = originalDateNow;
});

test('action is passed spotify object and command options when handler called', async () => {
  const originalDateNow = Date.now;
  // Simulate token being around 15 minutes old
  Date.now = jest.fn(() => 1589645712150);

  const handler = await injectSpotify(mockAction);
  await handler(['option']);

  expect(mockAction).toHaveBeenCalledWith(
    expect.objectContaining({
      setAccessToken: expect.anything()
    }),
    ['option']
  );

  Date.now = originalDateNow;
});

test('new token is requested if token is invalid', async () => {
  const originalDateNow = Date.now;
  // Simulate token being around 3 hours old
  Date.now = jest.fn(() => 1599645712150);

  await injectSpotify(mockAction);

  expect(mockSetClientId).toHaveBeenCalledTimes(1);
  expect(mockSetClientSecret).toHaveBeenCalledTimes(1);
  expect(mockSetRefreshToken).toHaveBeenCalledTimes(1);
  expect(mockRefreshAccessToken).toHaveBeenCalledTimes(1);
  expect(mockSetAccessToken).toHaveBeenCalledTimes(1);

  Date.now = originalDateNow;
});

test('current auth data is retrieved from configuration when called', async () => {
  const originalDateNow = Date.now;
  // Simulate token being around 15 minutes old
  Date.now = jest.fn(() => 1589645712150);

  await injectSpotify(mockAction);

  expect(config.get).toHaveBeenCalledTimes(1);
  expect(config.get).toHaveBeenCalledWith('tokens');

  Date.now = originalDateNow;
});

test('new token is written to config file if refreshed', async () => {
  const originalDateNow = Date.now;
  // Simulate token being around 3 hours old
  Date.now = jest.fn(() => 1599645712150);

  await injectSpotify(mockAction);

  expect(config.set).toHaveBeenCalledTimes(1);
  expect(config.set).toHaveBeenCalledWith('tokens.accessToken', '1234');

  Date.now = originalDateNow;
});
