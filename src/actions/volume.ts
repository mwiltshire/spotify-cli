import SpotifyWebApi from 'spotify-web-api-node';
import createAction from '../create-action';

const matchNumberBetween0And100 = (number: string) =>
  /^\d+$/.test(number) && Number(number) >= 0 && Number(number) <= 100;

const handler = async (spotify: SpotifyWebApi, options: any[]) => {
  const [percent] = options;
  if (!percent) {
    throw new Error('Volume percent is required!');
  }

  if (!matchNumberBetween0And100(percent)) {
    throw new Error(`Invalid percent argument.

Received: '${percent}'

Percent must be a number between 0 and 100. E.g.:

spotify volume 99
`);
  }

  await spotify.setVolume(Number(percent));
};

export const volume = createAction(handler);
