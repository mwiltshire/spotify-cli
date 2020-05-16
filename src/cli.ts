import { program } from 'commander';
import auth from './auth';

program
  .command('auth [port]')
  .description('Launch server to start app authentication')
  .action(auth);

program.parse(process.argv);
