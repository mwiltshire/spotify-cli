import app from './app';

const port = process.argv[2];

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  process.send && process.send('server started');
});
