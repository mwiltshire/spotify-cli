import config from './config';
import SpotifyWebApi from 'spotify-web-api-node';

interface AuthCredentials {
  accessToken: string;
  refreshToken: string;
  tokenRetrievedAt: number;
}

export type Handler = (options?: any[]) => Promise<any>;

export type Action = (spotify: SpotifyWebApi, options?: any[]) => Promise<any>;

const tokenIsValid = (timestamp: number) => {
  // Token is valid for 1 hour. Check if less than 55 mins
  // to add a little buffer.
  return Math.floor(Date.now() / 1000) - timestamp < 3300;
};

const injectSpotify = async (fn: Action): Promise<Handler> => {
  const auth: AuthCredentials = config.get('auth');
  const timestamp = auth.tokenRetrievedAt;
  const spotify = new SpotifyWebApi();

  if (tokenIsValid(timestamp)) {
    spotify.setAccessToken(auth.accessToken);
    return (options: any[]) => fn(spotify, options);
  }

  spotify.setRefreshToken(auth.refreshToken);
  const {
    body: { access_token }
  } = await spotify.refreshAccessToken();

  config.set('auth.accessToken', access_token);

  spotify.setAccessToken(access_token);
  return (options: any[]) => fn(spotify, options);
};

export default injectSpotify;
