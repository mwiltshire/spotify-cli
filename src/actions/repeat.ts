import SpotifyWebApi from 'spotify-web-api-node';
import createAction from '../create-action';

// TODO: Support targeting specific device_id, default repeat mode of track??

const handler = async (spotify: SpotifyWebApi, options: any[]) => {
  const [mode] = options;

  if (!['track', 'context', 'off'].includes(mode)) {
    throw new Error(`Invalid repeat mode.

Received mode: ${mode}
  
Please specify a repeat mode of 'track', 'context' or 'off'. E.g.:

spotify repeat track
spotify repeat context
spotify repeat off
`);
  }

  await spotify.setShuffle({ state: mode });
};

export const repeat = createAction(handler);
