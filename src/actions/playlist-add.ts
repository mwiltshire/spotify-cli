import SpotifyWebApi from 'spotify-web-api-node';
import createAction from '../create-action';
import logger from '../utils/logger';

const handler = async (spotify: SpotifyWebApi, args: [string, string, any]) => {
  const [name, uri, options] = args;

  const userPlaylistsResponse = await spotify.getUserPlaylists();

  // What if user has multiple playlists with the same name?
  const playlistToUpdate = userPlaylistsResponse.body.items.find(
    (playlist) => playlist.name === name
  );

  if (!playlistToUpdate) {
    throw new Error(`Could not find a playlist with the name ${name}!`);
  }

  let trackUri = uri;

  if (!uri) {
    const currentTrackResponse = await spotify.getMyCurrentPlayingTrack();
    const currentTrackUri = currentTrackResponse.body.item?.uri;

    if (!currentTrackUri) {
      throw new Error('Cannot get the currently playing context!');
    }

    trackUri = currentTrackUri;
  }

  await spotify.addTracksToPlaylist(playlistToUpdate.id, [trackUri], {
    position: options.position
  });

  logger.success(
    uri ? 'Added track to playlist!' : 'Added current track to playlist!'
  );
};

export const playlistAdd = createAction(handler);
