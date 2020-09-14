import SpotifyWebApi from 'spotify-web-api-node';
import inquirer from 'inquirer';
import createAction from '../create-action';
import logger from '../utils/logger';

const devicesTransfer = async (spotify: SpotifyWebApi) => {
  const res = await spotify.getMyDevices();
  const devices = res.body.devices;

  if (devices.length === 1) {
    logger.info('You currently have no other active devices available!');
    return;
  }

  const [activeDevice] = devices.filter((device) => device.is_active);
  const availableDevices = devices.filter((device) => !device.is_active);

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'device',
      message: `Your currently active device is ${activeDevice.name}. Select a device to transfer playback to.`,
      choices: availableDevices.map((device) => device.name)
    }
  ]);

  const newDevice = devices.find(
    (device) => device.name === answer.device
  ) as SpotifyApi.UserDevice;

  if (!newDevice.id) {
    logger.error(`Unable to obtain Spotify ID for device ${newDevice.name}`);
    return;
  }

  // Casting to any here as the Spotify API client types expect
  // `device_ids` but the actual method should receive `deviceIds`.
  await spotify.transferMyPlayback({
    deviceIds: [newDevice.id],
    play: true
  } as any);

  logger.spotify(`Switched playback to ${newDevice.name}`);
};

export default createAction(devicesTransfer);
