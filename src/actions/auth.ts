import open from 'open';
import { fork, ForkOptions } from 'child_process';
import path from 'path';
import logger from '../utils/logger';

const trim = (data: Buffer) => data.toString().trim();

export const auth = async ({ port = '8080' }) => {
  process.env.REDIRECT_URI = `http://localhost:${port}/callback`;
  process.env.SCOPE = [
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'user-read-email',
    'user-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    'user-library-modify',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-follow-read',
    'user-follow-modify'
  ].join(' ');
  process.env.PUBLIC_PATH = path.resolve(__dirname, '../../public');

  logger.info('Starting server...');

  const server = path.resolve(__dirname, '../server');
  const opts: ForkOptions = {
    silent: true,
    stdio: ['ipc']
  };
  const child = fork(server, [port], opts);

  child.on('message', async (message) => {
    if (message === 'server started') {
      logger.info(
        `Opening your default browser at http://localhost:${port}...`
      );
      await open(`http://localhost:${port}`, { wait: false });
      logger.info(
        'Opened browser. Waiting for you to complete Spotify authorization process...'
      );
    }

    if (message === 'success') {
      logger.success(
        'Authorization successful! You can safely kill the server with CTRL + C.'
      );
    }
  });

  child.on('error', (error) => logger.error(error.message));

  child.stderr?.on('data', (data) => {
    logger.error(trim(data));
    child.kill();
  });

  child.stdout?.on('data', (data) => logger.info(trim(data)));

  child.on('close', () => logger.info('Killed server'));
};
