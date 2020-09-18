import { Command } from 'commander';
import { volume } from '../actions';

export const volumeCommand = new Command('volume <percent>')
  .description('Set playback volume.')
  .action(volume);
