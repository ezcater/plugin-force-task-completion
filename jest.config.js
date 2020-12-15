const path = require('path');

module.exports = config => {
  config.testEnvironment = 'jsdom';
  config.collectCoverageFrom = [
    'src/**/*.ts',
    'src/**/*.tsx'
  ];
  config.coveragePathIgnorePatterns = [
    '<rootDir>/node_modules',
    '__tests__',
    'constants',
    '<rootDir>/src/registerNotifications.tsx',
    '<rootDir>/src/registerReducers.ts',
    '<rootDir>/src/registerListeners.ts',
    '<rootDir>/src/ForceTaskCompletionPlugin.tsx',
    '<rootDir>/src/setupTests.ts',
    '<rootDir>/src/index.ts',
    '<rootDir>/src/react-app-env.d.ts'
  ];
  config.coverageReporters = [
    'json',
    'lcov',
    'text'
  ];
  config.transform = {
    "^.+\\.ts$": "ts-jest",
    "^.+\\.tsx?$": "ts-jest"
  };

  return config;
};
