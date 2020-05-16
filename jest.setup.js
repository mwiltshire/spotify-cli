// Set up process.env for app.ts tests
process.env.REDIRECT_URI = `http://localhost:3000/callback`;
process.env.SCOPE =
  'user-read-currently-playing user-modify-playback-state user-read-playback-state';
process.env.PUBLIC_PATH = '/';
