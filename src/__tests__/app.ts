import path from 'path';
import request from 'supertest';
import nock from 'nock';
import app from '../app';
import config from '../config';
import querystring from 'querystring';

jest.mock('../config', () => ({
  set: jest.fn(),
  get: jest.fn(() => ({
    clientId: '1234',
    clientSecret: '5678',
    accessToken: '1234',
    refreshToken: '1234',
    tokenRetrievedAt: 1589644712
  }))
}));

jest.mock('crypto', () => ({
  randomBytes: () => ({ toString: () => '1234' })
}));

describe('GET /favicon.ico', () => {
  it('responds with 204 status code', async () => {
    const res = await request(app).get('/favicon.ico');
    expect(res.status).toBe(204);
  });
});

describe('GET /', () => {
  it('returns 200 status code and html response', async () => {
    process.env.PUBLIC_PATH = path.resolve(__dirname, 'fixtures');
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.header['content-type']).toBe('text/html; charset=UTF-8');
  });
});

describe('POST /', () => {
  it('sets client ID and secret in config', async () => {
    await request(app).post('/').send({
      clientId: '1234',
      clientSecret: '5678'
    });
    expect(config.set).toHaveBeenCalledTimes(1);
    expect(config.set).toHaveBeenCalledWith('credentials', {
      clientId: '1234',
      clientSecret: '5678'
    });
  });

  it('returns a 302 redirect to Spotify auth endpoint', async () => {
    const res = await request(app).post('/').send({
      clientId: '1234',
      clientSecret: '5678'
    });

    expect(res.status).toBe(302);
    expect(res.header.location).toMatch(
      /https:\/\/accounts.spotify.com\/authorize\?*/
    );
  });
});

describe('GET /callback', () => {
  it('handles Spotify authorization, sets config properties and returns html response if successful', async () => {
    process.env.PUBLIC_PATH = path.resolve(__dirname, 'fixtures');
    const originalDateNow = Date.now;
    Date.now = jest.fn(() => 1589644712810);

    nock('https://accounts.spotify.com/api')
      .post(
        '/token',
        querystring.stringify({
          grant_type: 'authorization_code',
          redirect_uri: 'http://localhost:3000/callback',
          code: '1234',
          client_id: '1234',
          client_secret: '5678'
        })
      )
      .reply(200, {
        access_token: '1234',
        refresh_token: '5678'
      });

    const res = await request(app).get('/callback?code=1234&state=1234');

    expect(res.status).toBe(200);
    expect(res.header['content-type']).toBe('text/html; charset=UTF-8');

    expect(config.get).toHaveBeenCalledTimes(1);
    expect(config.get).toHaveBeenCalledWith('credentials');

    expect(config.set).toHaveBeenCalledTimes(1);
    expect(config.set).toHaveBeenCalledWith('tokens', {
      accessToken: '1234',
      refreshToken: '5678',
      tokenRetrievedAt: 1589644712
    });

    Date.now = originalDateNow;
  });

  it('returns 500 status code and html response body if authorization fails', async () => {
    process.env.PUBLIC_PATH = path.resolve(__dirname, 'fixtures');
    const originalConsoleError = console.error;
    console.error = jest.fn();

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

    const res = await request(app).get('/callback?code=1234&state=1234');

    expect(res.status).toBe(500);
    expect(res.header['content-type']).toBe('text/html; charset=UTF-8');
    expect(console.error).toHaveBeenCalledWith(expect.any(String));

    console.error = originalConsoleError;
  });

  it('returns 500 status code and html response body if state in auth response does not match request', async () => {
    process.env.PUBLIC_PATH = path.resolve(__dirname, 'fixtures');
    const originalConsoleError = console.error;
    console.error = jest.fn();

    const res = await request(app)
      // We expect our state to be '1234'
      .get('/callback?code=1234&state=5678');

    expect(res.status).toBe(500);
    expect(res.header['content-type']).toBe('text/html; charset=UTF-8');
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/Authorization states do not match!/)
    );

    console.error = originalConsoleError;
  });

  it('returns 500 status code and html response body if error query param is present', async () => {
    process.env.PUBLIC_PATH = path.resolve(__dirname, 'fixtures');
    const originalConsoleError = console.error;
    console.error = jest.fn();

    const res = await request(app).get('/callback?error=Error&state=1234');

    expect(res.status).toBe(500);
    expect(res.header['content-type']).toBe('text/html; charset=UTF-8');
    expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/Error/));

    console.error = originalConsoleError;
  });
});
