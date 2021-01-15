module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "coverageThreshold": {
    "global": {
      "statements": 49,
      "branches": 47,
      "functions": 30,
      "lines": 50
    }
  },
  "collectCoverageFrom": [
    "src/**/*.{ts,tsx}",
  ]
};
