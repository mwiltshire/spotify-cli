import { Command } from 'commander';
import { save } from '../actions';

export const saveCommand = new Command('save').action(save);
