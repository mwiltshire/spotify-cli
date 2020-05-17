import express, { Response } from 'express';
import SpotifyWebApi from 'spotify-web-api-node';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import config from './config';
import logger from './logger';

const authState = crypto.randomBytes(20).toString('hex');

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// Send no content response if browser requests favicon from root
app.get('/favicon.ico', (_, res) => res.status(204).end());

app.get('/', (_, res, next) => {
  res.sendFile(
    'auth.html',
    {
      root: process.env.PUBLIC_PATH,
      dotfiles: 'deny'
    },
    (error) => {
      if (error) {
        next(error);
      }
    }
  );
});

app.post('/', (req, res, next) => {
  const { client_id, client_secret } = req.body;
  try {
    config.set('credentials', {
      client_id,
      client_secret
    });
    const spotify = new SpotifyWebApi({
      redirectUri: process.env.REDIRECT_URI,
      clientId: client_id
    });

    const authURL = spotify.createAuthorizeURL(
      (process.env.SCOPE as string).split(' '),
      authState
    );
    res.redirect(authURL);
  } catch (error) {
    next(error);
  }
});

app.get('/callback', async (req, res, next) => {
  const { code, error, state } = req.query;
  const handleError = (error) => {
    if (error) {
      next(error);
    }
  };
  const fileOptions = {
    root: process.env.PUBLIC_PATH,
    dotfiles: 'deny'
  };

  if (error) {
    next(new Error(error as string));
  } else if (state !== authState) {
    next(new Error('Authorization states do not match!'));
  } else {
    try {
      const credentials = config.get('credentials');
      const spotify = new SpotifyWebApi({
        ...credentials,
        redirectUri: process.env.REDIRECT_URI
      });
      const {
        body: { access_token, refresh_token }
      } = await spotify.authorizationCodeGrant(code as string);
      config.set('auth', {
        // TODO: Clean up use of camel/snake case
        accessToken: access_token,
        refreshToken: refresh_token,
        tokenRetrievedAt: Math.floor(Date.now() / 1000)
      });
      process.send && process.send('sucess');
      res.sendFile('success.html', fileOptions, handleError);
    } catch (error) {
      next(error);
    }
  }
});

app.use((error: any, _: any, res: Response, __: any) => {
  const fileOptions = {
    root: process.env.PUBLIC_PATH,
    dotfiles: 'deny'
  };
  logger.error(error.message);
  res.status(500).sendFile('error.html', fileOptions, (error) => {
    if (error) {
      logger.error(error.message);
    }
  });
});

export default app;
