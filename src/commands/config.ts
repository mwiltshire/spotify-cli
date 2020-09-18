import { Command } from 'commander';
import { configPath, configClearTokens } from '../actions';

const configCommand = new Command('config');

configCommand.command('path').action(configPath);
configCommand.command('clear-tokens').action(configClearTokens);

export { configCommand };
