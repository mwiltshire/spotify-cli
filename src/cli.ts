import { program } from 'commander';
import {
  authCommand,
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
  playlistCommand,
  recommendCommand
} from './commands';

(async () => {
  program.addCommand(authCommand);
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
  program.addCommand(recommendCommand);

  await program.parseAsync(process.argv);
})();
