import { Command } from 'commander';
import { volume } from '../actions';

const volumeCommand = new Command('volume <percent>')
  .description('Set playback volume.')
  .action(volume);

export default volumeCommand;
