import { Command } from 'commander';
import { shuffle } from '../actions';

export const shuffleCommand = new Command('shuffle <state>')
  .description('Toggle playback shuffle.')
  .action(shuffle);
