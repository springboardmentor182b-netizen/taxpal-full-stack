module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.(ts|js)", "**/?(*.)+(spec|test).(ts|js)"],
  transform: { "^.+\\.(ts|tsx)$": "ts-jest" },
  collectCoverageFrom: ["src/**/*.{ts,js}", "!src/**/*.d.ts"],
  testTimeout: 180000,
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
  maxWorkers: 1,
};
