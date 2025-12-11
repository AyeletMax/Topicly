module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js'
  ]
};

