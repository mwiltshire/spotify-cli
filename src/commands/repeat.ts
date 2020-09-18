import { Command } from 'commander';
import { repeat } from '../actions';

export const repeatCommand = new Command('repeat <mode>')
  .description('Set playback repeat mode.')
  .action(repeat);
