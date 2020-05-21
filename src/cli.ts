import { program } from 'commander';
import actions from './actions';

(async () => {
  program
    .command('auth [port]')
    .description('Launch server to start app authentication.')
    .action(actions.auth);

  program
    .command('play')
    .description('Start or resume playback.')
    .action(actions.play);

  program.command('pause').description('Pause playback.').action(actions.pause);

  program
    .command('skip [direction]')
    .description(
      'Skip track. Direction must be either `forward` or `back`. Defaults to skipping to next track.'
    )
    .action(actions.skip);

  program
    .command('volume <percent>')
    .description('Set playback volume.')
    .action(actions.volume);

  program.command('mute').description('Mute playback').action(actions.mute);

  program
    .command('share')
    .description(
      'Get a shareable link for the currently playing track. Copies link to clipboard.'
    )
    .action(actions.share);

  program
    .command('shuffle <state>')
    .description('Toggle playback shuffle.')
    .action(actions.shuffle);

  program
    .command('repeat <mode>')
    .description('Set playback repeat mode.')
    .action(actions.repeat);

  program
    .command('search <query>')
    .description(
      'Perform search for a given query. Only the top 20 results max will be shown for each query type.'
    )
    .option('-a, --artist', 'Include artists in search results')
    .option('-A, --album', 'Include albums in search results')
    .option('-t, --track', 'Include tracks in search results')
    .option('-p, --playlist', 'Include playlists in search results')
    .action(actions.search);

  await program.parseAsync(process.argv);
})();
