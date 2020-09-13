import Spotify from 'spotify-web-api-node';
import playTrack from '../play-track';
import { mockSearchTracks, mockPlay } from '../../test-mocks.ts';

jest.mock('spotify-web-api-node', () => {
  return jest.fn().mockImplementation(() => {
    return {
      searchTracks: mockSearchTracks,
      play: mockPlay
    };
  });
});

jest.mock('../../utils/inject-spotify', () => (action: any) =>
  Promise.resolve((args: any) => action(new Spotify(), args))
);

test('action searches spotify for query and play with context URI', async () => {
  await playTrack({}, ['kids will be skeletons']);

  expect(mockSearchTracks).toHaveBeenCalledWith('kids will be skeletons');
  expect(mockPlay).toHaveBeenCalledWith({
    uris: ['spotify:track:3xogCrlDsnIZ7nQo8VvRL6']
  });
});
