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

  await program.parseAsync(process.argv);
})();
