import { program } from 'commander';
import auth from './auth';
import play from './play';

(async () => {
  program
    .command('auth [port]')
    .description('Launch server to start app authentication')
    .action(auth);

  program.command('play').description('Start or resume playback').action(play);

  await program.parseAsync(process.argv);
})();
