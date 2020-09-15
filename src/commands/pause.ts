import { Command } from 'commander';
import { pause } from '../actions';

const pauseCommand = new Command('pause')
  .description('Pause playback.')
  .action(pause);

export default pauseCommand;
