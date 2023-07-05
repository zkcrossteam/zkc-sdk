import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  clearMocks: true,
  coverageDirectory: 'coverage',
  testRegex: '(/__tests__/.*(test|spec))\\.[jt]sx?$',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};

export default jestConfig;
