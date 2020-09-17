import inquirer from 'inquirer';
import config from '../config';
import SpotifyWebApi from 'spotify-web-api-node';
import crypto from 'crypto';
import open from 'open';
import { fork, ForkOptions } from 'child_process';
import path from 'path';
import logger from '../utils/logger';

const authState = crypto.randomBytes(20).toString('hex');

const trim = (data: Buffer) => data.toString().trim();

const scopes = [
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
];

const handleAuth = async (port) => {
  const clientIdQuestion = {
    type: 'password',
    name: 'clientId',
    message: 'Enter your Spotify client ID',
    mask: '*'
  };

  const clientSecretQuestion = {
    type: 'password',
    name: 'clientSecret',
    message: 'Enter your Spotify client secret',
    mask: '*'
  };

  const redirectUriQuestion = {
    type: 'input',
    name: 'redirectUri',
    message: 'Enter your redirect URI',
    default: `http://localhost:${port}/callback`,
    validate: (input: string) => {
      if (!/^http:\/\/localhost:\d{1,5}\/.*$/.test(input)) {
        return `Something looks wrong with your redirect URI. Are you using the correct port: ${port}`;
      }
      return true;
    }
  };

  const scopesQuestion = {
    type: 'checkbox',
    name: 'scopes',
    message: 'Select the authorization scopes you want to use',
    choices: scopes
  };

  const answers = await inquirer.prompt([
    clientIdQuestion,
    clientSecretQuestion,
    redirectUriQuestion,
    scopesQuestion
  ]);

  config.set('credentials', {
    clientId: answers.clientId,
    clientSecret: answers.clientSecret,
    redirectUri: answers.redirectUri
  });

  const spotify = new SpotifyWebApi({
    redirectUri: answers.redirectUri,
    clientId: answers.clientId
  });

  const authURL = spotify.createAuthorizeURL(scopes, authState);

  await open(authURL, { wait: false });
};

export const authTerminal = async (options: any) => {
  const { port = '8080' } = options;
  logger.info(`Starting Spotify authentication using port ${port}`);

  const publicPath = path.resolve(__dirname, '../../public');

  logger.info('Starting server...');

  const server = path.resolve(__dirname, '../auth-server');
  const opts: ForkOptions = {
    silent: true,
    stdio: ['ipc']
  };
  const child = fork(server, [port, publicPath, authState], opts);

  child.on('message', async (message) => {
    if (message === 'ready') {
      await handleAuth(port);
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
