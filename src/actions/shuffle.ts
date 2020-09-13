import SpotifyWebApi from 'spotify-web-api-node';
import createAction from '../create-action';

// TODO: Support targeting specific device_id

const shuffle = async (spotify: SpotifyWebApi, options: any[]) => {
  const [state] = options;

  if (state !== 'on' || state !== 'off') {
    throw new Error(`Invalid shuffle state.

Received state: ${state}
  
Please specify 'on' to activate playback shuffle or 'off' to deactivate it. E.g.:

spotify shuffle on
spotify shuffle off
`);
  }

  await spotify.setShuffle({ state: state === 'on' });
};

export default createAction(shuffle);
