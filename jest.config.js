module.exports = {
  preset: 'jest-expo',
  testMatch: ['**/tests/unit/**/*.test.[jt]s?(x)'],
  setupFilesAfterEnv: ['<rootDir>/tests/utils/testUtils.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@?react-native|@react-native-community|expo(nent)?|@expo|expo-router|jest-expo|@react-navigation)',
  ],
};


