module.exports = {
  collectCoverageFrom: ['lambdas/*.{js,ts}'],
  coverageDirectory: 'reports/unit',
  coveragePathIgnorePatterns: ['node_modules', '__tests__', '__mocks__', 'index.ts$'],
  moduleFileExtensions: ['js', 'ts', 'json'],
  moduleDirectories: ['node_modules'],
  testRegex: 'test.(ts|js)$',
  testEnvironment: 'node',
};
