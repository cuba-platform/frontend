module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "coverageThreshold": {
    "global": {
      "statements": 50,
      "branches": 50,
      "functions": 30,
      "lines": 50
    }
  },
  "collectCoverageFrom": [
    "src/**/*.{ts,tsx}",
  ]
};
