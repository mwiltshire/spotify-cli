import { Command } from 'commander';
import { share } from '../actions';

const shareComand = new Command('share')
  .description(
    'Get a shareable link for the currently playing track. Copies link to clipboard.'
  )
  .action(share);

export default shareComand;
