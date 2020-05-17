import { program } from 'commander';
import auth from './auth';
import play from './play';
import pause from './pause';
import skip from './skip';
import volume from './volume';
import mute from './mute';
import share from './share';
import shuffle from './shuffle';
import repeat from './repeat';

(async () => {
  program
    .command('auth [port]')
    .description('Launch server to start app authentication.')
    .action(auth);

  program.command('play').description('Start or resume playback.').action(play);

  program.command('pause').description('Pause playback.').action(pause);

  program
    .command('skip [direction]')
    .description(
      'Skip track. Direction must be either `forward` or `back`. Defaults to skipping to next track.'
    )
    .action(skip);

  program
    .command('volume <percent>')
    .description('Set playback volume.')
    .action(volume);

  program.command('mute').description('Mute playback').action(mute);

  program
    .command('share')
    .description(
      'Get a shareable link for the currently playing track. Copies link to clipboard.'
    )
    .action(share);

  program
    .command('shuffle <state>')
    .description('Toggle playback shuffle.')
    .action(shuffle);

  program
    .command('repeat <mode>')
    .description('Set playback repeat mode.')
    .action(repeat);

  await program.parseAsync(process.argv);
})();
