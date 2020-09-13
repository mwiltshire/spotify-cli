import playArtist from '../play-artist';
import Spotify from 'spotify-web-api-node';

const MOCK_SEARCH = jest.fn(() => {
  return Promise.resolve({
    body: {
      artists: {
        items: [
          {
            uri: '123456789'
          }
        ]
      }
    }
  });
});

const MOCK_PLAY = jest.fn(() => {
  return Promise.resolve();
});

jest.mock('spotify-web-api-node', () => {
  return jest.fn().mockImplementation(() => {
    return {
      searchArtists: MOCK_SEARCH,
      play: MOCK_PLAY
    };
  });
});

jest.mock('../../utils/injectSpotify', () => (action: any) =>
  Promise.resolve((args: any) => action(new Spotify(), args))
);

test('action searches spotify for query and play with context URI', async () => {
  await playArtist({}, ['mogwai']);
  expect(MOCK_SEARCH).toHaveBeenCalledWith('mogwai');
  expect(MOCK_PLAY).toHaveBeenCalledWith({ context_uri: '123456789' });
});
