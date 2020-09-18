import { Command } from 'commander';
import { auth } from '../actions';

const authCommand = new Command('auth')
  .option('-p, --port <port>')
  .description('Launch server to start app authentication.')
  .action(auth);

export default authCommand;
