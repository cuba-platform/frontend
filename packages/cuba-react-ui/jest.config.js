module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "coverageThreshold": {
    "global": {
      "statements": 5,
      "branches": 4,
      "functions": 2,
      "lines": 5
    }
  },
  "collectCoverageFrom": [
    "src/**/*.{ts,tsx}",
  ]
};
