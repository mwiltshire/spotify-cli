import Spotify from 'spotify-web-api-node';
import createAction from '../create-action';
import injectSpotify from '../utils/inject-spotify';

jest.mock('../utils/inject-spotify', () =>
  jest.fn((action: any) =>
    Promise.resolve((args: any) => action(new Spotify(), args))
  )
);

test('Spotify is injected into the action handler', async () => {
  const actionHandler = () => Promise.resolve();
  const action = createAction(actionHandler);

  await action();

  expect(injectSpotify).toHaveBeenCalledWith(actionHandler);
});

test('action handler is called with Spotify instance and args', async () => {
  const actionHandler = jest.fn(() => Promise.resolve());
  const action = createAction(actionHandler);

  await action({}, 'test');

  expect(actionHandler).toHaveBeenCalledWith(expect.any(Spotify), [{}, 'test']);
});
