import inquirer from 'inquirer';
import config from '../config';
import logger from '../utils/logger';
import createAction from '../create-action';

const configClearTokens = async () => {
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: `Are you sure you want to delete all tokens? You will need to reauthenticate in order to continue using the CLI.`,
      default: false
    }
  ]);

  if (answer.confirmed) {
    config.delete('tokens');
    logger.info('Cleared all Spotify authentication tokens.');
  }
};

export default createAction(configClearTokens);
