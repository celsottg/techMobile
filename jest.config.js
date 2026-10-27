// https://docs.expo.dev/develop/unit-testing/
/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  // Mesmos aliases do tsconfig.json (o Metro resolve `@/`, o Jest precisa do mapeamento).
  moduleNameMapper: {
    '^@/assets/(.*)$': '<rootDir>/assets/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/example/'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|standard-navigation|@sentry/react-native|native-base|react-native-svg)',
  ],
  // `src/app/` só reexporta telas dos módulos; barrels e arquivos de tipos não têm lógica.
  collectCoverageFrom: [
    'src/modules/**/*.{ts,tsx}',
    'src/shared/**/*.{ts,tsx}',
    '!**/index.ts',
    '!**/types.ts',
    '!**/*.test.{ts,tsx}',
  ],
  coverageReporters: ['text', 'text-summary', 'lcov', 'json-summary'],
  // O CI falha se a cobertura cair abaixo destes valores.
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 80,
      functions: 90,
      lines: 90,
    },
  },
};
