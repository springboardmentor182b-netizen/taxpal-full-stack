export default  {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.(ts|js)", "**/?(*.)+(spec|test).(ts|js)"],
  transform: { 
    "^.+\\.(ts|tsx)$": ["ts-jest", {
      // ts-jest config goes here instead of globals
      tsconfig: {
        isolatedModules: true
      }
    }]
  },
  collectCoverageFrom: ["src/**/*.{ts,js}", "!src/**/*.d.ts"],
  testTimeout: 180000,
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
  maxWorkers: 1,
  
  // Memory optimization settings
  maxConcurrency: 1,
  bail: false,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};