// Test Evol\Frontend\jest.config.cjs
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {

    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: './tsconfig.json', 
      compilerOptions: {
        esModuleInterop: true,
        jsx: 'react-jsx', 
        module: 'ESNext', 
        allowSyntheticDefaultImports: true 
      }
    }],
  },
  testPathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  roots: ['<rootDir>/src'], 
};