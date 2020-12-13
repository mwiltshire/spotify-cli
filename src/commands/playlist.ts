import { Command } from 'commander';
import { playlistCreate, playlistAdd, playlistFill } from '../actions';

const playlistCommand = new Command('playlist');

playlistCommand
  .command('create <name>')
  .option('-p, --private')
  .option('-c, --collaborative')
  .option('-d, --description <description>')
  .action(playlistCreate);

playlistCommand
  .command('add <name> [uri]')
  .option('-p, --position <index>')
  .action(playlistAdd);

playlistCommand
  .command('fill <name>')
  .option('-s, --seed <artist>')
  .option('-m, --mode <name>')
  .action(playlistFill);

export { playlistCommand };
