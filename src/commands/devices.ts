import { Command } from 'commander';
import { devicesList, devicesTransfer } from '../actions';

const devicesCommand = new Command('devices');

devicesCommand.command('list').action(devicesList);
devicesCommand.command('transfer').action(devicesTransfer);

export { devicesCommand };
