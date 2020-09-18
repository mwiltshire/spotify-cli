import SpotifyWebApi from 'spotify-web-api-node';
import logger from '../utils/logger';
import createAction from '../create-action';

const handler = async (spotify: SpotifyWebApi) => {
  const currentTrackResponse = await spotify.getMyCurrentPlayingTrack({
    additional_types: 'episode'
  } as any);
  const currentTrack = currentTrackResponse.body.item;

  if (!currentTrack) {
    throw new Error(
      "Unable to save track. You're not currently playing anything!"
    );
  }

  const currentTrackType = (currentTrackResponse.body as any)
    .currently_playing_type;

  if (currentTrackType === 'ad') {
    throw new Error('Cannot save ad to library!');
  }

  if (currentTrackType === 'unknown') {
    throw new Error('Unable to determine playback type!');
  }

  if (currentTrackType === 'episode') {
    throw new Error('Saving shows is not currently supported!');
  }

  await spotify.addToMySavedTracks([currentTrack.id]);

  logger.spotify(
    `Saved ${currentTrack.name} by ${currentTrack.artists[0].name} to your library!`
  );
};

export const save = createAction(handler);
