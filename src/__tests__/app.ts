import path from 'path';
import request from 'supertest';
import nock from 'nock';
import app from '../app';
import config from '../config';
import querystring from 'querystring';

jest.mock('../config');

jest.mock('crypto', () => ({
  randomBytes: () => ({ toString: () => '1234' })
}));

describe('GET /favicon.ico', () => {
  it('responds with 204 status code', (done) => {
    request(app).get('/favicon.ico').expect(204, done);
  });
});

describe('GET /', () => {
  it('returns 200 status code and html response', async () => {
    process.env.PUBLIC_PATH = path.resolve(__dirname, 'fixtures');
    const res = await request(app).get('/').expect(200);
    expect(res.header['content-type']).toBe('text/html; charset=UTF-8');
  });
});

describe('POST /', () => {
  it('sets client ID and secret in config', async () => {
    await request(app).post('/').send({
      client_id: '1234',
      client_secret: '5678'
    });
    expect(config.set).toHaveBeenCalledTimes(1);
    expect(config.set).toHaveBeenCalledWith('credentials', {
      client_id: '1234',
      client_secret: '5678'
    });
  });

  it('returns a 302 redirect to Spotify auth endpoint', async () => {
    const res = await request(app)
      .post('/')
      .send({
        client_id: '1234',
        client_secret: '5678'
      })
      .expect(302);

    expect(res.header.location).toMatch(
      /https:\/\/accounts.spotify.com\/authorize\?*/
    );
  });
});

describe('GET /callback', () => {
  it('handles Spotify authorization, sets config properties and returns html response if successful', async () => {
    process.env.PUBLIC_PATH = path.resolve(__dirname, 'fixtures');
    nock('https://accounts.spotify.com/api')
      .post(
        '/token',
        querystring.stringify({
          grant_type: 'authorization_code',
          redirect_uri: 'http://localhost:3000/callback',
          code: '1234'
        })
      )
      .reply(200, {
        access_token: '1234',
        refresh_token: '5678',
        expires_in: 1000
      });

    const res = await request(app)
      .get('/callback?code=1234&state=1234')
      .expect(200);

    expect(config.get).toHaveBeenCalledTimes(1);
    expect(config.get).toHaveBeenCalledWith('credentials');

    expect(config.set).toHaveBeenCalledTimes(1);
    expect(config.set).toHaveBeenCalledWith('auth', {
      accessToken: '1234',
      refreshToken: '5678',
      tokenRetrievedAt: 1000
    });

    expect(res.header['content-type']).toBe('text/html; charset=UTF-8');
  });

  it('returns 500 status code and html response body if authorization fails', async () => {
    process.env.PUBLIC_PATH = path.resolve(__dirname, 'fixtures');
    // mute console.log
    const originalConsoleLog = console.log;
    console.log = jest.fn();

    nock('https://accounts.spotify.com/api')
      .post(
        '/token',
        querystring.stringify({
          grant_type: 'authorization_code',
          redirect_uri: 'http://localhost:3000/callback',
          code: '1234'
        })
      )
      .reply(400);

    const res = await request(app)
      .get('/callback?code=1234&state=1234')
      .expect(500);

    expect(res.header['content-type']).toBe('text/html; charset=UTF-8');
    expect(console.log).toHaveBeenCalledWith(expect.any(String));

    console.log = originalConsoleLog;
  });

  it('returns 500 status code and html response body if state in auth response does not match request', async () => {
    process.env.PUBLIC_PATH = path.resolve(__dirname, 'fixtures');
    const originalConsoleLog = console.log;
    console.log = jest.fn();

    const res = await request(app)
      // We expect our state to be '1234'
      .get('/callback?code=1234&state=5678')
      .expect(500);

    expect(res.header['content-type']).toBe('text/html; charset=UTF-8');
    expect(console.log).toHaveBeenCalledWith(
      'Authorization states do not match!'
    );

    console.log = originalConsoleLog;
  });

  it('returns 500 status code and html response body if error query param is present', async () => {
    process.env.PUBLIC_PATH = path.resolve(__dirname, 'fixtures');
    const originalConsoleLog = console.log;
    console.log = jest.fn();

    const res = await request(app)
      .get('/callback?error=Error&state=1234')
      .expect(500);

    expect(res.header['content-type']).toBe('text/html; charset=UTF-8');
    expect(console.log).toHaveBeenCalledWith('Error');

    console.log = originalConsoleLog;
  });
});
