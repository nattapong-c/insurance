/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  moduleNameMapper: {
    '^@modelcontextprotocol/sdk/server/(.*)\\.js$': '<rootDir>/node_modules/@modelcontextprotocol/sdk/dist/cjs/server/$1.js',
    '^@modelcontextprotocol/sdk/(.*)\\.js$': '<rootDir>/node_modules/@modelcontextprotocol/sdk/dist/cjs/$1.js',
    '^@modelcontextprotocol/sdk/(.*)$': '<rootDir>/node_modules/@modelcontextprotocol/sdk/dist/cjs/$1',
  },
};
