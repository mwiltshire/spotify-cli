import SpotifyWebApi from 'spotify-web-api-node';
import createAction from '../create-action';
import logger from '../utils/logger';

const handler = async (spotify: SpotifyWebApi, args: [string, any]) => {
  const [name, cmd] = args;

  const res = await spotify.getMe();

  const options: Record<string, any> = {
    public: !cmd.private,
    collaborative: cmd.collaborative
  };

  if (cmd.description) {
    options.description = cmd.description;
  }

  await spotify.createPlaylist(res.body.id, name);

  logger.success(`Created playlist ${name}!`);
};

export const playlistCreate = createAction(handler);
