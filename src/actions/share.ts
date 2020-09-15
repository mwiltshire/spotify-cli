import SpotifyWebApi from 'spotify-web-api-node';
import clipboard from 'clipboardy';
import logger from '../utils/logger';
import createAction from '../create-action';

const handler = async (spotify: SpotifyWebApi) => {
  const {
    body: { item }
  } = await spotify.getMyCurrentPlayingTrack();

  if (!item) {
    throw new Error('No playback object available!');
  }

  const shareLink = `https://open.spotify.com/track/${item.id}`;
  clipboard.writeSync(shareLink);
  logger.spotify(
    `Copied song link to clipboard: https://open.spotify.com/track/${item.id}`
  );
};

export const share = createAction(handler);
