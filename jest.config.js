const nextJest = require('next/jest')

require('dotenv-safe').config({
  allowEmptyValues: true,
})

require('dotenv').config({ path: __dirname + '/environments/.env.example' })
// require('dotenv').config({ path: __dirname + '/environments' })

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  roots: ['<rootDir>/'],
  // testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/.jest/',
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/src/__tests__/mocks/',
    '<rootDir>/src/_mocks/',
    '<rootDir>/src/environments/',
    '<rootDir>/src/_test-utils/',
  ],
  coveragePathIgnorePatterns: ['<rootDir>/src/_tests-utils/'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
