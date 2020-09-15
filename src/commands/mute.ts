import { Command } from 'commander';
import { mute } from '../actions';

const muteCommand = new Command('mute')
  .description('Mute playback')
  .action(mute);

export default muteCommand;
