import { program } from 'commander';
import actions from './actions';

(async () => {
  const configProgram = program.command('config');
  configProgram.command('path').action(actions.configPath);
  configProgram.command('clear-tokens').action(actions.configClearTokens);

  program
    .command('auth [port]')
    .description('Launch server to start app authentication.')
    .action(actions.auth);

  const playCommand = program
    .command('play')
    .description('Start or resume playback.')
    .action(actions.play);

  playCommand.command('artist <name>').action(actions.playArtist);
  playCommand.command('track <name>').action(actions.playTrack);
  playCommand.command('album <name>').action(actions.playAlbum);

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

  const devicesProgram = program.command('devices');

  devicesProgram.command('list').action(actions.devicesList);
  devicesProgram.command('transfer').action(actions.devicesTransfer);

  const playlistProgramn = program.command('playlist');
  playlistProgramn
    .command('create [name]')
    .option('-p, --private')
    .option('-c, --collaborative')
    .option('-d, --description [description]')
    .action(actions.playlistCreate);

  playlistProgramn
    .command('add <name> [uri]')
    .option('-p, --position [index]')
    .action(actions.playlistAdd);

  await program.parseAsync(process.argv);
})();
