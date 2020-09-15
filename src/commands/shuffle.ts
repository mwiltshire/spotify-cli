import { Command } from 'commander';
import { shuffle } from '../actions';

const shuffleCommand = new Command('shuffle <state>')
  .description('Toggle playback shuffle.')
  .action(shuffle);

export default shuffleCommand;
