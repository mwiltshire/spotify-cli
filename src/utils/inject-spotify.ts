import SpotifyWebApi from 'spotify-web-api-node';
import config from '../config';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenRetrievedAt: number;
}

interface AuthCredentials {
  clientId: string;
  clientSecret: string;
}

export type Handler = (options?: any[]) => Promise<any>;

export type Action = (spotify: SpotifyWebApi, options?: any[]) => Promise<any>;

const tokenIsValid = (timestamp: number) => {
  // Token is valid for 1 hour. Check if less than 55 mins
  // to add a little buffer.
  return Math.floor(Date.now() / 1000) - timestamp < 3300;
};

const injectSpotify = async (fn: Action): Promise<Handler> => {
  const tokens: AuthTokens = config.get('tokens');
  const timestamp = tokens.tokenRetrievedAt;
  const spotify = new SpotifyWebApi();

  if (tokenIsValid(timestamp)) {
    spotify.setAccessToken(tokens.accessToken);
    return (options: any[]) => fn(spotify, options);
  }

  const credentials: AuthCredentials = config.get('credentials');
  spotify.setClientId(credentials.clientId);
  spotify.setClientSecret(credentials.clientSecret);
  spotify.setRefreshToken(tokens.refreshToken);
  const {
    body: { access_token }
  } = await spotify.refreshAccessToken();

  config.set('tokens.accessToken', access_token);

  spotify.setAccessToken(access_token);
  return (options: any[]) => fn(spotify, options);
};

export default injectSpotify;
