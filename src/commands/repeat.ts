import { Command } from 'commander';
import { repeat } from '../actions';

const repeatCommand = new Command('repeat <mode>')
  .description('Set playback repeat mode.')
  .action(repeat);

export default repeatCommand;
