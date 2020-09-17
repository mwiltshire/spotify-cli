import express, { Response } from 'express';
import SpotifyWebApi from 'spotify-web-api-node';
import bodyParser from 'body-parser';
import config from './config';
import logger from './utils/logger';

const [, , port, publicPath, authState] = process.argv;

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// Send no content response if browser requests favicon from root
app.get('/favicon.ico', (_, res) => res.status(204).end());

app.get('/:callback', async (req, res, next) => {
  const { code, error, state } = req.query;
  const handleError = (error) => {
    if (error) {
      next(error);
    }
  };

  if (error) {
    next(new Error(error as string));
  } else if (state !== authState) {
    next(new Error('Authorization states do not match!'));
  } else {
    try {
      const credentials = config.get('credentials');
      const spotify = new SpotifyWebApi(credentials);
      const {
        body: { access_token, refresh_token }
      } = await spotify.authorizationCodeGrant(code as string);

      config.set('tokens', {
        accessToken: access_token,
        refreshToken: refresh_token,
        tokenRetrievedAt: Math.floor(Date.now() / 1000)
      });

      process.send && process.send('success');

      const fileOptions = {
        root: publicPath,
        dotfiles: 'deny'
      };

      res.sendFile('success.html', fileOptions, handleError);
    } catch (error) {
      next(error);
    }
  }
});

app.use((error: any, _: any, res: Response, __: any) => {
  const fileOptions = {
    root: publicPath,
    dotfiles: 'deny'
  };
  logger.error(error.message);
  res.status(500).sendFile('error.html', fileOptions, (error) => {
    if (error) {
      logger.error(error.message);
    }
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  process.send && process.send('ready');
});
