import Spotify from 'spotify-web-api-node';
import playArtist from '../play-artist';
import { mockSearchArtists, mockPlay } from '../../test-mocks.ts';

jest.mock('spotify-web-api-node', () => {
  return jest.fn().mockImplementation(() => {
    return {
      searchArtists: mockSearchArtists,
      play: mockPlay
    };
  });
});

jest.mock('../../utils/inject-spotify', () => (action: any) =>
  Promise.resolve((args: any) => action(new Spotify(), args))
);

test('action searches spotify for query and calls play with context URI', async () => {
  await playArtist({}, ['mogwai']);

  expect(mockSearchArtists).toHaveBeenCalledWith('mogwai');
  expect(mockPlay).toHaveBeenCalledWith({
    context_uri: 'spotify:artist:34UhPkLbtFKRq3nmfFgejG'
  });
});
