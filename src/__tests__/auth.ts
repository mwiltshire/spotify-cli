import { fork } from 'child_process';
import auth from '../auth';

const mockChildOn = jest.fn();
const mockStdoutOn = jest.fn();
const mockStdErrOn = jest.fn();

jest.mock('child_process', () => ({
  fork: jest.fn(() => ({
    on: mockChildOn,
    stdout: {
      on: mockStdoutOn
    },
    stderr: {
      on: mockStdErrOn
    }
  }))
}));

const originalConsoleLog = console.log;
const mockConsoleLog = jest.fn();

beforeEach(() => (console.log = mockConsoleLog));

afterEach(() => (console.log = originalConsoleLog));

it('forks child process to start express server', async () => {
  await auth('8080');
  expect(fork).toHaveBeenCalledTimes(1);
  expect(fork).toHaveBeenCalledWith(
    expect.stringMatching(/server$/),
    ['8080'],
    {
      silent: true,
      stdio: ['ipc']
    }
  );
});

it('sets up message, error, data and close event listeners', async () => {
  await auth('8080');

  expect(mockChildOn).toHaveBeenCalledTimes(3);
  expect(
    mockChildOn.mock.calls.flat(1).filter((el) => typeof el === 'string')
  ).toEqual(['message', 'error', 'close']);

  expect(mockStdoutOn).toHaveBeenCalledTimes(1);
  expect(mockStdoutOn).toHaveBeenCalledWith('data', expect.any(Function));

  expect(mockStdErrOn).toHaveBeenCalledTimes(1);
  expect(mockStdErrOn).toHaveBeenCalledWith('data', expect.any(Function));
});
