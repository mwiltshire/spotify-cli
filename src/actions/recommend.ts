import SpotifyWebApi from 'spotify-web-api-node';
import inquirer from 'inquirer';
import logger from '../utils/logger';
import createAction from '../create-action';

type Seed = 'artists' | 'tracks';

interface RecommendHandlerOptions {
  seed?: Seed;
}

interface GetRecommendationsOptions {
  seed_artists?: string[];
  seed_tracks?: string[];
}

const getSeedOptions = async (spotify: SpotifyWebApi, seed: Seed) => {
  const limitOption = { limit: 5 };

  const seedOptions: GetRecommendationsOptions = {};

  if (seed === 'artists') {
    const res = await spotify.getMyTopArtists(limitOption);
    seedOptions.seed_artists = res.body.items.map((item) => item.id);
  } else {
    const res = await spotify.getMyTopTracks(limitOption);
    seedOptions.seed_tracks = res.body.items.map((item) => item.id);
  }

  return seedOptions;
};

const handler = async (
  spotify: SpotifyWebApi,
  [{ seed = 'artists' }]: [RecommendHandlerOptions]
) => {
  if (seed !== 'artists' && seed !== 'tracks') {
    throw new Error(
      `'${seed}' is not a valid seed value. This option must be either 'artists' or 'tracks'`
    );
  }

  logger.info('Loading recommendations...');

  const seedOptions = await getSeedOptions(spotify, seed);

  if (Object.values(seedOptions).every((v) => !v.length)) {
    throw new Error(`You do not have any top ${seed}!`);
  }

  const recommendationsResponse = await spotify.getRecommendations(seedOptions);

  const recommendations = recommendationsResponse.body.tracks;

  if (!recommendations.length) {
    throw new Error('Unable to provide any recommendations!');
  }

  const tracks = recommendations.map(
    (track) => `${track.name} by ${track.artists[0].name}`
  );

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'selected',
      message: 'Select a recommended track to play.',
      choices: ['Play all', ...tracks]
    }
  ]);

  let uris: string[];

  if (answer.selected === 'Play all') {
    uris = recommendations.map((track) => track.uri);
  } else {
    const index = tracks.findIndex(
      (track) => track === answer.selected
    ) as number;
    uris = [recommendations[index].uri];
  }

  await spotify.play({ uris });

  logger.spotify(
    answer.selected === 'Play all'
      ? 'Playing all recommended tracks'
      : `Playing ${answer.selected}`
  );
};

export const recommend = createAction(handler);
