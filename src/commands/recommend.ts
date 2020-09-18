import { Command } from 'commander';
import { recommend } from '../actions';

const recommendCommand = new Command('recommend')
  .option('-s, --seed <type>')
  .action(recommend);

export { recommendCommand };
