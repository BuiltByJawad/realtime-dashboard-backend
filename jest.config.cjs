// load environment variables from .env for tests
require('dotenv').config();

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    rootDir: '.',
    clearMocks: true,
}