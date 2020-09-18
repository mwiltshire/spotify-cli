import { Command } from 'commander';
import { pause } from '../actions';

export const pauseCommand = new Command('pause')
  .description('Pause playback.')
  .action(pause);
