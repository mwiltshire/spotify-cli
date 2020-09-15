import { Command } from 'commander';
import { skip } from '../actions';

const skipCommand = new Command('skip [direction]')
  .description(
    'Skip track. Direction must be either `forward` or `back`. Defaults to skipping to next track.'
  )
  .action(skip);

export default skipCommand;
