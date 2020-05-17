import chalk from 'chalk';

const info = (text: string) =>
  console.log(
    `${chalk.bgRgb(240, 240, 240).bold.rgb(0, 0, 0)(' INFO ')} ${text}`
  );

const warn = (text: string) =>
  console.warn(`${chalk.bgYellow.bold.rgb(0, 0, 0)(' WARN ')} ${text}`);

const error = (text: string) =>
  console.error(
    `${chalk.bgRed.bold.white(' ERROR ')} ${chalk.red(
      text || 'Oh no! An unknown error occurred!'
    )}`
  );

const success = (text: string) =>
  console.log(`${chalk.bgGreen.bold.rgb(0, 0, 0)(' SUCCESS ')} ${text}`);

const spotify = (text: string) =>
  console.log(
    `${chalk.bgRgb(30, 215, 96).bold.rgb(0, 0, 0)(' SPOTIFY ')} ${chalk.white(
      text
    )}`
  );

export default { info, warn, error, success, spotify };
