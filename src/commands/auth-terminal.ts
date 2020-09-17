import { Command } from 'commander';
import { authTerminal } from '../actions';

const authTerminalCommand = new Command('auth-terminal')
  .option('-p, ---port <port>')
  .action(authTerminal);

export default authTerminalCommand;
