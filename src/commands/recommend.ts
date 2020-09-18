import { Command } from 'commander';
import { recommend } from '../actions';

export const recommendCommand = new Command('recommend')
  .option('-s, --seed <type>')
  .action(recommend);
