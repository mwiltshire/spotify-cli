import SpotifyWebApi from 'spotify-web-api-node';
import createAction from '../create-action';
import logger from '../utils/logger';

const listDevices = async (spotify: SpotifyWebApi) => {
  const res = await spotify.getMyDevices();
  res.body.devices.forEach((device) =>
    logger.info(`${device.name}: ${device.id}`)
  );
};

export default createAction(listDevices);
