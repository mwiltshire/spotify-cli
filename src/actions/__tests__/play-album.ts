import Spotify from 'spotify-web-api-node';
import playAlbum from '../play-album';
import { mockSearchAlbums, mockPlay } from '../../test-mocks.ts';

jest.mock('spotify-web-api-node', () => {
  return jest.fn().mockImplementation(() => {
    return {
      searchAlbums: mockSearchAlbums,
      play: mockPlay
    };
  });
});

jest.mock('../../utils/inject-spotify', () => (action: any) =>
  Promise.resolve((args: any) => action(new Spotify(), args))
);

test('action searches spotify for query and calls play with context URI', async () => {
  await playAlbum('mr. beast');

  expect(mockSearchAlbums).toHaveBeenCalledWith('mr. beast');
  expect(mockPlay).toHaveBeenCalledWith({
    context_uri: 'spotify:album:12lwDzvs23w1e8EKa5zQoC'
  });
});
