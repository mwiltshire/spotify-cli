import { program } from 'commander';
import * as cmd from './commands';

(async () => {
  program.addCommand(cmd.authCommand);
  program.addCommand(cmd.configCommand);
  program.addCommand(cmd.playCommand);
  program.addCommand(cmd.pauseCommand);
  program.addCommand(cmd.skipCommand);
  program.addCommand(cmd.volumeCommand);
  program.addCommand(cmd.muteCommand);
  program.addCommand(cmd.shareCommand);
  program.addCommand(cmd.shuffleCommand);
  program.addCommand(cmd.repeatCommand);
  program.addCommand(cmd.devicesCommand);
  program.addCommand(cmd.playlistCommand);
  program.addCommand(cmd.recommendCommand);
  program.addCommand(cmd.saveCommand);

  await program.parseAsync(process.argv);
})();
