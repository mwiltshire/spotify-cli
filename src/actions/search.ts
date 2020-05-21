import SpotifyWebApi from 'spotify-web-api-node';
import inquirer from 'inquirer';
import injectSpotify from '../utils/injectSpotify';
import logger from '../utils/logger';

type SearchType = 'artist' | 'album' | 'track' | 'playlist';

type SearchTypeResponseField = 'artists' | 'albums' | 'tracks' | 'playlists';

type SearchTypeOptions = Partial<
  {
    [k in SearchType]: boolean;
  }
>;

interface SearchOptions extends SearchTypeOptions {
  [k: string]: any;
}

const getSearchTypes = (options: SearchOptions) => {
  const types: SearchType[] = ['artist', 'album', 'track', 'playlist'];
  const filteredTypes = types.filter((type) => type in options);
  return filteredTypes.length ? filteredTypes : types;
};

const pluralize = (types: SearchType[]): SearchTypeResponseField[] =>
  types.map((type) => `${type}s` as SearchTypeResponseField);

const action = async (spotify: SpotifyWebApi, args: any[]) => {
  const [query, options] = args as [string, SearchOptions];

  const searchTypes = getSearchTypes(options);

  const { body } = await spotify.search(query, searchTypes);

  const fields = pluralize(searchTypes);

  const questions: any[] = [];

  if (searchTypes.length === 1) {
    // Only one search type, don't need to prompt type selection
    const prompts = {
      type: 'list',
      name: 'play',
      choices: (body[fields[0]]?.items as any[]).map((item) => item.name),
      message: `Results for ${searchTypes[0]}`,
      pageSize: 10
    };
    questions.push(prompts);
  } else {
    const prompts = [
      {
        type: 'list',
        name: 'type',
        choices: Object.keys(body),
        message: 'Narrow down your search',
        pageSize: 10
      },
      {
        type: 'list',
        name: 'play',
        choices: (body.artists?.items as any[]).map((item) => item.name),
        message: `Showing artists (hit enter to play)`,
        pageSize: 10,
        when: (answers) => answers.type === 'artists'
      },
      {
        type: 'list',
        name: 'play',
        choices: (body.albums?.items as any[]).map((item) => item.name),
        message: `Showing albums (hit enter to play)`,
        pageSize: 10,
        when: (answers) => answers.type === 'albums'
      },
      {
        type: 'list',
        name: 'play',
        choices: (body.tracks?.items as any[]).map((item) => item.name),
        message: `Showing tracks (hit enter to play)`,
        pageSize: 10,
        when: (answers) => answers.type === 'tracks'
      },
      {
        type: 'list',
        name: 'play',
        choices: (body.playlists?.items as any[]).map((item) => item.name),
        message: `Showing playlists (hit enter to play)`,
        pageSize: 10,
        when: (answers) => answers.type === 'playlists'
      }
    ];
    questions.push(...prompts);
  }

  const answers = await inquirer.prompt(questions);
  const type = answers.type || fields[0];
  const uri = (body[type]?.items as any[]).find(
    (item) => item.name === answers.play
  ).uri;

  await spotify.play(
    /track/.test(uri) ? { uris: [uri] } : { context_uri: uri }
  );
};

// TODO: Support filters

const search = async (...args: any[]) => {
  try {
    const handler = await injectSpotify(action);
    await handler(args);
  } catch (error) {
    logger.error(error?.message);
  }
};

export default search;
