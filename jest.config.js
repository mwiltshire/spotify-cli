module.exports = {
  roots: ['<rootDir>/src', '<rootDir>/__mocks__'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  collectCoverageFrom: ['src/**/*.ts'],
  testEnvironment: 'node',
  clearMocks: true,
  moduleFileExtensions: ['ts', 'js', 'json', 'jsx', 'tsx', 'node'],
  setupFiles: ['./jest.setup.js']
};
