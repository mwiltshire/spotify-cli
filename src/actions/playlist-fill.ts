import SpotifyWebApi from 'spotify-web-api-node';
import createAction from '../create-action';
import logger from '../utils/logger';

interface PlaylistFillOptions {
  seed?: string;
  mode?: 'hipster';
}

const handler = async (
  spotify: SpotifyWebApi,
  args: [string, PlaylistFillOptions]
) => {
  const [name, options] = args;

  const seed: string[] = [];

  if (options.seed) {
    const { body: artist } = await spotify.searchArtists(options.seed, {
      limit: 1
    });
    seed.push(artist.artists?.items[0].id as string);
  } else {
    const { body: topArtists } = await spotify.getMyTopArtists({ limit: 1 });
    seed.push(topArtists.items[0].id);
  }

  const limit = 19;
  const uris: string[] = [];

  for (let i = 0; i <= limit; i++) {
    let options: Record<string, any> = {
      limit: 1,
      seed_artists: seed
    };

    if (options?.mode === 'hipster') {
      options = { ...options, max_popularity: 30 };
    }

    const { body: recommendation } = await spotify.getRecommendations(options);
    const trackUri = recommendation.tracks[0].uri;

    uris.push(trackUri);

    // Spotify allows a maximum of 5 seed artists to be passed.
    seed.length === 5
      ? seed.splice((i % 5) - 1, 1, recommendation.tracks[0].artists[0].id)
      : seed.push(recommendation.tracks[0].artists[0].id);
  }

  const { body: user } = await spotify.getMe();

  const { body: playlist } = await spotify.createPlaylist(user.id, name, {
    public: false
  });

  await spotify.addTracksToPlaylist(playlist.id, uris);

  logger.success(`Created playlist ${name}!`);
};

export const playlistFill = createAction(handler);
