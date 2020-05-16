import { fork, ForkOptions } from 'child_process';
import path from 'path';
import open from 'open';

const trim = (data: Buffer) => data.toString().trim();

export default async (port = '8080') => {
  process.env.REDIRECT_URI = `http://localhost:${port}/callback`;
  process.env.SCOPE =
    'user-read-currently-playing user-modify-playback-state user-read-playback-state';
  process.env.PUBLIC_PATH = path.resolve(__dirname, './public');

  console.log(`Starting server...`);

  const server = path.resolve(__dirname, 'server');
  const opts: ForkOptions = {
    silent: true,
    stdio: ['ipc']
  };
  const child = fork(server, [port], opts);

  child.on('message', async (message) => {
    if (message === 'server started') {
      console.log(
        `Opening your default browser at http://localhost:${port}...`
      );
      await open(`http://localhost:${port}`, { wait: false });
      console.log(
        'Opened browser. Waiting for you to complete Spotify authorization process...'
      );
    }
  });

  child.on('error', (error) => console.log('Error: ' + error.message));

  child.stderr?.on('data', (data) => {
    console.log(trim(data));
    child.kill();
  });

  child.stdout?.on('data', (data) => console.log(trim(data)));

  child.on('close', (code, signal) => console.log(code, signal));
};
