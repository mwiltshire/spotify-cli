import { program } from 'commander';
import {
  auth,
  authCommand,
  authTerminalCommand,
  configCommand,
  playCommand,
  pauseCommand,
  skipCommand,
  volumeCommand,
  muteCommand,
  shareCommand,
  shuffleCommand,
  repeatCommand,
  devicesCommand,
  playlistCommand
} from './commands';

(async () => {
  program.addCommand(auth);
  program.addCommand(authCommand);
  program.addCommand(authTerminalCommand);
  program.addCommand(configCommand);
  program.addCommand(playCommand);
  program.addCommand(pauseCommand);
  program.addCommand(skipCommand);
  program.addCommand(volumeCommand);
  program.addCommand(muteCommand);
  program.addCommand(shareCommand);
  program.addCommand(shuffleCommand);
  program.addCommand(repeatCommand);
  program.addCommand(devicesCommand);
  program.addCommand(playlistCommand);

  await program.parseAsync(process.argv);
})();
